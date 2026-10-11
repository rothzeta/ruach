From: owner
Date: 2026-10-12 08:10 UTC
Subject: RELAY-14 update aftermath

The host updated overnight. Check each worker's actual process state before doing anything, and preserve every partial branch and diff.

Only an identity that has actually ended may get a bounded fresh replacement. Never replace or kill a worker that is still working. If you cannot establish the process state, leave it alone and record the gap rather than guessing. Do not push, merge or tag anything.
