from django.urls import path
from .views import (request_otp,
                    verify_otp,
                    TimeSlotListView,
                    BookingCreateView,
                    CreateRazorpayOrderView,
                    VerifyPaymentView)

urlpatterns = [
    path('auth/request-otp/', request_otp, name='request_otp'),
    path('auth/verify-otp/', verify_otp, name='verify_otp'),
    path('slots/', TimeSlotListView.as_view(), name='time-slot-list'),
    path('bookings/', BookingCreateView.as_view(), name='booking-create'),
    path('create-order/', CreateRazorpayOrderView.as_view(), name='create_razorpay_order'),
    path('verify-payment/', VerifyPaymentView.as_view(), name='verify_payment'),

]
