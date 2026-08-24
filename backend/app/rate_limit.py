"""In-memory rate limiting for the Gemini-backed endpoints.

No external dependency (Render's free tier runs a single instance, so an
in-process sliding window is enough) — protects the shared free-tier Gemini
quota from being exhausted by one abusive client during judging.
"""
import time
from collections import defaultdict, deque

from fastapi import HTTPException, Request

_WINDOW_SECONDS = 60
_MAX_PER_IP_PER_WINDOW = 8
_MAX_GLOBAL_PER_DAY = 300  # well under the ~1000/day free quota, leaves headroom for retries

_ip_hits: dict[str, deque] = defaultdict(deque)
_global_hits: deque = deque()


def _client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def enforce_rate_limit(request: Request) -> None:
    now = time.time()

    ip_queue = _ip_hits[_client_ip(request)]
    while ip_queue and now - ip_queue[0] > _WINDOW_SECONDS:
        ip_queue.popleft()
    if len(ip_queue) >= _MAX_PER_IP_PER_WINDOW:
        raise HTTPException(status_code=429, detail="요청이 너무 잦아요. 1분 후 다시 시도해주세요.")
    ip_queue.append(now)

    while _global_hits and now - _global_hits[0] > 86400:
        _global_hits.popleft()
    if len(_global_hits) >= _MAX_GLOBAL_PER_DAY:
        raise HTTPException(status_code=429, detail="오늘의 데모 사용량 한도에 도달했어요. 내일 다시 시도해주세요.")
    _global_hits.append(now)
