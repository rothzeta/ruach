# Decision log

| Date | Topic | Decision | By |
| --- | --- | --- | --- |
| 2026-08-28 | Cache storage | SQLite file in the user data directory | dana |
| 2026-09-02 | Cache eviction | Time-based expiry, 15-minute TTL | dana |
| 2026-09-20 | Retries | Exponential backoff from 200 ms, at most 5 attempts | dana |
