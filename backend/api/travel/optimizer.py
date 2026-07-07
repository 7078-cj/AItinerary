from math import radians, sin, cos, sqrt, atan2
from typing import Dict, List

EARTH_RADIUS_KM = 6371.0


def haversine_distance(
    lat1: float,
    lon1: float,
    lat2: float,
    lon2: float,
) -> float:
    """
    Returns the distance between two coordinates in kilometers.
    """

    lat1 = radians(lat1)
    lon1 = radians(lon1)

    lat2 = radians(lat2)
    lon2 = radians(lon2)

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = (
        sin(dlat / 2) ** 2
        + cos(lat1)
        * cos(lat2)
        * sin(dlon / 2) ** 2
    )

    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    return EARTH_RADIUS_KM * c


def nearest_neighbor(stops: List[Dict]) -> List[Dict]:
    """
    Orders locations using the nearest-neighbor heuristic.
    """

    if len(stops) <= 2:
        return stops

    remaining = stops.copy()
    ordered = [remaining.pop(0)]

    while remaining:

        current = ordered[-1]

        nearest = min(
            remaining,
            key=lambda x: haversine_distance(
                current["latitude"],
                current["longitude"],
                x["latitude"],
                x["longitude"],
            ),
        )

        ordered.append(nearest)
        remaining.remove(nearest)

    return ordered


def renumber(stops: List[Dict]):

    for index, stop in enumerate(stops, start=1):
        stop["order"] = index


def estimate_times(
    day: Dict,
    start_hour: int = 9,
    start_minute: int = 0,
):

    hour = start_hour
    minute = start_minute

    for stop in day["to_go_locations"]:

        stop["arrival_time"] = f"{hour:02}:{minute:02}"

        duration = stop.get(
            "estimated_duration_minutes",
            60,
        )

        minute += duration

        while minute >= 60:
            hour += 1
            minute -= 60

        stop["departure_time"] = f"{hour:02}:{minute:02}"


def optimize_day(day: Dict):

    original_stops = day.get("to_go_locations", [])

    valid_stops = []
    invalid_stops = []

    for stop in original_stops:

        if (
            stop.get("latitude") is not None
            and stop.get("longitude") is not None
        ):
            valid_stops.append(stop)
        else:
            invalid_stops.append(stop)

    if invalid_stops:
        print("\n⚠ Skipping locations with missing coordinates:")

        for stop in invalid_stops:
            print(
                f"   - {stop.get('name', 'Unknown Location')}"
            )

    if len(valid_stops) < 2:

        day["to_go_locations"] = valid_stops

        estimate_times(day)

        return day

    optimized = nearest_neighbor(valid_stops)

    renumber(optimized)

    day["to_go_locations"] = optimized

    estimate_times(day)

    return day


def optimize_itinerary(itinerary: Dict):

    print("\n==============================")
    print("STARTING OPTIMIZER")
    print("==============================")

    for index, day in enumerate(
        itinerary.get("daily_itinerary", []),
        start=1,
    ):

        print(f"Optimizing Day {index}")

        optimize_day(day)

        print(
            f"✓ Day {index} optimized with "
            f"{len(day.get('to_go_locations', []))} locations."
        )

    print("==============================")
    print("OPTIMIZER COMPLETE")
    print("==============================")

    return itinerary