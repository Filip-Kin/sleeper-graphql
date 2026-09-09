# sleeper-graphql

The undocumented GraphQL API behind the Sleeper fantasy app, mapped from live introspection and live responses on 2026-09-09. Sleeper's public REST API (docs.sleeper.com) covers reads only and sits behind a CDN cache. The app itself talks to `https://sleeper.app/graphql`, which has 240 queries, 350 mutations, no subscriptions, and no cache. This repo is the reference for it plus a small typed Bun client.

Everything written here came from the server. Signatures are from `__schema` introspection. Example responses are real, trimmed, with user ids, names and message text redacted. Where a query could not be run, the doc says so and why.

## Contents

| file | what |
|---|---|
| [schema/schema.graphql](schema/schema.graphql) | full SDL: 116 object types, 19 inputs, 16 scalars, every query and mutation with args and server descriptions |
| [schema/introspection.json](schema/introspection.json) | the raw introspection result |
| [docs/queries.md](docs/queries.md) | all 240 queries: signature, working example, trimmed real response, notes on auth, freshness, pagination and traps |
| [docs/mutations.md](docs/mutations.md) | all 350 mutations: signature, return type, what it does, and which ones sleeper-coach has actually executed |
| [docs/types.md](docs/types.md) | every object type with fields and observed example values |
| [docs/vs-rest.md](docs/vs-rest.md) | which GraphQL read replaces which REST endpoint, with measured cache headers |
| [src/client.ts](src/client.ts) | typed transport plus helpers for rosters, matchups, players (batched), transactions, DMs, messages, projections |
| [src/client.test.ts](src/client.test.ts) | fixture tests, no network |

## Server facts

- Endpoint: `POST https://sleeper.app/graphql`, JSON body `{"query": "...", "variables": {...}}`. Variables work.
- Absinthe (Elixir). Introspection meta-fields are snake_case: `query_type`, `mutation_type`, `input_fields`, `enum_values`, `of_type`, `is_deprecated`, `default_value`. The spec's camelCase names return "Cannot query field" errors.
- Introspection is open and needs no token.
- No enums. Every status, type and sort is a plain `String`; the docs list the values that were observed to work.
- Custom scalars `Map`, `Json`, `List`, `Set`, `Snowflake` and friends are plain JSON and take no sub-selection. `Snowflake` is a numeric id as a string.
- Maps are passed to mutations as parallel arrays (`k_adds: [String]`, `v_adds: [Int]`).
- `leg` and `round` both mean NFL week in a regular league.
- Responses are `cache-control: private, max-age=0`. Nothing is cached in front of the server.
- Errors come back as HTTP 200 with an `errors` array; each entry has `code`, `message`, `path`. A few malformed requests return an HTML page instead of JSON, and a couple of moderator-only queries hang for 30 s and answer HTTP 500 with no CORS headers.

## Auth

Public data does not need a token. `get_league`, `league_rosters`, `matchup_legs`, `get_player`, `scores` and the stat queries answered a bare POST. Anything user-scoped (`me`, `my_*`, DMs, requests) returns `code: "unauthorized"` without one.

The token is the value the web app keeps in `localStorage.token`, sent as a plain `authorization: <token>` header (no `Bearer` prefix). Two ways to get it:

1. Browser session passthrough (what sleeper-coach does). Keep a logged-in Playwright/Chromium profile alive and run the fetch inside the page with `page.evaluate`, so the token never leaves the profile and the request carries the site's origin. A server-side fetch with the same token also works for the reads tested here, but the app's own origin is the safer default.
2. The `login` field. It is a query, not a mutation: `login(email_or_phone_or_username, password, captcha, passkey, passkey_conversation_id): User`, and the returned `User.token` is the bearer token. A third-party wrapper reports this works. It was not executed for this reference and the captcha requirement is unknown.

Do not commit the token, the browser profile or cookies. `.gitignore` covers the obvious file names.

## Run the introspection yourself

```bash
curl -s https://sleeper.app/graphql -H 'content-type: application/json' \
  -d '{"query":"{__schema{query_type{name} mutation_type{name} types{name kind}}}"}' | head -c 400
```

The full query used for `schema/introspection.json` is the standard one with snake_case meta-fields:

```graphql
query IntrospectionQuery {
  __schema {
    query_type { name } mutation_type { name } subscription_type { name }
    types { ...FullType }
    directives { name description locations args { ...InputValue } }
  }
}
fragment FullType on __Type {
  kind name description
  fields(include_deprecated: true) { name description args { ...InputValue } type { ...TypeRef } is_deprecated deprecation_reason }
  input_fields { ...InputValue }
  interfaces { ...TypeRef }
  enum_values(include_deprecated: true) { name description is_deprecated deprecation_reason }
  possible_types { ...TypeRef }
}
fragment InputValue on __InputValue { name description type { ...TypeRef } default_value }
fragment TypeRef on __Type { kind name of_type { kind name of_type { kind name of_type { kind name of_type { kind name of_type { kind name of_type { kind name of_type { kind name } } } } } } } }
```

## Use the client

```ts
import { createTransport, leagueRosters, getPlayers, leagueTransactionsByStatus } from "./src/client.ts";

const gql = createTransport({ token: process.env.SLEEPER_TOKEN }); // token optional for public reads
const rosters = await leagueRosters(gql, "1389357604773322752");
const players = await getPlayers(gql, rosters.flatMap((r) => r.players ?? [])); // 60 per request
const offers = await leagueTransactionsByStatus(gql, "1389357604773322752", "proposed", 1);
```

`createTransport` takes any fetch-compatible function, so a wrapper that forwards through a logged-in browser page slots in as `fetch`.

```bash
bun install
bun test
bun run typecheck
```

## Five things a coach should know

1. `league_transactions_by_status(status: "proposed")` is the only place a live trade offer exists. REST `/transactions/{week}` never lists proposed or rejected trades.
2. `get_player` aliased 60 per request replaces the 14.6 MB REST player blob, and `league_rosters.player_map` already carries injury status for every rostered player.
3. `stats_for_players_in_week(category: "proj")` and `weekly_stats` are the app's own Rotowire projections; `scores` carries the live spread with `updated_at`.
4. `messages(parent_id)` reads DMs, league chat and draft chat with the same call. Trade offers land there as messages with `transaction_id` in `attachment.data`. Reading does not mark anything read.
5. `read_receipts` tells you whether a rival has read your message, and `league_event_logs` shows every settings change with who made it.

## Scope and limits

- Read-only. No mutation was executed while building this. `docs/mutations.md` marks the eleven sleeper-coach has run and the evidence.
- One account, one league, one week. Queries that need ids this account cannot produce (parlays, derbies, dues payouts, company groups) are documented from the schema only.
- The side-effect "queries" `create_read_receipt` and `mark_mention_as_read` were not run.
