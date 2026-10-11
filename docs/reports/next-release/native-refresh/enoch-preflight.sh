#!/usr/bin/env bash
# Read-only worker preflight for the Enoch exercise clone. Prints facts; exits 1 on any mismatch. Changes nothing.
set -u
C=/tmp/ruach-implementation-20261011/enoch-exercise/clone; BASE=d163a4132a6840d2604e6e17883612eb77a901ec; SEED=ea33fc70456bf45bdd51e6eedcb83cf5cdf89347; bad=0
chk(){ if [ "$2" = "$3" ]; then echo "ok   $1"; else echo "FAIL $1: $2 != $3"; bad=1; fi; }
chk head "$(git -C $C rev-parse HEAD)" $SEED
chk branch "$(git -C $C symbolic-ref --short HEAD)" ruach-exercise/url-encoding-seed
chk clean "$(git -C $C status --porcelain | wc -l)" 0
chk seed-diff-digest "$(git -C $C diff $BASE $SEED | sha256sum | cut -d' ' -f1)" b8f48d297e6ad8d0b75fb476c3302022fd9a76d658f6522059e1057c3c88c2d3
chk subject-branch-unused "$(git -C $C show-ref --verify --quiet refs/heads/ruach-exercise/url-encoding-subject && echo exists || echo absent)" absent
chk hooks "$(git -C $C config core.hooksPath)" /dev/null
chk node "$(PATH=/tmp/ruach-implementation-20261011/live/node22/node-v22.23.3-linux-x64/bin:$PATH node --version)" v22.23.3
echo "protected test digests:"; (cd $C/src/Enoch.Ui/src && sha256sum *.test.ts App.vue)
exit $bad
