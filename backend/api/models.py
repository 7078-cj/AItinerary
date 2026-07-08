from django.conf import settings
from django.db import models


class Trip(models.Model):
    """Top level trip, owned by the logged-in user."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="trips",
    )

    destination = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    days = models.PositiveIntegerField()
    nights = models.PositiveIntegerField()
    currency = models.CharField(max_length=10, default="PHP")
    travelers = models.PositiveIntegerField(default=1)

    # vibe
    vibe_mood = models.CharField(max_length=255, blank=True)
    vibe_description = models.TextField(blank=True)
    vibe_color_palette = models.JSONField(default=list, blank=True)
    vibe_photo_style_notes = models.TextField(blank=True)

    group_considerations = models.TextField(blank=True)
    accessibility_notes = models.TextField(blank=True)

    # budget
    budget_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    budget_recommended = models.BooleanField(default=True)

    # hotel
    hotel_name = models.CharField(max_length=255, blank=True)
    hotel_osm_query = models.CharField(max_length=500, blank=True)
    hotel_address = models.CharField(max_length=500, blank=True)
    hotel_type = models.CharField(max_length=100, blank=True)
    hotel_estimated_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    hotel_accessibility = models.TextField(blank=True)
    hotel_latitude = models.FloatField(null=True, blank=True)
    hotel_longitude = models.FloatField(null=True, blank=True)
    hotel_geocoded = models.BooleanField(default=False)

    # transportation
    transportation_type = models.CharField(max_length=255, blank=True)
    transportation_recommended = models.BooleanField(default=True)
    transportation_estimated_carbon_kg_co2 = models.FloatField(null=True, blank=True)
    transportation_carbon_comparison_notes = models.TextField(blank=True)

    travel_tips = models.JSONField(default=list, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.destination} ({self.user})"


class BudgetBreakdown(models.Model):
    trip = models.OneToOneField(
        Trip, on_delete=models.CASCADE, related_name="budget_breakdown"
    )
    hotel = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    food = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    transport = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    activities = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    shopping = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    misc = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def __str__(self):
        return f"Budget breakdown for {self.trip}"


class DailyItinerary(models.Model):
    trip = models.ForeignKey(
        Trip, on_delete=models.CASCADE, related_name="daily_itinerary"
    )
    day = models.PositiveIntegerField()
    theme = models.CharField(max_length=255, blank=True)

    # daily_budget
    daily_budget_food = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    daily_budget_transport = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    daily_budget_activities = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    daily_budget_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    class Meta:
        ordering = ["day"]
        unique_together = ("trip", "day")
        verbose_name_plural = "Daily itineraries"

    def __str__(self):
        return f"Day {self.day} - {self.theme}"


class Meal(models.Model):
    class MealType(models.TextChoices):
        BREAKFAST = "Breakfast", "Breakfast"
        LUNCH = "Lunch", "Lunch"
        DINNER = "Dinner", "Dinner"
        SNACK = "Snack", "Snack"

    daily_itinerary = models.ForeignKey(
        DailyItinerary, on_delete=models.CASCADE, related_name="meal_plan"
    )
    type = models.CharField(max_length=20, choices=MealType.choices)
    time = models.CharField(max_length=10, blank=True)  # "08:00"
    restaurant = models.CharField(max_length=255, blank=True)
    osm_query = models.CharField(max_length=500, blank=True)
    address = models.CharField(max_length=500, blank=True)
    recommended_orders = models.JSONField(default=list, blank=True)
    estimated_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    class Meta:
        ordering = ["time"]

    def __str__(self):
        return f"{self.type} - {self.restaurant}"


class ToGoLocation(models.Model):
    daily_itinerary = models.ForeignKey(
        DailyItinerary, on_delete=models.CASCADE, related_name="to_go_locations"
    )
    order = models.PositiveIntegerField(default=1)
    arrival_time = models.CharField(max_length=10, blank=True)
    departure_time = models.CharField(max_length=10, blank=True)
    name = models.CharField(max_length=255)
    osm_query = models.CharField(max_length=500, blank=True)
    address = models.CharField(max_length=500, blank=True)
    description = models.TextField(blank=True)
    estimated_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    estimated_duration_minutes = models.PositiveIntegerField(null=True, blank=True)
    crowd_level_notes = models.TextField(blank=True)
    accessibility = models.TextField(blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    geocoded = models.BooleanField(default=False)
    transport = models.JSONField(default=dict, blank=True)  # type, distance, duration, geometry

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.name