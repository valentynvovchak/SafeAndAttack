from django.urls import path
from .views import CreateAdView, AdListView, AdDetailView

urlpatterns = [
    path('', AdListView.as_view(), name='ad-list'),
    path('<int:pk>/', AdDetailView.as_view(), name='ad-detail'),  # Видалення
    path('create/', CreateAdView.as_view(), name='create-ad'),
]
