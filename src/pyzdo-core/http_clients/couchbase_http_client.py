from typing import Optional
from requests import request


class CouchbaseHttpClient:
    _default_headers = {
        "Content-Type": "application/json",
        "Accept-Encoding": "gzip, deflate, br",
    }

    def __init__(self, base_url: Optional[str] = ""):
        self._base_url = base_url

    def query(
        self,
        json: str,
        url: Optional[str] = "",
        headers: Optional[dict[str, str]] = _default_headers,
    ):
        return request(
            "POST", url=f"{self._base_url}/{url}", headers=headers, data=json
        )
