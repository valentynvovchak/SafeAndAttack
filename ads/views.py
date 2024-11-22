from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.generics import RetrieveAPIView
from rest_framework.generics import DestroyAPIView
from .models import Ad
from .serializers import AdSerializer
from django.core.cache import cache  # Для тимчасового зберігання CAPTCHA
import requests

def validate_recaptcha(captcha_response):
    secret_key = "6LfSSIUqAAAAANVuZY50-uK6frsF900BZHJee2EZ"  # Ваш секретний ключ Google reCAPTCHA
    url = "https://www.google.com/recaptcha/api/siteverify"
    data = {
        'secret': secret_key,
        'response': captcha_response
    }
    response = requests.post(url, data=data)
    return response.json().get('success', False)


class AdListView(ListAPIView):
    queryset = Ad.objects.all().order_by('-created_at')
    serializer_class = AdSerializer

class AdDetailView(RetrieveAPIView):
    queryset = Ad.objects.all()
    serializer_class = AdSerializer



class CreateAdView(APIView):
    def post(self, request):
        captcha_response = request.data.get('captcha')
        if not validate_recaptcha(captcha_response):
            return Response({"error": "Неправильна CAPTCHA"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = AdSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdDetailView(DestroyAPIView):
    queryset = Ad.objects.all()
    serializer_class = AdSerializer