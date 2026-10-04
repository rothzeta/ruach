set positional-arguments

bun := env_var_or_default("BUN_BIN", if path_exists(env_var("HOME") / ".bun/bin/bun") == "true" { env_var("HOME") / ".bun/bin/bun" } else { "bun" })

# List repository commands.
default:
    @just --list

# Install pinned executable-skill dependencies.
install:
    @cd skills/ruach-handoff && "{{bun}}" install --frozen-lockfile
    @cd skills/ruach-herdr && "{{bun}}" install --frozen-lockfile
    @cd skills/ruach-harness-eval && "{{bun}}" install --frozen-lockfile

# Install this checkout's skills globally through the standard Skills CLI.
install-global *args:
    @"{{bun}}" x --bun skills@1.7.0 add ./skills --global --agent codex --agent claude-code --skill '*' "$@"

# Register this checkout as a user-level Claude marketplace and install its plugin.
install-plugin:
    @claude plugin marketplace add . --scope user
    @claude plugin install ruach@ruach --scope user

# Check synchronized release metadata and its changelog entry.
release-check:
    @"{{bun}}" run release-check

# Check resource identities, eval placement and links.
check:
    @"{{bun}}" run check

# Test root tools and each executable skill.
test:
    @"{{bun}}" run test
    @cd skills/ruach-handoff && "{{bun}}" test
    @cd skills/ruach-herdr && "{{bun}}" test
    @cd skills/ruach-harness-eval && "{{bun}}" test

# Resolve or launch a role using Ruach's source resources.
agent-routing *args:
    @"{{bun}}" scripts/agent-routing.ts "$@"

# Launch the Coordinator in one sibling Herdr pane.
coordinator *args:
    @"{{bun}}" scripts/agent-routing.ts start coordinator "$@"
