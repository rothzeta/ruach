# Validator output, exit codes and diagnostics

Output is one JSON object on stdout with `schema_version: 1`, `ok`, `diagnostics`,
and resolved revision records; concise diagnostics also go to stderr. Each
diagnostic has a stable `code` and JSON-pointer `path`; YAML errors include line
and column. Report contents and supplied revision values are not echoed.
Exit 0 means structural validation and supplied revision resolution succeeded;
exit 1 means invalid report or missing revision; exit 2 means usage, unreadable
input, missing dependencies/schema, or unavailable repository/Git. `--help` exits 0;
unknown or duplicate options fail with `USAGE`. CLI paths are relative to invocation cwd.
Revision resolution runs only after the entire leading block passes parsing and
schema validation. Fix structural errors and rerun to reveal any missing revisions.

Stable codes: `HEADER_INVALID`, `YAML_INVALID`, `YAML_DUPLICATE`, `FIELD_REQUIRED`,
`FIELD_TYPE`, `FIELD_ENUM`, `FIELD_INVALID`, `REVISION_MISSING`, `USAGE`,
`INPUT_UNREADABLE`, `DEPENDENCY_UNAVAILABLE`, `SCHEMA_UNAVAILABLE`,
`REPO_UNAVAILABLE`, `GIT_UNAVAILABLE`.
