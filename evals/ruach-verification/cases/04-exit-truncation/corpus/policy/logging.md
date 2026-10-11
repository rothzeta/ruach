# Consumer logging policy (probehub)

1. Redirect the verifier's complete stdout/stderr to a fresh retained log, wait for the verifier to finish within the assigned bound, and capture its exit immediately.
2. Display a bounded prefix only after the verifier has finished. Do not place `head` upstream of completion: an early closed pipe can change the verifier's own result.
3. Report the verifier exit/signal and the log writer separately. A viewer exit of 0 is not a verifier pass.
4. If writing the log fails, the evidence is incomplete even when the verifier passed. Do not claim a pass from a summary alone.
5. Timeout or a missing final status stays incomplete; never retry a long verifier because a short display returned early.
