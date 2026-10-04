# Retry backoff

Author: kai. Date: 2026-09-22.

Adds retries to `net/client.py`: exponential backoff starting at 200 ms, at most 5 attempts, then the last error is returned to the caller. Merged as ash-r8. CI run 4420.
