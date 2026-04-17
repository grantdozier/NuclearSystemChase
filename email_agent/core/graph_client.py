"""Microsoft Graph API client using MSAL client-credentials flow."""
from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any

import msal
import requests

log = logging.getLogger(__name__)

GRAPH_BASE = "https://graph.microsoft.com/v1.0"


class GraphClient:
    def __init__(self, tenant_id: str, client_id: str, client_secret: str, scopes: list[str]) -> None:
        self._scopes = scopes
        self._app = msal.ConfidentialClientApplication(
            client_id,
            authority=f"https://login.microsoftonline.com/{tenant_id}",
            client_credential=client_secret,
        )
        self._token: str | None = None

    def _get_token(self) -> str:
        result = self._app.acquire_token_silent(self._scopes, account=None)
        if not result:
            result = self._app.acquire_token_for_client(scopes=self._scopes)
        if "access_token" not in result:
            raise RuntimeError(f"MSAL token error: {result.get('error_description', result)}")
        return result["access_token"]

    def _headers(self) -> dict[str, str]:
        return {"Authorization": f"Bearer {self._get_token()}", "Content-Type": "application/json"}

    def get_messages(
        self,
        mailbox: str,
        since: datetime,
        folder: str = "inbox",
        page_size: int = 50,
    ) -> list[dict[str, Any]]:
        since_str = since.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        url = (
            f"{GRAPH_BASE}/users/{mailbox}/mailFolders/{folder}/messages"
            f"?$filter=receivedDateTime ge {since_str}"
            f"&$top={page_size}"
            f"&$select=id,subject,from,toRecipients,ccRecipients,receivedDateTime,bodyPreview,body,hasAttachments,importance"
            f"&$orderby=receivedDateTime desc"
        )
        messages: list[dict[str, Any]] = []
        while url:
            resp = requests.get(url, headers=self._headers(), timeout=30)
            resp.raise_for_status()
            data = resp.json()
            messages.extend(data.get("value", []))
            url = data.get("@odata.nextLink")
        log.info("Fetched %d messages from %s since %s", len(messages), mailbox, since_str)
        return messages

    def get_sent_messages(self, mailbox: str, since: datetime, page_size: int = 50) -> list[dict[str, Any]]:
        return self.get_messages(mailbox, since, folder="sentitems", page_size=page_size)
