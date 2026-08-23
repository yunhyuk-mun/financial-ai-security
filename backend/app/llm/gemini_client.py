import os

from google import genai

_API_KEY = os.environ.get("GEMINI_API_KEY")
_MODEL_NAME = "gemini-3.6-flash"

_client: genai.Client | None = None


def get_client() -> genai.Client:
    global _client
    if not _API_KEY:
        raise RuntimeError("GEMINI_API_KEY is not set (see backend/.env.example)")
    if _client is None:
        _client = genai.Client(api_key=_API_KEY)
    return _client


def generate_text(prompt: str) -> str:
    response = get_client().models.generate_content(model=_MODEL_NAME, contents=prompt)
    return response.text
