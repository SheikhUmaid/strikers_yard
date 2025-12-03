from background_task import background
from django.core.mail import send_mail
from django.conf import settings
from bookings.models import Booking, TimeSlot
from django.utils import timezone


@background(schedule=1)
def send_booking_emails_task(booking_id):
    """
    Background task to send booking confirmation emails
    (User + Owner)
    """

    booking = Booking.objects.select_related(
        "user", "service", "time_slot"
    ).get(id=booking_id)

    user = booking.user
    service = booking.service

    start_slot = booking.time_slot

    all_slots = list(
        TimeSlot.objects.order_by("start_time")
    )
    start_index = all_slots.index(start_slot)
    end_slot = all_slots[start_index + booking.duration_hours - 1]

    amount_paid = booking.amount_paid

    # ✅ User email
    send_mail(
        subject="Booking Confirmed ✅",
        message=(
            f"Your booking is confirmed.\n\n"
            f"Service: {service.name}\n"
            f"Date: {booking.date}\n"
            f"Time: {start_slot.start_time} - {end_slot.end_time}\n"
            f"Duration: {booking.duration_hours} hour(s)\n"
            f"Amount Paid: ₹{amount_paid}\n"
            f"Booking ID: {booking.booking_id}\n"
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )

    # ✅ Owner email
    send_mail(
        subject="New Turf Booking ⚽",
        message=(
            f"A new booking has been confirmed.\n\n"
            f"Customer: {user.name}\n"
            f"Service: {service.name}\n"
            f"Date: {booking.date}\n"
            f"Time: {start_slot.start_time} - {end_slot.end_time}\n"
            f"Duration: {booking.duration_hours} hour(s)\n"
            f"Status: {booking.status}\n"
            f"Booking ID: {booking.booking_id}\n"
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[settings.OWNER_EMAIL],
        fail_silently=False,
    )




@background(schedule=0)
def expire_pending_booking(booking_id):
    try:
        booking = Booking.objects.get(id=booking_id)
    except Booking.DoesNotExist:
        return

    if booking.status != 'pending':
        return
    booking.status = 'cancelled'
    booking.save(update_fields=['status'])