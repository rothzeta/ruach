# Ask for a council

**Availability:** Ruach 0.7.0 includes the council workflow, but a complete live
council remains blocked on verified member isolation. Separate worktrees and
instructions to ignore peers do not establish that isolation. See the
[boundary decision](design/c1-c5/council-boundary-decision.md) for the missing
capability. A request does not waive this hold.

When that capability is available, give your Coordinator a request like this.
Replace the bracketed evidence references; this is ordinary text, not a config
file or command.

> Arrange a council on whether to keep our cache eviction policy or adopt the
> proposal. Use [repository revision], [proposal] and [benchmark report].
> Use two members on our configured routes: a Scout examining failure cases
> and an Architect examining maintenance costs. Run exactly three total rounds,
> including the first, even if they agree early. Advice only; no product edits
> or runtime probes. Return the recommendations, evidence, disagreements and
> decisions I still need to make. Report any missing capability before starting.

## Configure the request

| Choice | What to specify |
| --- | --- |
| Question | One bounded decision and the evidence versions members may use |
| Members | How many, each role and its perspective; names are optional |
| Rounds | Choose one mode from the table below; there is no default count |
| Routes, if overriding policy | An authorized selection from your consumer's routing catalogs |
| Limits, if needed | Time, cost or evidence-access bounds; otherwise existing consumer policy applies |

Multiple members may share a role or model. Use perspectives that could expose
different evidence or assumptions. Existing Scout and Architect roles usually
suffice; no new generic council role is required. You need not repeat harness,
model and effort when the configured route already selects them. Routes never
change automatically after failure. See [routing](../skills/ruach-herdr/references/routing.md)
for overrides and permission policy.

## Choose one round mode

| Mode | What happens |
| --- | --- |
| Manual | One round and synthesis, then a pause until you request another |
| Exactly N | N total rounds, including the first; agreement does not permit early stopping |
| Up to N, stop when stable | At most N rounds; stop early only after two successive closed rounds have no consequential change in propositions, evidence, assumptions or dispositions |

N must be positive. With N=1, the budget ends without demonstrating comparative
stability. A capability block, cancellation or your amendment can interrupt any
mode. Agreement is neither a vote nor permission to adopt the recommendation.
Supported minority objections remain in the synthesis.

## Results and follow-ups

The Coordinator records your brief and gives members separate assignments.
Members work independently within each round; later rounds may use reports
from closed rounds. A round closes only with durable reports and recorded
dispositions; missing or blocked members stay explicit.

Expect attributed supporting and opposing reasons, evidence limits, changed
positions and unresolved questions. Advice grants no implementation or delivery
authority. Ask separately to adopt a recommendation, extend the round budget or
change the question, roster, route or evidence.

The task record and linked reports preserve the result after sessions close.
No `council.yaml` or new CLI is needed. For Coordinator mechanics, see the
[workflow](../skills/ruach-workflow-council/SKILL.md),
[round reference](../skills/ruach-workflow-council/references/rounds.md) and
[member brief](examples/council-member-assignment.md).
