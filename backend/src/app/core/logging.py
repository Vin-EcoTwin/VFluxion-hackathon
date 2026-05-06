import sys

from loguru import logger


def setup_logging(level: str = "INFO") -> None:
  logger.remove()
  logger.add(
    sys.stdout,
    level=level,
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | {message}",
  )
