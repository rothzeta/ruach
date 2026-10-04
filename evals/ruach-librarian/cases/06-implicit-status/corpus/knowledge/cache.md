# Cache

The cache is a SQLite file in the user data directory ([decision log](../decisions/log.md)).

Eviction: LRU with a capacity of 10,000 entries ([design](../sources/eviction-design.md)). Verified by [CI run 4411](../sources/ci/run-4411.txt).
