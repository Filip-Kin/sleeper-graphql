# Mutations

Every field on `RootMutationType` (350), from introspection on 2026-09-09. None of these were executed while building this reference. The 'Status' line says whether sleeper-coach has run the mutation for real, based on its source (`src/`) and its activity log (`/data/sleeper-coach/activity.jsonl`) on 2026-09-09.

Argument conventions seen across the schema:

- Maps are passed as parallel arrays: `k_settings: [String]` with `v_settings: [Int]`, `k_metadata`/`v_metadata` (strings), `k_scoring_settings`/`v_scoring_settings` (floats), `k_adds`/`v_adds` and `k_drops`/`v_drops` (player id to roster id).
- `leg` is the NFL week. `round` is the matchup round (same number in a regular league).
- Commissioner-only mutations say so in their description; the server enforces it.
- Most return the updated object; `Boolean` returns are fire-and-forget.

## Proven by sleeper-coach

| mutation | status | evidence |
|---|---|---|
| `propose_trade` | EXECUTED, succeeded | `src/league/api.ts` `proposeTrade()`; activity log `trade-proposed` 2026-09-09 with a returned `transaction_id` and status `proposed`. Parallel arrays: every player appears in both `k_adds`/`v_adds` (keyed to the roster receiving) and `k_drops`/`v_drops` (roster losing). `reject_transaction_id` + `reject_transaction_leg` make a counter-offer one call. |
| `reject_trade` | EXECUTED, succeeded | `src/league/api.ts` `rejectTrade()`; `trade-countered` log rows 2026-09-09 (reject then counter). Returns the LeagueTransaction with `status: rejected` and `metadata.rejecter_id`. |
| `accept_trade` | EXECUTED, succeeded | `src/league/api.ts` `acceptTrade()`; `trade-decided` row 2026-09-05 (`ACCEPT ... server said proposed`, `replied: true`) followed by `trade-completed` after the review window. Accept only records consent; the trade processes later under `trade_review_days`. |
| `roster_update_starters` | EXECUTED, succeeded | `src/league/api.ts` `updateStarters()`; `lineup-set` rows (`set and verified`) 2026-09-06/07. Pass the full starters array in slot order; `0` is an empty slot. |
| `create_message` | EXECUTED, succeeded | `src/league/api.ts` `sendDm()` with `parent_type: "dm"`; 38 `dm-reply` rows. Stored text comes back HTML-escaped. |
| `accept_request` | EXECUTED, succeeded | `src/league/api.ts` `acceptChatRequest()`; 88 `dm-request-accepted` rows for `dm_single` and `dm_group`. |
| `make_pickem_pick` | EXECUTED, succeeded | `src/pickem/client.ts` `submitPick()`; `pickem-picks` row 2026-08-31 `set 16 picks`. The `pick` input needs `outcome: "win"` alongside `team` and `game_id` or the server rejects it. |
| `set_pickem_tiebreaker` | EXECUTED, succeeded | `src/pickem/client.ts` `setTiebreaker()` called from `src/pickem/run.ts`; `pickem-picks` rows carry the tiebreaker value the server echoed back. |
| `remove_pickem_pick` | CALLED in code, unverified | `src/pickem/client.ts` has it; no activity row shows a removal. |
| `submit_waiver_claim` | CALLED in code, unverified | `src/act/waiver-run.ts` `submitWaiverClaim()`; every `waiver-run` so far ended in `waiver-shadow` (no claim needed), no success row. |
| `cancel_waiver_claim` | CALLED in code, unverified | `src/league/api.ts` `cancelWaiverClaim()`; never reached. |
| `league_create_transaction` | CALLED in code, unverified | `src/league/api.ts` `addFreeAgent()` (`type: "free_agent"`, adds and drops) and `dropPlayers()` (drops only); no `free-agent` run has needed a move yet. Memory note: `dropPlayers` write UNVERIFIED. |

Everything else below is untested from this side.

## Contents

- [League management (own roster)](#league-management-own-roster)
- [League management (commissioner)](#league-management-commissioner)
- [Pick'em](#pick-em)
- [Drafts](#drafts)
- [DMs, messages, requests](#dms-messages-requests)
- [Channels and topics](#channels-and-topics)
- [Account and auth](#account-and-auth)
- [League groups and companies](#league-groups-and-companies)
- [User rosters (Sleeper Picks lineups)](#user-rosters-sleeper-picks-lineups)
- [League dues](#league-dues)
- [Sleeper Picks: wagers, wallet, KYC, promos (real money)](#sleeper-picks-wagers-wallet-kyc-promos-real-money)

## League management (own roster)

### `roster_update_starters`

```graphql
roster_update_starters(league_id: Snowflake!, roster_id: Int!, starters: [String]): Roster
```

Server description: Roster update starters

Status: **EXECUTED, succeeded**. `src/league/api.ts` `updateStarters()`; `lineup-set` rows (`set and verified`) 2026-09-06/07. Pass the full starters array in slot order; `0` is an empty slot.


### `roster_update_reserve`

```graphql
roster_update_reserve(league_id: Snowflake!, roster_id: Int!, reserve: [String]): Roster
```

Server description: Roster update injured reserve

Status: untested.


### `roster_update_taxi`

```graphql
roster_update_taxi(force: Boolean, league_id: Snowflake!, roster_id: Int!, taxi: [String]): Roster
```

Server description: Roster update taxi

Status: untested.


### `roster_set_keepers`

```graphql
roster_set_keepers(keepers: [String], league_id: Snowflake!, roster_id: Int!): Roster
```

Server description: Roster set keepers

Status: untested.


### `roster_update_metadata`

```graphql
roster_update_metadata(league_id: Snowflake!, roster_id: Int!, k_metadata: [String], v_metadata: [String]): Roster
```

Server description: Roster update metadata

Status: untested.


### `propose_trade`

```graphql
propose_trade(expires_at: Int, league_id: Snowflake!, draft_picks: [String], waiver_budget: [String], reject_transaction_id: Snowflake, reject_transaction_leg: Int, v_drops: [Int], k_drops: [String], v_adds: [Int], k_adds: [String]): LeagueTransaction
```

Server description: Propose a trade

Status: **EXECUTED, succeeded**. `src/league/api.ts` `proposeTrade()`; activity log `trade-proposed` 2026-09-09 with a returned `transaction_id` and status `proposed`. Parallel arrays: every player appears in both `k_adds`/`v_adds` (keyed to the roster receiving) and `k_drops`/`v_drops` (roster losing). `reject_transaction_id` + `reject_transaction_leg` make a counter-offer one call.


### `accept_trade`

```graphql
accept_trade(leg: Int!, league_id: Snowflake!, transaction_id: Snowflake!): LeagueTransaction
```

Server description: Accept Trade

Status: **EXECUTED, succeeded**. `src/league/api.ts` `acceptTrade()`; `trade-decided` row 2026-09-05 (`ACCEPT ... server said proposed`, `replied: true`) followed by `trade-completed` after the review window. Accept only records consent; the trade processes later under `trade_review_days`.


### `reject_trade`

```graphql
reject_trade(leg: Int!, league_id: Snowflake!, transaction_id: Snowflake!): LeagueTransaction
```

Server description: Reject Trade

Status: **EXECUTED, succeeded**. `src/league/api.ts` `rejectTrade()`; `trade-countered` log rows 2026-09-09 (reject then counter). Returns the LeagueTransaction with `status: rejected` and `metadata.rejecter_id`.


### `submit_waiver_claim`

```graphql
submit_waiver_claim(league_id: Snowflake!, k_metadata: [String], v_metadata: [String], k_settings: [String], v_settings: [Int], v_drops: [Int], k_drops: [String], v_adds: [Int], k_adds: [String]): LeagueTransaction
```

Server description: Submit waiver claim

Status: **CALLED in code, unverified**. `src/act/waiver-run.ts` `submitWaiverClaim()`; every `waiver-run` so far ended in `waiver-shadow` (no claim needed), no success row.


### `update_waiver_claim`

```graphql
update_waiver_claim(leg: Int!, league_id: Snowflake!, transaction_id: Snowflake!, k_metadata: [String], v_metadata: [String], k_settings: [String], v_settings: [Int]): LeagueTransaction
```

Server description: Update a waiver claim

Status: untested.


### `cancel_waiver_claim`

```graphql
cancel_waiver_claim(leg: Int!, league_id: Snowflake!, transaction_id: Snowflake!): LeagueTransaction
```

Server description: Cancel a waiver claim

Status: **CALLED in code, unverified**. `src/league/api.ts` `cancelWaiverClaim()`; never reached.


### `league_create_transaction`

```graphql
league_create_transaction(type: String!, league_id: Snowflake!, v_drops: [Int], k_drops: [String], v_adds: [Int], k_adds: [String]): LeagueTransaction
```

Server description: Add / Drop Player

Status: **CALLED in code, unverified**. `src/league/api.ts` `addFreeAgent()` (`type: "free_agent"`, adds and drops) and `dropPlayers()` (drops only); no `free-agent` run has needed a move yet. Memory note: `dropPlayers` write UNVERIFIED.


### `add_league_player_note`

```graphql
add_league_player_note(player_id: String!, note: String!, league_id: Snowflake!): LeaguePlayer
```

Server description: Add league player note, can use this to overwrite as well

Status: untested.


### `remove_league_player_note`

```graphql
remove_league_player_note(player_id: String!, league_id: Snowflake!): LeaguePlayer
```

Server description: Remove league player note

Status: untested.


### `add_league_player_trade_block`

```graphql
add_league_player_trade_block(player_id: String!, league_id: Snowflake!): LeaguePlayer
```

Server description: Put player on trade block

Status: untested.


### `remove_league_player_trade_block`

```graphql
remove_league_player_trade_block(player_id: String!, league_id: Snowflake!): LeaguePlayer
```

Server description: Remove league player from trade block

Status: untested.


### `like_league_player`

```graphql
like_league_player(player_id: String!, league_id: Snowflake!): LeaguePlayer
```

Server description: Like a player

Status: untested.


### `unlike_league_player`

```graphql
unlike_league_player(player_id: String!, league_id: Snowflake!): LeaguePlayer
```

Server description: Unlike a player

Status: untested.


### `update_league_user_metadata`

```graphql
update_league_user_metadata(league_id: Snowflake!, k_metadata: [String], v_metadata: [String]): LeagueUser
```

Server description: Update a League User Settings, for push notifications, etc

Status: untested.


### `update_matchup_leg`

```graphql
update_matchup_leg(round: Int!, leg: Int!, league_id: Snowflake!, roster_id: Int!, starters: [String], starters_games: Map, subs: Map): MatchupLeg
```

Server description: Update matchup leg

Status: untested.


### `add_matchup_leg_pick`

```graphql
add_matchup_leg_pick(position: String!, round: Int!, leg: Int!, league_id: Snowflake!, hero_id: String!, roster_id: Int!): MatchupLeg
```

Server description: add pick to matchup leg

Status: untested.


### `remove_matchup_leg_pick`

```graphql
remove_matchup_leg_pick(position: String!, round: Int!, leg: Int!, league_id: Snowflake!, roster_id: Int!): MatchupLeg
```

Server description: remove pick from matchup leg

Status: untested.


### `add_matchup_leg_ban`

```graphql
add_matchup_leg_ban(position: String!, round: Int!, leg: Int!, league_id: Snowflake!, hero_id: String!, roster_id: Int!): MatchupLeg
```

Server description: add ban to matchup leg

Status: untested.


### `remove_matchup_leg_ban`

```graphql
remove_matchup_leg_ban(position: String!, round: Int!, leg: Int!, league_id: Snowflake!, roster_id: Int!): MatchupLeg
```

Server description: remove ban from matchup leg

Status: untested.


### `watch_player`

```graphql
watch_player(sport: String!, season_type: String, season: String, player_id: String!): Player
```

Server description: Watch player

Status: untested.


### `unwatch_player`

```graphql
unwatch_player(sport: String!, season_type: String, season: String, player_id: String!): Boolean
```

Server description: Unwatch player

Status: untested.


### `unwatch_all_players`

```graphql
unwatch_all_players(sport: String!, season_type: String, season: String): Boolean
```

Server description: Unwatch all players

Status: untested.


### `set_league_mascot`

```graphql
set_league_mascot(leg: Int!, league_id: Snowflake!, mascot_item_id: Snowflake, mascot_item_type_id: String, emotion: String): LeagueUser
```

Status: untested.


### `set_league_mascot_emotion`

```graphql
set_league_mascot_emotion(leg: Int!, league_id: Snowflake!, emotion: String!): LeagueUser
```

Status: untested.


### `set_league_mascot_message`

```graphql
set_league_mascot_message(message: String!, leg: Int!, league_id: Snowflake!, emotion: String): LeagueUser
```

Status: untested.


### `update_tiebreaker`

```graphql
update_tiebreaker(league_id: Snowflake!, roster_id: Int!, tiebreaker: Int, Tiebreaker: Int): Roster
```

Server description: Set tiebreaker field for a tournament bracket

Status: untested.


### `save_tournament_pick`

```graphql
save_tournament_pick(round: Int!, team: String, game_id: String!, league_id: Snowflake!, roster_id: Int!, team_bracket: String, team_seed: Int): [TournamentPick]
```

Server description: Save tournament pick

Status: untested.


### `clear_tournament_picks`

```graphql
clear_tournament_picks(league_id: Snowflake!, roster_id: Int!): Boolean
```

Status: untested.


### `clone_tournament_picks`

```graphql
clone_tournament_picks(league_id: Snowflake!, dest_league_id: Snowflake, src_roster_id: Int!, dest_roster_id: Int!): [TournamentPick]
```

Server description: Clone tournament picks for roster

Status: untested.


### `leave_league`

```graphql
leave_league(league_id: Snowflake!): League
```

Server description: Leave a league

Status: untested.


### `push_notify_join_voice_lounge`

```graphql
push_notify_join_voice_lounge(league_id: Snowflake!): Boolean
```

Status: untested.


## League management (commissioner)

### `league_update_settings`

```graphql
league_update_settings(league_id: Snowflake!, k_settings: [String], v_settings: [Int]): League
```

Server description: Update settings

Status: untested.


### `league_update_scoring_settings`

```graphql
league_update_scoring_settings(league_id: Snowflake!, k_scoring_settings: [String], v_scoring_settings: [Float]): League
```

Server description: League update scoring_settings

Status: untested.


### `league_update_roster_positions`

```graphql
league_update_roster_positions(league_id: Snowflake!, roster_positions: [String]): League
```

Server description: Update roster positions

Status: untested.


### `league_update_name`

```graphql
league_update_name(name: String!, league_id: Snowflake!): League
```

Server description: Update league name

Status: untested.


### `league_update_avatar`

```graphql
league_update_avatar(league_id: Snowflake!, avatar_url: String!): League
```

Server description: Update league avatar

Status: untested.


### `league_update_metadata`

```graphql
league_update_metadata(league_id: Snowflake!, k_metadata: [String], v_metadata: [String]): League
```

Server description: League update metadata

Status: untested.


### `league_update_note`

```graphql
league_update_note(text: String, league_id: Snowflake!): LeagueNote
```

Server description: Update league note

Status: untested.


### `league_update_owners`

```graphql
league_update_owners(league_id: Snowflake!, owner_ids: [Snowflake]): [LeagueUser]
```

Server description: Update league commissioners

Status: untested.


### `league_update_custom_standings`

```graphql
league_update_custom_standings(league_id: Snowflake!, v_rank_map: [Int], k_rank_map: [Int]): [Roster]
```

Server description: League update custom standings

Status: untested.


### `league_remove_user`

```graphql
league_remove_user(user_id: Snowflake!, league_id: Snowflake!): League
```

Server description: Commissioner remove user from league

Status: untested.


### `roster_change_owner`

```graphql
roster_change_owner(league_id: Snowflake!, roster_id: Int!, owner_id: Snowflake): Roster
```

Server description: Roster change owner

Status: untested.


### `remove_co_owner`

```graphql
remove_co_owner(league_id: Snowflake!, co_owner_id: Snowflake!): Roster
```

Server description: Remove co-owner

Status: untested.


### `roster_update_settings`

```graphql
roster_update_settings(league_id: Snowflake!, roster_id: Int!, k_settings: [String], v_settings: [Int]): Roster
```

Server description: Roster update settings (commissioner only)

Status: untested.


### `process_transaction`

```graphql
process_transaction(leg: Int!, league_id: Snowflake!, transaction_id: Snowflake!): LeagueTransaction
```

Server description: Process a trade - commissioners only

Status: untested.


### `force_cancel_transaction`

```graphql
force_cancel_transaction(leg: Int!, league_id: Snowflake!, transaction_id: Snowflake!): LeagueTransaction
```

Server description: Force cancel any transaction - commissioners only

Status: untested.


### `force_update_matchup_leg`

```graphql
force_update_matchup_leg(round: Int!, leg: Int!, league_id: Snowflake!, roster_id: Int!, starters: [String], starters_games: Map, subs: Map): MatchupLeg
```

Server description: Force update matchup leg

Status: untested.


### `update_matchup_leg_custom_points`

```graphql
update_matchup_leg_custom_points(round: Int!, leg: Int!, league_id: Snowflake!, roster_id: Int!, custom_points: Float): Boolean
```

Server description: Update custom matchup points (commish only)

Status: untested.


### `update_opponents`

```graphql
update_opponents(round: Int!, leg: Int!, league_id: Snowflake!, roster_ids: [Int], matchup_ids: [Int]): [MatchupLeg]
```

Server description: Update opponents (commish only)

Status: untested.


### `randomize_opponents`

```graphql
randomize_opponents(league_id: Snowflake!): [MatchupLeg]
```

Server description: Randomize opponents (commish only)

Status: untested.


### `recalculate_matchup_scoring`

```graphql
recalculate_matchup_scoring(round: Int!, league_id: Snowflake!): Boolean
```

Server description: Recalculate scoring (commish only)

Status: untested.


### `override_league_playoff_brackets`

```graphql
override_league_playoff_brackets(league_id: Snowflake!, bracket_overrides: [PlayoffMatchOverride], loser_bracket_overrides: [PlayoffMatchOverride]): Map
```

Server description: Override playoff brackets

Status: untested.


### `configure_divisions`

```graphql
configure_divisions(league_id: Snowflake!, roster_ids: [Int], roster_divisions: [Int]): [Roster]
```

Server description: Configure Divisions

Status: untested.


### `remove_divisions`

```graphql
remove_divisions(league_id: Snowflake!): [Roster]
```

Server description: Remove Divisions

Status: untested.


### `assign_roster_draft_pick`

```graphql
assign_roster_draft_pick(league_id: Snowflake!, draft_pick: String!): RosterDraftPick
```

Server description: Draft Pick Trading - Assign Pick - commissioner only

Status: untested.


### `unassign_roster_draft_pick`

```graphql
unassign_roster_draft_pick(round: Int!, season: String!, league_id: Snowflake!, roster_id: Int!): RosterDraftPick
```

Server description: Draft Pick Trading - Unassign Pick - commissioner only

Status: untested.


### `continue_league`

```graphql
continue_league(type: Int!, league_id: Snowflake!, owner_ids: [Snowflake]): League
```

Server description: Continue a league

Status: untested.


### `create_league`

```graphql
create_league(name: String!, sport: String!, season_type: String!, season: String!, draft_id: Snowflake, roster_positions: [String], avatar_url: String, k_metadata: [String], v_metadata: [String], k_settings: [String], v_settings: [Int], k_scoring_settings: [String], v_scoring_settings: [Float]): League
```

Server description: Create League

Status: untested.


### `delete_league`

```graphql
delete_league(league_id: Snowflake!): League
```

Server description: Delete a league

Status: untested.


### `create_roster`

```graphql
create_roster(league_id: Snowflake!): Roster
```

Server description: Create a roster in league (for bracket mania)

Status: untested.


### `delete_roster`

```graphql
delete_roster(league_id: Snowflake!, roster_id: Int!): Boolean
```

Server description: Delete a roster in league (for bracket mania)

Status: untested.


### `create_supplemental_draft`

```graphql
create_supplemental_draft(league_id: Snowflake!): League
```

Server description: Create supplemental draft

Status: untested.


### `import_draft`

```graphql
import_draft(draft_id: Snowflake!, league_id: Snowflake!): League
```

Server description: Import draft to league

Status: untested.


### `reset_to_startup_draft`

```graphql
reset_to_startup_draft(league_id: Snowflake!): League
```

Server description: Reset to startup Draft

Status: untested.


### `skip_startup_draft`

```graphql
skip_startup_draft(league_id: Snowflake!): League
```

Server description: Skip startup draft

Status: untested.


### `import_league_users`

```graphql
import_league_users(user_ids: [Snowflake], src_league_id: Snowflake!, dest_league_id: Snowflake!): Boolean
```

Status: untested.


### `import_league_history`

```graphql
import_league_history(provider: String!, archive_json: String!): LeagueHistoryImport
```

Server description: Import external league history into a new Sleeper league

Status: untested.


### `upsert_league_manual_history`

```graphql
upsert_league_manual_history(season: String!, league_id: Snowflake!, league_notes: List, season_standings: List, top_standings: Map): [LeagueManualHistory]
```

Server description: Create or update manual league history

Status: untested.


### `delete_league_manual_history`

```graphql
delete_league_manual_history(season: String!, league_id: Snowflake!): [LeagueManualHistory]
```

Server description: Delete manual league history

Status: untested.


### `migrate_league_note`

```graphql
migrate_league_note(league_id: Snowflake!): LeagueNote
```

Server description: Commissioner migrates league note from previous league

Status: untested.


### `migrate_pinned_messages`

```graphql
migrate_pinned_messages(league_id: Snowflake!): Int
```

Server description: Commissioner migrates pinned messages from previous league

Status: untested.


### `clone_to_chopped`

```graphql
clone_to_chopped(league_id: Snowflake!, copy_draft_results: Boolean): League
```

Server description: Clone a league to chopped league

Status: untested.


### `chop_roster`

```graphql
chop_roster(league_id: Snowflake!, roster_id: Int!): Roster
```

Server description: Chop a roster, for chopped leagues only

Status: untested.


### `unlock_chopped_roster`

```graphql
unlock_chopped_roster(league_id: Snowflake!, roster_id: Int!): Roster
```

Server description: Unlock a chopped roster, for chopped leagues only, this does not add players back to the roster

Status: untested.


### `pickem_commish_revive`

```graphql
pickem_commish_revive(league_id: Snowflake!, roster_id: Int!): Roster
```

Status: untested.


### `rescore_pickem_league`

```graphql
rescore_pickem_league(league_id: Snowflake!, clear_roster_metadata: Boolean, make_random_picks: Boolean): String
```

Status: untested.


### `set_league_matchmaking`

```graphql
set_league_matchmaking(message: String, is_open: Boolean, league_id: Snowflake!, commitment: Float, custom_tags: [String], join_type: Int): MatchmakingLobby
```

Status: untested.


### `league_update_display_order`

```graphql
league_update_display_order(v_display_order: [Int], k_display_order: [Snowflake]): Boolean
```

Server description: Update my leagues display order (for left panel)

Status: untested.


## Pick'em

### `make_pickem_pick`

```graphql
make_pickem_pick(pick: InputPickemPick!, league_id: Snowflake!, roster_id: Int!, leg_id: String!, pick_to_replace: InputPickemPick): PickemLeg
```

Status: **EXECUTED, succeeded**. `src/pickem/client.ts` `submitPick()`; `pickem-picks` row 2026-08-31 `set 16 picks`. The `pick` input needs `outcome: "win"` alongside `team` and `game_id` or the server rejects it.


### `remove_pickem_pick`

```graphql
remove_pickem_pick(pick: InputPickemPick!, league_id: Snowflake!, roster_id: Int!, leg_id: String!): PickemLeg
```

Status: **CALLED in code, unverified**. `src/pickem/client.ts` has it; no activity row shows a removal.


### `set_pickem_tiebreaker`

```graphql
set_pickem_tiebreaker(league_id: Snowflake!, roster_id: Int!, tiebreaker: InputPickemTiebreaker!, leg_id: String!): PickemLeg
```

Status: **EXECUTED, succeeded**. `src/pickem/client.ts` `setTiebreaker()` called from `src/pickem/run.ts`; `pickem-picks` rows carry the tiebreaker value the server echoed back.


## Drafts

### `create_draft`

```graphql
create_draft(type: String!, sport: String!, season_type: String!, season: String!, league_id: Snowflake, k_metadata: [String], v_metadata: [String], k_settings: [String], v_settings: [Int], reset_league_draft: Boolean): Draft
```

Server description: Create a Draft

Status: untested.


### `clone_draft`

```graphql
clone_draft(sport: String!, draft_id: Snowflake!): Draft
```

Server description: Clone Draft

Status: untested.


### `delete_draft`

```graphql
delete_draft(sport: String!, draft_id: Snowflake!): Draft
```

Server description: Delete Draft

Status: untested.


### `join_draft`

```graphql
join_draft(sport: String!, draft_id: Snowflake!): Draft
```

Server description: Join a draft

Status: untested.


### `leave_draft`

```graphql
leave_draft(sport: String!, draft_id: Snowflake!): Draft
```

Server description: Leave a draft

Status: untested.


### `claim_draft_slot`

```graphql
claim_draft_slot(slot: Int!, sport: String!, draft_id: Snowflake!): Draft
```

Server description: Claim a draft slot

Status: untested.


### `draft_pick_player`

```graphql
draft_pick_player(sport: String!, player_id: String!, draft_id: Snowflake!, pick_no: Int!): DraftPick
```

Server description: User Pick a player for draft

Status: untested.


### `draft_cpu_pick_player`

```graphql
draft_cpu_pick_player(sport: String!, draft_id: Snowflake!, pick_no: Int!): DraftPick
```

Server description: CPU Pick Player for Draft

Status: untested.


### `draft_remove_pick`

```graphql
draft_remove_pick(sport: String!, draft_id: Snowflake!, pick_no: Int!): DraftPick
```

Server description: Remove draft pick

Status: untested.


### `draft_set_keeper`

```graphql
draft_set_keeper(sport: String!, player_id: String!, draft_id: Snowflake!, pick_no: Int!): DraftPick
```

Server description: Set a keeper on a draft board

Status: untested.


### `draft_hover_player`

```graphql
draft_hover_player(slot: Int!, sport: String!, player_id: String!, draft_id: Snowflake!, pick_no: Int): Boolean
```

Server description: select player but don't immediately nominate

Status: untested.


### `draft_nominate_player`

```graphql
draft_nominate_player(slot: Int!, amount: Int!, sport: String!, player_id: String!, draft_id: Snowflake!, pick_no: Int): DraftOffer
```

Server description: nominate a player for drafting

Status: untested.


### `draft_make_offer`

```graphql
draft_make_offer(slot: Int!, amount: Int!, sport: String!, player_id: String!, draft_id: Snowflake!, pick_no: Int): DraftOffer
```

Server description: make a draft offer to a player

Status: untested.


### `draft_force_auction_pick`

```graphql
draft_force_auction_pick(slot: Int!, amount: Int, sport: String!, player_id: String!, draft_id: Snowflake!, pick_no: Int, is_keeper: Boolean): DraftPick
```

Status: untested.


### `draft_pass_offering`

```graphql
draft_pass_offering(sport: String!, draft_id: Snowflake!): Draft
```

Server description: Signals this user does not wish to make any more offers to a player

Status: untested.


### `draft_resume_offering`

```graphql
draft_resume_offering(sport: String!, draft_id: Snowflake!): Draft
```

Server description: Signals this user would like to make offers to a player

Status: untested.


### `draft_set_nominator`

```graphql
draft_set_nominator(slot: Int!, sport: String!, draft_id: Snowflake!): Draft
```

Server description: override the current nominator in an auction draft

Status: untested.


### `draft_end_phase`

```graphql
draft_end_phase(phase: String!, sport: String!, draft_id: Snowflake!): Draft
```

Server description: Ends the current draft phase (sets timer to 0)

Status: untested.


### `draft_clear_afk_rounds`

```graphql
draft_clear_afk_rounds(sport: String!, draft_id: Snowflake!): Draft
```

Server description: Signals this user is not afk

Status: untested.


### `draft_remove_user`

```graphql
draft_remove_user(user_id: Snowflake!, sport: String!, draft_id: Snowflake!): Draft
```

Server description: Remove user from draft

Status: untested.


### `put_user_on_autopick`

```graphql
put_user_on_autopick(draft_id: Snowflake!): Boolean
```

Status: untested.


### `remove_user_from_autopick`

```graphql
remove_user_from_autopick(draft_id: Snowflake!): Boolean
```

Status: untested.


### `update_draft_queue`

```graphql
update_draft_queue(draft_id: Snowflake!, player_ids: [String]): [String]
```

Server description: Update the draft queue

Status: untested.


### `update_draft_order`

```graphql
update_draft_order(sport: String!, draft_id: Snowflake!, draft_order: [Snowflake]): Draft
```

Server description: Update Draft Order

Status: untested.


### `randomize_draft_order`

```graphql
randomize_draft_order(sport: String!, draft_id: Snowflake!): Draft
```

Server description: Randomize Draft Order

Status: untested.


### `update_draft_settings`

```graphql
update_draft_settings(sport: String!, draft_id: Snowflake!, k_settings: [String], v_settings: [Int]): Draft
```

Server description: Update Draft Settings

Status: untested.


### `update_draft_metadata`

```graphql
update_draft_metadata(sport: String!, draft_id: Snowflake!, k_metadata: [String], v_metadata: [String]): Draft
```

Server description: Update Draft Metadata

Status: untested.


### `update_draft_start_time`

```graphql
update_draft_start_time(start_time: Int!, sport: String!, draft_id: Snowflake!): Draft
```

Server description: Update draft proposed start time

Status: untested.


### `update_draft_status`

```graphql
update_draft_status(status: String!, sport: String!, draft_id: Snowflake!): Draft
```

Server description: Update Draft Status (start/pause/finish draft etc)

Status: untested.


### `update_draft_type`

```graphql
update_draft_type(type: String!, sport: String!, draft_id: Snowflake!): Draft
```

Server description: Update Draft Type (snake/linear/auction)

Status: untested.


### `update_user_draft_settings`

```graphql
update_user_draft_settings(draft_id: Snowflake!, allow_pn: Boolean!, mention_pn: Boolean!): UserDraft
```

Server description: Update Draft Setting

Status: untested.


### `react_to_draft_pick`

```graphql
react_to_draft_pick(sport: String!, draft_id: Snowflake!, pick_no: Int!, reaction: String): DraftPick
```

Server description: Reaction (emoji) to draft pick

Status: untested.


## DMs, messages, requests

### `create_dm`

```graphql
create_dm(title: String, members: [Snowflake], attachment_type: String, client_id: String, dm_type: String!, client_context: String, message_text: String, attachment_id: Snowflake, k_attachment_data: [String], v_attachment_data: [String]): Dm
```

Server description: Create a DM

Status: untested.


### `invite_to_dm`

```graphql
invite_to_dm(members: [Snowflake], dm_id: Snowflake!): Dm
```

Server description: Invite to an existing DM

Status: untested.


### `leave_dm`

```graphql
leave_dm(dm_id: Snowflake!): Dm
```

Server description: Leave a DM

Status: untested.


### `hide_dm`

```graphql
hide_dm(dm_id: Snowflake!): Dm
```

Server description: Hide DM

Status: untested.


### `delete_dm`

```graphql
delete_dm(dm_id: Snowflake!): Dm
```

Server description: Delete DM

Status: untested.


### `change_dm_title`

```graphql
change_dm_title(title: String!, dm_id: Snowflake!): Dm
```

Server description: Change DM title

Status: untested.


### `update_dm_member`

```graphql
update_dm_member(dm_id: Snowflake!, allow_pn: Boolean!, mention_pn: Boolean!): DmUser
```

Server description: Update a DM member

Status: untested.


### `create_message`

```graphql
create_message(text: String, parent_type: String!, attachment_type: String, client_id: String, channel_id: Snowflake, parent_id: Snowflake!, role_id: Snowflake, author_achievement: String, pinned: Boolean, shard_max: Int, shard_min: Int, client_context: String, attachment_id: Snowflake, k_attachment_data: [String], v_attachment_data: [String]): Message
```

Server description: Create a message.  Options include channel_id, shard_min, & shard_max for cases if it's a topical message

Status: **EXECUTED, succeeded**. `src/league/api.ts` `sendDm()` with `parent_type: "dm"`; 38 `dm-reply` rows. Stored text comes back HTML-escaped.


### `change_message_text`

```graphql
change_message_text(text: String!, message_id: Snowflake!, parent_id: Snowflake!): Message
```

Server description: Change message text

Status: untested.


### `delete_message`

```graphql
delete_message(message_id: Snowflake!, parent_id: Snowflake!): Boolean
```

Server description: Delete message

Status: untested.


### `pin_message`

```graphql
pin_message(message_id: Snowflake!, parent_id: Snowflake!): Boolean
```

Server description: Pin message

Status: untested.


### `unpin_message`

```graphql
unpin_message(message_id: Snowflake!, parent_id: Snowflake!): Boolean
```

Server description: Unpin message

Status: untested.


### `create_reaction`

```graphql
create_reaction(message_id: Snowflake!, parent_id: Snowflake!, reaction: String!, enable_multi: Boolean): Reaction
```

Server description: React to a message

Status: untested.


### `delete_reaction`

```graphql
delete_reaction(message_id: Snowflake!, parent_id: Snowflake!, reaction: String!): Reaction
```

Server description: Remove a reaction from a message

Status: untested.


### `create_tutorial_message`

```graphql
create_tutorial_message(text: String, parent_type: String!, attachment_type: String, parent_id: Snowflake!, attachment_id: Snowflake, k_attachment_data: [String], v_attachment_data: [String], bot_id: Snowflake!): Message
```

Server description: Create a tutorial message, in a DM / League / Draft / etc...

Status: untested.


### `typing`

```graphql
typing(parent_type: String!, channel_id: Snowflake, parent_id: Snowflake!): Boolean
```

Server description: User is typing

Status: untested.


### `signal`

```graphql
signal(item: String!, parent_type: String!, item_count: Int, channel_id: Snowflake, parent_id: Snowflake!): Boolean
```

Server description: Send a message signal

Status: untested.


### `clear_unread_dms`

```graphql
clear_unread_dms: Boolean
```

Server description: Clear all unread DMs

Status: untested.


### `clear_unread_mentions`

```graphql
clear_unread_mentions: Boolean
```

Server description: Clear all unread mentions

Status: untested.


### `send_request`

```graphql
send_request(type_id: Snowflake!, requestee_id: Snowflake!, request_type: String!): Request
```

Server description: Request a user to be a friend, join group, channel, or league. Types are league, dm_group, dm_single, friend, and channel

Status: untested.


### `accept_request`

```graphql
accept_request(type_id: Snowflake!, requester_id: Snowflake!, request_type: String!): Boolean
```

Server description: Accept a request

Status: **EXECUTED, succeeded**. `src/league/api.ts` `acceptChatRequest()`; 88 `dm-request-accepted` rows for `dm_single` and `dm_group`.


### `decline_request`

```graphql
decline_request(type_id: Snowflake!, requester_id: Snowflake!, request_type: String!): Boolean
```

Server description: Decline a request

Status: untested.


### `cancel_request`

```graphql
cancel_request(type_id: Snowflake!, requestee_id: Snowflake!, request_type: String!): Boolean
```

Server description: Cancel an outbound request

Status: untested.


### `send_matchmaking_request`

```graphql
send_matchmaking_request(type_id: Snowflake!, lobby_id: Snowflake!, game_bucket: String!, game: String!, requestee_id: Snowflake!, request_type: String!): Request
```

Status: untested.


### `suggest_matchmaking_user`

```graphql
suggest_matchmaking_user(league_id: Snowflake!, game_bucket: String!, game: String!, requestee_id: Snowflake!): Message
```

Status: untested.


### `remove_friend`

```graphql
remove_friend(friend_id: Snowflake!): Boolean
```

Status: untested.


### `block_user`

```graphql
block_user(blocked_user_id: Snowflake!): BlockedUser
```

Server description: Block a user

Status: untested.


### `unblock_user`

```graphql
unblock_user(blocked_user_id: Snowflake!): BlockedUser
```

Server description: Unblock a user

Status: untested.


### `report_user`

```graphql
report_user(user_id: Snowflake!): Boolean
```

Status: untested.


### `invite_friends`

```graphql
invite_friends(contact_infos: [ContactInfo], my_name: String!): Boolean
```

Status: untested.


### `create_poll`

```graphql
create_poll(prompt: String, choices: [String], k_metadata: [String], v_metadata: [String]): Poll
```

Server description: Create a poll

Status: untested.


### `poll_vote`

```graphql
poll_vote(type: String, type_id: Snowflake, parent_id: Snowflake, poll_id: Snowflake!, choice_id: String!): Poll
```

Server description: Vote on a poll

Status: untested.


### `poll_unvote`

```graphql
poll_unvote(type: String, type_id: Snowflake, parent_id: Snowflake, poll_id: Snowflake!, choice_id: String!): Poll
```

Server description: Unvote on a poll

Status: untested.


### `poll_add_choice`

```graphql
poll_add_choice(type: String, choice: String!, type_id: Snowflake, parent_id: Snowflake, poll_id: Snowflake!): Poll
```

Server description: Add a poll choice

Status: untested.


### `poll_edit_choice`

```graphql
poll_edit_choice(type: String, choice: String!, type_id: Snowflake, parent_id: Snowflake, poll_id: Snowflake!, choice_id: String!): Poll
```

Server description: Edit a poll choice

Status: untested.


### `poll_remove_choice`

```graphql
poll_remove_choice(type: String, type_id: Snowflake, parent_id: Snowflake, poll_id: Snowflake!, choice_id: String!): Poll
```

Server description: Remove a poll choice

Status: untested.


### `poll_edit_prompt`

```graphql
poll_edit_prompt(type: String, prompt: String!, type_id: Snowflake, parent_id: Snowflake, poll_id: Snowflake!): Poll
```

Server description: Edit poll prompt

Status: untested.


### `poll_set_closes_at`

```graphql
poll_set_closes_at(type: String, type_id: Snowflake, parent_id: Snowflake, poll_id: Snowflake!, closes_at: Int!): Poll
```

Server description: Set poll closes at

Status: untested.


### `create_file`

```graphql
create_file(filename: String!, width: Int, parent_type: String!, url: String!, channel_id: Snowflake, parent_id: Snowflake!, filesize: Int!, height: Int, mimetype: String, url_original: String): File
```

Server description: Create a file

Status: untested.


### `create_event`

```graphql
create_event(name: String!, description: String, start_time: Int, parent_type: String!, end_time: Int, parent_id: Snowflake!): Event
```

Status: untested.


### `delete_event`

```graphql
delete_event(parent_type: String!, event_id: Snowflake!, parent_id: Snowflake!): Event
```

Status: untested.


### `enter_event_queue`

```graphql
enter_event_queue(priority: Int, type: String!, event_id: Snowflake, type_id: Snowflake!): Boolean
```

Status: untested.


### `leave_event_queue`

```graphql
leave_event_queue(type: String!, type_id: Snowflake!): Boolean
```

Status: untested.


### `create_invite_link`

```graphql
create_invite_link(code: String, type: String!, expires_at: Int, type_id: Snowflake!, uses_remaining: Int): Code
```

Server description: Create Invite Link

Status: untested.


### `use_code`

```graphql
use_code(code: String, ref_code: String): Code
```

Server description: Use Code

Status: untested.


## Channels and topics

### `create_channel`

```graphql
create_channel(name: String!, description: String, sort_order: String!, is_private: Boolean!, sport: String!, parent_id: Snowflake, sharding_enabled: Boolean!, avatar_url: String, default_moderator_role: Boolean): Channel
```

Server description: Create a new channel

Status: untested.


### `update_channel`

```graphql
update_channel(name: String!, description: String, sort_order: String!, is_private: Boolean!, channel_id: Snowflake!, sport: String!, max_message_length: Int, max_topic_length: Int, message_create_amount: Int, message_create_ban: Int, message_create_delay: Int, message_create_period: Int, reaction_create_delay: Int, sharding_enabled: Boolean!, topic_create_delay: Int, avatar_url: String): Channel
```

Server description: Update a channel

Status: untested.


### `delete_channel`

```graphql
delete_channel(channel_id: Snowflake!): Channel
```

Server description: Delete a channel

Status: untested.


### `join_channel`

```graphql
join_channel(channel_id: Snowflake!, display_order: Int): Channel
```

Server description: Join a channel

Status: untested.


### `join_channels`

```graphql
join_channels(channel_ids: [Snowflake]): [Channel]
```

Server description: Join multiple channels

Status: untested.


### `leave_channel`

```graphql
leave_channel(channel_id: Snowflake!): Channel
```

Server description: Leave a channel

Status: untested.


### `leave_channels`

```graphql
leave_channels(channel_ids: [Snowflake]): [Channel]
```

Server description: Leave multiple channels

Status: untested.


### `reorder_channels`

```graphql
reorder_channels(channel_ids: [Snowflake]): [Channel]
```

Server description: Re-order user channels

Status: untested.


### `channel_update_favorite`

```graphql
channel_update_favorite(channel_id: Snowflake!, is_favorite: Boolean!): Channel
```

Server description: Favorite a channel

Status: untested.


### `track_channel_join`

```graphql
track_channel_join(channel_id: Snowflake!): Boolean
```

Server description: Track Channel Join, temporary workaround for not enough trending channels

Status: untested.


### `create_topic`

```graphql
create_topic(title: String!, attachment_type: String, client_id: String, channel_tags: [String], channel_id: Snowflake!, attachment_id: Snowflake, k_attachment_data: [String], v_attachment_data: [String]): Topic
```

Server description: Create a topic

Status: untested.


### `create_post`

```graphql
create_post(text: String, attachment: Map, attachment_type: String, channel_tags: [String], player_tags: [String], attachment_id: Snowflake, sport_tags: [String], team_tags: [String], mod_post: Boolean): Topic
```

Status: untested.


### `change_topic_title`

```graphql
change_topic_title(title: String!, topic_id: Snowflake!, channel_id: Snowflake!): Topic
```

Server description: Change topic title

Status: untested.


### `update_topic_title_map`

```graphql
update_topic_title_map(key: String!, url: String, topic_id: Snowflake!, channel_id: Snowflake!): Topic
```

Server description: Update topic title_map with a URL without changing the title text. Useful for attaching Twitter/X video links. Pass url to add/update, pass nil/empty to remove.

Status: untested.


### `delete_topic`

```graphql
delete_topic(topic_id: Snowflake!, channel_id: Snowflake!): Boolean
```

Server description: Delete topic

Status: untested.


### `hide_topic`

```graphql
hide_topic(topic_id: Snowflake!, channel_id: Snowflake!): Boolean
```

Server description: Hide topic

Status: untested.


### `unhide_topic`

```graphql
unhide_topic(topic_id: Snowflake!, channel_id: Snowflake!): Boolean
```

Server description: Unhide topic

Status: untested.


### `shadow_topic`

```graphql
shadow_topic(topic_id: Snowflake!, channel_id: Snowflake!): Boolean
```

Server description: Shadow topic

Status: untested.


### `unshadow_topic`

```graphql
unshadow_topic(topic_id: Snowflake!, channel_id: Snowflake!): Boolean
```

Server description: Unshadow topic

Status: untested.


### `pin_topic`

```graphql
pin_topic(topic_id: Snowflake!, channel_id: Snowflake!): Boolean
```

Server description: Pin topic

Status: untested.


### `unpin_topic`

```graphql
unpin_topic(topic_id: Snowflake!, channel_id: Snowflake!): Boolean
```

Server description: Unpin topic

Status: untested.


### `push_topic`

```graphql
push_topic(tag: String!, topic_id: Snowflake!, channel_id: Snowflake!): Topic
```

Server description: Push topic

Status: untested.


### `create_topic_reaction`

```graphql
create_topic_reaction(topic_id: Snowflake!, channel_id: Snowflake!, reaction: String!): TopicReaction
```

Status: untested.


### `delete_topic_reaction`

```graphql
delete_topic_reaction(topic_id: Snowflake!, channel_id: Snowflake!, reaction: String!): TopicReaction
```

Status: untested.


### `create_topic_subscriptions`

```graphql
create_topic_subscriptions(topic_id: Snowflake!, channel_id: Snowflake!, user_ids: [Snowflake]): Boolean
```

Server description: Create subscriptions on behalf of others

Status: untested.


### `unsubscribe_from_topic`

```graphql
unsubscribe_from_topic(topic_id: Snowflake!): Boolean
```

Server description: Unsubscribe from topic

Status: untested.


### `add_channel_tag`

```graphql
add_channel_tag(topic_id: Snowflake!, channel_id: Snowflake!, channel_tag: String!): Topic
```

Server description: Add channel tag to topic

Status: untested.


### `remove_channel_tag`

```graphql
remove_channel_tag(topic_id: Snowflake!, channel_id: Snowflake!, channel_tag: String!): Topic
```

Server description: Remove channel tag to topic

Status: untested.


### `update_channel_tags`

```graphql
update_channel_tags(topic_id: Snowflake!, channel_tags: [String], channel_id: Snowflake!): Topic
```

Server description: Update a list of channel tags

Status: untested.


### `create_channel_tag`

```graphql
create_channel_tag(name: String!, tag: String!, description: String!, color: String!, channel_id: Snowflake!, is_default: Boolean!, sound: String!): ChannelTag
```

Server description: Create a new channel tag

Status: untested.


### `update_channel_tag`

```graphql
update_channel_tag(name: String!, tag: String!, description: String!, color: String!, channel_id: Snowflake!, is_default: Boolean!, sound: String!): ChannelTag
```

Server description: Update an existing channel tag

Status: untested.


### `delete_channel_tag`

```graphql
delete_channel_tag(tag: String!, channel_id: Snowflake!): ChannelTag
```

Server description: Delete a channel tag

Status: untested.


### `reorder_channel_tags`

```graphql
reorder_channel_tags(tags: [String], channel_id: Snowflake!): [String]
```

Server description: Re-order channel tags

Status: untested.


### `add_player_tag`

```graphql
add_player_tag(topic_id: Snowflake!, channel_id: Snowflake!, sport: String!, player_id: String!): Topic
```

Server description: Add player tag to topic

Status: untested.


### `remove_player_tag`

```graphql
remove_player_tag(topic_id: Snowflake!, channel_id: Snowflake!, sport: String!, player_id: String!): Topic
```

Server description: Remove player tag to topic

Status: untested.


### `ban_channel_user`

```graphql
ban_channel_user(channel_id: Snowflake!, expire_days: Int, ban_user_id: Snowflake!): ChannelBan
```

Server description: Ban a user from a channel

Status: untested.


### `unban_channel_user`

```graphql
unban_channel_user(channel_id: Snowflake!, unban_user_id: Snowflake!): ChannelBan
```

Server description: Unban a user from a channel

Status: untested.


### `add_role`

```graphql
add_role(name: String!, type: String!, type_id: Snowflake!): Role
```

Server description: Add a role to a channel, group, or league

Status: untested.


### `remove_role`

```graphql
remove_role(type: String!, type_id: Snowflake!, role_id: Snowflake!): Role
```

Server description: Remove a role from a channel / league

Status: untested.


### `assign_role`

```graphql
assign_role(type: String!, user_id: Snowflake!, type_id: Snowflake!, role_id: Snowflake!): Boolean
```

Server description: Assign Role to a user

Status: untested.


### `revoke_role`

```graphql
revoke_role(type: String!, user_id: Snowflake!, type_id: Snowflake!, role_id: Snowflake!): Boolean
```

Server description: Revoke Role from user

Status: untested.


### `add_role_permission`

```graphql
add_role_permission(type: String!, type_id: Snowflake!, role_id: Snowflake!, permission: String!): Boolean
```

Server description: Add permission to role

Status: untested.


### `remove_role_permission`

```graphql
remove_role_permission(type: String!, type_id: Snowflake!, role_id: Snowflake!, permission: String!): Boolean
```

Server description: Remove permission from role

Status: untested.


### `reorder_roles`

```graphql
reorder_roles(type: String!, type_id: Snowflake!, role_ids: [Snowflake]): Boolean
```

Server description: Re-order roles for a type_id

Status: untested.


### `track_score_view`

```graphql
track_score_view(sport: String!, season_type: String!, season: String!, game_id: String!): Boolean
```

Status: untested.


## Account and auth

### `user`

```graphql
user(code: String, password: String, real_name: String, display_name: String, promo: String, avatar_url: String, captcha: String, email_or_phone: String, ref_code: String, impact_click_id: String): User
```

Server description: Create a user with display name and avatar_url

Status: referenced in sleeper-coach (src/draft/run.ts) but no execution evidence.


### `create_pending_user`

```graphql
create_pending_user(real_name: String!, email_or_phone: String!): User
```

Server description: Create a user with display name and avatar_url

Status: untested.


### `delete_user`

```graphql
delete_user(password: String, email_or_phone_or_username: String!): User
```

Server description: Delete

Status: untested.


### `change_password`

```graphql
change_password(password: String!, old_password: String): Boolean
```

Server description: Change Password

Status: untested.


### `change_password2`

```graphql
change_password2(password: String!, logout_all: Boolean, old_password: String): User
```

Server description: Change Password

Status: untested.


### `request_password_reset`

```graphql
request_password_reset(captcha: String, email_or_phone: String!): Boolean
```

Server description: Request Reset Password

Status: untested.


### `reset_password`

```graphql
reset_password(code: String!, password: String!): Boolean
```

Server description: Reset Password

Status: untested.


### `reset_password_with_code`

```graphql
reset_password_with_code(code: String!, password: String!, email_or_phone: String!): Boolean
```

Server description: Reset Password With Code

Status: untested.


### `create_verification_code`

```graphql
create_verification_code(version: String, captcha: String, email_or_phone: String!): Map
```

Server description: Create a phone code

Status: untested.


### `request_verification`

```graphql
request_verification(version: String, captcha: String, email_or_phone: String!): Boolean
```

Server description: Request Verification

Status: untested.


### `verify_verification_code`

```graphql
verify_verification_code(code: String!, email_or_phone: String!): Boolean
```

Server description: Verify phone code

Status: untested.


### `verify_contact_update`

```graphql
verify_contact_update(code: String!): User
```

Server description: Verify contact update by code

Status: untested.


### `cancel_verification`

```graphql
cancel_verification: Boolean
```

Server description: Cancel Verification

Status: untested.


### `create_passkey_start`

```graphql
create_passkey_start: Map
```

Status: untested.


### `create_passkey_finalize`

```graphql
create_passkey_finalize(public_key_credential: PublicKeyCredentialInput!): Passkey
```

Status: untested.


### `delete_passkey`

```graphql
delete_passkey(passkey_id: String!): Boolean
```

Status: untested.


### `login_via_passkey_start`

```graphql
login_via_passkey_start: Map
```

Status: untested.


### `update_user_display_name`

```graphql
update_user_display_name(display_name: String!): User
```

Server description: Update user's display name

Status: untested.


### `update_user_real_name`

```graphql
update_user_real_name(real_name: String!): User
```

Server description: Update user's real name

Status: untested.


### `update_user_avatar_url`

```graphql
update_user_avatar_url(avatar_url: String!): User
```

Server description: Update user's avatar_url

Status: untested.


### `update_user_flairs`

```graphql
update_user_flairs(user_flair: [UserFlair]): User
```

Server description: Update the flairs for a user returns the updated user

Status: untested.


### `update_user_summoner_name`

```graphql
update_user_summoner_name(region: String!, summoner_name: String!): User
```

Server description: Update user's summoner name

Status: untested.


### `update_preferences`

```graphql
update_preferences(values: [String], names: [String], type_id: Snowflake!): Boolean
```

Server description: Update preference value for user_id, type_id, and name

Status: untested.


### `update_dismissals`

```graphql
update_dismissals(type: String!, value: String!): Map
```

Status: untested.


### `remove_dismissals`

```graphql
remove_dismissals(type: String!): Map
```

Status: untested.


### `add_async_bundles`

```graphql
add_async_bundles(bundle_names: [String]): [String]
```

Server description: Add bundles to User's async bundles

Status: untested.


### `delete_async_bundles`

```graphql
delete_async_bundles(bundle_names: [String]): [String]
```

Server description: Delete bundles to User's async bundles

Status: untested.


### `accept_legal_agreement`

```graphql
accept_legal_agreement(agreement_type: String!): Boolean
```

Server description: accept legal agreement of a given type

Status: untested.


### `consent_to_electronic_delivery`

```graphql
consent_to_electronic_delivery(consent: Boolean!): Boolean
```

Status: untested.


### `set_favorite_teams`

```graphql
set_favorite_teams(sport: String!, teams: [String]): Boolean
```

Status: untested.


### `add_favorite_team`

```graphql
add_favorite_team(sport: String!, team: String!): Boolean
```

Status: untested.


### `remove_favorite_team`

```graphql
remove_favorite_team(sport: String!, team: String!): Boolean
```

Status: untested.


### `sync_push_token`

```graphql
sync_push_token(token: String!, device_id: String, token_type: String!, bundle_id: String, has_permission: Boolean!): String
```

Server description: Sync push token

Status: untested.


### `sync_push_tags`

```graphql
sync_push_tags(k_tags: [String], push_id: String!, v_tags: [String]): Boolean
```

Server description: Sync onesignal push tags

Status: untested.


### `sync_badge_count`

```graphql
sync_badge_count(count: Int!): String
```

Server description: Sync push notification badge counts

Status: untested.


### `sync_app_information`

```graphql
sync_app_information(app_instance_id: String!, app_type: String!): String
```

Server description: Sync user app information

Status: untested.


### `tag_braze_user`

```graphql
tag_braze_user(type: String): Boolean
```

Status: untested.


### `send_download_link`

```graphql
send_download_link(phone: String!): Boolean
```

Server description: Send download link

Status: untested.


### `reward_onboarding`

```graphql
reward_onboarding(platform: String!, step: String!, sport: String!): OnboardingReward
```

Status: untested.


### `set_ftu_offer`

```graphql
set_ftu_offer(offer: String!): String
```

Server description: Set FTU promo offer

Status: untested.


### `clear_notifications`

```graphql
clear_notifications(notification_types: [String]): Boolean
```

Status: untested.


### `use_item`

```graphql
use_item(item_id: Snowflake!): Item
```

Status: untested.


### `claim_gift`

```graphql
claim_gift(message_id: Snowflake!, parent_id: Snowflake!, item_id: Snowflake!): Item
```

Status: untested.


### `gift_item_to_user`

```graphql
gift_item_to_user(item_id: Snowflake!, receiver_user_id: Snowflake!): Item
```

Status: untested.


### `gift_item_to_league`

```graphql
gift_item_to_league(item_id: Snowflake!, receiver_league_id: Snowflake!): Item
```

Status: untested.


### `purchase_gift_for_user`

```graphql
purchase_gift_for_user(item_type_id: String!, receiver_user_id: Snowflake!): Item
```

Status: untested.


### `purchase_gift_for_league`

```graphql
purchase_gift_for_league(item_type_id: String!, receiver_league_id: Snowflake!): Item
```

Status: untested.


### `purchase_item_with_cookies`

```graphql
purchase_item_with_cookies(item_type_id: String!): Item
```

Status: untested.


### `redeem_receipt_for_cookies`

```graphql
redeem_receipt_for_cookies(product_id: String!, store_type: String!, proof_of_purchase: String!): Int
```

Status: untested.


### `rotate_purchasable_mascots`

```graphql
rotate_purchasable_mascots: [ItemType]
```

Status: untested.


## League groups and companies

### `create_company`

```graphql
create_company(name: String!, description: String, shortcode: String!, avatar_url: String): Company
```

Status: untested.


### `update_company`

```graphql
update_company(name: String!, description: String!, company_id: Snowflake!, shortcode: String!, avatar_url: String): Company
```

Status: untested.


### `delete_company`

```graphql
delete_company(company_id: Snowflake!): Company
```

Status: untested.


### `create_league_group`

```graphql
create_league_group(name: String!, description: String, company_id: Snowflake!, sport: String!, season_type: String!, season: String!, roster_positions: [String], avatar_url: String, k_metadata: [String], v_metadata: [String], k_settings: [String], v_settings: [Int], k_scoring_settings: [String], v_scoring_settings: [Float], k_group_settings: [String], v_group_settings: [Int], k_draft_settings: [String], v_draft_settings: [Int]): LeagueGroup
```

Status: untested.


### `update_league_group`

```graphql
update_league_group(name: String!, description: String, company_id: Snowflake!, sport: String!, season_type: String!, season: String!, group_id: Snowflake!, avatar_url: String): LeagueGroup
```

Status: untested.


### `delete_league_group`

```graphql
delete_league_group(company_id: Snowflake!, sport: String!, season_type: String!, season: String!, group_id: Snowflake!): LeagueGroup
```

Status: untested.


### `create_league_group_league`

```graphql
create_league_group_league(name: String!, group_id: Snowflake!, avatar_url: String, draft_time: Int!): League
```

Status: untested.


### `add_league_group_admin`

```graphql
add_league_group_admin(company_id: Snowflake!, group_id: Snowflake!): String
```

Status: untested.


### `update_league_group_settings`

```graphql
update_league_group_settings(company_id: Snowflake!, sport: String!, season_type: String!, season: String!, group_id: Snowflake!, k_settings: [String], v_settings: [Int]): LeagueGroup
```

Status: untested.


### `update_league_group_group_settings`

```graphql
update_league_group_group_settings(company_id: Snowflake!, sport: String!, season_type: String!, season: String!, group_id: Snowflake!, k_group_settings: [String], v_group_settings: [Int]): LeagueGroup
```

Status: untested.


### `update_league_group_draft_settings`

```graphql
update_league_group_draft_settings(company_id: Snowflake!, sport: String!, season_type: String!, season: String!, group_id: Snowflake!, k_draft_settings: [String], v_draft_settings: [Int]): LeagueGroup
```

Status: untested.


### `update_league_group_metadata`

```graphql
update_league_group_metadata(company_id: Snowflake!, sport: String!, season_type: String!, season: String!, group_id: Snowflake!, k_metadata: [String], v_metadata: [String]): LeagueGroup
```

Status: untested.


### `update_league_group_roster_positions`

```graphql
update_league_group_roster_positions(company_id: Snowflake!, sport: String!, season_type: String!, season: String!, group_id: Snowflake!, roster_positions: [String]): LeagueGroup
```

Status: untested.


### `update_league_group_scoring_settings`

```graphql
update_league_group_scoring_settings(company_id: Snowflake!, sport: String!, season_type: String!, season: String!, group_id: Snowflake!, k_scoring_settings: [String], v_scoring_settings: [Float]): LeagueGroup
```

Status: untested.


### `join_matchmaking_league`

```graphql
join_matchmaking_league(lobby_id: Snowflake!, game_bucket: String!, game: String!): League
```

Status: untested.


### `join_public_league`

```graphql
join_public_league(sport: String!, season_type: String!, season: String!): League
```

Server description: Join a public league

Status: untested.


### `set_user_league_matchmaking_preferences`

```graphql
set_user_league_matchmaking_preferences(message: String, tags: Map, is_open: Boolean, sport: String!, season_type: String!, season: String!, custom_tags: [String], commitment_high: Float, commitment_low: Float, player_count: [Int]): MatchmakingUser
```

Status: untested.


### `league_sync_create_league`

```graphql
league_sync_create_league(type: Int, cookie: String, provider: String!, roster_id: Int, provider_league_id: String!, s2: String, swid: String): League
```

Status: untested.


### `league_sync_login`

```graphql
league_sync_login(password: String!, provider: String!, login_value: String!): Map
```

Status: untested.


### `league_sync_get_mask`

```graphql
league_sync_get_mask(provider: String!, login_value: String!): Map
```

Status: untested.


### `league_sync_send_recovery_code`

```graphql
league_sync_send_recovery_code(type: String, mask: String, cookie: String, marker: String, display_name: String, provider: String!, acrumb: String, crumb: String, session_index: String, masked_value: String, email_or_phone: String): Map
```

Status: untested.


### `league_sync_use_recovery_code`

```graphql
league_sync_use_recovery_code(code: String, type: String, mask: String, cookie: String, session_id: String, api_key: String, display_name: String, provider: String!, reference_id: String, acrumb: String, crumb: String, session_index: String, att_remaining: String): Map
```

Status: untested.


## User rosters (Sleeper Picks lineups)

### `create_user_roster`

```graphql
create_user_roster(sport: String!, season_type: String!, season: String!, players: [String], roster_positions: [String], starters: [String], k_metadata: [String], v_metadata: [String], k_settings: [String], v_settings: [Int], k_scoring_settings: [String], v_scoring_settings: [Float]): UserRoster
```

Server description: Create a user roster

Status: untested.


### `delete_user_roster`

```graphql
delete_user_roster(sport: String!, season_type: String!, season: String!, roster_id: Snowflake!): UserRoster
```

Server description: Delete a user roster

Status: untested.


### `update_user_roster_players`

```graphql
update_user_roster_players(sport: String!, season_type: String!, season: String!, players: [String], roster_id: Snowflake!, starters: [String]): UserRoster
```

Server description: Update user roster players

Status: untested.


### `update_user_roster_positions`

```graphql
update_user_roster_positions(sport: String!, season_type: String!, season: String!, roster_positions: [String], roster_id: Snowflake!): UserRoster
```

Server description: Update user roster positions

Status: untested.


### `update_user_roster_scoring_settings`

```graphql
update_user_roster_scoring_settings(sport: String!, season_type: String!, season: String!, roster_id: Snowflake!, k_scoring_settings: [String], v_scoring_settings: [Float]): UserRoster
```

Server description: Update user roster scoring settings

Status: untested.


### `update_user_roster_settings`

```graphql
update_user_roster_settings(sport: String!, season_type: String!, season: String!, roster_id: Snowflake!, k_settings: [String], v_settings: [Int]): UserRoster
```

Server description: Update user roster settings

Status: untested.


### `update_user_roster_metadata`

```graphql
update_user_roster_metadata(sport: String!, season_type: String!, season: String!, roster_id: Snowflake!, k_metadata: [String], v_metadata: [String]): UserRoster
```

Server description: Update user roster metadata

Status: untested.


## League dues

### `upsert_league_dues_config`

```graphql
upsert_league_dues_config(enabled: Boolean, status: String, amount: Int, settings: Map, currency_type: String, league_id: Snowflake!, notes: String, reminders_enabled: Boolean, payment_deadline: Int, season_dues: Map): LeagueDuesConfig
```

Server description: Upsert league dues config

Status: untested.


### `disable_league_dues_config`

```graphql
disable_league_dues_config(league_id: Snowflake!): LeagueDuesConfig
```

Server description: Disable a league's dues config, creating the config row if none exists yet. Draft or unconfigured leagues only, before any payments have been made. Re-enable by saving the config back to draft.

Status: untested.


### `convert_league_dues_to_sleeper_safe`

```graphql
convert_league_dues_to_sleeper_safe(league_id: Snowflake!): LeagueDuesConfig
```

Server description: Convert a league's tracker dues config to a fresh SleeperSafe draft

Status: untested.


### `convert_league_dues_to_tracker`

```graphql
convert_league_dues_to_tracker(amount: Int!, league_id: Snowflake!): LeagueDuesConfig
```

Server description: Convert a league's SleeperSafe config to the simple dues tracker, creating the tracker config if none exists yet. Draft or disabled configs only, before any payments have been made.

Status: untested.


### `migrate_league_dues_v1`

```graphql
migrate_league_dues_v1(league_id: Snowflake!): LeagueDuesConfig
```

Server description: Legacy alias for convert_league_dues_to_sleeper_safe

Status: untested.


### `batch_upsert_league_dues_users`

```graphql
batch_upsert_league_dues_users(league_id: Snowflake!, league_dues_users: [LeagueDuesUserInput]!, expected_hash: String!): LeagueDueUsersWithHash
```

Server description: Batch upsert league dues users

Status: untested.


### `pay_league_dues`

```graphql
pay_league_dues(season: String!, league_id: Snowflake!, target_user_ids: [Snowflake]): LeagueDuesPaymentResult
```

Server description: Pay league dues using eligible wallet balance

Status: untested.


### `league_dues_deposit`

```graphql
league_dues_deposit(location: Location!, season: String!, payment_method: PaymentMethodInput!, league_id: Snowflake!, target_user_ids: [Snowflake], use_league_dues_balance: Boolean): LeagueDuesPaymentResult
```

Server description: Deposit league dues via an eligible payment method

Status: untested.


### `withdraw_league_dues`

```graphql
withdraw_league_dues(location: Location!, currency_type: String!, payment_method: PaymentMethodInput!, currency_amount: Float!, device_id: String, client_ip: String): CurrencyTransaction
```

Server description: Withdraw from league dues wallet

Status: untested.


### `send_league_dues_reminder`

```graphql
send_league_dues_reminder(league_id: Snowflake!): String
```

Server description: Send dues reminder

Status: untested.


### `dm_unpaid_league_dues`

```graphql
dm_unpaid_league_dues(league_id: Snowflake!): String
```

Server description: Send DMs to unpaid league members

Status: untested.


### `save_league_dues_payout_configs`

```graphql
save_league_dues_payout_configs(league_id: Snowflake!, configs: [LeagueDuesPayoutConfigInput]!): [LeagueDuesPayoutConfig]
```

Server description: Save all league dues payout configs used during initial setup

Status: untested.


### `propose_league_dues_payout_changes`

```graphql
propose_league_dues_payout_changes(league_id: Snowflake!, payout_interval: String!, changes: [LeagueDuesPayoutChangeInput]!): [LeagueDuesPayoutPlan]
```

Server description: Propose payout changes for all configs in an interval

Status: untested.


## Sleeper Picks: wagers, wallet, KYC, promos (real money)

### `create_parlay`

```graphql
create_parlay(type: String, location: Location!, event_id: Snowflake, market_id: Snowflake, currency_type: String!, expected_provider_fee: String, expected_sleeper_fee: String, expected_total_fee: String, ask_price: String, side: String, currency_amount: Float!, line_ids: [Snowflake], league_id: Snowflake, promo_id: String, correlation_config_ids: Map, entry_name: String, payout_version: String, quest_id: String, boost_adjustment_version: String, client_metadata: Map, client_possible_multipliers: ClientPossibleMultipliers, vs_group: String, prototype_parlay_id: Snowflake, client_max_payout: String, pv: Int, league_public: Boolean!, auto_accept_changes: Boolean): Parlay
```

Status: untested.


### `cancel_parlay`

```graphql
cancel_parlay(parlay_id: Snowflake!): Parlay
```

Status: untested.


### `update_parlay`

```graphql
update_parlay(league_id: Snowflake, parlay_id: Snowflake!): Parlay
```

Status: untested.


### `set_contest_entry_name`

```graphql
set_contest_entry_name(parlay_id: Snowflake!, entry_name: String): Boolean
```

Status: untested.


### `order_contract`

```graphql
order_contract(event_id: Snowflake!, market_id: Snowflake!, currency_type: String, expected_provider_fee: String, expected_sleeper_fee: String, expected_total_fee: String, ask_quantity: Int!, order_type: String!, side: String, slippage_buffer_cents: Int, ask_price_dollars: String, ask_price_cents: Int): ContractOrder
```

Status: untested.


### `enter_daily_draft`

```graphql
enter_daily_draft(group: String, location: Location!, sport: String!): UserPool
```

Status: untested.


### `enter_daily_draft_bonuses`

```graphql
enter_daily_draft_bonuses(location: Location!, sport: String!, source_pool_id: Snowflake!, bonuses: Map!): [UserPool]
```

Status: untested.


### `join_derby`

```graphql
join_derby(derby_id: String!): DerbyUser
```

Status: untested.


### `leave_derby`

```graphql
leave_derby(derby_id: String!): Boolean
```

Status: untested.


### `acknowledge_derby_prize`

```graphql
acknowledge_derby_prize(derby_id: String!): UserDerbyPrize
```

Server description: Mark a derby prize's winnings modal as seen/dismissed

Status: untested.


### `update_squad_bank_grading_mode`

```graphql
update_squad_bank_grading_mode(league_id: Snowflake!, grading_mode: String!): UpdateSquadBankGradingModeResult
```

Server description: Update squad bank grading mode

Status: untested.


### `update_squad_waitlist_eligibility`

```graphql
update_squad_waitlist_eligibility(location: Location!): Boolean
```

Status: untested.


### `deposit`

```graphql
deposit(type: String, location: Location!, currency_type: String!, wallet_type: String, payment_method: PaymentMethodInput, currency_amount: Float!, promos: [String], theme: String, force_card_type: String): CcDepositResult
```

Status: untested.


### `cc_deposit`

```graphql
cc_deposit(location: Location!, currency_type: String!, wallet_type: String, payment_method: PaymentMethodInput, currency_amount: Float!, promos: [String], theme: String, force_card_type: String): CcDepositResult
```

Status: untested.


### `applepay_deposit`

```graphql
applepay_deposit(location: Location!, currency_type: String!, wallet_type: String, currency_amount: Float!, promos: [String], theme: String, force_card_type: String): CcDepositResult
```

Status: untested.


### `aeropay_deposit`

```graphql
aeropay_deposit(location: Location!, currency_type: String!, wallet_type: String, payment_method: PaymentMethodInput!, currency_amount: Float!, promos: [String]): CurrencyTransaction
```

Status: untested.


### `interactive_bank_deposit`

```graphql
interactive_bank_deposit(location: Location!, currency_type: String!, wallet_type: String, payment_method: PaymentMethodInput, currency_amount: Float!, client_ip: String, promos: [String], return_url: String!): InteractiveBankDepositResult
```

Status: untested.


### `aeropay_withdraw`

```graphql
aeropay_withdraw(location: Location!, currency_type: String!, wallet_type: String, payment_method: PaymentMethodInput!, currency_amount: Float!): CurrencyTransaction
```

Status: untested.


### `cc_withdrawal`

```graphql
cc_withdrawal(location: Location!, currency_type: String!, wallet_type: String, payment_method: PaymentMethodInput!, currency_amount: Float!): CurrencyTransaction
```

Status: untested.


### `bank_withdrawal`

```graphql
bank_withdrawal(location: Location!, currency_type: String!, wallet_type: String, payment_method: PaymentMethodInput!, currency_amount: Float!, client_ip: String): CurrencyTransaction
```

Status: untested.


### `offline_withdrawal`

```graphql
offline_withdrawal(reason: String!, location: Location!, email: String!, currency_type: String!, currency_amount: Float!, paper_check_info: OfflineWithdrawalPaperCheckInfo, ach_info: OfflineWithdrawalAchInfo): CurrencyTransaction
```

Status: untested.


### `clear_pending_withdrawal`

```graphql
clear_pending_withdrawal(reference_type: String!, reference_action: String!, reference_id: String!): CurrencyTransaction
```

Status: untested.


### `verify_bank_payment_method`

```graphql
verify_bank_payment_method(location: Location!, client_ip: String!, return_url: String!): Boolean
```

Status: untested.


### `verify_bank_payment_and_withdraw`

```graphql
verify_bank_payment_and_withdraw(location: Location!, currency_type: String!, currency_amount: Float!, client_ip: String!, return_url: String!): Map
```

Status: untested.


### `register_aeropay_user`

```graphql
register_aeropay_user(wallet_type: String): Map
```

Status: untested.


### `confirm_aeropay_user`

```graphql
confirm_aeropay_user(code: String!, wallet_type: String): [PaymentMethod]
```

Status: untested.


### `link_aeropay_account`

```graphql
link_aeropay_account(password: String!, user_id: String!, wallet_type: String): PaymentMethod
```

Status: untested.


### `sync_aeropay_accounts`

```graphql
sync_aeropay_accounts(wallet_type: String): [PaymentMethod]
```

Status: untested.


### `get_aeropay_aggregator_credentials`

```graphql
get_aeropay_aggregator_credentials(wallet_type: String): Map
```

Status: untested.


### `interac_set_security_question`

```graphql
interac_set_security_question(payment_method: PaymentMethodInput!, security_question: String!, security_answer: String!): PaymentMethod
```

Status: untested.


### `remove_payment_method`

```graphql
remove_payment_method(payment_method: PaymentMethodInput!): Boolean
```

Status: untested.


### `confirm_payment_methods`

```graphql
confirm_payment_methods(national_id: String!): Boolean
```

Status: untested.


### `verify_user_profile`

```graphql
verify_user_profile(location: Location, city: String!, first_name: String!, last_name: String!, region: String!, date_of_birth: String!, country_code: String!, address1: String!, address2: String, national_id: String, postal_code: String!, document_uuid: String, docv_transaction_token: String, kyc_session_id: String): UserProfile
```

Status: untested.


### `verify_change_info`

```graphql
verify_change_info(location: Location, city: String!, first_name: String!, last_name: String!, region: String!, date_of_birth: String!, country_code: String!, address1: String!, address2: String, national_id: String, postal_code: String!, kyc_session_id: String): UserProfile
```

Status: untested.


### `verify_start_one_click`

```graphql
verify_start_one_click(birthdate: String, ssn4: String): UserProfile
```

Status: untested.


### `verify_update_one_click`

```graphql
verify_update_one_click(birthdate: String, ssn4: String): UserProfile
```

Status: untested.


### `verify_confirm_one_click`

```graphql
verify_confirm_one_click(location: Location, kyc_session_id: String): UserProfile
```

Status: untested.


### `socure_documents_request`

```graphql
socure_documents_request(city: String!, first_name: String!, last_name: String!, region: String!, date_of_birth: String!, country_code: String!, address1: String!, address2: String, postal_code: String!): String
```

Status: untested.


### `save_cftc_questionnaire`

```graphql
save_cftc_questionnaire(has_futures_experience: Boolean, income: String, net_worth: String, occupation: String): Boolean
```

Status: untested.


### `set_responsible_gaming_limit`

```graphql
set_responsible_gaming_limit(identifier: String!, amount: Int!, frequency: String!, limit_scope: String): ResponsibleGamingLimit
```

Status: untested.


### `clear_responsible_gaming_limit`

```graphql
clear_responsible_gaming_limit(identifier: String!, limit_scope: String): Boolean
```

Status: untested.


### `set_user_exclusion`

```graphql
set_user_exclusion(limit_scope: String, num_days: Int): ResponsibleGamingLimit
```

Server description: Sets the user's self exclusion period. nil means indefinitely

Status: untested.


### `claim_promo`

```graphql
claim_promo(location: Location, league_id: Snowflake, promo_id: String!): Boolean
```

Status: untested.


### `claim_promo_v2`

```graphql
claim_promo_v2(promo_id: String!): Promo
```

Status: untested.


### `claim_shared_promo`

```graphql
claim_shared_promo(share_id: Snowflake!, gifter_user_id: Snowflake!): Promo
```

Server description: Claim a shared promo

Status: untested.


### `create_shared_promo`

```graphql
create_shared_promo(promo_id: String!, giftee_user_id: Snowflake): SharedPromo
```

Server description: Create a shared promo

Status: untested.


### `update_referral_promo_code`

```graphql
update_referral_promo_code(promo_id: String!): String
```

Status: untested.


### `tip_user`

```graphql
tip_user(source: String, currency_type: String!, currency_amount: Float!, receiver_user_id: Snowflake!): UserTipTransactionLog
```

Status: untested.


### `tip_message_author`

```graphql
tip_message_author(message_id: Snowflake!, parent_id: Snowflake!, currency_type: String!, currency_amount: Float!): UserTipTransactionLog
```

Status: untested.


### `tip_topic_author`

```graphql
tip_topic_author(topic_id: Snowflake!, channel_id: Snowflake!, currency_type: String!, currency_amount: Float!): UserTipTransactionLog
```

Status: untested.

