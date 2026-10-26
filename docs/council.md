# Ask for a council

Use this natural-language request as an example for your Coordinator. Replace the
bracketed inputs and route choices before using it; this is a request, not a
configuration file or command.

> Please arrange an advisory council on this bounded question: should we retain
> the current cache eviction policy or adopt the proposed policy for the next
> release? Use only [repository revision SHA], [proposal version] and [benchmark
> report version] as evidence. Name Ada as a Scout focused on failure cases and
> Lin as an Architect focused on design and maintenance costs. I explicitly
> authorize Ada's [approved Scout route ID: harness, model, effort] and Lin's
> [approved Architect route ID: harness, model, effort], subject to our existing
> permission policy and capability gates. Use automatic **exactly 3 total
> rounds, including round one**; agreement does not authorize stopping early.
> Limit the whole council to 45 minutes and each member to four evidence reads
> per round. Advice only: members may write their assigned reports; no product
> edits, runtime probes, network access, implementation or delivery. If required
> access or evidence is missing, report the hold. Return durable reports for each
> closed round and a final synthesis with attributed evidence, disagreements,
> supported minority objections, changed assumptions, recommendations and any
> decisions I still need to make. Recommendations require my separate adoption.

**Current availability:** this prepared 0.7.0 source includes the guide and council
workflow, but complete native independence and council demonstrations remain on
a capability hold. Separate worktrees or telling models not to read peers do not
establish verified isolation. The [current boundary decision](design/c1-c5/council-boundary-decision.md)
records the missing capability and reopening condition. Preparing a brief does
not waive that hold or establish live council support for a chosen route.

## Choose members and routes

Three choices describe each member:

| Choice | What it means | Example |
| --- | --- | --- |
| Role | The existing responsibility and authority contract | Scout, Architect, or a consumer-declared read-only domain role |
| Member identity and expertise | A named perspective on this question | Ada examines failure cases; Lin examines maintenance costs |
| Route | The selected harness, model and effort | An explicitly authorized route from your consumer's catalogs |

Multiple members may share a role or model while examining different concerns.
You do not need a new generic council role. Choose expertise that could expose
different evidence or assumptions, and name the evidence revision and read scope
so the advice answers the same question.

Consumer routing catalogs govern allowed selections; a role's declared
alternatives require explicit selection. Wrapper permission policy is separate
from model routing, and route selection alone grants no action authority or
native capability. Failure never causes automatic route or model fallback. The
Coordinator prepares assignments and handles launches within the authorized
bounds. See the [routing reference](../skills/ruach-herdr/references/routing.md);
Ruach's [development catalogs](../config/agent-routing/) are repository-specific
examples, not universal model, effort or harness defaults.

## Choose one round mode

| Mode | What you authorize |
| --- | --- |
| Manual | One round, its closure and synthesis, then an owner pause. A next round needs your request. |
| Automatic exact N | A positive N total rounds, including round one. Agreement does not permit an early stop; a block, cancellation or owner amendment can interrupt the plan. |
| Automatic up to N, stop when stable | Separately authorize a positive maximum N and an early stop only when two successive closed rounds show no consequential change in propositions, evidence, assumptions or dispositions. |

With N=1, the budget can end but comparative stability cannot be demonstrated.
There is no default round count, vote or majority-adoption rule. Stability also
preserves supported minority objections.

## Where the brief and results go

Your brief becomes the Coordinator's existing task record and separate bounded
member assignments. Reusable role definitions stay in their existing role files;
consumer routing stays in its catalogs. No `council.yaml`, new configuration
schema or council CLI is needed. You can ask the Coordinator to fill gaps in the
brief before arranging members.

Expect actual durable member reports and recorded Coordinator dispositions before
a round closes. Missing or blocked members remain explicit. Later rounds exchange
only reports from closed rounds, alongside identified new evidence; open peer
answers stay excluded. The synthesis should retain attributed supporting and
opposing reasons, evidence limits, changed positions, unresolved objections and
what evidence or owner decision could resolve them. A recommendation remains
separate from your adoption; council alone grants no product edits,
implementation or delivery authority.

The retained task record, reports and synthesis support resumption after sessions
are released. Ask for a manual next round or extend an exhausted automatic budget
explicitly. When changing the question, roster, route, evidence or budgets, state
the amendment so the Coordinator can record its effect on remaining rounds.

For mechanics, see the canonical [council workflow](../skills/ruach-workflow-council/SKILL.md),
[closed-round reference](../skills/ruach-workflow-council/references/rounds.md) and
[member assignment specimen](examples/council-member-assignment.md). The Coordinator
uses the workflow; members receive their own assignments.
