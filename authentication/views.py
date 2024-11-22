from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from django.views.generic import View
from rest_framework.views import APIView
from .models import CustomUser
from datetime import datetime, timedelta
import random
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.timezone import now
from django.conf import settings

User = get_user_model()
class LoginView(APIView):
    @method_decorator(ratelimit(key='ip', rate='1/m', block=True))
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = CustomUser.objects.filter(email=email).first()

        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)
            response = Response({
                'message': 'Вхід успішний',
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_200_OK)

            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE'],
                value=str(refresh.access_token),
                httponly=True,
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
            )

            return response

        return Response({'error': 'Невірні дані для входу'}, status=status.HTTP_400_BAD_REQUEST)

class VerifyEmail(APIView):
    @method_decorator(ratelimit(key='ip', rate='2/m', block=True, method="POST"))
    def post(self, request):
        email = request.data.get('email')
        user = User.objects.filter(email=email).first()
        
        if user:
            code = str(random.randint(100000, 999999))
            user.verification_code = code
            user.code_expires_at = now() + timedelta(minutes=10)  # Використовуємо timezone-aware дату
            user.save()
            
            send_mail(
                'Ваш код підтвердження',
                f'Ваш код: {code}',
                'from@example.com',
                [email],
            )
            return Response({'message': 'Код підтвердження надіслано'}, status=status.HTTP_200_OK)
        
        return Response({'error': 'Користувача з такою поштою не знайдено'}, status=status.HTTP_400_BAD_REQUEST)

    
class Verify2FACode(APIView):
    @method_decorator(ratelimit(key='ip', rate='3/m', block=True))
    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('code')
        user = CustomUser.objects.filter(email=email).first()

        if user:
            if user.verification_code == code and user.code_expires_at > now():
                user.is_verified = True
                user.verification_code = None
                user.save()
                return Response({'message': 'Успішно верифіковано'}, status=status.HTTP_200_OK)
            return Response({'error': 'Неправильний або прострочений код'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'error': 'Користувача з такою поштою не знайдено'}, status=status.HTTP_400_BAD_REQUEST)
