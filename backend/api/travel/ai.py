import json
from typing import Dict, Any

from ..utils import generate


def build_itinerary_prompt(user_prompt: str) -> str:
    """
    Creates the prompt for the AI itinerary generator.
    """

    return f"""
You are an expert travel planner.

The user request is:

"{user_prompt}"

Your task is to generate a COMPLETE travel itinerary.

If the user does NOT specify:

- destination
- duration
- budget
- hotel
- transportation
- attractions
- restaurants
- meal preferences
- vibe / mood / aesthetic

recommend sensible defaults.

If the user DOES specify or imply a desired vibe, mood, or aesthetic (e.g. "romantic", "adventurous", "cozy", "luxurious", "chill", "vibrant nightlife", "pastel aesthetic", "moody golden-hour photos", "IG-worthy", etc.), you MUST:

- Let that vibe influence which attractions, restaurants, and activities are chosen (e.g. a "romantic" vibe favors sunset viewpoints and intimate restaurants over crowded tourist traps; a "vibrant/energetic" vibe favors markets, nightlife, and colorful street scenes).
- Let it influence pacing and timing (e.g. a "relaxed" vibe should have fewer stops and longer dwell times; a "packed adventure" vibe can be denser).
- Infer a color palette / photo mood target that matches the vibe (e.g. warm golden tones for "romantic sunset", pastel and bright colors for "cute aesthetic", moody blues and neutrals for "minimalist/chill"), and factor that into attraction choice and suggested time of day (so lighting matches, e.g. golden hour for warm tones).
- Reflect this in a top-level "vibe" object in the JSON (see schema) summarizing the intended mood, descriptive tone, and target color palette, and weave consistent mood language into each day's "theme" and each location's "description".

Return ONLY valid JSON.

Do NOT include markdown.
Do NOT explain.
Do NOT wrap the JSON inside ```.

JSON Schema

{{
    "trip": {{
        "destination": "",
        "country": "",
        "days": 0,
        "nights": 0,
        "currency": "",
        "travelers": 1,
        "vibe": {{
            "mood": "",
            "description": "",
            "color_palette": [],
            "photo_style_notes": ""
        }},
        "budget": {{
            "total": 0,
            "recommended": true
        }},
        "hotel": {{
            "name": "",
            "osm_query": "",
            "address": "",
            "type": "",
            "estimated_cost": 0
        }},
        "transportation": {{
            "type": "",
            "recommended": true
        }}
    }},

    "daily_itinerary": [
        {{
            "day": 1,
            "theme": "",

            "meal_plan": [
                {{
                    "type": "Breakfast",
                    "time": "08:00",
                    "restaurant": "",
                    "osm_query": "",
                    "address": "",
                    "recommended_orders": [
                        {{
                            "name": "",
                            "description": "",
                            "estimated_price": 0
                        }}
                    ],
                    "estimated_cost": 0
                }},
                {{
                    "type": "Lunch",
                    "time": "12:00",
                    "restaurant": "",
                    "osm_query": "",
                    "address": "",
                    "recommended_orders": [
                        {{
                            "name": "",
                            "description": "",
                            "estimated_price": 0
                        }}
                    ],
                    "estimated_cost": 0
                }},
                {{
                    "type": "Dinner",
                    "time": "18:00",
                    "restaurant": "",
                    "osm_query": "",
                    "address": "",
                    "recommended_orders": [
                        {{
                            "name": "",
                            "description": "",
                            "estimated_price": 0
                        }}
                    ],
                    "estimated_cost": 0
                }}
            ],

            "to_go_locations": [
                {{
                    "order": 1,
                    "arrival_time": "09:00",
                    "departure_time": "11:00",
                    "name": "",
                    "osm_query": "",
                    "address": "",
                    "description": "",
                    "estimated_cost": 0,
                    "estimated_duration_minutes": 120
                }}
            ],

            "daily_budget": {{
                "food": 0,
                "transport": 0,
                "activities": 0,
                "total": 0
            }}
        }}
    ],

    "budget_breakdown": {{
        "hotel": 0,
        "food": 0,
        "transport": 0,
        "activities": 0,
        "shopping": 0,
        "misc": 0,
        "total": 0
    }},

    "travel_tips": []
}}

Rules

1. Return ONLY JSON.
2. Recommend REAL attractions.
3. Recommend REAL restaurants.
4. Every day MUST have Breakfast, Lunch and Dinner.
5. Every day MUST have attractions.
6. Attractions should already be ordered geographically.
7. Hotel should be close to Day 1 attractions.
8. Include realistic budgets.
9. Include realistic visit durations.
10. Use complete addresses whenever possible.
11. Do NOT generate latitude or longitude.
12. Budget total must equal the breakdown.
13. Generate the correct number of itinerary days.
14. Never leave arrays empty.
15. Always recommend at least 3 attractions per day.

Vibe & Aesthetic

16a. Always populate the "trip.vibe" object, even if the user didn't specify a vibe — infer a sensible default based on the destination and trip type.
16b. "color_palette" should be a short list (3–6) of descriptive color/tone words (e.g. "warm gold", "terracotta", "soft pastel pink", "deep ocean blue") that match the intended photo mood.
16c. "photo_style_notes" should briefly describe lighting/time-of-day and composition style that fits the vibe (e.g. "golden hour, warm backlighting, silhouettes").
16d. Attraction and restaurant choices, and suggested visit times, should be consistent with the stated vibe and color palette where multiple equally-valid real options exist.

OpenStreetMap / OSRM Compatibility

17. Every attraction, hotel, and restaurant MUST be a real place that currently exists.

18. Every attraction, hotel, and restaurant MUST include an "osm_query" field.

19. The osm_query must be written exactly as it should be searched in OpenStreetMap Nominatim.

20. Format osm_query as:

"Official Place Name, City, Country"

Examples:

"Eiffel Tower, Paris, France"

"Louvre Museum, Paris, France"

"The Shelbourne Dublin, Autograph Collection, Dublin, Ireland"

"The Woollen Mills, Dublin, Ireland"

21. Use official names only.

22. Never abbreviate place names.

23. Never invent attractions, restaurants or hotels.

24. The "name" field should only contain the official place name.

25. The "address" field should contain the full postal address whenever known.

26. The "osm_query" field should always be optimized for OpenStreetMap geocoding.

27. All generated places must be uniquely searchable using their osm_query.

28. The generated itinerary will later be processed by OpenStreetMap Nominatim and OSRM Routing APIs, so every osm_query must resolve to a single real-world location.

Restaurant Recommendations

29. Every meal must recommend 2–4 signature dishes or drinks available at that restaurant.

30. Include a "recommended_orders" array.

31. Each recommended order must contain:
    - name
    - description
    - estimated_price

32. Estimated prices must use the destination country's local currency.

33. The meal's estimated_cost should equal the approximate sum of the recommended orders.

34. Recommend the restaurant's most popular or signature dishes.

35. Do not invent menu items.

36. Ensure the dishes actually exist at the recommended restaurant.

37. Breakfast should contain breakfast items.

38. Lunch and dinner may contain appetizers, main courses, desserts, or beverages.

39. Recommend at least one local specialty food every day.

40. If the traveler has dietary preferences, recommend suitable dishes.

41. Prices should be realistic for the restaurant.

42. Use official restaurant names.

43. Every restaurant must include an osm_query.

44. Every attraction and restaurant should be reasonably close to each other to minimize travel time.

45. Balance indoor and outdoor attractions throughout the itinerary.

46. Avoid recommending duplicate attractions or restaurants during the trip unless explicitly requested.

47. Schedule meals near the attractions visited around the same time of day.

48. Include iconic local foods and must-try specialties unique to the destination.

49. Budget calculations must include the cost of the recommended menu items.

"""


def generate_itinerary(user_prompt: str) -> Dict[str, Any]:
    """
    Generates an itinerary using the configured LLM.
    """

    prompt = build_itinerary_prompt(user_prompt)

    response = generate(prompt)

    if not response["success"]:
        raise Exception(response["error"])

    return response["result"]


def validate_itinerary(itinerary: Dict[str, Any]) -> Dict[str, Any]:
    """
    Ensures required keys exist.
    """

    itinerary.setdefault("trip", {})
    itinerary.setdefault("daily_itinerary", [])
    itinerary.setdefault("budget_breakdown", {})
    itinerary.setdefault("travel_tips", [])

    for day in itinerary["daily_itinerary"]:

        day.setdefault("meal_plan", [])

        day.setdefault("to_go_locations", [])

        day.setdefault("daily_budget", {})

    return itinerary


def create_itinerary(user_prompt: str) -> Dict[str, Any]:
    """
    Main function.

    Returns AI itinerary before geocoding.
    """

    itinerary = generate_itinerary(user_prompt)

    itinerary = validate_itinerary(itinerary)

    return itinerary


