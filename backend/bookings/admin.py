from django.contrib import admin
from .models import TimeSlot, Service, Booking 
from django.contrib.auth.models import Group
from rangefilter.filters import DateRangeFilter





# Register your models here.

admin.site.site_header = "Strikers Yard Admin"
admin.site.site_title = "Strikers Yard Admin Portal"
admin.site.index_title = "Strikers Yard Booking Management"


admin.site.unregister(Group)
admin.site.register(Service)
admin.site.register(TimeSlot)

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    # This adds a nice date picker to your admin sidebar
    # list_filter = (
    #     ('date', DateRangeFilter),
    # )
    
    # Optional: Add search fields and list displays to make it more readable
    list_display = ('user', 'service', 'date', 'time_slot', 'duration_hours', 'status', 'get_day')

    list_filter = (
        'date',               # Built-in date filter
        'service',            # Filter by service
        'status',             # Filter by booking status
        'time_slot',          # Filter by time slot (added)
        'duration_hours',     # Filter by duration (added)
        # 'payment_status',     # Filter by payment status (added)
        # 'payment_method',     # Filter by payment method (added)
    )


