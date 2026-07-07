import httpx
from typing import Dict, Optional

OSRM_URL = "https://router.project-osrm.org"

PROFILE_MAP = {
    "Walk": "walking",
    "Walking": "walking",
    "Drive": "driving",
    "Driving": "driving",
    "Car": "driving",
    "Bike": "cycling",
    "Cycling": "cycling",
}


class Router:

    def __init__(self):
        self.client = httpx.Client(timeout=20)

    def close(self):
        self.client.close()

    def route(
        self,
        start_lat: float,
        start_lon: float,
        end_lat: float,
        end_lon: float,
        profile: str = "walking",
    ) -> Optional[Dict]:

        url = (
            f"{OSRM_URL}/route/v1/"
            f"{profile}/"
            f"{start_lon},{start_lat};"
            f"{end_lon},{end_lat}"
        )

        try:

            response = self.client.get(
                url,
                params={
                    "overview": "full",
                    "geometries": "geojson",
                },
            )

            response.raise_for_status()

            data = response.json()

            if not data.get("routes"):
                return None

            route = data["routes"][0]

            return {
                "distance_meters": route["distance"],
                "distance_km": round(route["distance"] / 1000, 2),
                "duration_seconds": route["duration"],
                "duration_minutes": round(route["duration"] / 60),
                "geometry": route["geometry"],
            }

        except Exception:
            return None


def calculate_day_routes(day: Dict, router: Router):

    locations = day.get("to_go_locations", [])

    if len(locations) < 2:
        return

    for i in range(len(locations) - 1):

        current = locations[i]
        nxt = locations[i + 1]

        if (
            current.get("latitude") is None
            or current.get("longitude") is None
            or nxt.get("latitude") is None
            or nxt.get("longitude") is None
        ):
            continue

        transport = current.get(
            "transport",
            {}
        ).get(
            "type",
            "Walking",
        )

        profile = PROFILE_MAP.get(
            transport,
            "walking",
        )

        result = router.route(
            current["latitude"],
            current["longitude"],
            nxt["latitude"],
            nxt["longitude"],
            profile,
        )

        if result:

            current["transport"] = {
                "type": transport,
                "distance_km": result["distance_km"],
                "distance_meters": result["distance_meters"],
                "duration_minutes": result["duration_minutes"],
                "duration_seconds": result["duration_seconds"],
                "geometry": result["geometry"],
            }


def calculate_routes(itinerary: Dict):

    router = Router()

    try:

        for day in itinerary.get("daily_itinerary", []):

            calculate_day_routes(
                day,
                router,
            )

    finally:

        router.close()

    return itinerary