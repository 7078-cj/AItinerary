import time

from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from ..serializers import UserSerializer

from ..travel.ai import create_itinerary
from ..travel.geocoder import enrich_itinerary
from ..travel.optimizer import optimize_itinerary
from ..travel.routing import calculate_routes
from rest_framework import generics, permissions

from ..models import Trip
from ..serializers import TripListSerializer, TripSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(["POST"])
def registerUser(request):

    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "User registered successfully"},
            status=status.HTTP_201_CREATED,
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def test(request):
    return Response("Hello")


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def generate_itininerary(request):

    print("=" * 80)
    print("🚀 Generate Itinerary Started")

    total_start = time.perf_counter()

    prompt = request.data.get("prompt")

    print("\n📝 Prompt:")
    print(prompt)

    if not prompt:
        print("❌ Prompt is missing.")

        return Response(
            {
                "success": False,
                "message": "Prompt is required."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:

        #################################################################
        # STEP 1
        #################################################################

        print("\n" + "-" * 80)
        print("STEP 1 - AI GENERATION")

        start = time.perf_counter()

        itinerary = create_itinerary(prompt)

        print(f"✅ AI completed in {time.perf_counter() - start:.2f}s")

        print("\nTrip Information:")
        print(itinerary.get("trip"))

        print(
            f"Days Generated: {len(itinerary.get('daily_itinerary', []))}"
        )

        #################################################################
        # STEP 2
        #################################################################

        print("\n" + "-" * 80)
        print("STEP 2 - GEOCODER")

        start = time.perf_counter()

        itinerary = enrich_itinerary(itinerary)

        print(f"✅ Geocoder completed in {time.perf_counter() - start:.2f}s")

        #################################################################
        # STEP 3
        #################################################################

        print("\n" + "-" * 80)
        print("STEP 3 - OPTIMIZER")

        start = time.perf_counter()

        itinerary = optimize_itinerary(itinerary)

        print(f"✅ Optimizer completed in {time.perf_counter() - start:.2f}s")

        #################################################################
        # STEP 4
        #################################################################

        print("\n" + "-" * 80)
        print("STEP 4 - ROUTING")

        start = time.perf_counter()

        itinerary = calculate_routes(itinerary)

        print(f"✅ Routing completed in {time.perf_counter() - start:.2f}s")

        #################################################################
        # SUMMARY
        #################################################################

        print("\n" + "=" * 80)
        print("🎉 COMPLETE")
        print(f"Total Time: {time.perf_counter() - total_start:.2f}s")
        print("=" * 80)

        return Response(
            {
                "success": True,
                "result": itinerary,
            },
            status=status.HTTP_200_OK,
        )

    except Exception as e:

        print("\n" + "=" * 80)
        print("❌ ERROR OCCURRED")
        print(type(e).__name__)
        print(str(e))
        print("=" * 80)

        import traceback
        traceback.print_exc()

        return Response(
            {
                "success": False,
                "message": str(e),
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    





class IsOwner(permissions.BasePermission):
    """Object-level check: only the trip's owner can touch it."""

    def has_object_permission(self, request, view, obj):
        return obj.user_id == request.user.id


class TripListCreateView(generics.ListCreateAPIView):
    """
    GET  /trips/   -> list the logged-in user's trips
    POST /trips/   -> create a new trip for the logged-in user
    """

    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            Trip.objects.filter(user=self.request.user)
            .select_related("budget_breakdown")
            .prefetch_related("daily_itinerary__meal_plan", "daily_itinerary__to_go_locations")
        )

    def get_serializer_class(self):
        if self.request.method == "POST":
            return TripSerializer
        return TripListSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TripRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /trips/<pk>/  -> retrieve a single trip (owner only)
    PUT    /trips/<pk>/  -> full update
    PATCH  /trips/<pk>/  -> partial update
    DELETE /trips/<pk>/  -> delete
    """

    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        # Scoping the queryset to the user is a second line of defense
        # in addition to IsOwner, and keeps get_object_or_404 from ever
        # leaking a 404 vs 403 distinction to other users' trips.
        return (
            Trip.objects.filter(user=self.request.user)
            .select_related("budget_breakdown")
            .prefetch_related("daily_itinerary__meal_plan", "daily_itinerary__to_go_locations")
        )