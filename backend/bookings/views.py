from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, generics
from rest_framework.response import Response




from bookings.models import User, OTP
from bookings.models import Service, TimeSlot, Booking
from bookings.serializers import TimeSlotSerializer, BookingSerializer
from bookings.models import Booking, TimeSlot, Service
from bookings.serializers import BookingSerializer, ServiceSerializer
from bookings.util_email import send_booking_emails
from bookings.tasks import send_booking_emails_task




from django.conf import settings
from django.core.mail import send_mail
from datetime import datetime, time
from decimal import Decimal
import os





import razorpay
from rest_framework.permissions import AllowAny

EVENING_START = time(17, 0)

# razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_SECRET_KEY))





# Request OTP
@api_view(['POST'])
def request_otp(request):
    phone = request.data.get('phone_number')
    if not phone:
        return Response({"error": "Phone number is required"}, status=400)

    otp_code = OTP.generate_otp()
    OTP.objects.create(phone_number=phone, code=otp_code)

    # TODO: integrate SMS API (Twilio, MSG91, etc.)
    
    # Send email with OTP
    send_mail(
        subject="Your OTP Code",
        message=f"Your OTP code is {otp_code}",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[phone],  # Replace with actual SMS gateway email
        fail_silently=False,
    )
    print(f"🔐 OTP for {phone} is {otp_code}")  # For now: print in console

    return Response({"message": "OTP sent successfully"}, status=200)


# Verify OTP
@api_view(['POST'])
def verify_otp(request):
    phone = request.data.get('phone_number')
    otp = request.data.get('otp')

    if not phone or not otp:
        return Response({"error": "Phone and OTP required"}, status=400)

    try:
        otp_record = OTP.objects.filter(phone_number=phone).latest('created_at')
    except OTP.DoesNotExist:
        return Response({"error": "No OTP found"}, status=404)

    if not otp_record.is_valid():
        return Response({"error": "OTP expired"}, status=400)

    if otp_record.code != otp:
        return Response({"error": "Invalid OTP"}, status=400)

    user, created = User.objects.get_or_create(phone_number=phone)
    refresh = RefreshToken.for_user(user)
    
    is_first_login = created
    response = Response({
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "user": {
            "id": user.id,
            "phone_number": user.phone_number,
            "name": user.name,
            "email": user.email,
            "is_first_login": is_first_login
        }
    }, status=200)

    # Store access token in cookies
    response.set_cookie(
        key="access_token",
        value=str(refresh.access_token),
        httponly=True,
        secure=True,  # Set to True in production
        samesite="Lax"
    )

    return response
    


class SetNameAndEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        name = request.data.get('name')
        email = request.data.get('email')

        if not name or not email:
            return Response({"error": "Name and email are required"}, status=400)

        user.name = name
        user.email = email
        user.save()

        return Response({"message": "Profile updated successfully", "user": {
            "phone_number": user.phone_number,
            "name": user.name,
            "email": user.email,
        }}, status=200)

class TimeSlotListView(APIView):
    """
    GET /api/slots/?date=YYYY-MM-DD
    Global availability for the single ground.
    """

    def get(self, request, *args, **kwargs):
        date_str = request.query_params.get('date')

        if not date_str:
            return Response(
                {"error": "'date' is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {"error": "Invalid date format. Use YYYY-MM-DD."},
                status=status.HTTP_400_BAD_REQUEST
            )

        slots = list(TimeSlot.objects.all().order_by('start_time'))

        # Map slot_id → index for easy range blocking
        slot_index = {slot.id: i for i, slot in enumerate(slots)}

        booked_indices = set()

        bookings = Booking.objects.filter(
            date=date,
            status__in=['pending', 'partial', 'paid']
        ).select_related('time_slot')

        for booking in bookings:
            start_idx = slot_index.get(booking.time_slot_id)

            if start_idx is None:
                continue

            for i in range(start_idx,
                        min(start_idx + booking.duration_hours, len(slots))):
                booked_indices.add(i)

        response_slots = []
        for i, slot in enumerate(slots):
            response_slots.append({
                "id": slot.id,
                "start_time": slot.start_time,
                "end_time": slot.end_time,
                "is_taken": i in booked_indices
            })

        return Response({
            "date": str(date),
            "slots": response_slots
        }, status=status.HTTP_200_OK)

        






class BookingCreateView(generics.CreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    

    def create(self, request, *args, **kwargs):
        user = request.user
        if not user or not user.is_authenticated:
            return Response(
                {"error": "Authentication credentials were not provided."},
                status=status.HTTP_401_UNAUTHORIZED
            )
        service_id = request.data.get("service")
        time_slot_id = request.data.get("time_slot")
        date = request.data.get("date")
        duration_hours = int(request.data.get("duration_hours", 1))
        is_partial_payment = request.data.get("is_partial_payment", False)
        if isinstance(is_partial_payment, str):
            is_partial_payment = is_partial_payment.lower() in ("true", "1", "yes")
        else:
            is_partial_payment = bool(is_partial_payment)

        if not all([service_id, time_slot_id, date]):
            return Response({"error": "Missing required fields (service, time_slot, date)."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            service = Service.objects.get(id=service_id)
            start_slot = TimeSlot.objects.get(id=time_slot_id)
        except (Service.DoesNotExist, TimeSlot.DoesNotExist):
            return Response({"error": "Invalid service or time slot."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Get all consecutive slots for the duration
        all_slots = list(TimeSlot.objects.all().order_by("start_time"))
        start_index = all_slots.index(start_slot)
        required_slots = all_slots[start_index:start_index + duration_hours]

        if len(required_slots) < duration_hours:
            print("Required slots:", required_slots)
            return Response({"error": "Not enough consecutive slots available."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Check if any of those slots are already booked
        if Booking.objects.filter(time_slot__in=required_slots, date=date, service=service).exists():
            print("Required slo2ts:", required_slots)
            return Response({"error": "One or more selected hours are already booked."},
                            status=status.HTTP_400_BAD_REQUEST)

        total_payablee = Decimal("0.00")
        evening_duration = 0
        normal_duration = 0
        print(required_slots)

        for slot in required_slots:
            print(f"Evaluating slot: {slot.start_time} - {slot.end_time}")
            if slot.start_time >= EVENING_START:
                print("Evening slot pricing applied.")
                print(f" Service evening price: {service.evening_pricing}, Duration hours: {duration_hours}")
                evening_duration += 1
                # price = service.evening_pricing * duration_hours
            else:
                print("Evening slot pricing NOT applied.")
                print(f" Service normal price: {service.price_per_hour}, Duration hours: {duration_hours}")
                normal_duration += 1
                # price = service.price_per_hour * duration_hours

            total_payablee = total_payablee + (service.evening_pricing if slot.start_time >= EVENING_START else service.price_per_hour) 
            # print(f" Slot price: {price}, Cumulative total: {total_payablee}")

        print(f" ******************** Total payable for booking: {total_payablee}  *******************")

        # Create booking
        booking = Booking.objects.create(
            user=user,
            service=service,
            time_slot=start_slot,
            date=date,
            duration_hours=duration_hours,
            status="pending",
            total_payable=total_payablee)

        # Razorpay order creation
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        total_amount_rupees = total_payablee
        payable_amount_rupees = total_payablee

        if is_partial_payment:
            partial_percentage = getattr(settings, "PARTIAL_PAYMENT_PERCENTAGE", Decimal('0.25'))
            if not isinstance(partial_percentage, Decimal):
                partial_percentage = Decimal(str(partial_percentage))
            payable_amount_rupees = (total_amount_rupees * partial_percentage).quantize(Decimal('0.01'))

        total_amount = int(payable_amount_rupees * 100)  # rupees → paise

        order_data = {
            "amount": total_amount,
            "currency": "INR",
            "receipt": str(booking.booking_id),
            "payment_capture": 1,
        }
        order = client.order.create(order_data)
        booking.payment_order_id = order.get("id")
        booking.save()
        
        

        response_data = self.get_serializer(booking).data
        response_data.update({
            "razorpay_order_id": order.get("id"),
            "razorpay_key_id": settings.RAZORPAY_KEY_ID,
            "amount": total_amount,
            "is_partial_payment": is_partial_payment,
        })

        return Response(response_data, status=status.HTTP_201_CREATED)




# class BookingCreateView(generics.CreateAPIView):
#     serializer_class = BookingSerializer
#     permission_classes = [IsAuthenticated]

#     def create(self, request, *args, **kwargs):
#         user = request.user
#         if not user or not user.is_authenticated:
#             return Response(
#                 {"error": "Authentication credentials were not provided."},
#                 status=status.HTTP_401_UNAUTHORIZED
#             )

#         service_id = request.data.get("service")
#         time_slot_id = request.data.get("time_slot")
#         date = request.data.get("date")
#         duration_hours = int(request.data.get("duration_hours", 1))
#         is_partial_payment = request.data.get("is_partial_payment", False)

#         if isinstance(is_partial_payment, str):
#             is_partial_payment = is_partial_payment.lower() in ("true", "1", "yes")
#         else:
#             is_partial_payment = bool(is_partial_payment)

#         if not all([service_id, time_slot_id, date]):
#             return Response(
#                 {"error": "Missing required fields (service, time_slot, date)."},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         try:
#             service = Service.objects.get(id=service_id)
#             start_slot = TimeSlot.objects.get(id=time_slot_id)
#         except (Service.DoesNotExist, TimeSlot.DoesNotExist):
#             return Response(
#                 {"error": "Invalid service or time slot."},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         # -------- SLOT RESOLUTION --------
#         all_slots = list(TimeSlot.objects.all().order_by("start_time"))

#         if start_slot not in all_slots:
#             return Response(
#                 {"error": "Invalid start slot selection."},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         start_index = all_slots.index(start_slot)
#         required_slots = all_slots[start_index:start_index + duration_hours]

#         if len(required_slots) < duration_hours:
#             return Response(
#                 {"error": "Not enough consecutive slots available."},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         # -------- GLOBAL SLOT BLOCKING --------
#         if Booking.objects.filter(
#             time_slot__in=required_slots,
#             date=date
#         ).exists():
#             return Response(
#                 {"error": "One or more selected hours are already booked."},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         # -------- PRICING LOGIC --------
#         total_payable = Decimal("0.00")

#         for slot in required_slots:
#             if slot.start_time >= EVENING_START:
#                 price = service.evening_pricing
#             else:
#                 price = service.price_per_hour

#             total_payable += price


#         print(f"Total payable for booking: {total_payable}")
#         # -------- CREATE BOOKING --------
#         booking = Booking.objects.create(
#             user=user,
#             service=service,
#             time_slot=start_slot,
#             date=date,
#             duration_hours=duration_hours,
#             status="pending",
#             total_payable=total_payable
#         )

#         # -------- RAZORPAY ORDER --------
#         client = razorpay.Client(
#             auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
#         )

#         payable_amount_rupees = total_payable

#         if is_partial_payment:
#             partial_percentage = getattr(
#                 settings, "PARTIAL_PAYMENT_PERCENTAGE", Decimal("0.25")
#             )
#             if not isinstance(partial_percentage, Decimal):
#                 partial_percentage = Decimal(str(partial_percentage))

#             payable_amount_rupees = (
#                 total_payable * partial_percentage
#             ).quantize(Decimal("0.01"))

#         total_amount_paise = int(payable_amount_rupees * 100)

#         order_data = {
#             "amount": total_amount_paise,
#             "currency": "INR",
#             "receipt": str(booking.booking_id),
#             "payment_capture": 1,
#         }

#         order = client.order.create(order_data)

#         booking.payment_order_id = order.get("id")
#         booking.save(update_fields=["payment_order_id"])

#         # -------- RESPONSE --------
#         response_data = self.get_serializer(booking).data
#         response_data.update({
#             "razorpay_order_id": order.get("id"),
#             "razorpay_key_id": settings.RAZORPAY_KEY_ID,
#             "amount": total_amount_paise,
#             "is_partial_payment": is_partial_payment,
#         })

#         return Response(response_data, status=status.HTTP_201_CREATED)


class CreateRazorpayOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        booking_id = request.data.get("booking_id")
        amount = request.data.get("amount")  # in rupees

        if not all([booking_id, amount]):
            return Response({"error": "Missing booking_id or amount"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            booking = Booking.objects.get(booking_id=booking_id, user=request.user)
        except Booking.DoesNotExist:
            return Response({"error": "Invalid booking_id"}, status=status.HTTP_404_NOT_FOUND)

        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

        # Razorpay expects amount in paise
        razorpay_order = client.order.create({
            "amount": int(amount) * 100,
            "currency": "INR",
            "payment_capture": 1
        })

        booking.payment_order_id = razorpay_order["id"]
        booking.save()

        return Response({
            "order_id": razorpay_order["id"],
            "amount": razorpay_order["amount"],
            "currency": "INR",
            "key": settings.RAZORPAY_KEY_ID
        }, status=status.HTTP_201_CREATED)
        
        
        
        
class VerifyPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        order_id = data.get("razorpay_order_id")
        payment_id = data.get("razorpay_payment_id")
        signature = data.get("razorpay_signature")
        is_partial_payment = data.get("is_partial_payment", False)
        if isinstance(is_partial_payment, str):
            is_partial_payment = is_partial_payment.lower() in ("true", "1", "yes")
        else:
            is_partial_payment = bool(is_partial_payment)

        if not all([order_id, payment_id, signature]):
            return Response(
                {"error": "Incomplete payment data."},
                status=status.HTTP_400_BAD_REQUEST
            )

        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        params_dict = {
            "razorpay_order_id": order_id,
            "razorpay_payment_id": payment_id,
            "razorpay_signature": signature
        }

        try:
            # Verify signature
            client.utility.verify_payment_signature(params_dict)

            # Fetch and update booking
            booking = Booking.objects.filter(payment_order_id=order_id, user=request.user).first()
            if not booking:
                return Response({"error": "Booking not found."}, status=status.HTTP_404_NOT_FOUND)

            booking.payment_id = payment_id
            booking.payment_signature = signature
            booking.amount_paid = booking.total_payable
            booking.status = "partial" if is_partial_payment else "paid"
            booking.save()
            
            # Send booking confirmation emails
            # send_booking_emails(booking)
            send_booking_emails_task(booking.id)
            return Response({
                "success": True,
                "message": "Payment verified successfully",
                "booking_id": str(booking.booking_id)
            })

        except razorpay.errors.SignatureVerificationError:
            return Response(
                {"success": False, "message": "Payment verification failed"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
            
            
@api_view(['GET'])
def get_services(request):
    permission_classes = [AllowAny]
    services = Service.objects.all()
    serialized_data = ServiceSerializer(services, many=True).data
    return Response(serialized_data, status=200)







class MyBookingsView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user).order_by('-created_at')
    
    


class BookingDetailView(generics.RetrieveAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'booking_id'

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)
    
    
@api_view(['GET'])
def health_check(request):
    return Response({"status": "ok"}, status=200)