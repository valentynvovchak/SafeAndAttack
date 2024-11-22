from django.urls import path
from .views import LoginView, VerifyEmail, Verify2FACode

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('verify-email/', VerifyEmail.as_view(), name='verify-email'),
    path('verify-2fa/', Verify2FACode.as_view(), name='verify-2fa'),
]
