from django.contrib import admin
from .models import ContactEnquiry, DemoBooking

admin.site.register(DemoBooking)
admin.site.register(ContactEnquiry)
