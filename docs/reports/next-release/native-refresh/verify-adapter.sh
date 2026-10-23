#!/usr/bin/env bash
# Task-local verifier arrangement for the snapshot-adapter row. The subject worked in a worktree the launcher created
# on branch smoke/claude-adapter; this builds a separate read-only verification packet (evidence copy + a fresh clone
# at that branch) so the subject worktree, its session and the native cleanup stay untouched. No commit is created.
# usage: verify-adapter.sh [BRANCH] [TAG] [extra check.ts flags, e.g. --allow-base for a base self-test]
set -euo pipefail
L=/tmp/ruach-implementation-20261011/live; P=$L/smoke/claude-adapter; BRANCH=${1:-smoke/claude-adapter}; TAG=${2:-live}; shift 2 || true
V=$L/smoke/claude-adapter-verify-$TAG
[ ! -e "$V" ] || { echo "verification packet exists: $V" >&2; exit 2; }
mkdir -p "$V/results"; cp -r "$P/evidence" "$V/evidence"
git clone -q --no-hardlinks --template= --branch "$BRANCH" "$P/consumer" "$V/consumer"
git -C "$V/consumer" config core.hooksPath /dev/null
bun $L/source/evals/next-release-native-smoke/scripts/check.ts --packet "$V" --tag "$TAG" "$@"
