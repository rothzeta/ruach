# OpenCode native transport smoke

From a Ruach source checkout with executable-skill dependencies installed and OpenCode 2.1.4+ on PATH:

```sh
bun evals/ruach-opencode/native-smoke.ts
```

This optional check uses a temporary HOME, XDG directories and native configuration, with provider policy restricted to an ephemeral loopback OpenAI-compatible fixture. It runs real OpenCode against that local model for Implementer and Coordinator roles and checks the actual model request, completion, native technical-skill discovery and workflow permissions. It creates no Herdr worker, sends no paid requests and leaves the shared OpenCode service and user settings unchanged. Local sockets and native subprocesses must be permitted. Owned runtime data is removed after the check.

This verifies transport and configuration composition. A fixture response does not establish model reasoning quality, account entitlement or a real consumer task. The regular Herdr suite uses fake CLIs to cover unavailable models, variants, managed conflicts, redaction, preparation without launch resources and private reader cleanup.
