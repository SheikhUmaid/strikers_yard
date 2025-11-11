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
from bookings.serializers import BookingSerializer





from django.conf import settings
from datetime import datetime





import razorpay

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
    
    
    response = Response({
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "user": {
            "id": user.id,
            "phone_number": user.phone_number,
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
    

    # return Response({
    #     "refresh": str(refresh),
    #     "access": str(refresh.access_token),
    #     "user": {
    #         "id": user.id,
    #         "phone_number": user.phone_number,
    #     }
    # }, status=200)






class TimeSlotListView(APIView):
    """
    GET /api/slots/?date=YYYY-MM-DD&service_id=<id>
    Returns all slots for the day, marking which are already taken.
    """

    def get(self, request, *args, **kwargs):
        date_str = request.query_params.get('date')
        service_id = request.query_params.get('service_id')

        # Validate input
        if not date_str or not service_id:
            return Response(
                {"error": "Both 'date' and 'service_id' are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {"error": "Invalid date format. Use YYYY-MM-DD."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check service exists
        try:
            service = Service.objects.get(id=service_id)
        except Service.DoesNotExist:
            return Response(
                {"error": "Service not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Get all slots
        slots = TimeSlot.objects.all()
        serializer = TimeSlotSerializer(slots, many=True, context={'request': request})

        return Response({
            "date": str(date),
            "service": service.name,
            "slots": serializer.data
        }, status=status.HTTP_200_OK)
        
        
        






class BookingCreateView(generics.CreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user = request.user
        service_id = request.data.get("service")
        time_slot_id = request.data.get("time_slot")
        date = request.data.get("date")

        # Validation
        if not all([service_id, time_slot_id, date]):
            return Response(
                {"error": "Missing required fields (service, time_slot, date)."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            service = Service.objects.get(id=service_id)
            time_slot = TimeSlot.objects.get(id=time_slot_id)
        except (Service.DoesNotExist, TimeSlot.DoesNotExist):
            return Response({"error": "Invalid service or time slot."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if already booked
        if Booking.objects.filter(time_slot=time_slot, date=date, service=service).exists():
            return Response(
                {"error": "This time slot is already booked for this service."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create booking (pending payment)
        booking = Booking.objects.create(
            user=user,
            service=service,
            time_slot=time_slot,
            date=date,
            status="pending"
        )

        # Create Razorpay Order
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

        order_data = {
            "amount": int(service.price_per_hour),  # Razorpay uses paise
            "currency": "INR",
            "receipt": str(booking.booking_id),
            "payment_capture": 1
        }

        order = client.order.create(order_data)
        booking.payment_order_id = order.get("id")
        booking.save()

        response_data = self.get_serializer(booking).data
        response_data["razorpay_order_id"] = order.get("id")
        response_data["razorpay_key_id"] = settings.RAZORPAY_KEY_ID
        response_data["amount"] = order_data["amount"]

        return Response(response_data, status=status.HTTP_201_CREATED)
















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
            booking.status = "paid"
            booking.save()

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