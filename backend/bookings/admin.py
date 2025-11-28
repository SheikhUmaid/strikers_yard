from django.contrib import admin
from .models import TimeSlot, Service, Booking, User, OTP
# Register your models here.


admin.site.register(User)
admin.site.register(OTP)
admin.site.register(Service)
admin.site.register(TimeSlot)
admin.site.register(Booking)


# 'Droid Sans Mono', 'monospace', monospace, ''