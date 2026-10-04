# Cache eviction: LRU

Author: lee. Date: 2026-09-18.

TTL expiry drops hot entries every 15 minutes and causes refetch spikes. This change replaces TTL expiry with LRU eviction, capacity 10,000 entries, in `cache/evict.py`. Merged as ash-r7.

Tests: CI run 4411 green.
