from base64 import b64encode


def build_basic_auth(username: str, password: str) -> str:
  token = b64encode(f"{username}:{password}".encode("utf-8")).decode("utf-8")
  return f"Basic {token}"
