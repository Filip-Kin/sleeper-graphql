# GraphQL vs the documented REST API

Which GraphQL reads replace which endpoints on docs.sleeper.com, with headers and bodies measured on 2026-09-09 (NFL week 1, before kickoff).

## The cache difference

Every GraphQL response measured came back with:

```
cache-control: max-age=0, private, must-revalidate
```

and no `age`, no `cf-cache-status`. There is no shared cache in front of it. Every REST endpoint measured is behind Cloudflare with a public `s-maxage`:

| REST endpoint | cache-control | measured |
|---|---|---|
| `/v1/league/{id}/rosters` | `public, s-maxage=300, stale-while-revalidate=300` | `cf-cache-status: HIT`, `age: 226` |
| `/v1/league/{id}` | `s-maxage=300` | `HIT`, `age: 165` |
| `/v1/league/{id}/users` | `s-maxage=300` | `HIT`, `age: 74` |
| `/v1/league/{id}/transactions/{week}` | `s-maxage=300` | `HIT`, `age: 166` |
| `/v1/league/{id}/matchups/{week}` | `s-maxage=60, stale-while-revalidate=300` | `EXPIRED` (served stale, revalidating) |
| `/v1/state/nfl` | `s-maxage=60, stale-while-revalidate=180` | `HIT`, `age: 6` |
| `/v1/user/{id}` | `s-maxage=120, stale-while-revalidate=600` | `MISS` |
| `/v1/players/nfl/trending/add` | `s-maxage=600` | `HIT`, `age: 249` |
| `/v1/players/nfl` | `s-maxage=600, stale-while-revalidate=300` | `HIT`, `age: 263`, 14.6 MB |
| `/v1/draft/{id}/picks` | `s-maxage=86400` | `HIT`, `age: 67222` (18.7 hours) |

So a REST read can be up to 5 minutes stale for rosters and transactions (10 minutes with stale-while-revalidate), and a full day for draft picks. GraphQL is live.

At capture time the bodies matched: `league_rosters` equalled REST `/rosters` on `players`, `starters`, `reserve` and `settings` for all 8 rosters, `matchup_legs[].starters` equalled REST `/matchups/1`, and every `team`, `status`, `injury_status`, `depth_chart_order` and `practice_participation` on the 3,198 GraphQL active players equalled the REST blob. No divergence was in flight during the capture window; the difference is the lag ceiling, not a different source.

## Replacement table

| REST (docs.sleeper.com) | GraphQL | What you gain | What you lose |
|---|---|---|---|
| `GET /v1/state/{sport}` | `sport_info(sport)` | `season_has_scores`, `dd_draft_week` | nothing |
| `GET /v1/league/{id}` | `get_league(league_id)` | `is_full`, `last_transaction_id`, `user_playoff_status`, full `last_message_attachment` (the last processed trade with player records), `last_message_text` | `bracket_id`, `loser_bracket_id`, `shard` |
| `GET /v1/league/{id}/rosters` | `league_rosters(league_id)` | `player_map` (team, injury_status, news_updated per rostered player), `keepers`, `taxi`, `co_owners` | nothing |
| `GET /v1/league/{id}/users` | `league_users(league_id)` | same fields | nothing |
| `GET /v1/league/{id}/matchups/{week}` | `matchup_legs(round, league_id)` or `matchup_legs_raw` (10x smaller, no player_map) | `proj_points`, `max_points`, `player_map` with injury status, `starters_games`, `subs` | `players_points` and `starters_points` as top-level maps (per-player points appear inside `player_map` once games start) |
| no equivalent | `matchup_legs_related_to_roster(league_id, roster_id, start_round, end_round)` | one roster's full schedule in one call | |
| `GET /v1/league/{id}/transactions/{week}` | `league_transactions(league_id, leg, status, type, roster_id, limit)` | `proposed` and `rejected` trades. REST returned only 3 `complete` rows for week 1; GraphQL listed the 5 most recent, all `rejected` trades REST never shows. Also `player_map` and `metadata.rejecter_id` | nothing |
| no equivalent | `league_transactions_by_status(league_id, status: "proposed", leg)` | the only way to see a live trade offer | |
| no equivalent | `league_transactions_by_player(league_id, player_id)` | a player's transaction history in the league | |
| `GET /v1/league/{id}/winners_bracket` | `league_playoff_bracket(league_id)` | same shape | |
| `GET /v1/league/{id}/losers_bracket` | `league_playoff_loser_bracket(league_id)` | same shape | |
| no equivalent | `roster_standings(round, league_id)` | wins, losses, points for/against, rank, W/L string, at any round | |
| no equivalent | `league_event_logs(league_id, limit, before_log_id, event_types)` | who changed which setting, old and new values | |
| `GET /v1/league/{id}/traded_picks` | `roster_draft_picks(league_id, season)` | same | |
| `GET /v1/league/{id}/drafts` | `drafts_by_league_id(league_id)` | same | |
| `GET /v1/draft/{id}` | `get_draft(sport, draft_id)` | `creators`, last message | |
| `GET /v1/draft/{id}/picks` | `draft_picks(draft_id)` | live during a draft (REST is cached a full day), `reactions` | |
| `GET /v1/draft/{id}/traded_picks` | `roster_draft_picks_by_draft(draft_id)` | same | |
| no equivalent | `draft_queue(draft_id)`, `draft_autopickers`, `user_drafts_by_status` | your queue, who is on autopick, mock drafts | |
| `GET /v1/players/{sport}` (14.6 MB, 12,227 rows, includes retired) | `get_active_players(sport)` (3.2 MB, 3,198 rows, 1.9 s) or `get_player(sport, player_id)` aliased 60 per request (91 ms) | fresh, small, per-player on demand | `news_updated` (not a Player field in GraphQL; it does appear inside `player_map` entries on rosters and matchups) |
| `GET /v1/players/{sport}/trending/{add\|drop}` | `trending_players(sort, sport)` | ordered list | the add/drop counts (GraphQL returns bare `player_id` rows) |
| no equivalent | `get_player_news(sport, player_id, limit)`, `get_player_outlook` | Rotowire news and season outlook text | |
| no equivalent (projections are undocumented in REST) | `stats_for_players_in_week(category: "proj", ...)`, `weekly_stats(category: "proj", positions, order_by)` | the app's Rotowire projections, per player or whole position | |
| no equivalent | `get_player_stats`, `season_stats`, `game_stats`, `plays` | box scores, season totals, play by play | |
| no equivalent | `scores(sport, season, season_type, week \| date \| game_id)` | game state, quarter scores, the spread with `updated_at`, weather, stadium, public pick percentages | |
| `GET /v1/user/{id}` | `user(user_id)` | same public fields | |
| `GET /v1/user/{id}/leagues/{sport}/{season}` | `my_leagues(sport, season_type, season)` (self) or `rosters_by_user(user_id, ...)` (anyone's rosters) | pick'em pools appear too | |
| `GET /v1/user/{id}/drafts/{sport}/{season}` | `user_drafts(sport, season_type, season)` | mocks included | |
| no equivalent | `my_dms`, `messages(parent_id)`, `inbound_requests`, `read_receipts` | the whole chat surface; trade offers arrive as DM messages with `transaction_id` in `attachment.data` | |
| no equivalent | `get_pickem_legs`, `get_pickem_picks_for_league`, `get_pickem_scoring_settings` | the pick'em product has no REST at all | |

## Measured timings (one sample each, inside the page)

| query | ms | bytes |
|---|---|---|
| `league_rosters` (8 rosters, with player_map) | 132 | 42,664 |
| `matchup_legs` week 1 | 133 | 42,110 |
| `matchup_legs_raw` week 1 | 80 | 4,062 |
| `get_player` x60 aliased | 91 | (60 records) |
| `get_active_players` | 1,879 | 3,169,775 |
| `league_transactions` limit 5 | 81 | 9,960 |
| `messages` (17 in a DM) | 133 | 72,068 |
| `scores` week | 136 | 71,839 |
| `weekly_stats` RB projections | 390 | 532,185 |
| `season_stats` QB 2026 | 478 | 225,250 |
| `list_all_active_promos` | 294 | 313,219 |
| `latest_topics` | 4,984 | 3,606 |
| `search_players_in_text` | 15,507 | 28 |

Ordinary reads land in 60 to 140 ms. The two slow ones are community-feed queries a coach does not need.

## Auth

Public data (`get_league` verified) needs no token at all: a bare POST with `{"query": "..."}` returned the league. User-scoped fields (`me`, `my_*`, DMs) return `{"code": "unauthorized"}` in `errors` with `data.me: null`, HTTP 200. See README for how the token is obtained.
