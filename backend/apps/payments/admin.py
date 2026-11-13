from django.contrib import admin
from .models import Coupon, PaymentOrder, WebhookEvent

admin.site.register(Coupon)
admin.site.register(PaymentOrder)
admin.site.register(WebhookEvent)
