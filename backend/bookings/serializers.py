from rest_framework import serializers
from .models import Service, TimeSlot, Booking


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'description', 'price_per_hour']


class TimeSlotSerializer(serializers.ModelSerializer):
    is_taken = serializers.SerializerMethodField()

    class Meta:
        model = TimeSlot
        fields = ['id', 'start_time', 'end_time', 'is_taken']

    def get_is_taken(self, obj):
        """
        Checks if a slot is already booked for the given date & service.
        The view should pass date & service_id in context.
        """
        request = self.context.get('request')
        date = request.query_params.get('date') if request else None
        service_id = request.query_params.get('service_id') if request else None

        if not (date and service_id):
            return False

        return Booking.objects.filter(
            date=date,
            time_slot=obj,
            service_id=service_id
        ).exists()


class BookingSerializer(serializers.ModelSerializer):
    service = ServiceSerializer(read_only=True)
    time_slot = TimeSlotSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = [
            'booking_id',
            'user',
            'service',
            'date',
            'time_slot',
            'status',
            'duration_hours',
            'payment_order_id',
            'payment_id',
            'payment_signature',
        ]
        read_only_fields = ['booking_id', 'status', 'payment_order_id', 'payment_id', 'payment_signature']





