from pathlib import Path
import os
import json
import environ
from google import genai
from google.genai import types
from google.genai.errors import ClientError
from fireworks import Fireworks

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, ".env"))

GEMINI_MODEL_FALLBACKS = [
    "gemini-2.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-flash-latest",  
]


def _call_gemini(client, prompt):
    last_error = None

    for model_name in GEMINI_MODEL_FALLBACKS:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                ),
            )
            return response.text
        except ClientError as e:
            if getattr(e, "code", None) == 404 or "NOT_FOUND" in str(e):
                last_error = e
                continue
            raise

    raise last_error


def generate(prompt):
    """
    Sends a prompt to either Fireworks or Gemini and returns parsed JSON.
    """

    use_fireworks = bool(env("FIREWORKS_AI_KEY", default=""))

    if use_fireworks:
        client = Fireworks(api_key=env("FIREWORKS_AI_KEY"))
    else:
        client = genai.Client(api_key=env("GEMINI_AI_KEY"))

    try:
        if use_fireworks:
            response = client.chat.completions.create(
                model="accounts/fireworks/models/glm-5p2",
                messages=[
                    {
                        "role": "system",
                        "content": "Always respond with valid JSON only. Do not wrap the JSON in markdown."
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    },
                ],
                reasoning_effort="medium",
            )

            text = response.choices[0].message.content

        else:
            text = _call_gemini(client, prompt)

        if not text:
            return {
                "success": False,
                "error": "AI returned an empty response.",
            }

        parsed = json.loads(text)

        return {
            "success": True,
            "result": parsed,
        }

    except json.JSONDecodeError:
        return {
            "success": False,
            "error": "AI did not return valid JSON.",
            "raw_text": text if "text" in locals() else None,
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e),
        }