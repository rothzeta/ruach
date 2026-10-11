From: owner
Date: 2026-10-12 10:50 UTC
Subject: RELAY-15 parse worker

Start the parse worker on its own branch and wait for it before doing anything else. It may ask for repository trust the first time; that is expected and needs a real answer. Do not push, merge or tag anything.
