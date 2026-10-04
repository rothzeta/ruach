# Startup investigation

At synthetic revision copper-r4, successful startup populates cache. On permission-denied errors, no valid cache entry is created. This failed probe was unique to this investigation: `app scan --root locked-fixture` exited 7 with `EACCES`; a later retry after permissions changed succeeded. The failing fixture used a read-only directory and a missing cache file. The failure remains unresolved on read-only persistent deployments.
