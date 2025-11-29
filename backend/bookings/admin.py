from django.contrib import admin
from .models import TimeSlot, Service, Booking 
from django.contrib.auth.models import Group




# Register your models here.

admin.site.site_header = "Strikers Yard Admin"
admin.site.site_title = "Strikers Yard Admin Portal"
admin.site.index_title = "Strikers Yard Booking Management"


admin.site.unregister(Group)
admin.site.register(Service)
admin.site.register(TimeSlot)
admin.site.register(Booking)


