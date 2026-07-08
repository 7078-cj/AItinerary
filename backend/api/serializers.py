from rest_framework import serializers
from django.contrib.auth.models import User
from .models import BudgetBreakdown, DailyItinerary, Meal, Trip, ToGoLocation


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}
        
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            
        )
        return user



class MealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meal
        fields = [
            "id",
            "type",
            "time",
            "restaurant",
            "osm_query",
            "address",
            "recommended_orders",
            "estimated_cost",
            "latitude",
            "longitude",
        ]


class ToGoLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ToGoLocation
        fields = [
            "id",
            "order",
            "arrival_time",
            "departure_time",
            "name",
            "osm_query",
            "address",
            "description",
            "estimated_cost",
            "estimated_duration_minutes",
            "crowd_level_notes",
            "accessibility",
            "latitude",
            "longitude",
            "geocoded",
            "transport",
        ]


class DailyItinerarySerializer(serializers.ModelSerializer):
    meal_plan = MealSerializer(many=True, required=False)
    to_go_locations = ToGoLocationSerializer(many=True, required=False)

    class Meta:
        model = DailyItinerary
        fields = [
            "id",
            "day",
            "theme",
            "daily_budget_food",
            "daily_budget_transport",
            "daily_budget_activities",
            "daily_budget_total",
            "meal_plan",
            "to_go_locations",
        ]

    def create(self, validated_data):
        meals_data = validated_data.pop("meal_plan", [])
        locations_data = validated_data.pop("to_go_locations", [])
        daily_itinerary = DailyItinerary.objects.create(**validated_data)
        self._sync_children(daily_itinerary, meals_data, locations_data)
        return daily_itinerary

    def update(self, instance, validated_data):
        meals_data = validated_data.pop("meal_plan", None)
        locations_data = validated_data.pop("to_go_locations", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if meals_data is not None:
            instance.meal_plan.all().delete()
            for meal in meals_data:
                Meal.objects.create(daily_itinerary=instance, **meal)

        if locations_data is not None:
            instance.to_go_locations.all().delete()
            for location in locations_data:
                ToGoLocation.objects.create(daily_itinerary=instance, **location)

        return instance

    @staticmethod
    def _sync_children(daily_itinerary, meals_data, locations_data):
        for meal in meals_data:
            Meal.objects.create(daily_itinerary=daily_itinerary, **meal)
        for location in locations_data:
            ToGoLocation.objects.create(daily_itinerary=daily_itinerary, **location)


class BudgetBreakdownSerializer(serializers.ModelSerializer):
    class Meta:
        model = BudgetBreakdown
        fields = [
            "hotel",
            "food",
            "transport",
            "activities",
            "shopping",
            "misc",
            "total",
        ]


class TripSerializer(serializers.ModelSerializer):
    """
    Serializer for list/create and retrieve/update/destroy of a Trip.
    `user` is read-only and is always taken from the logged-in request,
    never from client input.
    """

    user = serializers.PrimaryKeyRelatedField(read_only=True)
    budget_breakdown = BudgetBreakdownSerializer(required=False)
    daily_itinerary = DailyItinerarySerializer(many=True, required=False)

    class Meta:
        model = Trip
        fields = [
            "id",
            "user",
            "destination",
            "country",
            "days",
            "nights",
            "currency",
            "travelers",
            "vibe_mood",
            "vibe_description",
            "vibe_color_palette",
            "vibe_photo_style_notes",
            "group_considerations",
            "accessibility_notes",
            "budget_total",
            "budget_recommended",
            "hotel_name",
            "hotel_osm_query",
            "hotel_address",
            "hotel_type",
            "hotel_estimated_cost",
            "hotel_accessibility",
            "hotel_latitude",
            "hotel_longitude",
            "hotel_geocoded",
            "transportation_type",
            "transportation_recommended",
            "transportation_estimated_carbon_kg_co2",
            "transportation_carbon_comparison_notes",
            "travel_tips",
            "budget_breakdown",
            "daily_itinerary",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "user", "created_at", "updated_at"]

    def create(self, validated_data):
        budget_data = validated_data.pop("budget_breakdown", None)
        daily_itinerary_data = validated_data.pop("daily_itinerary", [])

        # user is injected by the view via serializer.save(user=request.user)
        trip = Trip.objects.create(**validated_data)

        if budget_data:
            BudgetBreakdown.objects.create(trip=trip, **budget_data)

        for day_data in daily_itinerary_data:
            meals_data = day_data.pop("meal_plan", [])
            locations_data = day_data.pop("to_go_locations", [])
            daily_itinerary = DailyItinerary.objects.create(trip=trip, **day_data)
            for meal in meals_data:
                Meal.objects.create(daily_itinerary=daily_itinerary, **meal)
            for location in locations_data:
                ToGoLocation.objects.create(daily_itinerary=daily_itinerary, **location)

        return trip

    def update(self, instance, validated_data):
        budget_data = validated_data.pop("budget_breakdown", None)
        daily_itinerary_data = validated_data.pop("daily_itinerary", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if budget_data is not None:
            BudgetBreakdown.objects.update_or_create(trip=instance, defaults=budget_data)

        if daily_itinerary_data is not None:
            instance.daily_itinerary.all().delete()
            for day_data in daily_itinerary_data:
                meals_data = day_data.pop("meal_plan", [])
                locations_data = day_data.pop("to_go_locations", [])
                daily_itinerary = DailyItinerary.objects.create(trip=instance, **day_data)
                for meal in meals_data:
                    Meal.objects.create(daily_itinerary=daily_itinerary, **meal)
                for location in locations_data:
                    ToGoLocation.objects.create(daily_itinerary=daily_itinerary, **location)

        return instance


class TripListSerializer(serializers.ModelSerializer):
    """Lighter-weight serializer for the list endpoint."""

    class Meta:
        model = Trip
        fields = [
            "id",
            "destination",
            "country",
            "days",
            "nights",
            "currency",
            "budget_total",
            "created_at",
            "updated_at",
        ]