from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .Views.user_views import registerUser, MyTokenObtainPairView, test, generate_itininerary


urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', registerUser, name='register_user'),
    path('test/', test, name='test'),
    path('itinerary/', generate_itininerary, name="Generate Itinerary")
    
    
]