# Queries

Every field on `RootQueryType` (240). Signatures come from introspection on 2026-09-09. Examples are real responses through the logged-in browser session, trimmed to the first two list items and 14 keys per object, with user ids, names, avatars and message text redacted. Timings are one sample each, measured inside the page.

Conventions: `Snowflake` is a numeric id as a string. `Map`, `Json`, `List`, `Set` are JSON scalars (no sub-selection allowed). `leg` and `round` both mean NFL week for a regular league. Argument order in the signatures is as the server lists them.

Public reads (`get_league` verified) work with no `authorization` header. User-scoped fields (`me`, `my_*`) return `code: unauthorized` without one.

## Contents

- [League](#league)
- [Rosters and matchups](#rosters-and-matchups)
- [Transactions (trades, waivers, adds)](#transactions-trades-waivers-adds)
- [Drafts](#drafts)
- [Players, news, stats, projections](#players-news-stats-projections)
- [Pick'em pools](#pick-em-pools)
- [DMs and messages](#dms-and-messages)
- [Channels and topics (community feed)](#channels-and-topics-community-feed)
- [Account, friends, social](#account-friends-social)
- [Sleeper Picks, wallet, promos (real-money product)](#sleeper-picks-wallet-promos-real-money-product)
- [League dues](#league-dues)
- [Matchmaking (public league finder)](#matchmaking-public-league-finder)
- [Items, mascots, companies, misc](#items-mascots-companies-misc)

## League

### `get_league`

```graphql
get_league(league_id: Snowflake!): League
```

Server description: List a user's leagues

Notes: Same shape as REST `/v1/league/{id}` plus `is_full`, `last_transaction_id`, `user_playoff_status`, and the full `last_message_attachment` (a processed trade shows up here with `transactions_by_roster`). GraphQL response is `cache-control: private, max-age=0`; REST is CDN cached `s-maxage=300` (measured `age: 165`). Works with no auth token.

Example:

```graphql
{get_league(league_id:"1389357604773322752"){name status metadata is_full settings avatar company_id sport season_type season scoring_settings last_message_id display_order last_author_avatar last_author_display_name last_author_id last_author_is_bot last_message_attachment last_message_text last_message_text_map last_message_time last_pinned_message_id draft_id last_read_id league_id previous_league_id group_id roster_positions total_rosters last_transaction_id matchup_legs user_playoff_status{round placement bracket is_bye playing_for seed_by_roster}}}
```

Result: 85 ms, 4,979 bytes. Trimmed:

```json
{
 "avatar": "<avatar>",
 "company_id": null,
 "display_order": null,
 "draft_id": "1389357604773322753",
 "group_id": null,
 "is_full": true,
 "last_author_avatar": null,
 "last_author_display_name": "<redacted>",
 "last_author_id": "<user_1>",
 "last_author_is_bot": true,
 "last_message_attachment": {
  "data": [
   {
    "poll_id": null,
    "transaction_id": "1400935506820251648",
    "transactions_by_roster": {
     "1": "{...}",
     "3": "{...}"
    },
    "type": "trade"
   }
  ],
  "type": "transactions"
 },
 "last_message_id": "1401849092367233024",
 "last_message_text": "<redacted text>",
 "last_message_text_map": {
  "flairs": {
   "data": [],
   "type": "flair"
  }
 },
 "...": "18 more keys"
}
```


Variant `get_league_pickem`:

```graphql
{get_league_pickem:get_league(league_id:"1399932549756674048"){name status metadata is_full settings avatar company_id sport season_type season scoring_settings last_message_id display_order last_author_avatar last_author_display_name last_author_id last_author_is_bot last_message_attachment last_message_text last_message_text_map last_message_time last_pinned_message_id draft_id last_read_id league_id previous_league_id group_id roster_positions total_rosters last_transaction_id matchup_legs user_playoff_status{round placement bracket is_bye playing_for seed_by_roster}}}
```

Result: 83 ms, 1,725 bytes. Trimmed:

```json
{
 "avatar": "<avatar>",
 "company_id": null,
 "display_order": null,
 "draft_id": null,
 "group_id": null,
 "is_full": false,
 "last_author_avatar": null,
 "last_author_display_name": "<redacted>",
 "last_author_id": "<user_1>",
 "last_author_is_bot": true,
 "last_message_attachment": {
  "data": {
   "avatar": null,
   "display_name": "<redacted>",
   "is_bot": false,
   "real_name": null,
   "user_id": "<user_4>",
   "username": "<redacted>"
  },
  "type": "join_league"
 },
 "last_message_id": "1401081711164440576",
 "last_message_text": "<redacted text>",
 "last_message_text_map": {
  "flairs": {
   "data": [],
   "type": "flair"
  }
 },
 "...": "18 more keys"
}
```



### `my_leagues`

```graphql
my_leagues(sport: String, season_type: String, season: String, exclude_previous: Boolean = true, exclude_archived: Boolean = true): [League]
```

Server description: List a user's leagues

Notes: Defaults `exclude_previous: true, exclude_archived: true`. Returns both fantasy leagues and pick'em pools (a pool has `metadata.current_pickem_leg_id`, `roster_positions: null`). Needs a token.

Example:

```graphql
{my_leagues(sport:"nfl",season_type:"regular",season:"2026"){name status metadata is_full settings avatar company_id sport season_type season scoring_settings last_message_id display_order last_author_avatar last_author_display_name last_author_id last_author_is_bot last_message_attachment last_message_text last_message_text_map last_message_time last_pinned_message_id draft_id last_read_id league_id previous_league_id group_id roster_positions total_rosters last_transaction_id matchup_legs user_playoff_status{round placement bracket is_bye playing_for seed_by_roster}}}
```

Result: 110 ms, 30,646 bytes. Trimmed:

```json
[
 {
  "avatar": null,
  "company_id": null,
  "display_order": 0,
  "draft_id": "1399830849339338752",
  "group_id": null,
  "is_full": null,
  "last_author_avatar": null,
  "last_author_display_name": "<redacted>",
  "last_author_id": "<user_1>",
  "last_author_is_bot": true,
  "last_message_attachment": {
   "data": [
    {
     "poll_id": null,
     "transaction_id": "1400193239872442368",
     "transactions_by_roster": "{...}",
     "type": "free_agent"
    }
   ],
   "type": "transactions"
  },
  "last_message_id": "1400193239985745920",
  "last_message_text": "<redacted text>",
  "last_message_text_map": {
   "flairs": {
    "data": [],
    "type": "flair"
   }
  },
  "...": "18 more keys"
 },
 {
  "avatar": "<avatar>",
  "company_id": null,
  "display_order": 0,
  "draft_id": "1389357604773322753",
  "group_id": null,
  "is_full": null,
  "last_author_avatar": null,
  "last_author_display_name": "<redacted>",
  "last_author_id": "<user_1>",
  "last_author_is_bot": true,
  "last_message_attachment": {
   "data": [
    {
     "poll_id": null,
     "transaction_id": "1400935506820251648",
     "transactions_by_roster": "{...}",
     "type": "trade"
    }
   ],
   "type": "transactions"
  },
  "last_message_id": "1401849092367233024",
  "last_message_text": "<redacted text>",
  "last_message_text_map": {
   "flairs": {
    "data": [],
    "type": "flair"
   }
  },
  "...": "18 more keys"
 }
]
```



### `owned_leagues`

```graphql
owned_leagues(user_id: Snowflake!, sport: String!, season_type: String!, season: String!): [League]
```

Server description: List leagues for which the specified user is a owner(commish)

Example:

```graphql
{owned_leagues(user_id:"1267685386142887936",sport:"nfl",season_type:"regular",season:"2026"){name status metadata is_full settings avatar company_id sport season_type season scoring_settings last_message_id display_order last_author_avatar last_author_display_name last_author_id last_author_is_bot last_message_attachment last_message_text last_message_text_map last_message_time last_pinned_message_id draft_id last_read_id league_id previous_league_id group_id roster_positions total_rosters last_transaction_id matchup_legs user_playoff_status{round placement bracket is_bye playing_for seed_by_roster}}}
```

Result: 79 ms, 3,966 bytes. Trimmed:

```json
[
 {
  "avatar": null,
  "company_id": null,
  "display_order": null,
  "draft_id": "1399830849339338752",
  "group_id": null,
  "is_full": null,
  "last_author_avatar": null,
  "last_author_display_name": "<redacted>",
  "last_author_id": "<user_1>",
  "last_author_is_bot": true,
  "last_message_attachment": {
   "data": [
    {
     "poll_id": null,
     "transaction_id": "1400193239872442368",
     "transactions_by_roster": "{...}",
     "type": "free_agent"
    }
   ],
   "type": "transactions"
  },
  "last_message_id": "1400193239985745920",
  "last_message_text": "<redacted text>",
  "last_message_text_map": {
   "flairs": {
    "data": [],
    "type": "flair"
   }
  },
  "...": "18 more keys"
 }
]
```



### `search_leagues`

```graphql
search_leagues(term: String!): [League]
```

Server description: Search user related items like leagues, leaguemates, dms, and people in dms

Example:

```graphql
{search_leagues(term:"a"){name status metadata is_full settings avatar company_id sport season_type season scoring_settings last_message_id display_order last_author_avatar last_author_display_name last_author_id last_author_is_bot last_message_attachment last_message_text last_message_text_map last_message_time last_pinned_message_id draft_id last_read_id league_id previous_league_id group_id roster_positions total_rosters last_transaction_id matchup_legs user_playoff_status{round placement bracket is_bye playing_for seed_by_roster}}}
```

Result: 87 ms, 2 bytes. Trimmed:

```json
[]
```


Variant `search_leagues_pit`:

```graphql
{search_leagues_pit:search_leagues(term:"Pit"){name status metadata is_full settings avatar company_id sport season_type season scoring_settings last_message_id display_order last_author_avatar last_author_display_name last_author_id last_author_is_bot last_message_attachment last_message_text last_message_text_map last_message_time last_pinned_message_id draft_id last_read_id league_id previous_league_id group_id roster_positions total_rosters last_transaction_id matchup_legs user_playoff_status{round placement bracket is_bye playing_for seed_by_roster}}}
```

Result: 91 ms, 5,012 bytes. Trimmed:

```json
[
 {
  "avatar": "<avatar>",
  "company_id": null,
  "display_order": 0,
  "draft_id": "1389357604773322753",
  "group_id": null,
  "is_full": null,
  "last_author_avatar": null,
  "last_author_display_name": "<redacted>",
  "last_author_id": "<user_1>",
  "last_author_is_bot": true,
  "last_message_attachment": {
   "data": [
    {
     "poll_id": null,
     "transaction_id": "1400935506820251648",
     "transactions_by_roster": "{...}",
     "type": "trade"
    }
   ],
   "type": "transactions"
  },
  "last_message_id": "1401849092367233024",
  "last_message_text": "<redacted text>",
  "last_message_text_map": {
   "flairs": {
    "data": [],
    "type": "flair"
   }
  },
  "...": "18 more keys"
 }
]
```



### `leagues_by_group`

```graphql
leagues_by_group(limit: Int, group_id: Snowflake!): [League]
```

Server description: List leagues by group

Not run: needs an id this account cannot produce (group_id (league has none)).


### `league_groups`

```graphql
league_groups(company_id: Snowflake!, sport: String!, season_type: String!, season: String!): [LeagueGroup]
```

Not run: needs an id this account cannot produce (company_id (companies empty)).


### `league_users`

```graphql
league_users(league_id: Snowflake!): [LeagueUser]
```

Server description: List a league's users

Notes: Same as REST `/league/{id}/users`. `is_owner: true` marks the commissioner.

Example:

```graphql
{league_users(league_id:"1389357604773322752"){metadata is_owner settings user_id avatar display_name is_bot league_id}}
```

Result: 77 ms, 2,900 bytes. Trimmed:

```json
[
 {
  "avatar": "<avatar>",
  "display_name": "<redacted>",
  "is_bot": false,
  "is_owner": false,
  "league_id": "1389357604773322752",
  "metadata": {
   "allow_pn": "on",
   "archived": "off",
   "mention_pn": "on"
  },
  "settings": null,
  "user_id": "<user_5>"
 },
 {
  "avatar": "<avatar>",
  "display_name": "<redacted>",
  "is_bot": false,
  "is_owner": true,
  "league_id": "1389357604773322752",
  "metadata": {
   "allow_pn": "on",
   "avatar": "<avatar>",
   "mention_pn": "on",
   "team_name": "Cloud Nine"
  },
  "settings": null,
  "user_id": "<user_2>"
 },
 "... 6 more"
]
```


Variant `league_users_pickem`:

```graphql
{league_users_pickem:league_users(league_id:"1399932549756674048"){metadata is_owner settings user_id avatar display_name is_bot league_id}}
```

Result: 68 ms, 2,498 bytes. Trimmed:

```json
[
 {
  "avatar": "<avatar>",
  "display_name": "<redacted>",
  "is_bot": false,
  "is_owner": null,
  "league_id": "1399932549756674048",
  "metadata": {
   "allow_pn": "on",
   "mention_pn": "on"
  },
  "settings": null,
  "user_id": "<user_11>"
 },
 {
  "avatar": "<avatar>",
  "display_name": "<redacted>",
  "is_bot": false,
  "is_owner": null,
  "league_id": "1399932549756674048",
  "metadata": {
   "allow_pn": "on",
   "mention_pn": "on"
  },
  "settings": null,
  "user_id": "<user_2>"
 },
 "... 8 more"
]
```



### `league_user`

```graphql
league_user(league_id: Snowflake!): LeagueUser
```

Server description: Fetch a league user

Notes: The calling user's membership record in this league (metadata holds push settings).

Example:

```graphql
{league_user(league_id:"1389357604773322752"){metadata is_owner settings user_id avatar display_name is_bot league_id}}
```

Result: 61 ms, 371 bytes. Trimmed:

```json
{
 "avatar": "<avatar>",
 "display_name": "<redacted>",
 "is_bot": false,
 "is_owner": false,
 "league_id": "1389357604773322752",
 "metadata": {
  "allow_pn": "on",
  "avatar": "<avatar>",
  "mention_pn": "on",
  "team_name": "--dangerously-skip-perms"
 },
 "settings": null,
 "user_id": "<user_3>"
}
```



### `league_user_by_user`

```graphql
league_user_by_user(sport: String!, season_type: String!, season: String!): [LeagueUser]
```

Server description: Fetch league_user objects by user

Notes: Every league membership for the caller in one sport/season. Cheap way to list league ids.

Example:

```graphql
{league_user_by_user(sport:"nfl",season_type:"regular",season:"2026"){metadata is_owner settings user_id avatar display_name is_bot league_id}}
```

Result: 76 ms, 627 bytes. Trimmed:

```json
[
 {
  "avatar": "<avatar>",
  "display_name": "<redacted>",
  "is_bot": false,
  "is_owner": false,
  "league_id": "1389357604773322752",
  "metadata": {
   "allow_pn": "on",
   "avatar": "<avatar>",
   "mention_pn": "on",
   "team_name": "--dangerously-skip-perms"
  },
  "settings": null,
  "user_id": "<user_3>"
 },
 {
  "avatar": "<avatar>",
  "display_name": "<redacted>",
  "is_bot": false,
  "is_owner": true,
  "league_id": "1399830848848592896",
  "metadata": {
   "allow_pn": "on",
   "mention_pn": "on"
  },
  "settings": null,
  "user_id": "<user_3>"
 }
]
```



### `league_users_metadata`

```graphql
league_users_metadata(league_id: Snowflake!): [Map]
```

Server description: Get all permanent metadata for users within a single league

Notes: Per-user permanent metadata (`allow_pn`, `mention_pn`, team name if set).

Example:

```graphql
{league_users_metadata(league_id:"1389357604773322752")}
```

Result: 81 ms, 890 bytes. Trimmed:

```json
[
 {
  "metadata": {
   "flairs": [
    {
     "sport": "nfl",
     "subject_id": "DET",
     "subject_type": "team"
    },
    {
     "sport": "cfb",
     "subject_id": "MICH",
     "subject_type": "team"
    },
    "... 1 more"
   ]
  },
  "user_id": "<user_5>"
 },
 {
  "metadata": {},
  "user_id": "<user_2>"
 },
 "... 6 more"
]
```



### `league_players`

```graphql
league_players(league_id: Snowflake!): [LeaguePlayer]
```

Server description: List league players who have metadata

Notes: League-scoped per-player metadata: trade block flags, notes, likes. Returned 21 KB for an 8-team league; each entry has `player_id`, `metadata`, `settings`.

Example:

```graphql
{league_players(league_id:"1389357604773322752"){metadata settings player_id league_id}}
```

Result: 89 ms, 21,345 bytes. Trimmed:

```json
[
 {
  "league_id": "1389357604773322752",
  "metadata": null,
  "player_id": "0",
  "settings": null
 },
 {
  "league_id": "1389357604773322752",
  "metadata": null,
  "player_id": "10213",
  "settings": null
 },
 "... 218 more"
]
```



### `league_note`

```graphql
league_note(league_id: Snowflake!): LeagueNote
```

Server description: Get league note

Notes: Commissioner note. `text` null when unset.

Example:

```graphql
{league_note(league_id:"1389357604773322752"){type text text_map updated_at league_id}}
```

Result: 79 ms, 117 bytes. Trimmed:

```json
{
 "league_id": "1389357604773322752",
 "text": null,
 "text_map": null,
 "type": "commissioner_note",
 "updated_at": null
}
```



### `league_event_logs`

```graphql
league_event_logs(limit: Int, league_id: Snowflake!, before_log_id: Snowflake, event_types: [String]): [LeagueEventLog]
```

Server description: Get event logs for a league

Notes: Audit log of settings changes with old/new values and who made them. Pagination: `before_log_id` plus `limit`; filter with `event_types` (observed `league_settings_updated`, `scoring_settings_updated`). Nothing here exposes this in REST.

Example:

```graphql
{league_event_logs(league_id:"1389357604773322752",limit:5){data created event_type league_id log_id}}
```

Result: 118 ms, 582 bytes. Trimmed:

```json
[
 {
  "created": 1788372058319,
  "data": {
   "user_id": "<user_2>",
   "changes": {
    "veto_auto_poll": {
     "new": 1,
     "old": 0
    }
   },
   "usernames": {
    "<user_2>": "<redacted>"
   }
  },
  "event_type": "league_settings_updated",
  "league_id": "1389357604773322752",
  "log_id": "1400937587484430336"
 },
 {
  "created": 1786825604579,
  "data": {
   "user_id": "<user_2>",
   "changes": {
    "fgmiss_50p": {
     "new": 0.5,
     "old": null
    }
   },
   "usernames": {
    "<user_2>": "<redacted>"
   }
  },
  "event_type": "scoring_settings_updated",
  "league_id": "1389357604773322752",
  "log_id": "1394451290376916992"
 }
]
```


Variant `event_logs_before`:

```graphql
{event_logs_before:league_event_logs(league_id:"1389357604773322752",before_log_id:"1400937587484430336",limit:1){data created event_type league_id log_id}}
```

Result: 73 ms, 292 bytes. Trimmed:

```json
[
 {
  "created": 1786825604579,
  "data": {
   "user_id": "<user_2>",
   "changes": {
    "fgmiss_50p": {
     "new": 0.5,
     "old": null
    }
   },
   "usernames": {
    "<user_2>": "<redacted>"
   }
  },
  "event_type": "scoring_settings_updated",
  "league_id": "1389357604773322752",
  "log_id": "1394451290376916992"
 }
]
```


Variant `event_logs_typed`:

```graphql
{event_logs_typed:league_event_logs(league_id:"1389357604773322752",event_types:["scoring_settings_updated"]){data created event_type league_id log_id}}
```

Result: 90 ms, 292 bytes. Trimmed:

```json
[
 {
  "created": 1786825604579,
  "data": {
   "user_id": "<user_2>",
   "changes": {
    "fgmiss_50p": {
     "new": 0.5,
     "old": null
    }
   },
   "usernames": {
    "<user_2>": "<redacted>"
   }
  },
  "event_type": "scoring_settings_updated",
  "league_id": "1389357604773322752",
  "log_id": "1394451290376916992"
 }
]
```



### `league_playoff_bracket`

```graphql
league_playoff_bracket(league_id: Snowflake!): [Map]
```

Server description: Get a bracket

Notes: Same shape as REST `/league/{id}/winners_bracket` (list of `{r, m, t1, t2, w, l, p, t1_from, t2_from}`). Empty list until brackets exist; the previous season's league returned the full bracket.

Example:

```graphql
{league_playoff_bracket(league_id:"1267682977899364352")}
```

Result: 91 ms, 308 bytes. Trimmed:

```json
[
 {
  "m": 1,
  "r": 1,
  "l": 4,
  "w": 8,
  "t1": 8,
  "t2": 4
 },
 {
  "m": 2,
  "r": 1,
  "l": 5,
  "w": 3,
  "t1": 3,
  "t2": 5
 },
 "... 2 more"
]
```



### `league_playoff_loser_bracket`

```graphql
league_playoff_loser_bracket(league_id: Snowflake!): [Map]
```

Server description: Get a loser bracket

Notes: Same as REST `/losers_bracket`.

Example:

```graphql
{league_playoff_loser_bracket(league_id:"1267682977899364352")}
```

Result: 76 ms, 308 bytes. Trimmed:

```json
[
 {
  "m": 1,
  "r": 1,
  "l": 1,
  "w": 2,
  "t1": 2,
  "t2": 1
 },
 {
  "m": 2,
  "r": 1,
  "l": 7,
  "w": 6,
  "t1": 6,
  "t2": 7
 },
 "... 2 more"
]
```



### `get_league_manual_history`

```graphql
get_league_manual_history(league_id: Snowflake!): [LeagueManualHistory]
```

Server description: Get manual league history

Example:

```graphql
{get_league_manual_history(league_id:"1389357604773322752"){season league_notes import_data season_standings top_standings}}
```

Result: 77 ms, 4 bytes. Trimmed:

```json
null
```



### `roster_standings`

```graphql
roster_standings(round: Int!, league_id: Snowflake!): [RosterStanding]
```

Server description: Get roster standings for league and round

Notes: Per-roster record through a given round: `wins`, `losses`, `points`, `points_against`, `rank`, `record` (string like `WWWLWL`). Empty before the first game. Verified on the 2025 league at round 14.

Example:

```graphql
{roster_standings(league_id:"1389357604773322752",round:1){round record wins points league_id roster_id correct_picks total_picks rank correct_bans losses points_against ties total_bans}}
```

Result: 69 ms, 2 bytes. Trimmed:

```json
[]
```


Variant `roster_standings_prev`:

```graphql
{roster_standings_prev:roster_standings(league_id:"1267682977899364352",round:14){round record wins points league_id roster_id correct_picks total_picks rank correct_bans losses points_against ties total_bans}}
```

Result: 70 ms, 2,351 bytes. Trimmed:

```json
[
 {
  "correct_bans": null,
  "correct_picks": null,
  "league_id": "1267682977899364352",
  "losses": 3,
  "points": 2041.260009765625,
  "points_against": 1743.5799560546875,
  "rank": 1,
  "record": "WWWLWLWWWWWWWL",
  "roster_id": 8,
  "round": 14,
  "ties": 0,
  "total_bans": null,
  "total_picks": null,
  "wins": 11
 },
 {
  "correct_bans": null,
  "correct_picks": null,
  "league_id": "1267682977899364352",
  "losses": 4,
  "points": 1970.8800048828125,
  "points_against": 1807.56005859375,
  "rank": 2,
  "record": "WLWWLWWWLWWWWL",
  "roster_id": 3,
  "round": 14,
  "ties": 0,
  "total_bans": null,
  "total_picks": null,
  "wins": 10
 },
 "... 6 more"
]
```



### `is_subscribed`

```graphql
is_subscribed(type_id: Snowflake!): Boolean
```

Server description: Is user subscribed to this ID?

Example:

```graphql
{is_subscribed(type_id:"1389357604773322752")}
```

Result: 94 ms, 5 bytes. Trimmed:

```json
false
```



### `preferences_for_type_id`

```graphql
preferences_for_type_id(type_id: Snowflake!): [Preference]
```

Server description: Preferences for User / Channel / League

Example:

```graphql
{preferences_for_type_id(type_id:"1389357604773322752"){name value type_id}}
```

Result: 71 ms, 2 bytes. Trimmed:

```json
[]
```



### `roles_by_type`

```graphql
roles_by_type(type_id: Snowflake!): [Role]
```

Server description: Get all roles for a given channel or league

Notes: Works for channels (returned Moderator role with permission list). For a league id it errors `Failed to retrieve roles`.

Example:

```graphql
{roles_by_type(type_id:"1389357604773322752"){name permissions type_id role_id is_default is_admin role_order}}
```

Result: error after 78 ms: `Failed to retrieve roles given the type_id 1389357604773322752`


Variant `roles_by_type_nfl`:

```graphql
{roles_by_type_nfl:roles_by_type(type_id:"250000000000000000"){name permissions type_id role_id is_default is_admin role_order}}
```

Result: 83 ms, 2,525 bytes. Trimmed:

```json
[
 {
  "is_admin": null,
  "is_default": null,
  "name": "Moderator",
  "permissions": [
   "member_ban",
   "member_invite",
   "... 12 more"
  ],
  "role_id": "250000000000000077",
  "role_order": 3,
  "type_id": "250000000000000000"
 },
 {
  "is_admin": null,
  "is_default": null,
  "name": "Analyst",
  "permissions": [
   "member_invite",
   "message_attach",
   "... 11 more"
  ],
  "role_id": "250000000000000078",
  "role_order": 4,
  "type_id": "250000000000000000"
 },
 "... 6 more"
]
```



### `user_roles_for_type`

```graphql
user_roles_for_type(user_id: Snowflake, type_id: Snowflake!): [Role]
```

Server description: All roles for a user given a channel / league / group

Notes: For a league id it errors with `We could find channel with channel_id ...`; it is channel-only.

Example:

```graphql
{user_roles_for_type(type_id:"1389357604773322752"){name permissions type_id role_id is_default is_admin role_order}}
```

Result: error after 74 ms: `We could find channel with channel_id 1389357604773322752`


Variant `user_roles_nfl`:

```graphql
{user_roles_nfl:user_roles_for_type(type_id:"250000000000000000"){name permissions type_id role_id is_default is_admin role_order}}
```

Result: 86 ms, 2 bytes. Trimmed:

```json
[]
```



### `codes_by_type`

```graphql
codes_by_type(type: String!, type_id: Snowflake!): [Code]
```

Server description: Codes by channel, league, or user_id

Notes: `type: league` and `type: user` both error `we don't recognize this type`; `type: channel` on the NFL channel timed out (30 s). Valid type strings not found.

Example:

```graphql
{codes_by_type(type:"league",type_id:"1389357604773322752"){code type metadata expires_at type_id uses_remaining}}
```

Result: error after 69 ms: `Sorry, we don't recognize this type`


Variant `codes_by_type_channel`:

```graphql
{codes_by_type_channel:codes_by_type(type:"channel",type_id:"250000000000000000"){code type metadata expires_at type_id uses_remaining}}
```

Result: error after 30001 ms: `TimeoutError: The operation timed out.`


Variant `codes_by_type_user`:

```graphql
{codes_by_type_user:codes_by_type(type:"user",type_id:"1267685386142887936"){code type metadata expires_at type_id uses_remaining}}
```

Result: error after 80 ms: `Sorry, we don't recognize this type`



### `get_code`

```graphql
get_code(code: String!): Code
```

Server description: Code

Not run: needs an id this account cannot produce (an invite code).


### `read_receipts`

```graphql
read_receipts(parent_type: String!, parent_id: Snowflake!): [ReadReceipt]
```

Server description: List read receipts for any DM, League, or Draft (doesn't work for channels/topics as they are partitioned differently)

Notes: Who has read up to which message in a league chat or DM (`parent_type: league|dm`). Useful to tell if a rival has seen your offer message.

Example:

```graphql
{read_receipts(parent_type:"league",parent_id:"1389357604773322752"){parent_type user_id parent_id last_read_id}}
```

Result: 75 ms, 1,088 bytes. Trimmed:

```json
[
 {
  "last_read_id": "1401849092367233024",
  "parent_id": "1389357604773322752",
  "parent_type": "league",
  "user_id": "<user_5>"
 },
 {
  "last_read_id": "1401849092367233024",
  "parent_id": "1389357604773322752",
  "parent_type": "league",
  "user_id": "<user_2>"
 },
 "... 6 more"
]
```


Variant `read_receipts_dm`:

```graphql
{read_receipts_dm:read_receipts(parent_type:"dm",parent_id:"1403496316385988608"){parent_type user_id parent_id last_read_id}}
```

Result: 73 ms, 264 bytes. Trimmed:

```json
[
 {
  "last_read_id": "1403514558420619264",
  "parent_id": "1403496316385988608",
  "parent_type": "dm",
  "user_id": "<user_5>"
 },
 {
  "last_read_id": "1403500870234103808",
  "parent_id": "1403496316385988608",
  "parent_type": "dm",
  "user_id": "<user_3>"
 }
]
```



### `events`

```graphql
events(parent_type: String!, parent_id: Snowflake!): [Event]
```

Notes: League events (voice lounge etc). Empty for this league.

Example:

```graphql
{events(parent_type:"league",parent_id:"1389357604773322752"){name started description start_time parent_type bucket end_time event_id parent_id}}
```

Result: 61 ms, 2 bytes. Trimmed:

```json
[]
```



### `event_queue_count`

```graphql
event_queue_count(event_id: Snowflake!): Int
```

Not run: needs an id this account cannot produce (event_id (events empty)).


### `metadata`

```graphql
metadata(type: String!, key: String!): Metadata
```

Notes: Both `type: nfl, key: schedule` and `type: league, key: <league_id>` returned `key_not_found`. Valid keys not found.

Example:

```graphql
{metadata(type:"nfl",key:"schedule"){data type key created last_updated}}
```

Result: error after 62 ms: `key_not_found We could not find the metadata based on the key you provided.`


Variant `metadata_league`:

```graphql
{metadata_league:metadata(type:"league",key:"1389357604773322752"){data type key created last_updated}}
```

Result: error after 84 ms: `key_not_found We could not find the metadata based on the key you provided.`



## Rosters and matchups

### `league_rosters`

```graphql
league_rosters(league_id: Snowflake!): [Roster]
```

Server description: List rosters in a league

Notes: Same fields as REST `/league/{id}/rosters` plus `player_map` (a mini player record per rostered player with `injury_status`, `team`, `news_updated`) and `keepers`, `taxi`, `co_owners`. Bodies matched REST exactly at capture time (`players`, `starters`, `reserve`, `settings`). GraphQL is uncached (`cache-control: private`), REST had `age: 226` on `s-maxage=300`.

Example:

```graphql
{league_rosters(league_id:"1389357604773322752"){metadata settings players keepers league_id roster_id owner_id starters player_map co_owners reserve taxi}}
```

Result: 132 ms, 42,664 bytes. Trimmed:

```json
[
 {
  "co_owners": null,
  "keepers": null,
  "league_id": "1389357604773322752",
  "metadata": null,
  "owner_id": "<user_2>",
  "player_map": {
   "2747": {
    "position": "K",
    "status": "Active",
    "number": 5,
    "first_name": "Jason",
    "last_name": "Myers",
    "sport": "nfl",
    "team": "SEA",
    "player_id": "2747",
    "fantasy_positions": [
     "K"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 11,
    "news_updated": 1788906320902
   },
   "4983": {
    "position": "WR",
    "status": "Active",
    "number": 2,
    "first_name": "DJ",
    "last_name": "Moore",
    "sport": "nfl",
    "team": "BUF",
    "player_id": "4983",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 8,
    "news_updated": 1788880849707
   },
   "5859": {
    "position": "WR",
    "status": "Active",
    "number": 1,
    "first_name": "A.J.",
    "last_name": "Brown",
    "sport": "nfl",
    "team": "NE",
    "player_id": "5859",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 7,
    "news_updated": 1788932723019
   },
   "6790": {
    "position": "RB",
    "status": "Active",
    "number": 4,
    "first_name": "D'Andre",
    "last_name": "Swift",
    "sport": "nfl",
    "team": "CHI",
    "player_id": "6790",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 6,
    "news_updated": 1788985846406
   },
   "7564": {
    "position": "WR",
    "status": "Active",
    "number": 1,
    "first_name": "Ja'Marr",
    "last_name": "Chase",
    "sport": "nfl",
    "team": "CIN",
    "player_id": "7564",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 5,
    "news_updated": 1788987346505
   },
   "7588": {
    "position": "RB",
    "status": "Active",
    "number": 33,
    "first_name": "Javonte",
    "last_name": "Williams",
    "sport": "nfl",
    "team": "DAL",
    "player_id": "7588",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 5,
    "news_updated": 1788561023166
   },
   "8144": {
    "position": "WR",
    "status": "Active",
    "number": 12,
    "first_name": "Chris",
    "last_name": "Olave",
    "sport": "nfl",
    "team": "NO",
    "player_id": "8144",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 4,
    "news_updated": 1788560723476
   },
   "9484": {
    "position": "TE",
    "status": "Active",
    "number": 85,
    "first_name": "Tucker",
    "last_name": "Kraft",
    "sport": "nfl",
    "team": "GB",
    "player_id": "9484",
    "fantasy_positions": [
     "TE"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": "Questionable",
    "years_exp": 3,
    "news_updated": 1788976234850
   },
   "9487": {
    "position": "WR",
    "status": "Active",
    "number": 11,
    "first_name": "Parker",
    "last_name": "Washington",
    "sport": "nfl",
    "team": "JAX",
    "player_id": "9487",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 3,
    "news_updated": 1788981045275
   },
   "11560": {
    "position": "QB",
    "status": "Active",
    "number": 18,
    "first_name": "Caleb",
    "last_name": "Williams",
    "sport": "nfl",
    "team": "CHI",
    "player_id": "11560",
    "fantasy_positions": [
     "QB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 2,
    "news_updated": 1788480915807
   },
   "12506": {
    "position": "TE",
    "status": "Active",
    "number": 44,
    "first_name": "Harold",
    "last_name": "Fannin",
    "sport": "nfl",
    "team": "CLE",
    "player_id": "12506",
    "fantasy_positions": [
     "TE"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 1,
    "news_updated": 1788706530649
   },
   "12507": {
    "position": "RB",
    "status": "Active",
    "number": 8,
    "first_name": "Omarion",
    "last_name": "Hampton",
    "sport": "nfl",
    "team": "LAC",
    "player_id": "12507",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 1,
    "news_updated": 1788450605412
   },
   "12512": {
    "position": "RB",
    "status": "Active",
    "number": 10,
    "first_name": "Quinshon",
    "last_name": "Judkins",
    "sport": "nfl",
    "team": "CLE",
    "player_id": "12512",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 1,
    "news_updated": 1788449105184
   },
   "12519": {
    "position": "WR",
    "status": "Active",
    "number": 10,
    "first_name": "Luther",
    "last_name": "Burden",
    "sport": "nfl",
    "team": "CHI",
    "player_id": "12519",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 1,
    "news_updated": 1788986446475
   },
   "...": "2 more keys"
  },
  "players": [
   "11560",
   "12507",
   "... 14 more"
  ],
  "reserve": null,
  "roster_id": 1,
  "settings": {
   "fpts": 0,
   "fpts_decimal": 0,
   "losses": 0,
   "ties": 0,
   "total_moves": 0,
   "waiver_budget_used": 0,
   "waiver_position": 6,
   "wins": 0
  },
  "starters": [
   "11560",
   "12507",
   "... 8 more"
  ],
  "taxi": null
 },
 {
  "co_owners": null,
  "keepers": null,
  "league_id": "1389357604773322752",
  "metadata": null,
  "owner_id": "<user_7>",
  "player_map": {
   "3451": {
    "position": "K",
    "status": "Active",
    "number": 15,
    "first_name": "Ka'imi",
    "last_name": "Fairbairn",
    "sport": "nfl",
    "team": "HOU",
    "player_id": "3451",
    "fantasy_positions": [
     "K"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 10,
    "news_updated": 1787986543802
   },
   "4046": {
    "position": "QB",
    "status": "Active",
    "number": 15,
    "first_name": "Patrick",
    "last_name": "Mahomes",
    "sport": "nfl",
    "team": "KC",
    "player_id": "4046",
    "fantasy_positions": [
     "QB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": "Questionable",
    "years_exp": 9,
    "news_updated": 1788889550651
   },
   "4217": {
    "position": "TE",
    "status": "Active",
    "number": 85,
    "first_name": "George",
    "last_name": "Kittle",
    "sport": "nfl",
    "team": "SF",
    "player_id": "4217",
    "fantasy_positions": [
     "TE"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": "Questionable",
    "years_exp": 9,
    "news_updated": 1788974134120
   },
   "5045": {
    "position": "WR",
    "status": "Active",
    "number": 14,
    "first_name": "Courtland",
    "last_name": "Sutton",
    "sport": "nfl",
    "team": "DEN",
    "player_id": "5045",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 8,
    "news_updated": 1788530120390
   },
   "5850": {
    "position": "RB",
    "status": "Active",
    "number": 8,
    "first_name": "Josh",
    "last_name": "Jacobs",
    "sport": "nfl",
    "team": "GB",
    "player_id": "5850",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": "NA",
    "years_exp": 7,
    "news_updated": 1788975934438
   },
   "7021": {
    "position": "RB",
    "status": "Active",
    "number": 13,
    "first_name": "Rico",
    "last_name": "Dowdle",
    "sport": "nfl",
    "team": "PIT",
    "player_id": "7021",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 6,
    "news_updated": 1788887150299
   },
   "7523": {
    "position": "QB",
    "status": "Active",
    "number": 16,
    "first_name": "Trevor",
    "last_name": "Lawrence",
    "sport": "nfl",
    "team": "JAX",
    "player_id": "7523",
    "fantasy_positions": [
     "QB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 5,
    "news_updated": 1788493216806
   },
   "8150": {
    "position": "RB",
    "status": "Active",
    "number": 23,
    "first_name": "Kyren",
    "last_name": "Williams",
    "sport": "nfl",
    "team": "LAR",
    "player_id": "8150",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 4,
    "news_updated": 1788614116896
   },
   "8155": {
    "position": "RB",
    "status": "Active",
    "number": 20,
    "first_name": "Breece",
    "last_name": "Hall",
    "sport": "nfl",
    "team": "NYJ",
    "player_id": "8155",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 4,
    "news_updated": 1788985847561
   },
   "9221": {
    "position": "RB",
    "status": "Active",
    "number": 0,
    "first_name": "Jahmyr",
    "last_name": "Gibbs",
    "sport": "nfl",
    "team": "DET",
    "player_id": "9221",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 3,
    "news_updated": 1788579313547
   },
   "9754": {
    "position": "WR",
    "status": "Active",
    "number": 1,
    "first_name": "Quentin",
    "last_name": "Johnston",
    "sport": "nfl",
    "team": "LAC",
    "player_id": "9754",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 3,
    "news_updated": 1788553522367
   },
   "9997": {
    "position": "WR",
    "status": "Active",
    "number": 4,
    "first_name": "Zay",
    "last_name": "Flowers",
    "sport": "nfl",
    "team": "BAL",
    "player_id": "9997",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": "Questionable",
    "years_exp": 3,
    "news_updated": 1788987946526
   },
   "10229": {
    "position": "WR",
    "status": "Active",
    "number": 4,
    "first_name": "Rashee",
    "last_name": "Rice",
    "sport": "nfl",
    "team": "KC",
    "player_id": "10229",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 3,
    "news_updated": 1788574524467
   },
   "12517": {
    "position": "TE",
    "status": "Active",
    "number": 84,
    "first_name": "Colston",
    "last_name": "Loveland",
    "sport": "nfl",
    "team": "CHI",
    "player_id": "12517",
    "fantasy_positions": [
     "TE"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 1,
    "news_updated": 1788576924712
   },
   "...": "2 more keys"
  },
  "players": [
   "4046",
   "7523",
   "... 14 more"
  ],
  "reserve": null,
  "roster_id": 2,
  "settings": {
   "fpts": 0,
   "fpts_decimal": 0,
   "losses": 0,
   "ties": 0,
   "total_moves": 0,
   "waiver_budget_used": 0,
   "waiver_position": 8,
   "wins": 0
  },
  "starters": [
   "7523",
   "9221",
   "... 8 more"
  ],
  "taxi": null
 },
 "... 6 more"
]
```


Variant `league_rosters_pickem`:

```graphql
{league_rosters_pickem:league_rosters(league_id:"1399932549756674048"){metadata settings players keepers league_id roster_id owner_id starters player_map co_owners reserve taxi}}
```

Result: 70 ms, 2,470 bytes. Trimmed:

```json
[
 {
  "co_owners": null,
  "keepers": null,
  "league_id": "1399932549756674048",
  "metadata": null,
  "owner_id": "<user_8>",
  "player_map": null,
  "players": null,
  "reserve": null,
  "roster_id": 1,
  "settings": null,
  "starters": null,
  "taxi": null
 },
 {
  "co_owners": null,
  "keepers": null,
  "league_id": "1399932549756674048",
  "metadata": null,
  "owner_id": "<user_2>",
  "player_map": null,
  "players": null,
  "reserve": null,
  "roster_id": 2,
  "settings": null,
  "starters": null,
  "taxi": null
 },
 "... 8 more"
]
```



### `rosters_by_user`

```graphql
rosters_by_user(user_id: Snowflake!, sport: String!, season_type: String!, season: String!): [Roster]
```

Server description: List rosters owned by a user

Notes: All of a user's rosters across leagues for a sport/season, with `player_map`. Includes the pick'em pool roster (empty players).

Example:

```graphql
{rosters_by_user(user_id:"1267685386142887936",sport:"nfl",season_type:"regular",season:"2026"){metadata settings players keepers league_id roster_id owner_id starters player_map co_owners reserve taxi}}
```

Result: 81 ms, 10,852 bytes. Trimmed:

```json
[
 {
  "co_owners": null,
  "keepers": null,
  "league_id": "1399830848848592896",
  "metadata": {
   "league_avatar": null,
   "league_description": "8-Team PPR  League",
   "league_name": "coach-staging DO NOT USE"
  },
  "owner_id": "<user_3>",
  "player_map": {
   "3163": {
    "position": "QB",
    "status": "Active",
    "number": 16,
    "first_name": "Jared",
    "last_name": "Goff",
    "sport": "nfl",
    "team": "DET",
    "player_id": "3163",
    "fantasy_positions": [
     "QB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 10,
    "news_updated": 1788573024252
   },
   "3198": {
    "position": "RB",
    "status": "Active",
    "number": 22,
    "first_name": "Derrick",
    "last_name": "Henry",
    "sport": "nfl",
    "team": "BAL",
    "player_id": "3198",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 10,
    "news_updated": 1788530120390
   },
   "4227": {
    "position": "K",
    "status": "Active",
    "number": 7,
    "first_name": "Harrison",
    "last_name": "Butker",
    "sport": "nfl",
    "team": "KC",
    "player_id": "4227",
    "fantasy_positions": [
     "K"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 9,
    "news_updated": 1784822422465
   },
   "5892": {
    "position": "RB",
    "status": "Active",
    "number": 32,
    "first_name": "David",
    "last_name": "Montgomery",
    "sport": "nfl",
    "team": "HOU",
    "player_id": "5892",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 7,
    "news_updated": 1788545721912
   },
   "7569": {
    "position": "WR",
    "status": "Active",
    "number": 12,
    "first_name": "Nico",
    "last_name": "Collins",
    "sport": "nfl",
    "team": "HOU",
    "player_id": "7569",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 5,
    "news_updated": 1788531320658
   },
   "7611": {
    "position": "RB",
    "status": "Active",
    "number": 38,
    "first_name": "Rhamondre",
    "last_name": "Stevenson",
    "sport": "nfl",
    "team": "NE",
    "player_id": "7611",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 5,
    "news_updated": 1788961225922
   },
   "8144": {
    "position": "WR",
    "status": "Active",
    "number": 12,
    "first_name": "Chris",
    "last_name": "Olave",
    "sport": "nfl",
    "team": "NO",
    "player_id": "8144",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 4,
    "news_updated": 1788560723476
   },
   "8146": {
    "position": "WR",
    "status": "Active",
    "number": 5,
    "first_name": "Garrett",
    "last_name": "Wilson",
    "sport": "nfl",
    "team": "NYJ",
    "player_id": "8146",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 4,
    "news_updated": 1788464106858
   },
   "8183": {
    "position": "QB",
    "status": "Active",
    "number": 13,
    "first_name": "Brock",
    "last_name": "Purdy",
    "sport": "nfl",
    "team": "SF",
    "player_id": "8183",
    "fantasy_positions": [
     "QB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 4,
    "news_updated": 1788701730242
   },
   "9221": {
    "position": "RB",
    "status": "Active",
    "number": 0,
    "first_name": "Jahmyr",
    "last_name": "Gibbs",
    "sport": "nfl",
    "team": "DET",
    "player_id": "9221",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 3,
    "news_updated": 1788579313547
   },
   "9500": {
    "position": "WR",
    "status": "Active",
    "number": 2,
    "first_name": "Josh",
    "last_name": "Downs",
    "sport": "nfl",
    "team": "IND",
    "player_id": "9500",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 3,
    "news_updated": 1788614716987
   },
   "10222": {
    "position": "WR",
    "status": "Active",
    "number": 11,
    "first_name": "Jayden",
    "last_name": "Reed",
    "sport": "nfl",
    "team": "GB",
    "player_id": "10222",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 3,
    "news_updated": 1788494716945
   },
   "11566": {
    "position": "QB",
    "status": "Active",
    "number": 5,
    "first_name": "Jayden",
    "last_name": "Daniels",
    "sport": "nfl",
    "team": "WAS",
    "player_id": "11566",
    "fantasy_positions": [
     "QB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 2,
    "news_updated": 1788542722026
   },
   "12490": {
    "position": "RB",
    "status": "Active",
    "number": 33,
    "first_name": "Bhayshul",
    "last_name": "Tuten",
    "sport": "nfl",
    "team": "JAX",
    "player_id": "12490",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 1,
    "news_updated": 1788988246606
   },
   "...": "2 more keys"
  },
  "players": [
   "10222",
   "11566",
   "... 14 more"
  ],
  "reserve": null,
  "roster_id": 1,
  "settings": {
   "fpts": 0,
   "fpts_decimal": 0,
   "losses": 0,
   "ties": 0,
   "total_moves": 0,
   "waiver_budget_used": 0,
   "waiver_position": 8,
   "wins": 0
  },
  "starters": [
   "11566",
   "9221",
   "... 8 more"
  ],
  "taxi": null
 },
 {
  "co_owners": null,
  "keepers": null,
  "league_id": "1389357604773322752",
  "metadata": {
   "league_avatar": "<avatar>",
   "league_description": "8-Team PPR  League",
   "league_name": "Pit Podcast powered by BAA"
  },
  "owner_id": "<user_3>",
  "player_map": {
   "2216": {
    "position": "WR",
    "status": "Active",
    "number": 5,
    "first_name": "Mike",
    "last_name": "Evans",
    "sport": "nfl",
    "team": "SF",
    "player_id": "2216",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 12,
    "news_updated": 1788912921433
   },
   "3294": {
    "position": "QB",
    "status": "Active",
    "number": 4,
    "first_name": "Dak",
    "last_name": "Prescott",
    "sport": "nfl",
    "team": "DAL",
    "player_id": "3294",
    "fantasy_positions": [
     "QB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 10,
    "news_updated": 1788467707202
   },
   "4034": {
    "position": "RB",
    "status": "Active",
    "number": 23,
    "first_name": "Christian",
    "last_name": "McCaffrey",
    "sport": "nfl",
    "team": "SF",
    "player_id": "4034",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 9,
    "news_updated": 1788914121512
   },
   "5012": {
    "position": "TE",
    "status": "Active",
    "number": 89,
    "first_name": "Mark",
    "last_name": "Andrews",
    "sport": "nfl",
    "team": "BAL",
    "player_id": "5012",
    "fantasy_positions": [
     "TE"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 8,
    "news_updated": 1788552322233
   },
   "5846": {
    "position": "WR",
    "status": "Active",
    "number": 4,
    "first_name": "DK",
    "last_name": "Metcalf",
    "sport": "nfl",
    "team": "PIT",
    "player_id": "5846",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 7,
    "news_updated": 1788806742940
   },
   "6904": {
    "position": "QB",
    "status": "Active",
    "number": 1,
    "first_name": "Jalen",
    "last_name": "Hurts",
    "sport": "nfl",
    "team": "PHI",
    "player_id": "6904",
    "fantasy_positions": [
     "QB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 6,
    "news_updated": 1788557122735
   },
   "7525": {
    "position": "WR",
    "status": "Active",
    "number": 6,
    "first_name": "DeVonta",
    "last_name": "Smith",
    "sport": "nfl",
    "team": "PHI",
    "player_id": "7525",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 5,
    "news_updated": 1788554423238
   },
   "7543": {
    "position": "RB",
    "status": "Active",
    "number": 3,
    "first_name": "Travis",
    "last_name": "Etienne",
    "sport": "nfl",
    "team": "NO",
    "player_id": "7543",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 5,
    "news_updated": 1788535525515
   },
   "7569": {
    "position": "WR",
    "status": "Active",
    "number": 12,
    "first_name": "Nico",
    "last_name": "Collins",
    "sport": "nfl",
    "team": "HOU",
    "player_id": "7569",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 5,
    "news_updated": 1788531320658
   },
   "8151": {
    "position": "RB",
    "status": "Active",
    "number": 9,
    "first_name": "Kenneth",
    "last_name": "Walker",
    "sport": "nfl",
    "team": "KC",
    "player_id": "8151",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 4,
    "news_updated": 1788621917593
   },
   "9224": {
    "position": "RB",
    "status": "Active",
    "number": 30,
    "first_name": "Chase",
    "last_name": "Brown",
    "sport": "nfl",
    "team": "CIN",
    "player_id": "9224",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 3,
    "news_updated": 1788619217404
   },
   "9500": {
    "position": "WR",
    "status": "Active",
    "number": 2,
    "first_name": "Josh",
    "last_name": "Downs",
    "sport": "nfl",
    "team": "IND",
    "player_id": "9500",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 3,
    "news_updated": 1788614716987
   },
   "10222": {
    "position": "WR",
    "status": "Active",
    "number": 11,
    "first_name": "Jayden",
    "last_name": "Reed",
    "sport": "nfl",
    "team": "GB",
    "player_id": "10222",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 3,
    "news_updated": 1788494716945
   },
   "10859": {
    "position": "TE",
    "status": "Active",
    "number": 87,
    "first_name": "Sam",
    "last_name": "LaPorta",
    "sport": "nfl",
    "team": "DET",
    "player_id": "10859",
    "fantasy_positions": [
     "TE"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 3,
    "news_updated": 1788985247984
   },
   "...": "2 more keys"
  },
  "players": [
   "10222",
   "10859",
   "... 14 more"
  ],
  "reserve": null,
  "roster_id": 3,
  "settings": {
   "fpts": 0,
   "fpts_decimal": 0,
   "losses": 0,
   "ties": 0,
   "total_moves": 0,
   "waiver_budget_used": 0,
   "waiver_position": 5,
   "wins": 0
  },
  "starters": [
   "6904",
   "4034",
   "... 8 more"
  ],
  "taxi": null
 }
]
```



### `matchup_legs`

```graphql
matchup_legs(round: Int!, league_id: Snowflake!): [MatchupLeg]
```

Server description: Matchup Legs for round

Notes: Superset of REST `/matchups/{week}`: adds `proj_points`, `max_points`, `player_map` (with per-player `injury_status`), `starters_games`, `subs`, `bans`, `picks`. REST has `players_points` and `starters_points` which GraphQL does not carry as fields (points live in `player_map` entries only once games start). Before kickoff `points`, `proj_points`, `max_points` are null. 42 KB for 8 rosters.

Example:

```graphql
{matchup_legs(league_id:"1389357604773322752",round:1){round leg points picks players league_id roster_id custom_points proj_points max_points matchup_id starters starters_games bans subs player_map}}
```

Result: 133 ms, 42,110 bytes. Trimmed:

```json
[
 {
  "bans": null,
  "custom_points": null,
  "league_id": "1389357604773322752",
  "leg": 1,
  "matchup_id": 2,
  "max_points": null,
  "picks": null,
  "player_map": {
   "2747": {
    "position": "K",
    "status": "Active",
    "number": 5,
    "first_name": "Jason",
    "last_name": "Myers",
    "sport": "nfl",
    "team": "SEA",
    "player_id": "2747",
    "fantasy_positions": [
     "K"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 11,
    "news_updated": 1788906320902
   },
   "4983": {
    "position": "WR",
    "status": "Active",
    "number": 2,
    "first_name": "DJ",
    "last_name": "Moore",
    "sport": "nfl",
    "team": "BUF",
    "player_id": "4983",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 8,
    "news_updated": 1788880849707
   },
   "5859": {
    "position": "WR",
    "status": "Active",
    "number": 1,
    "first_name": "A.J.",
    "last_name": "Brown",
    "sport": "nfl",
    "team": "NE",
    "player_id": "5859",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 7,
    "news_updated": 1788932723019
   },
   "6790": {
    "position": "RB",
    "status": "Active",
    "number": 4,
    "first_name": "D'Andre",
    "last_name": "Swift",
    "sport": "nfl",
    "team": "CHI",
    "player_id": "6790",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 6,
    "news_updated": 1788985846406
   },
   "7564": {
    "position": "WR",
    "status": "Active",
    "number": 1,
    "first_name": "Ja'Marr",
    "last_name": "Chase",
    "sport": "nfl",
    "team": "CIN",
    "player_id": "7564",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 5,
    "news_updated": 1788987346505
   },
   "7588": {
    "position": "RB",
    "status": "Active",
    "number": 33,
    "first_name": "Javonte",
    "last_name": "Williams",
    "sport": "nfl",
    "team": "DAL",
    "player_id": "7588",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 5,
    "news_updated": 1788561023166
   },
   "8144": {
    "position": "WR",
    "status": "Active",
    "number": 12,
    "first_name": "Chris",
    "last_name": "Olave",
    "sport": "nfl",
    "team": "NO",
    "player_id": "8144",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 4,
    "news_updated": 1788560723476
   },
   "9484": {
    "position": "TE",
    "status": "Active",
    "number": 85,
    "first_name": "Tucker",
    "last_name": "Kraft",
    "sport": "nfl",
    "team": "GB",
    "player_id": "9484",
    "fantasy_positions": [
     "TE"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": "Questionable",
    "years_exp": 3,
    "news_updated": 1788976234850
   },
   "9487": {
    "position": "WR",
    "status": "Active",
    "number": 11,
    "first_name": "Parker",
    "last_name": "Washington",
    "sport": "nfl",
    "team": "JAX",
    "player_id": "9487",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 3,
    "news_updated": 1788981045275
   },
   "11560": {
    "position": "QB",
    "status": "Active",
    "number": 18,
    "first_name": "Caleb",
    "last_name": "Williams",
    "sport": "nfl",
    "team": "CHI",
    "player_id": "11560",
    "fantasy_positions": [
     "QB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 2,
    "news_updated": 1788480915807
   },
   "12506": {
    "position": "TE",
    "status": "Active",
    "number": 44,
    "first_name": "Harold",
    "last_name": "Fannin",
    "sport": "nfl",
    "team": "CLE",
    "player_id": "12506",
    "fantasy_positions": [
     "TE"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 1,
    "news_updated": 1788706530649
   },
   "12507": {
    "position": "RB",
    "status": "Active",
    "number": 8,
    "first_name": "Omarion",
    "last_name": "Hampton",
    "sport": "nfl",
    "team": "LAC",
    "player_id": "12507",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 1,
    "news_updated": 1788450605412
   },
   "12512": {
    "position": "RB",
    "status": "Active",
    "number": 10,
    "first_name": "Quinshon",
    "last_name": "Judkins",
    "sport": "nfl",
    "team": "CLE",
    "player_id": "12512",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 1,
    "news_updated": 1788449105184
   },
   "12519": {
    "position": "WR",
    "status": "Active",
    "number": 10,
    "first_name": "Luther",
    "last_name": "Burden",
    "sport": "nfl",
    "team": "CHI",
    "player_id": "12519",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 1,
    "news_updated": 1788986446475
   },
   "...": "2 more keys"
  },
  "players": [
   "11560",
   "12507",
   "... 14 more"
  ],
  "points": null,
  "proj_points": 143.72,
  "roster_id": 1,
  "round": 1,
  "starters": [
   "11560",
   "12507",
   "... 8 more"
  ],
  "...": "2 more keys"
 },
 {
  "bans": null,
  "custom_points": null,
  "league_id": "1389357604773322752",
  "leg": 1,
  "matchup_id": 4,
  "max_points": null,
  "picks": null,
  "player_map": {
   "3451": {
    "position": "K",
    "status": "Active",
    "number": 15,
    "first_name": "Ka'imi",
    "last_name": "Fairbairn",
    "sport": "nfl",
    "team": "HOU",
    "player_id": "3451",
    "fantasy_positions": [
     "K"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 10,
    "news_updated": 1787986543802
   },
   "4046": {
    "position": "QB",
    "status": "Active",
    "number": 15,
    "first_name": "Patrick",
    "last_name": "Mahomes",
    "sport": "nfl",
    "team": "KC",
    "player_id": "4046",
    "fantasy_positions": [
     "QB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": "Questionable",
    "years_exp": 9,
    "news_updated": 1788889550651
   },
   "4217": {
    "position": "TE",
    "status": "Active",
    "number": 85,
    "first_name": "George",
    "last_name": "Kittle",
    "sport": "nfl",
    "team": "SF",
    "player_id": "4217",
    "fantasy_positions": [
     "TE"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": "Questionable",
    "years_exp": 9,
    "news_updated": 1788974134120
   },
   "5045": {
    "position": "WR",
    "status": "Active",
    "number": 14,
    "first_name": "Courtland",
    "last_name": "Sutton",
    "sport": "nfl",
    "team": "DEN",
    "player_id": "5045",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 8,
    "news_updated": 1788530120390
   },
   "5850": {
    "position": "RB",
    "status": "Active",
    "number": 8,
    "first_name": "Josh",
    "last_name": "Jacobs",
    "sport": "nfl",
    "team": "GB",
    "player_id": "5850",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": "NA",
    "years_exp": 7,
    "news_updated": 1788975934438
   },
   "7021": {
    "position": "RB",
    "status": "Active",
    "number": 13,
    "first_name": "Rico",
    "last_name": "Dowdle",
    "sport": "nfl",
    "team": "PIT",
    "player_id": "7021",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 6,
    "news_updated": 1788887150299
   },
   "7523": {
    "position": "QB",
    "status": "Active",
    "number": 16,
    "first_name": "Trevor",
    "last_name": "Lawrence",
    "sport": "nfl",
    "team": "JAX",
    "player_id": "7523",
    "fantasy_positions": [
     "QB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 5,
    "news_updated": 1788493216806
   },
   "8150": {
    "position": "RB",
    "status": "Active",
    "number": 23,
    "first_name": "Kyren",
    "last_name": "Williams",
    "sport": "nfl",
    "team": "LAR",
    "player_id": "8150",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 4,
    "news_updated": 1788614116896
   },
   "8155": {
    "position": "RB",
    "status": "Active",
    "number": 20,
    "first_name": "Breece",
    "last_name": "Hall",
    "sport": "nfl",
    "team": "NYJ",
    "player_id": "8155",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 4,
    "news_updated": 1788985847561
   },
   "9221": {
    "position": "RB",
    "status": "Active",
    "number": 0,
    "first_name": "Jahmyr",
    "last_name": "Gibbs",
    "sport": "nfl",
    "team": "DET",
    "player_id": "9221",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 3,
    "news_updated": 1788579313547
   },
   "9754": {
    "position": "WR",
    "status": "Active",
    "number": 1,
    "first_name": "Quentin",
    "last_name": "Johnston",
    "sport": "nfl",
    "team": "LAC",
    "player_id": "9754",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 3,
    "news_updated": 1788553522367
   },
   "9997": {
    "position": "WR",
    "status": "Active",
    "number": 4,
    "first_name": "Zay",
    "last_name": "Flowers",
    "sport": "nfl",
    "team": "BAL",
    "player_id": "9997",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": "Questionable",
    "years_exp": 3,
    "news_updated": 1788987946526
   },
   "10229": {
    "position": "WR",
    "status": "Active",
    "number": 4,
    "first_name": "Rashee",
    "last_name": "Rice",
    "sport": "nfl",
    "team": "KC",
    "player_id": "10229",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 3,
    "news_updated": 1788574524467
   },
   "12517": {
    "position": "TE",
    "status": "Active",
    "number": 84,
    "first_name": "Colston",
    "last_name": "Loveland",
    "sport": "nfl",
    "team": "CHI",
    "player_id": "12517",
    "fantasy_positions": [
     "TE"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 1,
    "news_updated": 1788576924712
   },
   "...": "2 more keys"
  },
  "players": [
   "4046",
   "7523",
   "... 14 more"
  ],
  "points": null,
  "proj_points": 142.08,
  "roster_id": 2,
  "round": 1,
  "starters": [
   "7523",
   "9221",
   "... 8 more"
  ],
  "...": "2 more keys"
 },
 "... 6 more"
]
```


Variant `matchup_legs_prev_r1`:

```graphql
{matchup_legs_prev_r1:matchup_legs(league_id:"1267682977899364352",round:1){round leg points picks players league_id roster_id custom_points proj_points max_points matchup_id starters starters_games bans subs player_map}}
```

Result: 126 ms, 43,196 bytes. Trimmed:

```json
[
 {
  "bans": null,
  "custom_points": null,
  "league_id": "1267682977899364352",
  "leg": 1,
  "matchup_id": 3,
  "max_points": 153.9199981689453,
  "picks": null,
  "player_map": {
   "3198": {
    "position": "RB",
    "status": "Active",
    "number": 22,
    "first_name": "Derrick",
    "last_name": "Henry",
    "sport": "nfl",
    "team": "BAL",
    "player_id": "3198",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 10,
    "news_updated": 1788530120390
   },
   "5012": {
    "position": "TE",
    "status": "Active",
    "number": 89,
    "first_name": "Mark",
    "last_name": "Andrews",
    "sport": "nfl",
    "team": "BAL",
    "player_id": "5012",
    "fantasy_positions": [
     "TE"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 8,
    "news_updated": 1788552322233
   },
   "5967": {
    "position": "RB",
    "status": "Active",
    "number": 20,
    "first_name": "Tony",
    "last_name": "Pollard",
    "sport": "nfl",
    "team": "TEN",
    "player_id": "5967",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 7,
    "news_updated": 1788554122408
   },
   "6783": {
    "position": "WR",
    "status": "Active",
    "number": 3,
    "first_name": "Jerry",
    "last_name": "Jeudy",
    "sport": "nfl",
    "team": "CLE",
    "player_id": "6783",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 6,
    "news_updated": 1788642324536
   },
   "6801": {
    "position": "WR",
    "status": "Active",
    "number": 5,
    "first_name": "Tee",
    "last_name": "Higgins",
    "sport": "nfl",
    "team": "CIN",
    "player_id": "6801",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 6,
    "news_updated": 1788987646358
   },
   "7526": {
    "position": "WR",
    "status": "Active",
    "number": 17,
    "first_name": "Jaylen",
    "last_name": "Waddle",
    "sport": "nfl",
    "team": "DEN",
    "player_id": "7526",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 5,
    "news_updated": 1788537921125
   },
   "7569": {
    "position": "WR",
    "status": "Active",
    "number": 12,
    "first_name": "Nico",
    "last_name": "Collins",
    "sport": "nfl",
    "team": "HOU",
    "player_id": "7569",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 5,
    "news_updated": 1788531320658
   },
   "8146": {
    "position": "WR",
    "status": "Active",
    "number": 5,
    "first_name": "Garrett",
    "last_name": "Wilson",
    "sport": "nfl",
    "team": "NYJ",
    "player_id": "8146",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 4,
    "news_updated": 1788464106858
   },
   "8150": {
    "position": "RB",
    "status": "Active",
    "number": 23,
    "first_name": "Kyren",
    "last_name": "Williams",
    "sport": "nfl",
    "team": "LAR",
    "player_id": "8150",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 4,
    "news_updated": 1788614116896
   },
   "9226": {
    "position": "RB",
    "status": "Active",
    "number": 28,
    "first_name": "De'Von",
    "last_name": "Achane",
    "sport": "nfl",
    "team": "MIA",
    "player_id": "9226",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 3,
    "news_updated": 1788804041034
   },
   "9756": {
    "position": "WR",
    "status": "Active",
    "number": 3,
    "first_name": "Jordan",
    "last_name": "Addison",
    "sport": "nfl",
    "team": "MIN",
    "player_id": "9756",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 3,
    "news_updated": 1788465306980
   },
   "10937": {
    "position": "K",
    "status": "Active",
    "number": 45,
    "first_name": "Jake",
    "last_name": "Moody",
    "sport": "nfl",
    "team": "BAL",
    "player_id": "10937",
    "fantasy_positions": [
     "K"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 3,
    "news_updated": 1788216613411
   },
   "11563": {
    "position": "QB",
    "status": "Active",
    "number": 10,
    "first_name": "Bo",
    "last_name": "Nix",
    "sport": "nfl",
    "team": "DEN",
    "player_id": "11563",
    "fantasy_positions": [
     "QB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 2,
    "news_updated": 1788486316132
   },
   "11565": {
    "position": "QB",
    "status": "Active",
    "number": 9,
    "first_name": "J.J.",
    "last_name": "McCarthy",
    "sport": "nfl",
    "team": "MIN",
    "player_id": "11565",
    "fantasy_positions": [
     "QB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 2,
    "news_updated": 1788980436381
   },
   "...": "3 more keys"
  },
  "players": [
   "11563",
   "11565",
   "... 15 more"
  ],
  "points": 118.44000244140625,
  "proj_points": 134.55,
  "roster_id": 1,
  "round": 1,
  "starters": [
   "11563",
   "3198",
   "... 8 more"
  ],
  "...": "2 more keys"
 },
 {
  "bans": null,
  "custom_points": null,
  "league_id": "1267682977899364352",
  "leg": 1,
  "matchup_id": 3,
  "max_points": 153.25999450683594,
  "picks": null,
  "player_map": {
   "1466": {
    "position": "TE",
    "status": "Active",
    "number": 87,
    "first_name": "Travis",
    "last_name": "Kelce",
    "sport": "nfl",
    "team": "KC",
    "player_id": "1466",
    "fantasy_positions": [
     "TE"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 13,
    "news_updated": 1788442540618
   },
   "1945": {
    "position": "K",
    "status": "Active",
    "number": 9,
    "first_name": "Chris",
    "last_name": "Boswell",
    "sport": "nfl",
    "team": "PIT",
    "player_id": "1945",
    "fantasy_positions": [
     "K"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 12,
    "news_updated": 1787420424674
   },
   "2449": {
    "position": "WR",
    "status": "Active",
    "number": 3,
    "first_name": "Stefon",
    "last_name": "Diggs",
    "sport": "nfl",
    "team": "WAS",
    "player_id": "2449",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 11,
    "news_updated": 1788580814041
   },
   "4137": {
    "position": "RB",
    "status": "Inactive",
    "number": 6,
    "first_name": "James",
    "last_name": "Conner",
    "sport": "nfl",
    "team": "ARI",
    "player_id": "4137",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": "IR",
    "years_exp": 9,
    "news_updated": 1788749435134
   },
   "4881": {
    "position": "QB",
    "status": "Active",
    "number": 8,
    "first_name": "Lamar",
    "last_name": "Jackson",
    "sport": "nfl",
    "team": "BAL",
    "player_id": "4881",
    "fantasy_positions": [
     "QB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 8,
    "news_updated": 1788387933622
   },
   "5846": {
    "position": "WR",
    "status": "Active",
    "number": 4,
    "first_name": "DK",
    "last_name": "Metcalf",
    "sport": "nfl",
    "team": "PIT",
    "player_id": "5846",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 7,
    "news_updated": 1788806742940
   },
   "5850": {
    "position": "RB",
    "status": "Active",
    "number": 8,
    "first_name": "Josh",
    "last_name": "Jacobs",
    "sport": "nfl",
    "team": "GB",
    "player_id": "5850",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": "NA",
    "years_exp": 7,
    "news_updated": 1788975934438
   },
   "5872": {
    "position": "WR",
    "status": "Active",
    "number": 19,
    "first_name": "Deebo",
    "last_name": "Samuel",
    "sport": "nfl",
    "team": "SF",
    "player_id": "5872",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 7,
    "news_updated": 1788808841677
   },
   "6786": {
    "position": "WR",
    "status": "Active",
    "number": 88,
    "first_name": "CeeDee",
    "last_name": "Lamb",
    "sport": "nfl",
    "team": "DAL",
    "player_id": "6786",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 6,
    "news_updated": 1788616517110
   },
   "6790": {
    "position": "RB",
    "status": "Active",
    "number": 4,
    "first_name": "D'Andre",
    "last_name": "Swift",
    "sport": "nfl",
    "team": "CHI",
    "player_id": "6790",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 6,
    "news_updated": 1788985846406
   },
   "7553": {
    "position": "TE",
    "status": "Active",
    "number": 8,
    "first_name": "Kyle",
    "last_name": "Pitts",
    "sport": "nfl",
    "team": "ATL",
    "player_id": "7553",
    "fantasy_positions": [
     "TE"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 5,
    "news_updated": 1788702630463
   },
   "9758": {
    "position": "QB",
    "status": "Active",
    "number": 7,
    "first_name": "C.J.",
    "last_name": "Stroud",
    "sport": "nfl",
    "team": "HOU",
    "player_id": "9758",
    "fantasy_positions": [
     "QB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 3,
    "news_updated": 1788930922981
   },
   "11620": {
    "position": "WR",
    "status": "Active",
    "number": 15,
    "first_name": "Rome",
    "last_name": "Odunze",
    "sport": "nfl",
    "team": "CHI",
    "player_id": "11620",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": "Questionable",
    "years_exp": 2,
    "news_updated": 1788986146444
   },
   "12526": {
    "position": "WR",
    "status": "Active",
    "number": 4,
    "first_name": "Tetairoa",
    "last_name": "McMillan",
    "sport": "nfl",
    "team": "CAR",
    "player_id": "12526",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 1,
    "news_updated": 1788623417640
   },
   "...": "2 more keys"
  },
  "players": [
   "4881",
   "9758",
   "... 14 more"
  ],
  "points": 137.25999450683594,
  "proj_points": 140.61,
  "roster_id": 2,
  "round": 1,
  "starters": [
   "4881",
   "5850",
   "... 8 more"
  ],
  "...": "2 more keys"
 },
 "... 6 more"
]
```



### `matchup_legs_raw`

```graphql
matchup_legs_raw(round: Int!, league_id: Snowflake!): [MatchupLeg]
```

Server description: Matchup Legs for round - without context or players etc - fast query - don't overwrite reducer version

Notes: Same rows as `matchup_legs` without `player_map` (4 KB vs 42 KB). Description says it is the fast path.

Example:

```graphql
{matchup_legs_raw(league_id:"1389357604773322752",round:1){round leg points picks players league_id roster_id custom_points proj_points max_points matchup_id starters starters_games bans subs player_map}}
```

Result: 80 ms, 4,062 bytes. Trimmed:

```json
[
 {
  "bans": null,
  "custom_points": null,
  "league_id": "1389357604773322752",
  "leg": 1,
  "matchup_id": 2,
  "max_points": null,
  "picks": null,
  "player_map": null,
  "players": [
   "11560",
   "12506",
   "... 14 more"
  ],
  "points": null,
  "proj_points": null,
  "roster_id": 1,
  "round": 1,
  "starters": [
   "11560",
   "12507",
   "... 8 more"
  ],
  "...": "2 more keys"
 },
 {
  "bans": null,
  "custom_points": null,
  "league_id": "1389357604773322752",
  "leg": 1,
  "matchup_id": 4,
  "max_points": null,
  "picks": null,
  "player_map": null,
  "players": [
   "10229",
   "12517",
   "... 14 more"
  ],
  "points": null,
  "proj_points": null,
  "roster_id": 2,
  "round": 1,
  "starters": [
   "7523",
   "9221",
   "... 8 more"
  ],
  "...": "2 more keys"
 },
 "... 6 more"
]
```



### `matchup_legs_related_to_roster`

```graphql
matchup_legs_related_to_roster(league_id: Snowflake!, roster_id: Int!, start_round: Int!, end_round: Int!): [MatchupLeg]
```

Server description: Related matchup Legs for a roster (aka schedule)

Notes: One roster's schedule over a round range: every leg the roster and its opponents appear in. `start_round..end_round` inclusive.

Example:

```graphql
{matchup_legs_related_to_roster(league_id:"1389357604773322752",roster_id:3,start_round:1,end_round:3){round leg points picks players league_id roster_id custom_points proj_points max_points matchup_id starters starters_games bans subs player_map}}
```

Result: 112 ms, 31,446 bytes. Trimmed:

```json
[
 {
  "bans": null,
  "custom_points": null,
  "league_id": "1389357604773322752",
  "leg": 1,
  "matchup_id": 2,
  "max_points": null,
  "picks": null,
  "player_map": {
   "2216": {
    "position": "WR",
    "status": "Active",
    "number": 5,
    "first_name": "Mike",
    "last_name": "Evans",
    "sport": "nfl",
    "team": "SF",
    "player_id": "2216",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 12,
    "news_updated": 1788912921433
   },
   "3294": {
    "position": "QB",
    "status": "Active",
    "number": 4,
    "first_name": "Dak",
    "last_name": "Prescott",
    "sport": "nfl",
    "team": "DAL",
    "player_id": "3294",
    "fantasy_positions": [
     "QB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 10,
    "news_updated": 1788467707202
   },
   "4034": {
    "position": "RB",
    "status": "Active",
    "number": 23,
    "first_name": "Christian",
    "last_name": "McCaffrey",
    "sport": "nfl",
    "team": "SF",
    "player_id": "4034",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 9,
    "news_updated": 1788914121512
   },
   "5012": {
    "position": "TE",
    "status": "Active",
    "number": 89,
    "first_name": "Mark",
    "last_name": "Andrews",
    "sport": "nfl",
    "team": "BAL",
    "player_id": "5012",
    "fantasy_positions": [
     "TE"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 8,
    "news_updated": 1788552322233
   },
   "5846": {
    "position": "WR",
    "status": "Active",
    "number": 4,
    "first_name": "DK",
    "last_name": "Metcalf",
    "sport": "nfl",
    "team": "PIT",
    "player_id": "5846",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 7,
    "news_updated": 1788806742940
   },
   "6904": {
    "position": "QB",
    "status": "Active",
    "number": 1,
    "first_name": "Jalen",
    "last_name": "Hurts",
    "sport": "nfl",
    "team": "PHI",
    "player_id": "6904",
    "fantasy_positions": [
     "QB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 6,
    "news_updated": 1788557122735
   },
   "7525": {
    "position": "WR",
    "status": "Active",
    "number": 6,
    "first_name": "DeVonta",
    "last_name": "Smith",
    "sport": "nfl",
    "team": "PHI",
    "player_id": "7525",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 5,
    "news_updated": 1788554423238
   },
   "7543": {
    "position": "RB",
    "status": "Active",
    "number": 3,
    "first_name": "Travis",
    "last_name": "Etienne",
    "sport": "nfl",
    "team": "NO",
    "player_id": "7543",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 5,
    "news_updated": 1788535525515
   },
   "7569": {
    "position": "WR",
    "status": "Active",
    "number": 12,
    "first_name": "Nico",
    "last_name": "Collins",
    "sport": "nfl",
    "team": "HOU",
    "player_id": "7569",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 5,
    "news_updated": 1788531320658
   },
   "8151": {
    "position": "RB",
    "status": "Active",
    "number": 9,
    "first_name": "Kenneth",
    "last_name": "Walker",
    "sport": "nfl",
    "team": "KC",
    "player_id": "8151",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 4,
    "news_updated": 1788621917593
   },
   "9224": {
    "position": "RB",
    "status": "Active",
    "number": 30,
    "first_name": "Chase",
    "last_name": "Brown",
    "sport": "nfl",
    "team": "CIN",
    "player_id": "9224",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 3,
    "news_updated": 1788619217404
   },
   "9500": {
    "position": "WR",
    "status": "Active",
    "number": 2,
    "first_name": "Josh",
    "last_name": "Downs",
    "sport": "nfl",
    "team": "IND",
    "player_id": "9500",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 3,
    "news_updated": 1788614716987
   },
   "10222": {
    "position": "WR",
    "status": "Active",
    "number": 11,
    "first_name": "Jayden",
    "last_name": "Reed",
    "sport": "nfl",
    "team": "GB",
    "player_id": "10222",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 3,
    "news_updated": 1788494716945
   },
   "10859": {
    "position": "TE",
    "status": "Active",
    "number": 87,
    "first_name": "Sam",
    "last_name": "LaPorta",
    "sport": "nfl",
    "team": "DET",
    "player_id": "10859",
    "fantasy_positions": [
     "TE"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 3,
    "news_updated": 1788985247984
   },
   "...": "2 more keys"
  },
  "players": [
   "10222",
   "10859",
   "... 14 more"
  ],
  "points": null,
  "proj_points": 151.98,
  "roster_id": 3,
  "round": 1,
  "starters": [
   "6904",
   "4034",
   "... 8 more"
  ],
  "...": "2 more keys"
 },
 {
  "bans": null,
  "custom_points": null,
  "league_id": "1389357604773322752",
  "leg": 2,
  "matchup_id": 3,
  "max_points": null,
  "picks": null,
  "player_map": {
   "2216": {
    "position": "WR",
    "status": "Active",
    "number": 5,
    "first_name": "Mike",
    "last_name": "Evans",
    "sport": "nfl",
    "team": "SF",
    "player_id": "2216",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 12,
    "news_updated": 1788912921433
   },
   "3294": {
    "position": "QB",
    "status": "Active",
    "number": 4,
    "first_name": "Dak",
    "last_name": "Prescott",
    "sport": "nfl",
    "team": "DAL",
    "player_id": "3294",
    "fantasy_positions": [
     "QB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 10,
    "news_updated": 1788467707202
   },
   "4034": {
    "position": "RB",
    "status": "Active",
    "number": 23,
    "first_name": "Christian",
    "last_name": "McCaffrey",
    "sport": "nfl",
    "team": "SF",
    "player_id": "4034",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 9,
    "news_updated": 1788914121512
   },
   "5012": {
    "position": "TE",
    "status": "Active",
    "number": 89,
    "first_name": "Mark",
    "last_name": "Andrews",
    "sport": "nfl",
    "team": "BAL",
    "player_id": "5012",
    "fantasy_positions": [
     "TE"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 8,
    "news_updated": 1788552322233
   },
   "5846": {
    "position": "WR",
    "status": "Active",
    "number": 4,
    "first_name": "DK",
    "last_name": "Metcalf",
    "sport": "nfl",
    "team": "PIT",
    "player_id": "5846",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 7,
    "news_updated": 1788806742940
   },
   "6904": {
    "position": "QB",
    "status": "Active",
    "number": 1,
    "first_name": "Jalen",
    "last_name": "Hurts",
    "sport": "nfl",
    "team": "PHI",
    "player_id": "6904",
    "fantasy_positions": [
     "QB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 6,
    "news_updated": 1788557122735
   },
   "7525": {
    "position": "WR",
    "status": "Active",
    "number": 6,
    "first_name": "DeVonta",
    "last_name": "Smith",
    "sport": "nfl",
    "team": "PHI",
    "player_id": "7525",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 5,
    "news_updated": 1788554423238
   },
   "7543": {
    "position": "RB",
    "status": "Active",
    "number": 3,
    "first_name": "Travis",
    "last_name": "Etienne",
    "sport": "nfl",
    "team": "NO",
    "player_id": "7543",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 5,
    "news_updated": 1788535525515
   },
   "7569": {
    "position": "WR",
    "status": "Active",
    "number": 12,
    "first_name": "Nico",
    "last_name": "Collins",
    "sport": "nfl",
    "team": "HOU",
    "player_id": "7569",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 5,
    "news_updated": 1788531320658
   },
   "8151": {
    "position": "RB",
    "status": "Active",
    "number": 9,
    "first_name": "Kenneth",
    "last_name": "Walker",
    "sport": "nfl",
    "team": "KC",
    "player_id": "8151",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 4,
    "news_updated": 1788621917593
   },
   "9224": {
    "position": "RB",
    "status": "Active",
    "number": 30,
    "first_name": "Chase",
    "last_name": "Brown",
    "sport": "nfl",
    "team": "CIN",
    "player_id": "9224",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 3,
    "news_updated": 1788619217404
   },
   "9500": {
    "position": "WR",
    "status": "Active",
    "number": 2,
    "first_name": "Josh",
    "last_name": "Downs",
    "sport": "nfl",
    "team": "IND",
    "player_id": "9500",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 3,
    "news_updated": 1788614716987
   },
   "10222": {
    "position": "WR",
    "status": "Active",
    "number": 11,
    "first_name": "Jayden",
    "last_name": "Reed",
    "sport": "nfl",
    "team": "GB",
    "player_id": "10222",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 3,
    "news_updated": 1788494716945
   },
   "10859": {
    "position": "TE",
    "status": "Active",
    "number": 87,
    "first_name": "Sam",
    "last_name": "LaPorta",
    "sport": "nfl",
    "team": "DET",
    "player_id": "10859",
    "fantasy_positions": [
     "TE"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 3,
    "news_updated": 1788985247984
   },
   "...": "2 more keys"
  },
  "players": [
   "10222",
   "10859",
   "... 14 more"
  ],
  "points": null,
  "proj_points": 148.11,
  "roster_id": 3,
  "round": 2,
  "starters": [
   "6904",
   "4034",
   "... 8 more"
  ],
  "...": "2 more keys"
 },
 "... 4 more"
]
```



### `roster_draft_picks`

```graphql
roster_draft_picks(season: String, league_id: Snowflake!): [RosterDraftPick]
```

Server description: Fetch picks that were traded

Notes: Traded draft picks (`owner_id`, `previous_owner_id` are roster ids). Empty here because pick trading is off in this league.

Example:

```graphql
{roster_draft_picks(league_id:"1389357604773322752"){round season league_id roster_id owner_id previous_owner_id}}
```

Result: 59 ms, 2 bytes. Trimmed:

```json
[]
```



### `roster_draft_picks_by_draft`

```graphql
roster_draft_picks_by_draft(draft_id: Snowflake!): [RosterDraftPick]
```

Server description: Fetch picks that were traded for a completed league draft or mock draft

Notes: Same for a specific completed draft.

Example:

```graphql
{roster_draft_picks_by_draft(draft_id:"1389357604773322753"){round season league_id roster_id owner_id previous_owner_id}}
```

Result: 70 ms, 2 bytes. Trimmed:

```json
[]
```



### `roster_draft_picks_by_owner`

```graphql
roster_draft_picks_by_owner(league_id: Snowflake!, owner_roster_id: Snowflake!): [RosterDraftPick]
```

Server description: Fetch picks that were traded owned by a specific player

Notes: Picks owned by one roster. Takes `owner_roster_id` as a Snowflake string, not Int.

Example:

```graphql
{roster_draft_picks_by_owner(league_id:"1389357604773322752",owner_roster_id:"3"){round season league_id roster_id owner_id previous_owner_id}}
```

Result: 75 ms, 2 bytes. Trimmed:

```json
[]
```



### `user_roster`

```graphql
user_roster(user_id: Snowflake!, sport: String!, season_type: String!, season: String!, roster_id: Snowflake!): [UserRoster]
```

Server description: Get a user roster

Notes: Belongs to the 'user roster' product (Sleeper Picks lineups), not league rosters. Errors `could not find the roster` with league args.

Example:

```graphql
{user_roster(user_id:"1267685386142887936",sport:"nfl",season_type:"regular",season:"2026",roster_id:"3"){metadata settings user_id sport season_type season scoring_settings players roster_positions roster_id starters player_map}}
```

Result: error after 77 ms: `We could not find the roster based on the arguments you provided.`



### `user_rosters`

```graphql
user_rosters(user_id: Snowflake!, sport: String!, season_type: String!, season: String!): [UserRoster]
```

Server description: Get a list of user rosters

Notes: Empty for this account; see `user_roster`.

Example:

```graphql
{user_rosters(user_id:"1267685386142887936",sport:"nfl",season_type:"regular",season:"2026"){metadata settings user_id sport season_type season scoring_settings players roster_positions roster_id starters player_map}}
```

Result: 69 ms, 2 bytes. Trimmed:

```json
[]
```



## Transactions (trades, waivers, adds)

### `league_transactions`

```graphql
league_transactions(status: String, type: String, limit: Int, leg: Int, league_id: Snowflake!, roster_id: Int): [LeagueTransaction]
```

Server description: List all transactions in a leg

Notes: Lists every status, newest first, including `proposed` and `rejected` trades that REST `/transactions/{week}` omits (REST returned only the 3 `complete` rows; this returned 5 `rejected` trades at `limit: 5`). Filters: `status`, `type`, `roster_id`, `leg`, `limit`. Each row has `player_map` and `metadata` (`rejecter_id`, `notes`).

Example:

```graphql
{league_transactions(league_id:"1389357604773322752",leg:1,limit:5){status type metadata created settings leg league_id draft_picks creator transaction_id adds drops consenter_ids roster_ids status_updated waiver_budget player_map}}
```

Result: 81 ms, 9,960 bytes. Trimmed:

```json
[
 {
  "adds": {
   "1466": 3,
   "10859": 5,
   "12490": 3
  },
  "consenter_ids": [
   5
  ],
  "created": 1788986431814,
  "creator": "<user_5>",
  "draft_picks": null,
  "drops": {
   "1466": 5,
   "10859": 3,
   "12490": 5
  },
  "league_id": "1389357604773322752",
  "leg": 1,
  "metadata": {
   "rejecter_id": "<user_3>"
  },
  "player_map": {
   "1466": {
    "position": "TE",
    "status": "Active",
    "number": 87,
    "first_name": "Travis",
    "last_name": "Kelce",
    "sport": "nfl",
    "team": "KC",
    "player_id": "1466",
    "fantasy_positions": [
     "TE"
    ],
    "injury_status": null,
    "news_updated": 1788442540618,
    "team_abbr": null,
    "team_changed_at": null,
    "years_exp": 13
   },
   "10859": {
    "position": "TE",
    "status": "Active",
    "number": 87,
    "first_name": "Sam",
    "last_name": "LaPorta",
    "sport": "nfl",
    "team": "DET",
    "player_id": "10859",
    "fantasy_positions": [
     "TE"
    ],
    "injury_status": null,
    "news_updated": 1788985247984,
    "team_abbr": null,
    "team_changed_at": null,
    "years_exp": 3
   },
   "12490": {
    "position": "RB",
    "status": "Active",
    "number": 33,
    "first_name": "Bhayshul",
    "last_name": "Tuten",
    "sport": "nfl",
    "team": "JAX",
    "player_id": "12490",
    "fantasy_positions": [
     "RB"
    ],
    "injury_status": null,
    "news_updated": 1788988246606,
    "team_abbr": null,
    "team_changed_at": null,
    "years_exp": 1
   }
  },
  "roster_ids": [
   3,
   5
  ],
  "settings": null,
  "status": "rejected",
  "status_updated": 1788986455788,
  "...": "3 more keys"
 },
 {
  "adds": {
   "5927": 3,
   "5947": 3,
   "8151": 5,
   "12490": 3
  },
  "consenter_ids": [
   5
  ],
  "created": 1788984399496,
  "creator": "<user_5>",
  "draft_picks": null,
  "drops": {
   "5927": 5,
   "5947": 5,
   "8151": 3,
   "12490": 5
  },
  "league_id": "1389357604773322752",
  "leg": 1,
  "metadata": {
   "rejecter_id": "<user_3>"
  },
  "player_map": {
   "5927": {
    "position": "WR",
    "status": "Active",
    "number": 17,
    "first_name": "Terry",
    "last_name": "McLaurin",
    "sport": "nfl",
    "team": "WAS",
    "player_id": "5927",
    "fantasy_positions": [
     "WR"
    ],
    "injury_status": null,
    "news_updated": 1788544521740,
    "team_abbr": null,
    "team_changed_at": null,
    "years_exp": 7
   },
   "5947": {
    "position": "WR",
    "status": "Active",
    "number": 3,
    "first_name": "Jakobi",
    "last_name": "Meyers",
    "sport": "nfl",
    "team": "JAX",
    "player_id": "5947",
    "fantasy_positions": [
     "WR"
    ],
    "injury_status": "Questionable",
    "news_updated": 1788988246636,
    "team_abbr": null,
    "team_changed_at": null,
    "years_exp": 7
   },
   "8151": {
    "position": "RB",
    "status": "Active",
    "number": 9,
    "first_name": "Kenneth",
    "last_name": "Walker",
    "sport": "nfl",
    "team": "KC",
    "player_id": "8151",
    "fantasy_positions": [
     "RB"
    ],
    "injury_status": null,
    "news_updated": 1788621917593,
    "team_abbr": null,
    "team_changed_at": null,
    "years_exp": 4
   },
   "12490": {
    "position": "RB",
    "status": "Active",
    "number": 33,
    "first_name": "Bhayshul",
    "last_name": "Tuten",
    "sport": "nfl",
    "team": "JAX",
    "player_id": "12490",
    "fantasy_positions": [
     "RB"
    ],
    "injury_status": null,
    "news_updated": 1788988246606,
    "team_abbr": null,
    "team_changed_at": null,
    "years_exp": 1
   }
  },
  "roster_ids": [
   3,
   5
  ],
  "settings": null,
  "status": "rejected",
  "status_updated": 1788984455078,
  "...": "3 more keys"
 },
 "... 3 more"
]
```


Variant `tx_leg1_trades`:

```graphql
{tx_leg1_trades:league_transactions(league_id:"1389357604773322752",leg:1,type:"trade",status:"rejected",roster_id:3){status type metadata created settings leg league_id draft_picks creator transaction_id adds drops consenter_ids roster_ids status_updated waiver_budget player_map}}
```

Result: 123 ms, 54,420 bytes. Trimmed:

```json
[
 {
  "adds": {
   "1466": 3,
   "10859": 5,
   "12490": 3
  },
  "consenter_ids": [
   5
  ],
  "created": 1788986431814,
  "creator": "<user_5>",
  "draft_picks": null,
  "drops": {
   "1466": 5,
   "10859": 3,
   "12490": 5
  },
  "league_id": "1389357604773322752",
  "leg": 1,
  "metadata": {
   "rejecter_id": "<user_3>"
  },
  "player_map": {
   "1466": {
    "position": "TE",
    "status": "Active",
    "number": 87,
    "first_name": "Travis",
    "last_name": "Kelce",
    "sport": "nfl",
    "team": "KC",
    "player_id": "1466",
    "fantasy_positions": [
     "TE"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 13,
    "news_updated": 1788442540618
   },
   "10859": {
    "position": "TE",
    "status": "Active",
    "number": 87,
    "first_name": "Sam",
    "last_name": "LaPorta",
    "sport": "nfl",
    "team": "DET",
    "player_id": "10859",
    "fantasy_positions": [
     "TE"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 3,
    "news_updated": 1788985247984
   },
   "12490": {
    "position": "RB",
    "status": "Active",
    "number": 33,
    "first_name": "Bhayshul",
    "last_name": "Tuten",
    "sport": "nfl",
    "team": "JAX",
    "player_id": "12490",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 1,
    "news_updated": 1788988246606
   }
  },
  "roster_ids": [
   3,
   5
  ],
  "settings": null,
  "status": "rejected",
  "status_updated": 1788986455788,
  "...": "3 more keys"
 },
 {
  "adds": {
   "5927": 3,
   "5947": 3,
   "8151": 5,
   "12490": 3
  },
  "consenter_ids": [
   5
  ],
  "created": 1788984399496,
  "creator": "<user_5>",
  "draft_picks": null,
  "drops": {
   "5927": 5,
   "5947": 5,
   "8151": 3,
   "12490": 5
  },
  "league_id": "1389357604773322752",
  "leg": 1,
  "metadata": {
   "rejecter_id": "<user_3>"
  },
  "player_map": {
   "5927": {
    "position": "WR",
    "status": "Active",
    "number": 17,
    "first_name": "Terry",
    "last_name": "McLaurin",
    "sport": "nfl",
    "team": "WAS",
    "player_id": "5927",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 7,
    "news_updated": 1788544521740
   },
   "5947": {
    "position": "WR",
    "status": "Active",
    "number": 3,
    "first_name": "Jakobi",
    "last_name": "Meyers",
    "sport": "nfl",
    "team": "JAX",
    "player_id": "5947",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": "Questionable",
    "years_exp": 7,
    "news_updated": 1788988246636
   },
   "8151": {
    "position": "RB",
    "status": "Active",
    "number": 9,
    "first_name": "Kenneth",
    "last_name": "Walker",
    "sport": "nfl",
    "team": "KC",
    "player_id": "8151",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 4,
    "news_updated": 1788621917593
   },
   "12490": {
    "position": "RB",
    "status": "Active",
    "number": 33,
    "first_name": "Bhayshul",
    "last_name": "Tuten",
    "sport": "nfl",
    "team": "JAX",
    "player_id": "12490",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 1,
    "news_updated": 1788988246606
   }
  },
  "roster_ids": [
   3,
   5
  ],
  "settings": null,
  "status": "rejected",
  "status_updated": 1788984455078,
  "...": "3 more keys"
 },
 "... 26 more"
]
```



### `league_transactions_by_status`

```graphql
league_transactions_by_status(status: String!, leg: Int!, league_id: Snowflake!): [LeagueTransaction]
```

Server description: List league transactions by status

Notes: The poller endpoint for pending offers: `status: "proposed"` (not `pending`). Also `complete`, `rejected`, `failed`. This is what sleeper-coach polls.

Example:

```graphql
{league_transactions_by_status(league_id:"1389357604773322752",leg:1,status:"complete"){status type metadata created settings leg league_id draft_picks creator transaction_id adds drops consenter_ids roster_ids status_updated waiver_budget player_map}}
```

Result: 82 ms, 3,129 bytes. Trimmed:

```json
[
 {
  "adds": {
   "5012": 3,
   "9487": 1
  },
  "consenter_ids": [
   1,
   3
  ],
  "created": 1788371562251,
  "creator": "<user_3>",
  "draft_picks": null,
  "drops": {
   "5012": 1,
   "9487": 3
  },
  "league_id": "1389357604773322752",
  "leg": 1,
  "metadata": {
   "notes": "Your trade was processed successfully!"
  },
  "player_map": {
   "5012": {
    "position": "TE",
    "status": "Active",
    "number": 89,
    "first_name": "Mark",
    "last_name": "Andrews",
    "sport": "nfl",
    "team": "BAL",
    "player_id": "5012",
    "fantasy_positions": [
     "TE"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 8,
    "news_updated": 1788552322233
   },
   "9487": {
    "position": "WR",
    "status": "Active",
    "number": 11,
    "first_name": "Parker",
    "last_name": "Washington",
    "sport": "nfl",
    "team": "JAX",
    "player_id": "9487",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 3,
    "news_updated": 1788981045275
   }
  },
  "roster_ids": [
   1,
   3
  ],
  "settings": {
   "expires_at": 1788630762
  },
  "status": "complete",
  "status_updated": 1788589377990,
  "...": "3 more keys"
 },
 {
  "adds": {
   "5850": 2
  },
  "consenter_ids": [
   2
  ],
  "created": 1788330863461,
  "creator": "<user_7>",
  "draft_picks": null,
  "drops": {
   "11631": 2
  },
  "league_id": "1389357604773322752",
  "leg": 1,
  "metadata": null,
  "player_map": {
   "5850": {
    "position": "RB",
    "status": "Active",
    "number": 8,
    "first_name": "Josh",
    "last_name": "Jacobs",
    "sport": "nfl",
    "team": "GB",
    "player_id": "5850",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": "NA",
    "years_exp": 7,
    "news_updated": 1788975934438
   },
   "11631": {
    "position": "WR",
    "status": "Active",
    "number": 7,
    "first_name": "Brian",
    "last_name": "Thomas",
    "sport": "nfl",
    "team": "JAX",
    "player_id": "11631",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 2,
    "news_updated": 1788987347490
   }
  },
  "roster_ids": [
   2
  ],
  "settings": null,
  "status": "complete",
  "status_updated": 1788330863461,
  "...": "3 more keys"
 },
 "... 1 more"
]
```


Variant `tx_proposed`:

```graphql
{tx_proposed:league_transactions_by_status(league_id:"1389357604773322752",leg:1,status:"proposed"){status type metadata created settings leg league_id draft_picks creator transaction_id adds drops consenter_ids roster_ids status_updated waiver_budget player_map}}
```

Result: 85 ms, 2 bytes. Trimmed:

```json
[]
```



### `league_transactions_filtered`

```graphql
league_transactions_filtered(limit: Int, league_id: Snowflake!, type_filters: [String], status_filters: [String], leg_filters: [Int], roster_id_filters: [Int]): [LeagueTransaction]
```

Server description: List filtered transactions

Notes: Multi-value filters: `type_filters`, `status_filters`, `leg_filters`, `roster_id_filters`, plus `limit`. Response identical in shape to `league_transactions`.

Example:

```graphql
{league_transactions_filtered(league_id:"1389357604773322752",limit:5,type_filters:["trade"]){status type metadata created settings leg league_id draft_picks creator transaction_id adds drops consenter_ids roster_ids status_updated waiver_budget player_map}}
```

Result: 86 ms, 9,960 bytes. Trimmed:

```json
[
 {
  "adds": {
   "1466": 3,
   "10859": 5,
   "12490": 3
  },
  "consenter_ids": [
   5
  ],
  "created": 1788986431814,
  "creator": "<user_5>",
  "draft_picks": null,
  "drops": {
   "1466": 5,
   "10859": 3,
   "12490": 5
  },
  "league_id": "1389357604773322752",
  "leg": 1,
  "metadata": {
   "rejecter_id": "<user_3>"
  },
  "player_map": {
   "1466": {
    "position": "TE",
    "status": "Active",
    "number": 87,
    "first_name": "Travis",
    "last_name": "Kelce",
    "sport": "nfl",
    "team": "KC",
    "player_id": "1466",
    "fantasy_positions": [
     "TE"
    ],
    "injury_status": null,
    "team_abbr": null,
    "news_updated": 1788442540618,
    "team_changed_at": null,
    "years_exp": 13
   },
   "10859": {
    "position": "TE",
    "status": "Active",
    "number": 87,
    "first_name": "Sam",
    "last_name": "LaPorta",
    "sport": "nfl",
    "team": "DET",
    "player_id": "10859",
    "fantasy_positions": [
     "TE"
    ],
    "injury_status": null,
    "team_abbr": null,
    "news_updated": 1788985247984,
    "team_changed_at": null,
    "years_exp": 3
   },
   "12490": {
    "position": "RB",
    "status": "Active",
    "number": 33,
    "first_name": "Bhayshul",
    "last_name": "Tuten",
    "sport": "nfl",
    "team": "JAX",
    "player_id": "12490",
    "fantasy_positions": [
     "RB"
    ],
    "injury_status": null,
    "team_abbr": null,
    "news_updated": 1788988246606,
    "team_changed_at": null,
    "years_exp": 1
   }
  },
  "roster_ids": [
   3,
   5
  ],
  "settings": null,
  "status": "rejected",
  "status_updated": 1788986455788,
  "...": "3 more keys"
 },
 {
  "adds": {
   "5927": 3,
   "5947": 3,
   "8151": 5,
   "12490": 3
  },
  "consenter_ids": [
   5
  ],
  "created": 1788984399496,
  "creator": "<user_5>",
  "draft_picks": null,
  "drops": {
   "5927": 5,
   "5947": 5,
   "8151": 3,
   "12490": 5
  },
  "league_id": "1389357604773322752",
  "leg": 1,
  "metadata": {
   "rejecter_id": "<user_3>"
  },
  "player_map": {
   "5927": {
    "position": "WR",
    "status": "Active",
    "number": 17,
    "first_name": "Terry",
    "last_name": "McLaurin",
    "sport": "nfl",
    "team": "WAS",
    "player_id": "5927",
    "fantasy_positions": [
     "WR"
    ],
    "injury_status": null,
    "team_abbr": null,
    "news_updated": 1788544521740,
    "team_changed_at": null,
    "years_exp": 7
   },
   "5947": {
    "position": "WR",
    "status": "Active",
    "number": 3,
    "first_name": "Jakobi",
    "last_name": "Meyers",
    "sport": "nfl",
    "team": "JAX",
    "player_id": "5947",
    "fantasy_positions": [
     "WR"
    ],
    "injury_status": "Questionable",
    "team_abbr": null,
    "news_updated": 1788988246636,
    "team_changed_at": null,
    "years_exp": 7
   },
   "8151": {
    "position": "RB",
    "status": "Active",
    "number": 9,
    "first_name": "Kenneth",
    "last_name": "Walker",
    "sport": "nfl",
    "team": "KC",
    "player_id": "8151",
    "fantasy_positions": [
     "RB"
    ],
    "injury_status": null,
    "team_abbr": null,
    "news_updated": 1788621917593,
    "team_changed_at": null,
    "years_exp": 4
   },
   "12490": {
    "position": "RB",
    "status": "Active",
    "number": 33,
    "first_name": "Bhayshul",
    "last_name": "Tuten",
    "sport": "nfl",
    "team": "JAX",
    "player_id": "12490",
    "fantasy_positions": [
     "RB"
    ],
    "injury_status": null,
    "team_abbr": null,
    "news_updated": 1788988246606,
    "team_changed_at": null,
    "years_exp": 1
   }
  },
  "roster_ids": [
   3,
   5
  ],
  "settings": null,
  "status": "rejected",
  "status_updated": 1788984455078,
  "...": "3 more keys"
 },
 "... 3 more"
]
```



### `league_transactions_by_player`

```graphql
league_transactions_by_player(offset: Int, limit: Int, player_id: String!, league_id: Snowflake!): [LeagueTransaction]
```

Server description: League transactions by player and league

Notes: Every transaction touching one player id in this league, with `offset`/`limit`.

Example:

```graphql
{league_transactions_by_player(league_id:"1389357604773322752",player_id:"4983",limit:5){status type metadata created settings leg league_id draft_picks creator transaction_id adds drops consenter_ids roster_ids status_updated waiver_budget player_map}}
```

Result: 81 ms, 1,113 bytes. Trimmed:

```json
[
 {
  "adds": {
   "4983": 1
  },
  "consenter_ids": null,
  "created": 1788131930230,
  "creator": "<user_2>",
  "draft_picks": null,
  "drops": null,
  "league_id": "1389357604773322752",
  "leg": 1,
  "metadata": {
   "draft_id": "1389357604773322753",
   "first_name": "DJ",
   "injury_status": "",
   "is_keeper": "false",
   "last_name": "Moore",
   "news_updated": "1788104455410",
   "number": "2",
   "pick_no": "62",
   "picked_by": "<user_2>",
   "player_id": "4983",
   "position": "WR",
   "round": "8",
   "round_pick_no": "6",
   "sport": "nfl",
   "...": "6 more keys"
  },
  "player_map": {
   "4983": {
    "position": "WR",
    "status": "Active",
    "number": 2,
    "last_name": "Moore",
    "first_name": "DJ",
    "sport": "nfl",
    "team": "BUF",
    "player_id": "4983",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 8,
    "news_updated": 1788880849707
   }
  },
  "roster_ids": [
   1
  ],
  "settings": null,
  "status": "complete",
  "status_updated": 1788131930230,
  "...": "3 more keys"
 }
]
```


Variant `tx_by_player_andrews`:

```graphql
{tx_by_player_andrews:league_transactions_by_player(league_id:"1389357604773322752",player_id:"5012"){status type metadata created settings leg league_id draft_picks creator transaction_id adds drops consenter_ids roster_ids status_updated waiver_budget player_map}}
```

Result: 75 ms, 2,118 bytes. Trimmed:

```json
[
 {
  "adds": {
   "5012": 3,
   "9487": 1
  },
  "consenter_ids": [
   1,
   3
  ],
  "created": 1788371562251,
  "creator": "<user_3>",
  "draft_picks": null,
  "drops": {
   "5012": 1,
   "9487": 3
  },
  "league_id": "1389357604773322752",
  "leg": 1,
  "metadata": {
   "notes": "Your trade was processed successfully!"
  },
  "player_map": {
   "5012": {
    "position": "TE",
    "status": "Active",
    "number": 89,
    "first_name": "Mark",
    "last_name": "Andrews",
    "sport": "nfl",
    "team": "BAL",
    "player_id": "5012",
    "fantasy_positions": [
     "TE"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 8,
    "news_updated": 1788552322233
   },
   "9487": {
    "position": "WR",
    "status": "Active",
    "number": 11,
    "first_name": "Parker",
    "last_name": "Washington",
    "sport": "nfl",
    "team": "JAX",
    "player_id": "9487",
    "fantasy_positions": [
     "WR"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 3,
    "news_updated": 1788981045275
   }
  },
  "roster_ids": [
   1,
   3
  ],
  "settings": {
   "expires_at": 1788630762
  },
  "status": "complete",
  "status_updated": 1788589377990,
  "...": "3 more keys"
 },
 {
  "adds": {
   "5012": 1
  },
  "consenter_ids": [
   1
  ],
  "created": 1788132208169,
  "creator": "<user_2>",
  "draft_picks": null,
  "drops": {
   "5850": 1
  },
  "league_id": "1389357604773322752",
  "leg": 1,
  "metadata": null,
  "player_map": {
   "5012": {
    "position": "TE",
    "status": "Active",
    "number": 89,
    "first_name": "Mark",
    "last_name": "Andrews",
    "sport": "nfl",
    "team": "BAL",
    "player_id": "5012",
    "fantasy_positions": [
     "TE"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": null,
    "years_exp": 8,
    "news_updated": 1788552322233
   },
   "5850": {
    "position": "RB",
    "status": "Active",
    "number": 8,
    "first_name": "Josh",
    "last_name": "Jacobs",
    "sport": "nfl",
    "team": "GB",
    "player_id": "5850",
    "fantasy_positions": [
     "RB"
    ],
    "team_abbr": null,
    "team_changed_at": null,
    "injury_status": "NA",
    "years_exp": 7,
    "news_updated": 1788975934438
   }
  },
  "roster_ids": [
   1
  ],
  "settings": null,
  "status": "complete",
  "status_updated": 1788132208169,
  "...": "3 more keys"
 }
]
```



## Drafts

### `get_draft`

```graphql
get_draft(sport: String!, draft_id: Snowflake!): Draft
```

Server description: Fetch a draft

Notes: Same as REST `/draft/{id}` plus `creators`, `last_message_*`. `league_id: null` for mock drafts.

Example:

```graphql
{get_draft(sport:"nfl",draft_id:"1389357604773322753"){status type metadata start_time created settings sport season_type season last_message_id last_message_time draft_id creators league_id draft_order last_picked}}
```

Result: 75 ms, 1,108 bytes. Trimmed:

```json
{
 "created": 1785611175295,
 "creators": [
  "<user_2>"
 ],
 "draft_id": "1389357604773322753",
 "draft_order": {
  "<user_5>": 7,
  "<user_2>": 3,
  "<user_6>": 5,
  "<user_7>": 1,
  "<user_8>": 2,
  "<user_3>": 4,
  "<user_9>": 6,
  "<user_10>": 8
 },
 "last_message_id": "1399930419872321536",
 "last_message_time": 1788131930848,
 "last_picked": 1788131930168,
 "league_id": "1389357604773322752",
 "metadata": {
  "description": "",
  "league_type": "0",
  "name": "Pit Podcast powered by BAA",
  "scoring_type": "ppr",
  "show_team_names": "0"
 },
 "season": "2026",
 "season_type": "regular",
 "settings": {
  "alpha_sort": 0,
  "autopause_enabled": 0,
  "autopause_end_time": 840,
  "autopause_start_time": 120,
  "autostart": 0,
  "cpu_autopick": 1,
  "nomination_timer": 60,
  "pick_timer": 90,
  "player_type": 0,
  "reversal_round": 0,
  "rounds": 16,
  "slots_bn": 6,
  "slots_def": 1,
  "slots_flex": 2,
  "...": "6 more keys"
 },
 "sport": "nfl",
 "start_time": 1788127790950,
 "...": "2 more keys"
}
```


Variant `get_draft_mock`:

```graphql
{get_draft_mock:get_draft(sport:"nfl",draft_id:"1399889357652910080"){status type metadata start_time created settings sport season_type season last_message_id last_message_time draft_id creators league_id draft_order last_picked}}
```

Result: 71 ms, 880 bytes. Trimmed:

```json
{
 "created": 1788122140845,
 "creators": [
  "<user_3>"
 ],
 "draft_id": "1399889357652910080",
 "draft_order": {
  "<user_3>": 6
 },
 "last_message_id": "1399891146179653633",
 "last_message_time": 1788122567271,
 "last_picked": 1788122567259,
 "league_id": null,
 "metadata": {
  "description": "",
  "is_autopaused": "false",
  "name": "",
  "scoring_type": "half_ppr",
  "show_team_names": "0"
 },
 "season": "2026",
 "season_type": "regular",
 "settings": {
  "alpha_sort": 0,
  "autopause_enabled": 0,
  "autopause_end_time": 840,
  "autopause_start_time": 120,
  "autostart": 0,
  "cpu_autopick": 1,
  "nomination_timer": 60,
  "pick_timer": 120,
  "player_type": 0,
  "reversal_round": 0,
  "rounds": 15,
  "slots_def": 1,
  "slots_flex": 2,
  "slots_k": 1,
  "...": "5 more keys"
 },
 "sport": "nfl",
 "start_time": 1788122185284,
 "...": "2 more keys"
}
```



### `drafts_by_league_id`

```graphql
drafts_by_league_id(league_id: Snowflake!): [Draft]
```

Server description: Drafts by league id

Notes: Same as REST `/league/{id}/drafts`.

Example:

```graphql
{drafts_by_league_id(league_id:"1389357604773322752"){status type metadata start_time created settings sport season_type season last_message_id last_message_time draft_id creators league_id draft_order last_picked}}
```

Result: 73 ms, 1,110 bytes. Trimmed:

```json
[
 {
  "created": 1785611175295,
  "creators": [
   "<user_2>"
  ],
  "draft_id": "1389357604773322753",
  "draft_order": {
   "<user_5>": 7,
   "<user_2>": 3,
   "<user_6>": 5,
   "<user_7>": 1,
   "<user_8>": 2,
   "<user_3>": 4,
   "<user_9>": 6,
   "<user_10>": 8
  },
  "last_message_id": "1399930419872321536",
  "last_message_time": 1788131930848,
  "last_picked": 1788131930168,
  "league_id": "1389357604773322752",
  "metadata": {
   "description": "",
   "league_type": "0",
   "name": "Pit Podcast powered by BAA",
   "scoring_type": "ppr",
   "show_team_names": "0"
  },
  "season": "2026",
  "season_type": "regular",
  "settings": {
   "alpha_sort": 0,
   "autopause_enabled": 0,
   "autopause_end_time": 840,
   "autopause_start_time": 120,
   "autostart": 0,
   "cpu_autopick": 1,
   "nomination_timer": 60,
   "pick_timer": 90,
   "player_type": 0,
   "reversal_round": 0,
   "rounds": 16,
   "slots_bn": 6,
   "slots_def": 1,
   "slots_flex": 2,
   "...": "6 more keys"
  },
  "sport": "nfl",
  "start_time": 1788127790950,
  "...": "2 more keys"
 }
]
```



### `draft_picks`

```graphql
draft_picks(draft_id: Snowflake!): [DraftPick]
```

Server description: Fetch draft picks on board

Notes: Same as REST `/draft/{id}/picks` plus `reactions`. 56 KB for a 3-round 8-team draft with player metadata.

Example:

```graphql
{draft_picks(draft_id:"1389357604773322753"){metadata player_id draft_id reactions pick_no picked_by is_keeper}}
```

Result: 131 ms, 56,490 bytes. Trimmed:

```json
[
 {
  "draft_id": "1389357604773322753",
  "is_keeper": null,
  "metadata": {
   "first_name": "Jahmyr",
   "injury_status": "",
   "last_name": "Gibbs",
   "news_updated": "1787807460056",
   "number": "0",
   "player_id": "9221",
   "position": "RB",
   "sport": "nfl",
   "status": "Active",
   "team": "DET",
   "team_abbr": "",
   "team_changed_at": "",
   "years_exp": "3"
  },
  "pick_no": 1,
  "picked_by": "<user_7>",
  "player_id": "9221",
  "reactions": {
   "1267685386142887936": [
    "crying"
   ]
  }
 },
 {
  "draft_id": "1389357604773322753",
  "is_keeper": null,
  "metadata": {
   "first_name": "Bijan",
   "injury_status": "",
   "last_name": "Robinson",
   "news_updated": "1787794258583",
   "number": "7",
   "player_id": "9509",
   "position": "RB",
   "sport": "nfl",
   "status": "Active",
   "team": "ATL",
   "team_abbr": "",
   "team_changed_at": "",
   "years_exp": "3"
  },
  "pick_no": 2,
  "picked_by": "<user_8>",
  "player_id": "9509",
  "reactions": {
   "1267685386142887936": [
    "crying"
   ]
  }
 },
 "... 126 more"
]
```


Variant `draft_picks_mock`:

```graphql
{draft_picks_mock:draft_picks(draft_id:"1399889357652910080"){metadata player_id draft_id reactions pick_no picked_by is_keeper}}
```

Result: 124 ms, 49,419 bytes. Trimmed:

```json
[
 {
  "draft_id": "1399889357652910080",
  "is_keeper": null,
  "metadata": {
   "first_name": "Bijan",
   "injury_status": "",
   "last_name": "Robinson",
   "news_updated": "1787794258583",
   "number": "7",
   "player_id": "9509",
   "position": "RB",
   "sport": "nfl",
   "status": "Active",
   "team": "ATL",
   "team_abbr": "",
   "team_changed_at": "",
   "years_exp": "3"
  },
  "pick_no": 1,
  "picked_by": "0",
  "player_id": "9509",
  "reactions": null
 },
 {
  "draft_id": "1399889357652910080",
  "is_keeper": null,
  "metadata": {
   "first_name": "Puka",
   "injury_status": "Questionable",
   "last_name": "Nacua",
   "news_updated": "1788118256607",
   "number": "12",
   "player_id": "9493",
   "position": "WR",
   "sport": "nfl",
   "status": "Active",
   "team": "LAR",
   "team_abbr": "",
   "team_changed_at": "",
   "years_exp": "3"
  },
  "pick_no": 2,
  "picked_by": "0",
  "player_id": "9493",
  "reactions": null
 },
 "... 118 more"
]
```



### `draft_queue`

```graphql
draft_queue(draft_id: Snowflake!): [String]
```

Server description: Fetch draft queue

Notes: The caller's draft queue for a draft, as player ids. No REST equivalent.

Example:

```graphql
{draft_queue(draft_id:"1389357604773322753")}
```

Result: 73 ms, 50 bytes. Trimmed:

```json
[
 "7594",
 "4199",
 "... 4 more"
]
```



### `draft_autopickers`

```graphql
draft_autopickers(sport: String!, draft_id: Snowflake!): [Snowflake]
```

Notes: User ids currently on autopick. Empty after the draft.

Example:

```graphql
{draft_autopickers(sport:"nfl",draft_id:"1389357604773322753")}
```

Result: 79 ms, 2 bytes. Trimmed:

```json
[]
```



### `draft_offers`

```graphql
draft_offers(sport: String!, draft_id: Snowflake!, pick_no: Int!): [DraftOffer]
```

Server description: fetch draft offers for a pick

Notes: Auction offers for a pick number. Empty for a snake draft.

Example:

```graphql
{draft_offers(sport:"nfl",draft_id:"1389357604773322753",pick_no:1){time slot metadata amount user_id player_id draft_id pick_no}}
```

Result: 79 ms, 2 bytes. Trimmed:

```json
[]
```



### `get_user_draft_settings`

```graphql
get_user_draft_settings(draft_id: String!): UserDraft
```

Server description: Get user draft settings

Notes: Caller's per-draft settings (`allow_pn`, `mention_pn`) plus a copy of the draft.

Example:

```graphql
{get_user_draft_settings(draft_id:"1389357604773322753"){status type metadata start_time created settings user_id sport season_type season last_message_id last_message_time draft_id last_read_id league_id last_picked allow_pn mention_pn user_avatar user_display_name user_is_bot}}
```

Result: 70 ms, 1,049 bytes. Trimmed:

```json
{
 "allow_pn": true,
 "created": 1785611175295,
 "draft_id": "1389357604773322753",
 "last_message_id": "1399930419872321536",
 "last_message_time": 1788131930848,
 "last_picked": 1788131930168,
 "last_read_id": null,
 "league_id": "1389357604773322752",
 "mention_pn": true,
 "metadata": {
  "description": "",
  "league_type": "0",
  "name": "Pit Podcast powered by BAA",
  "scoring_type": "ppr",
  "show_team_names": "0"
 },
 "season": "2026",
 "season_type": "regular",
 "settings": {
  "alpha_sort": 0,
  "autopause_enabled": 0,
  "autopause_end_time": 840,
  "autopause_start_time": 120,
  "autostart": 0,
  "cpu_autopick": 1,
  "nomination_timer": 60,
  "pick_timer": 90,
  "player_type": 0,
  "reversal_round": 0,
  "rounds": 16,
  "slots_bn": 6,
  "slots_def": 1,
  "slots_flex": 2,
  "...": "6 more keys"
 },
 "sport": "nfl",
 "...": "7 more keys"
}
```



### `user_drafts`

```graphql
user_drafts(before: Snowflake, sport: String!, season_type: String!, season: String!): [UserDraft]
```

Server description: list user drafts for a sport, season_type, season

Notes: All drafts the caller is in for a sport/season, including mocks (`league_id: null`). `before` paginates by draft id. 38 KB here.

Example:

```graphql
{user_drafts(sport:"nfl",season_type:"regular",season:"2026"){status type metadata start_time created settings user_id sport season_type season last_message_id last_message_time draft_id last_read_id league_id last_picked allow_pn mention_pn user_avatar user_display_name user_is_bot}}
```

Result: 122 ms, 37,751 bytes. Trimmed:

```json
[
 {
  "allow_pn": true,
  "created": 1788122140845,
  "draft_id": "1399889357652910080",
  "last_message_id": "1399891146179653633",
  "last_message_time": 1788122567271,
  "last_picked": 1788122567259,
  "last_read_id": null,
  "league_id": null,
  "mention_pn": true,
  "metadata": {
   "description": "",
   "elapsed_pick_timer": "8140",
   "is_autopaused": "false",
   "name": "",
   "scoring_type": "half_ppr",
   "show_team_names": "0"
  },
  "season": "2026",
  "season_type": "regular",
  "settings": {
   "alpha_sort": 0,
   "autopause_enabled": 0,
   "autopause_end_time": 840,
   "autopause_start_time": 120,
   "autostart": 0,
   "cpu_autopick": 1,
   "nomination_timer": 60,
   "pick_timer": 120,
   "player_type": 0,
   "reversal_round": 0,
   "rounds": 15,
   "slots_def": 1,
   "slots_flex": 2,
   "slots_k": 1,
   "...": "5 more keys"
  },
  "sport": "nfl",
  "...": "7 more keys"
 },
 {
  "allow_pn": true,
  "created": 1788122065023,
  "draft_id": "1399889039628181504",
  "last_message_id": "1399889544081321984",
  "last_message_time": 1788122185301,
  "last_picked": 1788122136251,
  "last_read_id": null,
  "league_id": null,
  "mention_pn": true,
  "metadata": {
   "description": "",
   "elapsed_pick_timer": "49044",
   "is_autopaused": "false",
   "name": "",
   "scoring_type": "half_ppr",
   "show_team_names": "0"
  },
  "season": "2026",
  "season_type": "regular",
  "settings": {
   "alpha_sort": 0,
   "autopause_enabled": 0,
   "autopause_end_time": 840,
   "autopause_start_time": 120,
   "autostart": 0,
   "cpu_autopick": 1,
   "nomination_timer": 60,
   "pick_timer": 120,
   "player_type": 0,
   "reversal_round": 0,
   "rounds": 15,
   "slots_def": 1,
   "slots_flex": 2,
   "slots_k": 1,
   "...": "5 more keys"
  },
  "sport": "nfl",
  "...": "7 more keys"
 },
 "... 36 more"
]
```



### `user_drafts_by_draft`

```graphql
user_drafts_by_draft(draft_id: Snowflake!): [UserDraft]
```

Server description: list user drafts by status, like in_progress drafts

Notes: Every user's UserDraft row for one draft (who has notifications on, who joined).

Example:

```graphql
{user_drafts_by_draft(draft_id:"1389357604773322753"){status type metadata start_time created settings user_id sport season_type season last_message_id last_message_time draft_id last_read_id league_id last_picked allow_pn mention_pn user_avatar user_display_name user_is_bot}}
```

Result: 80 ms, 8,438 bytes. Trimmed:

```json
[
 {
  "allow_pn": true,
  "created": 1785611175295,
  "draft_id": "1389357604773322753",
  "last_message_id": "1399930419872321536",
  "last_message_time": 1788131930848,
  "last_picked": 1788131930168,
  "last_read_id": null,
  "league_id": "1389357604773322752",
  "mention_pn": true,
  "metadata": {
   "description": "",
   "league_type": "0",
   "name": "Pit Podcast powered by BAA",
   "scoring_type": "ppr",
   "show_team_names": "0"
  },
  "season": "2026",
  "season_type": "regular",
  "settings": {
   "alpha_sort": 0,
   "autopause_enabled": 0,
   "autopause_end_time": 840,
   "autopause_start_time": 120,
   "autostart": 0,
   "cpu_autopick": 1,
   "nomination_timer": 60,
   "pick_timer": 90,
   "player_type": 0,
   "reversal_round": 0,
   "rounds": 16,
   "slots_bn": 6,
   "slots_def": 1,
   "slots_flex": 2,
   "...": "6 more keys"
  },
  "sport": "nfl",
  "...": "7 more keys"
 },
 {
  "allow_pn": true,
  "created": 1785611175295,
  "draft_id": "1389357604773322753",
  "last_message_id": "1399930419872321536",
  "last_message_time": 1788131930848,
  "last_picked": 1788131930168,
  "last_read_id": null,
  "league_id": "1389357604773322752",
  "mention_pn": true,
  "metadata": {
   "description": "",
   "league_type": "0",
   "name": "Pit Podcast powered by BAA",
   "scoring_type": "ppr",
   "show_team_names": "0"
  },
  "season": "2026",
  "season_type": "regular",
  "settings": {
   "alpha_sort": 0,
   "autopause_enabled": 0,
   "autopause_end_time": 840,
   "autopause_start_time": 120,
   "autostart": 0,
   "cpu_autopick": 1,
   "nomination_timer": 60,
   "pick_timer": 90,
   "player_type": 0,
   "reversal_round": 0,
   "rounds": 16,
   "slots_bn": 6,
   "slots_def": 1,
   "slots_flex": 2,
   "...": "6 more keys"
  },
  "sport": "nfl",
  "...": "7 more keys"
 },
 "... 6 more"
]
```



### `user_drafts_by_league_mock`

```graphql
user_drafts_by_league_mock(league_id: Snowflake!): [UserDraft]
```

Server description: list user drafts by status, like in_progress drafts

Notes: Mock drafts attached to a league.

Example:

```graphql
{user_drafts_by_league_mock(league_id:"1389357604773322752"){status type metadata start_time created settings user_id sport season_type season last_message_id last_message_time draft_id last_read_id league_id last_picked allow_pn mention_pn user_avatar user_display_name user_is_bot}}
```

Result: 78 ms, 2,254 bytes. Trimmed:

```json
[
 {
  "allow_pn": true,
  "created": 1786111109786,
  "draft_id": "1391454482067374080",
  "last_message_id": "1391455622205030400",
  "last_message_time": 1786111381631,
  "last_picked": 1786111381618,
  "last_read_id": null,
  "league_id": null,
  "mention_pn": true,
  "metadata": {
   "description": "",
   "league_id": "1389357604773322752",
   "league_type": "0",
   "mock_traded_picks": "on",
   "name": "Pit Podcast powered by Royal Shirtery",
   "scoring_type": "ppr",
   "show_team_names": "0",
   "type": "league_mock"
  },
  "season": "2026",
  "season_type": "regular",
  "settings": {
   "alpha_sort": 0,
   "autopause_enabled": 0,
   "autopause_end_time": 840,
   "autopause_start_time": 120,
   "autostart": 0,
   "cpu_autopick": 1,
   "nomination_timer": 60,
   "pick_timer": 90,
   "player_type": 0,
   "reversal_round": 0,
   "rounds": 16,
   "slots_bn": 6,
   "slots_def": 1,
   "slots_flex": 2,
   "...": "6 more keys"
  },
  "sport": "nfl",
  "...": "7 more keys"
 },
 {
  "allow_pn": true,
  "created": 1786108654774,
  "draft_id": "1391444184992333824",
  "last_message_id": "1391449398403141632",
  "last_message_time": 1786109897760,
  "last_picked": 1786109897745,
  "last_read_id": null,
  "league_id": null,
  "mention_pn": true,
  "metadata": {
   "description": "",
   "league_id": "1389357604773322752",
   "league_type": "0",
   "mock_traded_picks": "on",
   "name": "Pit Podcast powered by Royal Shirtery",
   "scoring_type": "ppr",
   "show_team_names": "0",
   "type": "league_mock"
  },
  "season": "2026",
  "season_type": "regular",
  "settings": {
   "alpha_sort": 0,
   "autopause_enabled": 0,
   "autopause_end_time": 840,
   "autopause_start_time": 120,
   "autostart": 0,
   "cpu_autopick": 1,
   "nomination_timer": 60,
   "pick_timer": 90,
   "player_type": 0,
   "reversal_round": 0,
   "rounds": 16,
   "slots_bn": 6,
   "slots_def": 1,
   "slots_flex": 2,
   "...": "6 more keys"
  },
  "sport": "nfl",
  "...": "7 more keys"
 }
]
```



### `user_drafts_by_status`

```graphql
user_drafts_by_status(status: String!, before: Snowflake, sport: String!, season_type: String!, season: String!): [UserDraft]
```

Server description: list user drafts by status, like in_progress drafts

Notes: Observed statuses: `complete`, `paused`, `pre_draft`. `drafting` returned empty (none live). Unknown strings return empty rather than an error.

Example:

```graphql
{user_drafts_by_status(status:"complete",sport:"nfl",season_type:"regular",season:"2026"){status type metadata start_time created settings user_id sport season_type season last_message_id last_message_time draft_id last_read_id league_id last_picked allow_pn mention_pn user_avatar user_display_name user_is_bot}}
```

Result: 86 ms, 25,748 bytes. Trimmed:

```json
[
 {
  "allow_pn": true,
  "created": 1788122140845,
  "draft_id": "1399889357652910080",
  "last_message_id": "1399891146179653633",
  "last_message_time": 1788122567271,
  "last_picked": 1788122567259,
  "last_read_id": null,
  "league_id": null,
  "mention_pn": true,
  "metadata": {
   "description": "",
   "elapsed_pick_timer": "8140",
   "is_autopaused": "false",
   "name": "",
   "scoring_type": "half_ppr",
   "show_team_names": "0"
  },
  "season": "2026",
  "season_type": "regular",
  "settings": {
   "alpha_sort": 0,
   "autopause_enabled": 0,
   "autopause_end_time": 840,
   "autopause_start_time": 120,
   "autostart": 0,
   "cpu_autopick": 1,
   "nomination_timer": 60,
   "pick_timer": 120,
   "player_type": 0,
   "reversal_round": 0,
   "rounds": 15,
   "slots_def": 1,
   "slots_flex": 2,
   "slots_k": 1,
   "...": "5 more keys"
  },
  "sport": "nfl",
  "...": "7 more keys"
 },
 {
  "allow_pn": true,
  "created": 1788120571621,
  "draft_id": "1399882775850434560",
  "last_message_id": "1399886375003697152",
  "last_message_time": 1788121429733,
  "last_picked": 1788121429721,
  "last_read_id": null,
  "league_id": null,
  "mention_pn": true,
  "metadata": {
   "description": "",
   "elapsed_pick_timer": "8140",
   "is_autopaused": "false",
   "name": "",
   "scoring_type": "half_ppr",
   "show_team_names": "0"
  },
  "season": "2026",
  "season_type": "regular",
  "settings": {
   "alpha_sort": 0,
   "autopause_enabled": 0,
   "autopause_end_time": 840,
   "autopause_start_time": 120,
   "autostart": 0,
   "cpu_autopick": 1,
   "nomination_timer": 60,
   "pick_timer": 120,
   "player_type": 0,
   "reversal_round": 0,
   "rounds": 15,
   "slots_def": 1,
   "slots_flex": 2,
   "slots_k": 1,
   "...": "5 more keys"
  },
  "sport": "nfl",
  "...": "7 more keys"
 },
 "... 24 more"
]
```


Variant `drafts_drafting`:

```graphql
{drafts_drafting:user_drafts_by_status(status:"drafting",sport:"nfl",season_type:"regular",season:"2026"){status type metadata start_time created settings user_id sport season_type season last_message_id last_message_time draft_id last_read_id league_id last_picked allow_pn mention_pn user_avatar user_display_name user_is_bot}}
```

Result: 80 ms, 2 bytes. Trimmed:

```json
[]
```


Variant `drafts_pre_draft`:

```graphql
{drafts_pre_draft:user_drafts_by_status(status:"pre_draft",sport:"nfl",season_type:"regular",season:"2026"){status type metadata start_time created settings user_id sport season_type season last_message_id last_message_time draft_id last_read_id league_id last_picked allow_pn mention_pn user_avatar user_display_name user_is_bot}}
```

Result: 76 ms, 2,686 bytes. Trimmed:

```json
[
 {
  "allow_pn": true,
  "created": 1786125546343,
  "draft_id": "1391515033342578688",
  "last_message_id": "1391515033342578688",
  "last_message_time": 1786125546343,
  "last_picked": null,
  "last_read_id": null,
  "league_id": null,
  "mention_pn": true,
  "metadata": {
   "description": "",
   "name": "",
   "scoring_type": "half_ppr",
   "show_team_names": "0"
  },
  "season": "2026",
  "season_type": "regular",
  "settings": {
   "alpha_sort": 0,
   "autopause_enabled": 0,
   "autopause_end_time": 840,
   "autopause_start_time": 120,
   "autostart": 0,
   "cpu_autopick": 1,
   "nomination_timer": 60,
   "pick_timer": 120,
   "player_type": 0,
   "reversal_round": 0,
   "rounds": 15,
   "slots_def": 1,
   "slots_flex": 2,
   "slots_k": 1,
   "...": "5 more keys"
  },
  "sport": "nfl",
  "...": "7 more keys"
 },
 {
  "allow_pn": true,
  "created": 1786118715683,
  "draft_id": "1391486383482228736",
  "last_message_id": "1391486383482228736",
  "last_message_time": 1786118715683,
  "last_picked": null,
  "last_read_id": null,
  "league_id": null,
  "mention_pn": true,
  "metadata": {
   "description": "",
   "name": "",
   "scoring_type": "half_ppr",
   "show_team_names": "0"
  },
  "season": "2026",
  "season_type": "regular",
  "settings": {
   "alpha_sort": 0,
   "autopause_enabled": 0,
   "autopause_end_time": 840,
   "autopause_start_time": 120,
   "autostart": 0,
   "cpu_autopick": 1,
   "nomination_timer": 60,
   "pick_timer": 120,
   "player_type": 0,
   "reversal_round": 0,
   "rounds": 15,
   "slots_def": 1,
   "slots_flex": 2,
   "slots_k": 1,
   "...": "5 more keys"
  },
  "sport": "nfl",
  "...": "7 more keys"
 },
 "... 1 more"
]
```


Variant `drafts_paused`:

```graphql
{drafts_paused:user_drafts_by_status(status:"paused",sport:"nfl",season_type:"regular",season:"2026"){status type metadata start_time created settings user_id sport season_type season last_message_id last_message_time draft_id last_read_id league_id last_picked allow_pn mention_pn user_avatar user_display_name user_is_bot}}
```

Result: 65 ms, 5,146 bytes. Trimmed:

```json
[
 {
  "allow_pn": true,
  "created": 1788122065023,
  "draft_id": "1399889039628181504",
  "last_message_id": "1399889544081321984",
  "last_message_time": 1788122185301,
  "last_picked": 1788122136251,
  "last_read_id": null,
  "league_id": null,
  "mention_pn": true,
  "metadata": {
   "description": "",
   "elapsed_pick_timer": "49044",
   "is_autopaused": "false",
   "name": "",
   "scoring_type": "half_ppr",
   "show_team_names": "0"
  },
  "season": "2026",
  "season_type": "regular",
  "settings": {
   "alpha_sort": 0,
   "autopause_enabled": 0,
   "autopause_end_time": 840,
   "autopause_start_time": 120,
   "autostart": 0,
   "cpu_autopick": 1,
   "nomination_timer": 60,
   "pick_timer": 120,
   "player_type": 0,
   "reversal_round": 0,
   "rounds": 15,
   "slots_def": 1,
   "slots_flex": 2,
   "slots_k": 1,
   "...": "5 more keys"
  },
  "sport": "nfl",
  "...": "7 more keys"
 },
 {
  "allow_pn": true,
  "created": 1788121705158,
  "draft_id": "1399887530249224192",
  "last_message_id": "1399889192053415936",
  "last_message_time": 1788122101370,
  "last_picked": 1788122079885,
  "last_read_id": null,
  "league_id": null,
  "mention_pn": true,
  "metadata": {
   "description": "",
   "elapsed_pick_timer": "21477",
   "is_autopaused": "false",
   "name": "",
   "scoring_type": "half_ppr",
   "show_team_names": "0"
  },
  "season": "2026",
  "season_type": "regular",
  "settings": {
   "alpha_sort": 0,
   "autopause_enabled": 0,
   "autopause_end_time": 840,
   "autopause_start_time": 120,
   "autostart": 0,
   "cpu_autopick": 1,
   "nomination_timer": 60,
   "pick_timer": 120,
   "player_type": 0,
   "reversal_round": 0,
   "rounds": 15,
   "slots_def": 1,
   "slots_flex": 2,
   "slots_k": 1,
   "...": "5 more keys"
  },
  "sport": "nfl",
  "...": "7 more keys"
 },
 "... 3 more"
]
```



## Players, news, stats, projections

### `get_player`

```graphql
get_player(sport: String!, player_id: String!): Player
```

Server description: Get a player

Notes: One player, full record (43 fields). Aliasable: 60 `get_player` aliases in one request returned in 91 ms with zero nulls. `player_id: "SEA"` returns the defense as a player. Uncached.

Example:

```graphql
{get_player(sport:"nfl",player_id:"4983"){birth_state injury_start_date rotoworld_id sportradar_id metadata height practice_participation active college depth_chart_order first_name yahoo_id team_changed_at status espn_id number rotowire_id stats_id injury_body_part high_school team_abbr injury_notes practice_description team fantasy_data_id sport last_name swish_id hashtag birth_date dl_trading_id birth_city fantasy_positions birth_country weight position depth_chart_position years_exp injury_status age player_id}}
```

Result: 76 ms, 1,017 bytes. Trimmed:

```json
{
 "last_name": "Moore",
 "player_id": "4983",
 "depth_chart_order": 1,
 "first_name": "DJ",
 "hashtag": null,
 "injury_notes": null,
 "injury_status": null,
 "metadata": {
  "channel_id": "1113708766076891136",
  "genius_id": "1008102",
  "rookie_year": "2018"
 },
 "height": "72",
 "rotoworld_id": null,
 "active": true,
 "team_abbr": null,
 "birth_city": null,
 "espn_id": 3915416,
 "...": "27 more keys"
}
```


Variant `get_player_def`:

```graphql
{get_player_def:get_player(sport:"nfl",player_id:"SEA"){birth_state injury_start_date rotoworld_id sportradar_id metadata height practice_participation active college depth_chart_order first_name yahoo_id team_changed_at status espn_id number rotowire_id stats_id injury_body_part high_school team_abbr injury_notes practice_description team fantasy_data_id sport last_name swish_id hashtag birth_date dl_trading_id birth_city fantasy_positions birth_country weight position depth_chart_position years_exp injury_status age player_id}}
```

Result: 74 ms, 865 bytes. Trimmed:

```json
{
 "last_name": "Seahawks",
 "player_id": "SEA",
 "depth_chart_order": null,
 "first_name": "Seattle",
 "hashtag": null,
 "injury_notes": null,
 "injury_status": null,
 "metadata": null,
 "height": null,
 "rotoworld_id": null,
 "active": null,
 "team_abbr": null,
 "birth_city": null,
 "espn_id": null,
 "...": "27 more keys"
}
```



### `get_active_players`

```graphql
get_active_players(sport: String!): [Player]
```

Server description: Get active players by sport

Notes: 3,198 active players in one 3.2 MB response (1.9 s). REST `/players/nfl` is 14.6 MB / 12,227 rows including retired players. Field values (team, injury_status, status, depth chart, practice) matched the REST blob on every player at capture time; the REST blob had `age: 263` on `s-maxage=600`. GraphQL has no `news_updated` field on Player; REST does.

Example:

```graphql
{get_active_players(sport:"nfl"){birth_state injury_start_date rotoworld_id sportradar_id metadata height practice_participation active college depth_chart_order first_name yahoo_id team_changed_at status espn_id number rotowire_id stats_id injury_body_part high_school team_abbr injury_notes practice_description team fantasy_data_id sport last_name swish_id hashtag birth_date dl_trading_id birth_city fantasy_positions birth_country weight position depth_chart_position years_exp injury_status age player_id}}
```

Result: 1879 ms, 3,169,775 bytes. Trimmed:

```json
[
 {
  "last_name": "Robinson",
  "player_id": "9509",
  "depth_chart_order": 1,
  "first_name": "Bijan",
  "hashtag": null,
  "injury_notes": null,
  "injury_status": null,
  "metadata": {
   "channel_id": "1113708865150545921",
   "genius_id": "1398582",
   "rookie_year": "2023"
  },
  "height": "71",
  "rotoworld_id": null,
  "active": true,
  "team_abbr": null,
  "birth_city": null,
  "espn_id": null,
  "...": "27 more keys"
 },
 {
  "last_name": "Gibbs",
  "player_id": "9221",
  "depth_chart_order": 1,
  "first_name": "Jahmyr",
  "hashtag": null,
  "injury_notes": null,
  "injury_status": null,
  "metadata": {
   "channel_id": "1113708815989108736",
   "genius_id": "1398586",
   "rookie_year": "2023"
  },
  "height": "69",
  "rotoworld_id": null,
  "active": true,
  "team_abbr": null,
  "birth_city": null,
  "espn_id": null,
  "...": "27 more keys"
 },
 "... 3196 more"
]
```



### `search_players`

```graphql
search_players(prefix: String!, limit: Int, sport: String!): [Player]
```

Server description: Search Players by Sport

Notes: Prefix search on name. Returns full Player rows.

Example:

```graphql
{search_players(prefix:"mahomes",limit:3,sport:"nfl"){birth_state injury_start_date rotoworld_id sportradar_id metadata height practice_participation active college depth_chart_order first_name yahoo_id team_changed_at status espn_id number rotowire_id stats_id injury_body_part high_school team_abbr injury_notes practice_description team fantasy_data_id sport last_name swish_id hashtag birth_date dl_trading_id birth_city fantasy_positions birth_country weight position depth_chart_position years_exp injury_status age player_id}}
```

Result: 87 ms, 1,059 bytes. Trimmed:

```json
[
 {
  "last_name": "Mahomes",
  "player_id": "4046",
  "depth_chart_order": 1,
  "first_name": "Patrick",
  "hashtag": "#patrickmahomes-NFL-KC-15",
  "injury_notes": "Surgery",
  "injury_status": "Questionable",
  "metadata": {
   "channel_id": "1113708747563233280",
   "genius_id": "998871",
   "rookie_year": "2017"
  },
  "height": "74",
  "rotoworld_id": 12142,
  "active": true,
  "team_abbr": null,
  "birth_city": null,
  "espn_id": 3139477,
  "...": "27 more keys"
 }
]
```



### `search_players_in_text`

```graphql
search_players_in_text(text: String!, sport: String!): Map
```

Server description: Search for players in Text

Notes: Finds player names in free text. Took 15.5 s and returned `{Kelce: [], Mahomes: []}` for `"Mahomes to Kelce"`. Not usable for real-time parsing.

Example:

```graphql
{search_players_in_text(text:"Mahomes to Kelce",sport:"nfl")}
```

Result: 15507 ms, 28 bytes. Trimmed:

```json
{
 "Kelce": [],
 "Mahomes": []
}
```



### `trending_players`

```graphql
trending_players(sort: String!, sport: String!): [Player]
```

Server description: Trending players

Notes: `sort: "add"` or `"drop"`. Returns Player rows with almost every field null except `player_id` (the client hydrates them). REST `/players/nfl/trending/add` gives counts instead.

Example:

```graphql
{trending_players(sort:"add",sport:"nfl"){birth_state injury_start_date rotoworld_id sportradar_id metadata height practice_participation active college depth_chart_order first_name yahoo_id team_changed_at status espn_id number rotowire_id stats_id injury_body_part high_school team_abbr injury_notes practice_description team fantasy_data_id sport last_name swish_id hashtag birth_date dl_trading_id birth_city fantasy_positions birth_country weight position depth_chart_position years_exp injury_status age player_id}}
```

Result: 143 ms, 21,281 bytes. Trimmed:

```json
[
 {
  "last_name": null,
  "player_id": "9482",
  "depth_chart_order": null,
  "first_name": null,
  "hashtag": null,
  "injury_notes": null,
  "injury_status": null,
  "metadata": null,
  "height": null,
  "rotoworld_id": null,
  "active": null,
  "team_abbr": null,
  "birth_city": null,
  "espn_id": null,
  "...": "27 more keys"
 },
 {
  "last_name": null,
  "player_id": "10235",
  "depth_chart_order": null,
  "first_name": null,
  "hashtag": null,
  "injury_notes": null,
  "injury_status": null,
  "metadata": null,
  "height": null,
  "rotoworld_id": null,
  "active": null,
  "team_abbr": null,
  "birth_city": null,
  "espn_id": null,
  "...": "27 more keys"
 },
 "... 23 more"
]
```


Variant `trending_drop`:

```graphql
{trending_drop:trending_players(sort:"drop",sport:"nfl"){birth_state injury_start_date rotoworld_id sportradar_id metadata height practice_participation active college depth_chart_order first_name yahoo_id team_changed_at status espn_id number rotowire_id stats_id injury_body_part high_school team_abbr injury_notes practice_description team fantasy_data_id sport last_name swish_id hashtag birth_date dl_trading_id birth_city fantasy_positions birth_country weight position depth_chart_position years_exp injury_status age player_id}}
```

Result: 224 ms, 21,284 bytes. Trimmed:

```json
[
 {
  "last_name": null,
  "player_id": "10235",
  "depth_chart_order": null,
  "first_name": null,
  "hashtag": null,
  "injury_notes": null,
  "injury_status": null,
  "metadata": null,
  "height": null,
  "rotoworld_id": null,
  "active": null,
  "team_abbr": null,
  "birth_city": null,
  "espn_id": null,
  "...": "27 more keys"
 },
 {
  "last_name": null,
  "player_id": "NE",
  "depth_chart_order": null,
  "first_name": null,
  "hashtag": null,
  "injury_notes": null,
  "injury_status": null,
  "metadata": null,
  "height": null,
  "rotoworld_id": null,
  "active": null,
  "team_abbr": null,
  "birth_city": null,
  "espn_id": null,
  "...": "27 more keys"
 },
 "... 23 more"
]
```



### `watched_players`

```graphql
watched_players(sport: String!, season_type: String, season: String): [Player]
```

Server description: Watched players list

Notes: The caller's watch list. Empty here.

Example:

```graphql
{watched_players(sport:"nfl",season_type:"regular",season:"2026"){birth_state injury_start_date rotoworld_id sportradar_id metadata height practice_participation active college depth_chart_order first_name yahoo_id team_changed_at status espn_id number rotowire_id stats_id injury_body_part high_school team_abbr injury_notes practice_description team fantasy_data_id sport last_name swish_id hashtag birth_date dl_trading_id birth_city fantasy_positions birth_country weight position depth_chart_position years_exp injury_status age player_id}}
```

Result: 76 ms, 2 bytes. Trimmed:

```json
[]
```



### `get_player_news`

```graphql
get_player_news(limit: Int, sport: String!, player_id: String!): [PlayerNews]
```

Server description: Get player news

Notes: Recent news items (Rotowire text under `metadata.description`, plus `analysis`). `limit` works. No REST equivalent.

Example:

```graphql
{get_player_news(sport:"nfl",player_id:"4983",limit:2){metadata source sport player_id source_key published}}
```

Result: 90 ms, 2,951 bytes. Trimmed:

```json
[
 {
  "metadata": {
   "description": "The Athletic's Joe Buscaglia writes that wide receiver DJ Moore could help swing the Bills' 2026 season after he was their \"crown jewel\" of the offseason whe...",
   "title": "DJ Moore Could be on the Field Constantly",
   "topic_id": "1403071613192118272",
   "url": "https://www.rotoballer.com/player-news/dj-moore-could-be-on-the-field-constantly/1925896"
  },
  "player_id": "4983",
  "published": 1788866226000,
  "source": "rotoballer",
  "source_key": "220337",
  "sport": "nfl"
 },
 {
  "metadata": {
   "description": "Buffalo Bills wide receiver DJ Moore is expected to bounce back in fantasy football leagues following a change of scenery this past offseason. A fresh start ...",
   "title": "DJ Moore Set to Bounce Back with New QB and New Role",
   "topic_id": "1401609357455540224",
   "url": "https://www.rotoballer.com/player-news/dj-moore-set-to-bounce-back-with-new-qb-and-new-role/1923204"
  },
  "player_id": "4983",
  "published": 1788517146000,
  "source": "rotoballer",
  "source_key": "220072",
  "sport": "nfl"
 }
]
```



### `get_player_news_by_id`

```graphql
get_player_news_by_id(source: String!, sport: String!, player_id: String!, source_key: String!): PlayerNews
```

Notes: Needs a `source_key` from a `get_player_news` row; a bogus key returns null.

Variant `news_by_id`:

```graphql
{news_by_id:get_player_news_by_id(source:"rotowire",sport:"nfl",player_id:"4983",source_key:"x"){metadata source sport player_id source_key published}}
```

Result: 84 ms, 4 bytes. Trimmed:

```json
null
```



### `get_player_outlook`

```graphql
get_player_outlook(sport: String!, season: String!, player_id: String!): PlayerNews
```

Server description: Get player season outlook

Notes: Season outlook blurb for a player. No REST equivalent.

Example:

```graphql
{get_player_outlook(sport:"nfl",season:"2026",player_id:"4983"){metadata source sport player_id source_key published}}
```

Result: 67 ms, 1,306 bytes. Trimmed:

```json
{
 "metadata": {
  "analysis": null,
  "description": "The Bears traded Moore to Buffalo early this offseason, following a 2025 campaign in which he took a backseat to Chicago's other pass catchers en route to ca...",
  "title": "2026 Season Outlook",
  "topic_id": "1351446310636503040"
 },
 "player_id": "4983",
 "published": null,
 "source": "rotowire",
 "source_key": "outlook_2026",
 "sport": "nfl"
}
```



### `get_player_stats`

```graphql
get_player_stats(category: String!, week: Int, sport: String!, season_type: String!, season: String!, player_id: String!, game_id: String): [Stat]
```

Server description: Player stats for season or game (if game_id, week, or date are not provided, we use season stats)

Notes: `category: "stat"` (actuals) or `"proj"`. Omit `week` for season totals (`game_id: "season"`). Week 1 2026 returned null before kickoff; 2025 week 1 returned the real box score (`company: sportradar`) plus `pos_rank_*`.

Example:

```graphql
{get_player_stats(category:"stat",sport:"nfl",season_type:"regular",season:"2026",player_id:"4983",week:1){date stats category week sport season_type season player team player_id opponent game_id updated_at company}}
```

Result: 75 ms, 4 bytes. Trimmed:

```json
null
```


Variant `get_player_stats_2025w1`:

```graphql
{get_player_stats_2025w1:get_player_stats(category:"stat",sport:"nfl",season_type:"regular",season:"2025",player_id:"4983",week:1){date stats category week sport season_type season player team player_id opponent game_id updated_at company}}
```

Result: 72 ms, 899 bytes. Trimmed:

```json
[
 {
  "category": "stat",
  "company": "sportradar",
  "date": "2025-09-08",
  "game_id": "202510106",
  "opponent": "MIN",
  "player": null,
  "player_id": "4983",
  "season": "2025",
  "season_type": "regular",
  "sport": "nfl",
  "stats": {
   "rush_lng": 5,
   "pos_rank_std": 40,
   "gp": 1,
   "tm_def_snp": 56,
   "rec_30_39": 1,
   "gms_active": 1,
   "penalty": 2,
   "rec_ypt": 13.6,
   "rec_20_29": 1,
   "pos_rank_half_ppr": 46,
   "bonus_fd_wr": 3,
   "pass_rush_yd": 8,
   "pts_std": 5.6,
   "rec_lng": 30,
   "...": "25 more keys"
  },
  "team": "CHI",
  "updated_at": 1757452118425,
  "week": 1
 }
]
```


Variant `get_player_stats_2025season`:

```graphql
{get_player_stats_2025season:get_player_stats(category:"stat",sport:"nfl",season_type:"regular",season:"2025",player_id:"4983"){date stats category week sport season_type season player team player_id opponent game_id updated_at company}}
```

Result: 102 ms, 1,873 bytes. Trimmed:

```json
[
 {
  "category": "stat",
  "company": "sportradar",
  "date": null,
  "game_id": "season",
  "opponent": null,
  "player": {
   "fantasy_positions": [
    "WR"
   ],
   "first_name": "DJ",
   "injury_body_part": null,
   "injury_notes": null,
   "injury_start_date": null,
   "injury_status": null,
   "last_name": "Moore",
   "metadata": {
    "channel_id": "1113708766076891136",
    "genius_id": "1008102",
    "rookie_year": "2018"
   },
   "news_updated": 1788880849707,
   "position": "WR",
   "team": "BUF",
   "team_abbr": null,
   "team_changed_at": null,
   "years_exp": 8
  },
  "player_id": "4983",
  "season": "2025",
  "season_type": "regular",
  "sport": "nfl",
  "stats": {
   "rush_lng": 70,
   "rush_td_lng": 17,
   "rec_drop": 4,
   "pass_air_yd": 2,
   "pos_rank_std": 28,
   "gp": 17,
   "rank_half_ppr": 106,
   "rec_0_4": 7,
   "tm_def_snp": 999,
   "first_td": 1,
   "rec_30_39": 1,
   "gms_active": 17,
   "penalty": 8,
   "rec_td": 6,
   "...": "59 more keys"
  },
  "team": "CHI",
  "updated_at": 1767606414144,
  "week": null
 }
]
```



### `stats_for_players_in_week`

```graphql
stats_for_players_in_week(category: String!, week: Int!, sport: String!, season_type: String!, season: String!, player_ids: [String]): [Stat]
```

Server description: Stats for multiple players in a week

Notes: Batch stats/projections for a list of player ids in one week. `category: "proj"` gave Rotowire projections with `pts_ppr`, `pts_half_ppr`, `pts_std`, `adp_dd_ppr`. This is the projection feed the app uses. No REST equivalent documented.

Example:

```graphql
{stats_for_players_in_week(category:"proj",week:1,sport:"nfl",season_type:"regular",season:"2026",player_ids:["4983","4046"]){date stats category week sport season_type season player team player_id opponent game_id updated_at company}}
```

Result: 76 ms, 1,534 bytes. Trimmed:

```json
[
 {
  "category": "proj",
  "company": "rotowire",
  "date": "2026-09-13",
  "game_id": "202610113",
  "opponent": "HOU",
  "player": null,
  "player_id": "4983",
  "season": "2026",
  "season_type": "regular",
  "sport": "nfl",
  "stats": {
   "adp_dd_ppr": 64,
   "bonus_rec_wr": 4.13,
   "def_fum_td": 0,
   "fum": 0.04,
   "fum_lost": 0.02,
   "gp": 1,
   "pos_adp_dd_ppr": 29,
   "pts_half_ppr": 10.02,
   "pts_ppr": 12.09,
   "pts_std": 7.96,
   "rec": 4.13,
   "rec_0_4": 0.83,
   "rec_10_19": 1.24,
   "rec_20_29": 0.83,
   "...": "14 more keys"
  },
  "team": "BUF",
  "updated_at": 1788988250325,
  "week": 1
 },
 {
  "category": "proj",
  "company": "rotowire",
  "date": "2026-09-14",
  "game_id": "202610116",
  "opponent": "DEN",
  "player": null,
  "player_id": "4046",
  "season": "2026",
  "season_type": "regular",
  "sport": "nfl",
  "stats": {
   "adp_dd_ppr": 115,
   "bonus_rush_td_qb": 0.09,
   "cmp_pct": 64.3,
   "def_fum_td": 0,
   "fum": 0.44,
   "fum_lost": 0.19,
   "gp": 1,
   "pass_2pt": 0.1,
   "pass_att": 33.63,
   "pass_cmp": 21.62,
   "pass_cmp_40p": 0.44,
   "pass_fd": 24.24,
   "pass_inc": 12.01,
   "pass_int": 0.7,
   "...": "14 more keys"
  },
  "team": "KC",
  "updated_at": 1788988250651,
  "week": 1
 }
]
```


Variant `stats_players_2025w1`:

```graphql
{stats_players_2025w1:stats_for_players_in_week(category:"stat",week:1,sport:"nfl",season_type:"regular",season:"2025",player_ids:["4983","4046"]){date stats category week sport season_type season player team player_id opponent game_id updated_at company}}
```

Result: 74 ms, 1,910 bytes. Trimmed:

```json
[
 {
  "category": "stat",
  "company": "sportradar",
  "date": "2025-09-08",
  "game_id": "202510106",
  "opponent": "MIN",
  "player": null,
  "player_id": "4983",
  "season": "2025",
  "season_type": "regular",
  "sport": "nfl",
  "stats": {
   "rush_lng": 5,
   "pos_rank_std": 40,
   "gp": 1,
   "tm_def_snp": 56,
   "rec_30_39": 1,
   "gms_active": 1,
   "penalty": 2,
   "rec_ypt": 13.6,
   "rec_20_29": 1,
   "pos_rank_half_ppr": 46,
   "bonus_fd_wr": 3,
   "pass_rush_yd": 8,
   "pts_std": 5.6,
   "rec_lng": 30,
   "...": "25 more keys"
  },
  "team": "CHI",
  "updated_at": 1757452118425,
  "week": 1
 },
 {
  "category": "stat",
  "company": "sportradar",
  "date": "2025-09-05",
  "game_id": "202510129",
  "opponent": "LAC",
  "player": null,
  "player_id": "4046",
  "season": "2025",
  "season_type": "regular",
  "sport": "nfl",
  "stats": {
   "rush_lng": 15,
   "rush_td_lng": 11,
   "pass_air_yd": 142,
   "pos_rank_std": 6,
   "gp": 1,
   "tm_def_snp": 65,
   "gms_active": 1,
   "pass_sack_yds": 9,
   "pos_rank_half_ppr": 6,
   "rush_td": 1,
   "pass_ypc": 10.75,
   "pass_lng": 49,
   "pass_rush_yd": 315,
   "pts_std": 26.02,
   "...": "29 more keys"
  },
  "team": "KC",
  "updated_at": 1757434162065,
  "week": 1
 }
]
```



### `weekly_stats`

```graphql
weekly_stats(category: String!, week: Int!, order_by: String!, sport: String!, season_type: String!, season: String!, positions: [String]): [Stat]
```

Server description: Get complete weekly stats for every player

Notes: Every player's stats or projections for one week, filtered by `positions`, sorted by `order_by` (e.g. `pts_ppr`). 532 KB for RB projections. Same data as the app's projection tab.

Example:

```graphql
{weekly_stats(category:"proj",week:1,order_by:"pts_ppr",sport:"nfl",season_type:"regular",season:"2026",positions:["RB"]){date stats category week sport season_type season player team player_id opponent game_id updated_at company}}
```

Result: 390 ms, 532,185 bytes. Trimmed:

```json
[
 {
  "category": "proj",
  "company": "rotowire",
  "date": "2026-09-13",
  "game_id": "202610111",
  "opponent": "NO",
  "player": {
   "fantasy_positions": [
    "RB"
   ],
   "first_name": "Jahmyr",
   "injury_body_part": null,
   "injury_notes": null,
   "injury_start_date": null,
   "injury_status": null,
   "last_name": "Gibbs",
   "metadata": {
    "channel_id": "1113708815989108736",
    "genius_id": "1398586",
    "rookie_year": "2023"
   },
   "news_updated": 1788579313547,
   "position": "RB",
   "team": "DET",
   "team_abbr": null,
   "team_changed_at": null,
   "years_exp": 3
  },
  "player_id": "9221",
  "season": "2026",
  "season_type": "regular",
  "sport": "nfl",
  "stats": {
   "adp_dd_ppr": 1,
   "bonus_rec_rb": 4.6,
   "def_fum_td": 0,
   "fum": 0.22,
   "fum_lost": 0.09,
   "gp": 1,
   "pos_adp_dd_ppr": 1,
   "pts_half_ppr": 21.38,
   "pts_ppr": 23.68,
   "pts_std": 19.08,
   "rec": 4.6,
   "rec_0_4": 0.92,
   "rec_10_19": 1.38,
   "rec_20_29": 0.92,
   "...": "14 more keys"
  },
  "team": "DET",
  "updated_at": 1788988849827,
  "week": 1
 },
 {
  "category": "proj",
  "company": "rotowire",
  "date": "2026-09-13",
  "game_id": "202610128",
  "opponent": "PIT",
  "player": {
   "fantasy_positions": [
    "RB"
   ],
   "first_name": "Bijan",
   "injury_body_part": null,
   "injury_notes": null,
   "injury_start_date": null,
   "injury_status": null,
   "last_name": "Robinson",
   "metadata": {
    "channel_id": "1113708865150545921",
    "genius_id": "1398582",
    "rookie_year": "2023"
   },
   "news_updated": 1788527720297,
   "position": "RB",
   "team": "ATL",
   "team_abbr": null,
   "team_changed_at": null,
   "years_exp": 3
  },
  "player_id": "9509",
  "season": "2026",
  "season_type": "regular",
  "sport": "nfl",
  "stats": {
   "adp_dd_ppr": 2,
   "bonus_rec_rb": 4.26,
   "def_fum_td": 0,
   "fum": 0.2,
   "fum_lost": 0.09,
   "gp": 1,
   "pos_adp_dd_ppr": 2,
   "pts_half_ppr": 19.4,
   "pts_ppr": 21.53,
   "pts_std": 17.27,
   "rec": 4.26,
   "rec_0_4": 0.85,
   "rec_10_19": 1.28,
   "rec_20_29": 0.85,
   "...": "14 more keys"
  },
  "team": "ATL",
  "updated_at": 1788988849918,
  "week": 1
 },
 "... 748 more"
]
```


Variant `weekly_stats_2025w1`:

```graphql
{weekly_stats_2025w1:weekly_stats(category:"stat",week:1,order_by:"pts_ppr",sport:"nfl",season_type:"regular",season:"2025",positions:["RB"]){date stats category week sport season_type season player team player_id opponent game_id updated_at company}}
```

Result: 316 ms, 166,576 bytes. Trimmed:

```json
[
 {
  "category": "stat",
  "company": "sportradar",
  "date": "2025-09-07",
  "game_id": "202510104",
  "opponent": "BUF",
  "player": {
   "fantasy_positions": [
    "RB"
   ],
   "first_name": "Derrick",
   "injury_body_part": null,
   "injury_notes": null,
   "injury_start_date": null,
   "injury_status": null,
   "last_name": "Henry",
   "metadata": {
    "channel_id": "1113708869839777793",
    "genius_id": "940750",
    "rookie_year": "2016"
   },
   "news_updated": 1788530120390,
   "position": "RB",
   "team": "BAL",
   "team_abbr": null,
   "team_changed_at": null,
   "years_exp": 10
  },
  "player_id": "3198",
  "season": "2025",
  "season_type": "regular",
  "sport": "nfl",
  "stats": {
   "rush_lng": 49,
   "rush_td_lng": 46,
   "bonus_rush_yd_100": 1,
   "pos_rank_std": 1,
   "gp": 1,
   "tm_def_snp": 85,
   "gms_active": 1,
   "rec_ypt": 13,
   "pos_rank_half_ppr": 1,
   "rush_td": 2,
   "rush_btkl": 2,
   "pass_rush_yd": 169,
   "pts_std": 28.2,
   "rec_lng": 13,
   "...": "31 more keys"
  },
  "team": "BAL",
  "updated_at": 1757365740720,
  "week": 1
 },
 {
  "category": "stat",
  "company": "sportradar",
  "date": "2025-09-07",
  "game_id": "202510102",
  "opponent": "TB",
  "player": {
   "fantasy_positions": [
    "RB"
   ],
   "first_name": "Bijan",
   "injury_body_part": null,
   "injury_notes": null,
   "injury_start_date": null,
   "injury_status": null,
   "last_name": "Robinson",
   "metadata": {
    "channel_id": "1113708865150545921",
    "genius_id": "1398582",
    "rookie_year": "2023"
   },
   "news_updated": 1788527720297,
   "position": "RB",
   "team": "ATL",
   "team_abbr": null,
   "team_changed_at": null,
   "years_exp": 3
  },
  "player_id": "9509",
  "season": "2025",
  "season_type": "regular",
  "sport": "nfl",
  "stats": {
   "rush_lng": 6,
   "rec_drop": 1,
   "bonus_rec_yd_100": 1,
   "pos_rank_std": 3,
   "gp": 1,
   "rec_0_4": 1,
   "tm_def_snp": 58,
   "first_td": 1,
   "gms_active": 1,
   "rec_td": 1,
   "rec_ypt": 14.29,
   "rec_20_29": 1,
   "pos_rank_half_ppr": 2,
   "pass_rush_yd": 24,
   "...": "34 more keys"
  },
  "team": "ATL",
  "updated_at": 1757365740443,
  "week": 1
 },
 "... 162 more"
]
```



### `season_stats`

```graphql
season_stats(category: String!, order_by: String!, sport: String!, season_type: String!, season: String!, positions: [String]): [Stat]
```

Server description: Get complete season stats for every player

Notes: Season totals for every player at the given positions (225 KB for QBs). Includes `player` sub-record.

Example:

```graphql
{season_stats(category:"stat",order_by:"pts_ppr",sport:"nfl",season_type:"regular",season:"2026",positions:["QB"]){date stats category week sport season_type season player team player_id opponent game_id updated_at company}}
```

Result: 478 ms, 225,250 bytes. Trimmed:

```json
[
 {
  "category": "stat",
  "company": "sportradar",
  "date": null,
  "game_id": "season",
  "opponent": null,
  "player": {
   "fantasy_positions": [
    "QB"
   ],
   "first_name": "Blake",
   "injury_body_part": null,
   "injury_notes": null,
   "injury_start_date": null,
   "injury_status": null,
   "last_name": "Sims",
   "metadata": {
    "channel_id": "1116852917714812928"
   },
   "news_updated": null,
   "position": "QB",
   "team": null,
   "team_abbr": null,
   "team_changed_at": null,
   "years_exp": 5
  },
  "player_id": "3957",
  "season": "2026",
  "season_type": "regular",
  "sport": "nfl",
  "stats": {},
  "team": null,
  "updated_at": null,
  "week": null
 },
 {
  "category": "stat",
  "company": "sportradar",
  "date": null,
  "game_id": "season",
  "opponent": null,
  "player": {
   "fantasy_positions": [
    "QB"
   ],
   "first_name": "Skyler",
   "injury_body_part": null,
   "injury_notes": null,
   "injury_start_date": null,
   "injury_status": null,
   "last_name": "Howard",
   "metadata": {
    "channel_id": "1116853043384549376"
   },
   "news_updated": null,
   "position": "QB",
   "team": "SEA",
   "team_abbr": null,
   "team_changed_at": null,
   "years_exp": 1
  },
  "player_id": "4936",
  "season": "2026",
  "season_type": "regular",
  "sport": "nfl",
  "stats": {},
  "team": "SEA",
  "updated_at": null,
  "week": null
 },
 "... 353 more"
]
```


Variant `season_stats_2025_te`:

```graphql
{season_stats_2025_te:season_stats(category:"stat",order_by:"pts_ppr",sport:"nfl",season_type:"regular",season:"2025",positions:["TE"]){date stats category week sport season_type season player team player_id opponent game_id updated_at company}}
```

Result: 664 ms, 502,163 bytes. Trimmed:

```json
[
 {
  "category": "stat",
  "company": "sportradar",
  "date": null,
  "game_id": "season",
  "opponent": null,
  "player": {
   "fantasy_positions": [
    "TE"
   ],
   "first_name": "Trey",
   "injury_body_part": null,
   "injury_notes": null,
   "injury_start_date": null,
   "injury_status": null,
   "last_name": "McBride",
   "metadata": {
    "channel_id": "1113708846951460864",
    "genius_id": "1075468",
    "rookie_year": "2022"
   },
   "news_updated": 1788756935922,
   "position": "TE",
   "team": "ARI",
   "team_abbr": null,
   "team_changed_at": null,
   "years_exp": 4
  },
  "player_id": "8130",
  "season": "2025",
  "season_type": "regular",
  "sport": "nfl",
  "stats": {
   "bonus_rec_te": 126,
   "rec_drop": 2,
   "bonus_rec_yd_100": 3,
   "pos_rank_std": 1,
   "gp": 17,
   "rank_half_ppr": 23,
   "rec_0_4": 29,
   "tm_def_snp": 1070,
   "first_td": 1,
   "rec_30_39": 1,
   "gms_active": 17,
   "penalty": 5,
   "rec_td": 11,
   "rec_ypt": 7.33,
   "...": "30 more keys"
  },
  "team": "ARI",
  "updated_at": 1767606447350,
  "week": null
 },
 {
  "category": "stat",
  "company": "sportradar",
  "date": null,
  "game_id": "season",
  "opponent": null,
  "player": {
   "fantasy_positions": [
    "TE"
   ],
   "first_name": "Kyle",
   "injury_body_part": null,
   "injury_notes": null,
   "injury_start_date": null,
   "injury_status": null,
   "last_name": "Pitts",
   "metadata": {
    "channel_id": "1113708858418688001",
    "genius_id": "1079616",
    "rookie_year": "2021"
   },
   "news_updated": 1788702630463,
   "position": "TE",
   "team": "ATL",
   "team_abbr": null,
   "team_changed_at": null,
   "years_exp": 5
  },
  "player_id": "7553",
  "season": "2025",
  "season_type": "regular",
  "sport": "nfl",
  "stats": {
   "bonus_rec_te": 88,
   "rec_drop": 2,
   "bonus_rec_yd_100": 1,
   "pos_rank_std": 3,
   "gp": 17,
   "rank_half_ppr": 73,
   "rec_0_4": 13,
   "tm_def_snp": 1036,
   "rec_30_39": 2,
   "gms_active": 17,
   "penalty": 7,
   "rec_td": 5,
   "rec_ypt": 7.86,
   "rec_20_29": 10,
   "...": "32 more keys"
  },
  "team": "ATL",
  "updated_at": 1767606316480,
  "week": null
 },
 "... 645 more"
]
```



### `game_stats`

```graphql
game_stats(category: String!, order_by: String!, sport: String!, season_type: String!, season: String!, game_id: String!, positions: [String]): [Stat]
```

Server description: Get complete game stats for every player

Notes: Box score for one game, every player, filtered by `positions`.

Example:

```graphql
{game_stats(category:"stat",order_by:"pts_ppr",sport:"nfl",season_type:"regular",season:"2026",game_id:"202610105"){date stats category week sport season_type season player team player_id opponent game_id updated_at company}}
```

Result: 74 ms, 2 bytes. Trimmed:

```json
[]
```


Variant `game_stats_2025`:

```graphql
{game_stats_2025:game_stats(category:"stat",order_by:"pts_ppr",sport:"nfl",season_type:"regular",season:"2025",game_id:"202510106",positions:["WR"]){date stats category week sport season_type season player team player_id opponent game_id updated_at company}}
```

Result: 104 ms, 18,521 bytes. Trimmed:

```json
[
 {
  "category": "stat",
  "company": "sportradar",
  "date": "2025-09-08",
  "game_id": "202510106",
  "opponent": "MIN",
  "player": {
   "fantasy_positions": [
    "WR"
   ],
   "first_name": "Rome",
   "injury_body_part": "Leg",
   "injury_notes": null,
   "injury_start_date": null,
   "injury_status": "Questionable",
   "last_name": "Odunze",
   "metadata": {
    "channel_id": "1113708767121272832",
    "genius_id": "1463680",
    "rookie_year": "2024"
   },
   "news_updated": 1788986146444,
   "position": "WR",
   "team": "CHI",
   "team_abbr": null,
   "team_changed_at": null,
   "years_exp": 2
  },
  "player_id": "11620",
  "season": "2025",
  "season_type": "regular",
  "sport": "nfl",
  "stats": {
   "anytime_tds": 1,
   "bonus_fd_wr": 2,
   "bonus_rec_wr": 6,
   "gms_active": 1,
   "gp": 1,
   "gs": 1,
   "off_snp": 63,
   "pos_rank_half_ppr": 21,
   "pos_rank_ppr": 19,
   "pos_rank_std": 22,
   "pts_half_ppr": 12.7,
   "pts_ppr": 15.7,
   "pts_std": 9.7,
   "rec": 6,
   "...": "18 more keys"
  },
  "team": "CHI",
  "updated_at": 1757430532408,
  "week": 1
 },
 {
  "category": "stat",
  "company": "sportradar",
  "date": "2025-09-08",
  "game_id": "202510106",
  "opponent": "CHI",
  "player": {
   "fantasy_positions": [
    "WR"
   ],
   "first_name": "Justin",
   "injury_body_part": null,
   "injury_notes": null,
   "injury_start_date": null,
   "injury_status": null,
   "last_name": "Jefferson",
   "metadata": {
    "channel_id": "1113708708145164288",
    "genius_id": "1080267",
    "rookie_year": "2020"
   },
   "news_updated": 1788531620559,
   "position": "WR",
   "team": "MIN",
   "team_abbr": null,
   "team_changed_at": null,
   "years_exp": 6
  },
  "player_id": "6794",
  "season": "2025",
  "season_type": "regular",
  "sport": "nfl",
  "stats": {
   "rush_lng": 4,
   "pos_rank_std": 17,
   "gp": 1,
   "rec_0_4": 1,
   "tm_def_snp": 67,
   "gms_active": 1,
   "rec_td": 1,
   "rec_ypt": 6.29,
   "pos_rank_half_ppr": 20,
   "bonus_fd_wr": 1,
   "pass_rush_yd": 4,
   "pts_std": 10.8,
   "rec_lng": 17,
   "tm_st_snp": 32,
   "...": "23 more keys"
  },
  "team": "MIN",
  "updated_at": 1757452118513,
  "week": 1
 },
 "... 18 more"
]
```



### `plays`

```graphql
plays(date: String, week: Int, sport: String!, season_type: String!, season: String!, game_id: String): [Play]
```

Server description: Plays by Week, Date, or Game ID

Notes: Play-by-play for a game (33 KB for one 2025 game) with `play_stats` per play. Empty for games not yet played.

Example:

```graphql
{plays(sport:"nfl",season_type:"regular",season:"2026",game_id:"202610105"){date time metadata sequence week sport season_type season game_id updated_at provider play_id play_stats{stats player player_id stats_agg}}}
```

Result: 75 ms, 2 bytes. Trimmed:

```json
[]
```


Variant `plays_2025`:

```graphql
{plays_2025:plays(sport:"nfl",season_type:"regular",season:"2025",game_id:"202510106"){date time metadata sequence week sport season_type season game_id updated_at provider play_id play_stats{stats player player_id stats_agg}}}
```

Result: 184 ms, 33,016 bytes. Trimmed:

```json
[
 {
  "date": "2025-09-08",
  "game_id": "202510106",
  "metadata": {
   "away_used_timeouts": 2,
   "description": "End Game",
   "home_used_timeouts": 3,
   "is_scoring_play": false,
   "play_time": "2025-09-09T03:33:10+00:00",
   "play_type": "game_over",
   "quarter_name": "4",
   "sequence": 1757388792617,
   "time_remaining_minutes": 0,
   "time_remaining_seconds": 0,
   "topic_id": "1270984353488318464",
   "type": "Period"
  },
  "play_id": "b31296b0-8d2d-11f0-b652-cd6585b5560f",
  "play_stats": [],
  "provider": null,
  "season": "2025",
  "season_type": "regular",
  "sequence": 1757388792617,
  "sport": "nfl",
  "time": 1757388790000,
  "updated_at": 1757606938557,
  "week": 1
 },
 {
  "date": "2025-09-08",
  "game_id": "202510106",
  "metadata": {
   "away_points": 27,
   "away_used_timeouts": 2,
   "description": "C.Williams pass short right complete. Catch made by R.Odunze for 8 yards. Lateral to D.Moore to CHI 36 for 13 yards. D.Moore FUMBLES, forced by T.Thomas. Fum...",
   "distance": 15,
   "distance_end": 10,
   "down": 1,
   "down_end": 1,
   "home_points": 24,
   "home_used_timeouts": 3,
   "is_scoring_play": false,
   "opponent": "MIN",
   "penalties": [],
   "play_time": "2025-09-09T03:32:29+00:00",
   "play_type": "pass_catch_fumble",
   "...": "17 more keys"
  },
  "play_id": "8c478ef0-8d2d-11f0-b652-cd6585b5560f",
  "play_stats": [
   {
    "player": {
     "position": "DB",
     "status": "Active",
     "number": 24,
     "first_name": "Jay",
     "last_name": "Ward",
     "sport": "nfl",
     "team": "MIN",
     "player_id": "10939",
     "fantasy_positions": "[...]",
     "injury_status": null,
     "news_updated": 1786921217411,
     "team_abbr": null,
     "team_changed_at": null,
     "years_exp": 3
    },
    "player_id": "10939",
    "stats": {
     "idp_fum_rec": 1
    },
    "stats_agg": null
   },
   {
    "player": {
     "position": "QB",
     "status": "Active",
     "number": 18,
     "first_name": "Caleb",
     "last_name": "Williams",
     "sport": "nfl",
     "team": "CHI",
     "player_id": "11560",
     "fantasy_positions": "[...]",
     "injury_status": null,
     "news_updated": 1788480915807,
     "team_abbr": null,
     "team_changed_at": null,
     "years_exp": 2
    },
    "player_id": "11560",
    "stats": {
     "pass_att": 1,
     "pass_att_yds": 8,
     "pass_cmp": 1,
     "pass_yd": 19
    },
    "stats_agg": null
   },
   "... 4 more"
  ],
  "provider": null,
  "season": "2025",
  "season_type": "regular",
  "sequence": 1757388785042,
  "sport": "nfl",
  "time": 1757388749000,
  "updated_at": 1757606938547,
  "week": 1
 },
 "... 18 more"
]
```



### `scores`

```graphql
scores(date: String, week: Int, sport: String!, season_type: String!, season: String!, game_id: String): [Score]
```

Server description: Scores

Notes: Game rows for a week/date/game with `metadata` holding the spread (`spread.{TEAM}`, `updated_at`), weather forecast, stadium, quarter scores, `is_over`, `pick_stats`, and channel/topic ids. This is the line feed the pick'em strategy uses. 72 KB per week.

Example:

```graphql
{scores(sport:"nfl",season_type:"regular",season:"2026",week:1){status date metadata start_time week sport season_type season game_id updated_at reactions total_reactions total_views total_comments}}
```

Result: 136 ms, 71,839 bytes. Trimmed:

```json
[
 {
  "date": "2026-09-13",
  "game_id": "202610105",
  "metadata": {
   "dl_trading_event_id": 2738985,
   "oddsjam_fixture_id": "20260913DABEBB98",
   "forecast_temp_low": 72,
   "day": "2026-09-13",
   "geo_lat": "35.225937",
   "canceled": false,
   "game_key": "202610105",
   "is_over": false,
   "away_score_overtime": 0,
   "has2nd_quarter_started": false,
   "quarter": "",
   "pick_stats": {
    "pick_count": 26773,
    "total_count": 29136
   },
   "home_score_overtime": 0,
   "away_team": "CHI",
   "...": "43 more keys"
  },
  "reactions": {
   "eyes": 20,
   "meme_scream_odyssey": 21,
   "meme_timeout_shaq": 4,
   "meme_take_my_money": 1,
   "meme_nfl_bryce_young_candy": 398,
   "meme_frustrated_ishowspeed": 1,
   "meme_druski_hands_up": 1,
   "meme_nfl_druski": 12,
   "sad": 1501,
   "meme_mbappespecial": 16,
   "meme_smart_guy": 6,
   "meme_six_seven": 0,
   "meme_scared_dexter": 2,
   "meme_soldier": 39,
   "...": "72 more keys"
  },
  "season": "2026",
  "season_type": "regular",
  "sport": "nfl",
  "start_time": 1789318800000,
  "status": "pre_game",
  "total_comments": 932,
  "total_reactions": 9664,
  "total_views": 679341,
  "updated_at": 1788988885263,
  "week": 1
 },
 {
  "date": "2026-09-13",
  "game_id": "202610107",
  "metadata": {
   "dl_trading_event_id": 2738986,
   "oddsjam_fixture_id": "20260913459E30BF",
   "forecast_temp_low": 70,
   "day": "2026-09-13",
   "geo_lat": "39.095413",
   "canceled": false,
   "game_key": "202610107",
   "is_over": false,
   "away_score_overtime": 0,
   "has2nd_quarter_started": false,
   "quarter": "",
   "pick_stats": {
    "pick_count": 52693,
    "total_count": 57070
   },
   "home_score_overtime": 0,
   "away_team": "TB",
   "...": "43 more keys"
  },
  "reactions": {
   "eyes": 14,
   "meme_scream_odyssey": 14,
   "meme_nfl_bucky_face": 596,
   "meme_nfl_baker_face": 596,
   "meme_timeout_shaq": 1,
   "meme_sus": 0,
   "meme_frustrated_ishowspeed": 7,
   "meme_druski_hands_up": 1,
   "meme_nfl_druski": 6,
   "sad": 1397,
   "meme_mbappespecial": 10,
   "meme_smart_guy": 3,
   "meme_six_seven": 3,
   "meme_scared_dexter": 6,
   "...": "84 more keys"
  },
  "season": "2026",
  "season_type": "regular",
  "sport": "nfl",
  "start_time": 1789318800000,
  "status": "pre_game",
  "total_comments": 608,
  "total_reactions": 9558,
  "total_views": 603154,
  "updated_at": 1788988884927,
  "week": 1
 },
 "... 14 more"
]
```


Variant `scores_2025w1`:

```graphql
{scores_2025w1:scores(sport:"nfl",season_type:"regular",season:"2025",week:1){status date metadata start_time week sport season_type season game_id updated_at reactions total_reactions total_views total_comments}}
```

Result: 138 ms, 61,418 bytes. Trimmed:

```json
[
 {
  "date": "2025-09-07",
  "game_id": "202510102",
  "metadata": {
   "down": "",
   "dl_trading_event_id": 2453693,
   "possession": "",
   "oddsjam_fixture_id": "202509077DB9DFF5",
   "forecast_temp_low": 65,
   "day": "2025-09-07",
   "geo_lat": "33.757368",
   "canceled": false,
   "game_key": "202510102",
   "is_over": true,
   "away_score_overtime": 0,
   "has2nd_quarter_started": true,
   "quarter": "F",
   "pick_stats": {
    "pick_count": 731940
   },
   "...": "54 more keys"
  },
  "reactions": {
   "eyes": 87,
   "meme_take_my_money": 33,
   "meme_white_lotus": 41,
   "meme_sus": 23,
   "meme_homer": 187,
   "meme_druski_hands_up": 28,
   "sad": 11388,
   "meme_smart_guy": 124,
   "meme_six_seven": 1,
   "meme_soldier": 1666,
   "meme_crying_jordan": 4347,
   "meme_shrek": 49,
   "meme_success_kid": 1309,
   "meme_fish_stare": 826,
   "...": "49 more keys"
  },
  "season": "2025",
  "season_type": "regular",
  "sport": "nfl",
  "start_time": 1757264400000,
  "status": "complete",
  "total_comments": 10380,
  "total_reactions": 89080,
  "total_views": 2457586,
  "updated_at": 1788986967825,
  "week": 1
 },
 {
  "date": "2025-09-07",
  "game_id": "202510104",
  "metadata": {
   "down": "",
   "dl_trading_event_id": 2453705,
   "possession": "",
   "oddsjam_fixture_id": "2025090822A151FB",
   "forecast_temp_low": 46,
   "day": "2025-09-07",
   "geo_lat": "42.773826",
   "canceled": false,
   "game_key": "202510104",
   "is_over": true,
   "event_name": "Sunday Night Football",
   "away_score_overtime": 0,
   "has2nd_quarter_started": true,
   "quarter": "F",
   "...": "55 more keys"
  },
  "reactions": {
   "eyes": 147,
   "meme_take_my_money": 87,
   "meme_white_lotus": 162,
   "meme_nfl_josh_allen_scream": 7,
   "meme_sus": 64,
   "meme_homer": 366,
   "meme_druski_hands_up": 71,
   "sad": 22097,
   "meme_smart_guy": 142,
   "meme_soldier": 533,
   "meme_crying_jordan": 4615,
   "meme_shrek": 111,
   "meme_success_kid": 2450,
   "meme_fish_stare": 667,
   "...": "51 more keys"
  },
  "season": "2025",
  "season_type": "regular",
  "sport": "nfl",
  "start_time": 1757290800000,
  "status": "complete",
  "total_comments": 21806,
  "total_reactions": 140156,
  "total_views": 3112785,
  "updated_at": 1788987863866,
  "week": 1
 },
 "... 14 more"
]
```


Variant `scores_2025_game`:

```graphql
{scores_2025_game:scores(sport:"nfl",season_type:"regular",season:"2025",game_id:"202510106"){status date metadata start_time week sport season_type season game_id updated_at reactions total_reactions total_views total_comments}}
```

Result: 73 ms, 4,031 bytes. Trimmed:

```json
[
 {
  "date": "2025-09-08",
  "game_id": "202510106",
  "metadata": {
   "down": "",
   "dl_trading_event_id": 2453707,
   "possession": "",
   "oddsjam_fixture_id": "2025090988097F76",
   "forecast_temp_low": 45,
   "day": "2025-09-08",
   "geo_lat": "41.862498",
   "canceled": false,
   "game_key": "202510106",
   "is_over": true,
   "event_name": "Monday Night Football",
   "away_score_overtime": 0,
   "has2nd_quarter_started": true,
   "quarter": "F",
   "...": "55 more keys"
  },
  "reactions": {
   "eyes": 123,
   "meme_take_my_money": 72,
   "meme_white_lotus": 45,
   "meme_sus": 61,
   "meme_frustrated_ishowspeed": 1,
   "meme_homer": 200,
   "meme_druski_hands_up": 42,
   "meme_nfl_druski": 1,
   "sad": 15220,
   "meme_smart_guy": 84,
   "meme_soldier": 393,
   "meme_crying_jordan": 3839,
   "meme_shrek": 108,
   "meme_success_kid": 1724,
   "...": "54 more keys"
  },
  "season": "2025",
  "season_type": "regular",
  "sport": "nfl",
  "start_time": 1757376900000,
  "status": "complete",
  "total_comments": 28027,
  "total_reactions": 92610,
  "total_views": 2924935,
  "updated_at": 1788988886152,
  "week": 1
 }
]
```


Variant `scores_2026_date`:

```graphql
{scores_2026_date:scores(sport:"nfl",season_type:"regular",season:"2026",date:"2026-09-13"){status date metadata start_time week sport season_type season game_id updated_at reactions total_reactions total_views total_comments}}
```

Result: 114 ms, 58,034 bytes. Trimmed:

```json
[
 {
  "date": "2026-09-13",
  "game_id": "202610105",
  "metadata": {
   "dl_trading_event_id": 2738985,
   "oddsjam_fixture_id": "20260913DABEBB98",
   "forecast_temp_low": 72,
   "day": "2026-09-13",
   "geo_lat": "35.225937",
   "canceled": false,
   "game_key": "202610105",
   "is_over": false,
   "away_score_overtime": 0,
   "has2nd_quarter_started": false,
   "quarter": "",
   "pick_stats": {
    "pick_count": 26990,
    "total_count": 29353
   },
   "home_score_overtime": 0,
   "away_team": "CHI",
   "...": "43 more keys"
  },
  "reactions": {
   "eyes": 20,
   "meme_scream_odyssey": 21,
   "meme_timeout_shaq": 4,
   "meme_take_my_money": 1,
   "meme_nfl_bryce_young_candy": 398,
   "meme_frustrated_ishowspeed": 1,
   "meme_druski_hands_up": 1,
   "meme_nfl_druski": 12,
   "sad": 1501,
   "meme_mbappespecial": 16,
   "meme_smart_guy": 6,
   "meme_six_seven": 0,
   "meme_scared_dexter": 2,
   "meme_soldier": 39,
   "...": "72 more keys"
  },
  "season": "2026",
  "season_type": "regular",
  "sport": "nfl",
  "start_time": 1789318800000,
  "status": "pre_game",
  "total_comments": 932,
  "total_reactions": 9669,
  "total_views": 680025,
  "updated_at": 1788989215069,
  "week": 1
 },
 {
  "date": "2026-09-13",
  "game_id": "202610107",
  "metadata": {
   "dl_trading_event_id": 2738986,
   "oddsjam_fixture_id": "20260913459E30BF",
   "forecast_temp_low": 70,
   "day": "2026-09-13",
   "geo_lat": "39.095413",
   "canceled": false,
   "game_key": "202610107",
   "is_over": false,
   "away_score_overtime": 0,
   "has2nd_quarter_started": false,
   "quarter": "",
   "pick_stats": {
    "pick_count": 52743,
    "total_count": 57120
   },
   "home_score_overtime": 0,
   "away_team": "TB",
   "...": "43 more keys"
  },
  "reactions": {
   "eyes": 14,
   "meme_scream_odyssey": 14,
   "meme_nfl_bucky_face": 596,
   "meme_nfl_baker_face": 597,
   "meme_timeout_shaq": 1,
   "meme_sus": 0,
   "meme_frustrated_ishowspeed": 7,
   "meme_druski_hands_up": 1,
   "meme_nfl_druski": 6,
   "sad": 1398,
   "meme_mbappespecial": 10,
   "meme_smart_guy": 3,
   "meme_six_seven": 3,
   "meme_scared_dexter": 6,
   "...": "84 more keys"
  },
  "season": "2026",
  "season_type": "regular",
  "sport": "nfl",
  "start_time": 1789318800000,
  "status": "pre_game",
  "total_comments": 609,
  "total_reactions": 9563,
  "total_views": 603682,
  "updated_at": 1788989217816,
  "week": 1
 },
 "... 11 more"
]
```



### `teams`

```graphql
teams(sport: String!): [Team]
```

Server description: Get Teams by Sport

Notes: All teams with `metadata` and `aliases`. 23 KB.

Example:

```graphql
{teams(sport:"nfl"){active name metadata aliases sport team}}
```

Result: 81 ms, 23,286 bytes. Trimmed:

```json
[
 {
  "active": true,
  "aliases": null,
  "metadata": {
   "bye_week": "8",
   "channel_id": "250000000000000029",
   "city": "San Francisco",
   "color1": "AA0000",
   "color2": "B3995D",
   "color3": "000000",
   "color4": "FFFFFF",
   "conference": "NFC",
   "def_coordinator": "Raheem Morris",
   "def_scheme": "4-3",
   "division": "NFC West",
   "full_name": "San Francisco 49ers",
   "genius_id": "106530",
   "head_coach": "Kyle Shanahan",
   "...": "8 more keys"
  },
  "name": "49ers",
  "sport": "nfl",
  "team": "SF"
 },
 {
  "active": true,
  "aliases": null,
  "metadata": {
   "bye_week": "10",
   "channel_id": "262859649521283072",
   "city": "Chicago",
   "color1": "0B162A",
   "color2": "C83803",
   "color3": "FFFFFF",
   "color4": "",
   "conference": "NFC",
   "def_coordinator": "Dennis Allen",
   "def_scheme": "3-4",
   "division": "NFC North",
   "full_name": "Chicago Bears",
   "genius_id": "102222",
   "head_coach": "Ben Johnson",
   "...": "8 more keys"
  },
  "name": "Bears",
  "sport": "nfl",
  "team": "CHI"
 },
 "... 30 more"
]
```



### `get_team`

```graphql
get_team(sport: String!, team: String!): Team
```

Server description: Get a single team

Notes: One team by abbreviation.

Example:

```graphql
{get_team(sport:"nfl",team:"DET"){active name metadata aliases sport team}}
```

Result: 74 ms, 714 bytes. Trimmed:

```json
{
 "active": true,
 "aliases": null,
 "metadata": {
  "bye_week": "6",
  "channel_id": "262859011462799360",
  "city": "Detroit",
  "color1": "0076B6",
  "color2": "B0B7BC",
  "color3": "FFFFFF",
  "color4": "",
  "conference": "NFC",
  "def_coordinator": "Kelvin Sheppard",
  "def_scheme": "4-3",
  "division": "NFC North",
  "full_name": "Detroit Lions",
  "genius_id": "82959",
  "head_coach": "Dan Campbell",
  "...": "8 more keys"
 },
 "name": "Lions",
 "sport": "nfl",
 "team": "DET"
}
```



### `get_favorite_teams`

```graphql
get_favorite_teams(user_id: Snowflake, sport: String): [Team]
```

Server description: Get favorite teams for a user. If no user_id is provided, we use the current user

Notes: Empty for this account.

Example:

```graphql
{get_favorite_teams(sport:"nfl"){active name metadata aliases sport team}}
```

Result: 71 ms, 2 bytes. Trimmed:

```json
[]
```


Variant `fav_teams_user`:

```graphql
{fav_teams_user:get_favorite_teams(user_id:"1267685386142887936",sport:"nfl"){active name metadata aliases sport team}}
```

Result: 64 ms, 2 bytes. Trimmed:

```json
[]
```



### `sport_info`

```graphql
sport_info(sport: String!): Map
```

Server description: Get sport info

Notes: Same as REST `/state/nfl` (`week`, `leg`, `season`, `season_start_date`, `display_week`) with `season_has_scores`, `dd_draft_week` extra.

Example:

```graphql
{sport_info(sport:"nfl")}
```

Result: 78 ms, 250 bytes. Trimmed:

```json
{
 "week": 1,
 "leg": 1,
 "season": "2026",
 "season_type": "regular",
 "league_season": "2026",
 "previous_season": "2025",
 "season_start_date": "2026-09-09",
 "display_week": 1,
 "league_create_season": "2026",
 "season_has_scores": true,
 "dd_draft_week": 1
}
```



### `player_performance_topic`

```graphql
player_performance_topic(sport: String!, season_type: String!, season: String!, player_id: String!, game_id: String!): Topic
```

Notes: SleeperBot's per-game player thread. Returned a topic for a 2025 game; null for the unplayed 2026 game.

Example:

```graphql
{player_performance_topic(sport:"nfl",season_type:"regular",season:"2026",player_id:"4983",game_id:"202610105"){hidden metadata title created attachment score client_id author_is_bot author_id topic_id title_map channel_tags channel_id last_message_id last_pinned_message_id last_read_id author_avatar author_display_name pinned reactions shard_max shard_min user_reactions{topic_id channel_id reactor_id reaction reactor_avatar reactor_display_name reactor_is_bot} upvotes num_messages player_tags pushed_by shadowed top_message_id engagement_score num_viewers}}
```

Result: 71 ms, 4 bytes. Trimmed:

```json
null
```


Variant `perf_topic_2025`:

```graphql
{perf_topic_2025:player_performance_topic(sport:"nfl",season_type:"regular",season:"2025",player_id:"4983",game_id:"202510106"){hidden metadata title created attachment score client_id author_is_bot author_id topic_id title_map channel_tags channel_id last_message_id last_pinned_message_id last_read_id author_avatar author_display_name pinned reactions shard_max shard_min user_reactions{topic_id channel_id reactor_id reaction reactor_avatar reactor_display_name reactor_is_bot} upvotes num_messages player_tags pushed_by shadowed top_message_id engagement_score num_viewers}}
```

Result: 73 ms, 1,978 bytes. Trimmed:

```json
{
 "attachment": null,
 "author_avatar": "<avatar>",
 "author_display_name": "<redacted>",
 "author_id": "<user_15>",
 "author_is_bot": true,
 "channel_id": "1113708766076891136",
 "channel_tags": [
  "player_performance"
 ],
 "client_id": null,
 "created": 1752524657830,
 "engagement_score": null,
 "hidden": null,
 "last_message_id": "1318761765810479104",
 "last_pinned_message_id": null,
 "last_read_id": null,
 "...": "17 more keys"
}
```



## Pick'em pools

### `get_pickem_leg`

```graphql
get_pickem_leg(league_id: String!, roster_id: Int!, leg_id: String!): PickemLeg
```

Notes: One roster's picks for one leg (`leg_id` like `v1:regular:1`): `picks` keyed by game id with `team`, `outcome`, `updated_at`; `tiebreaker`; `leg_scoring_result`; `num_expected_picks`. Takes `league_id` as String, not Snowflake.

Example:

```graphql
{get_pickem_leg(league_id:"1399932549756674048",roster_id:5,leg_id:"v1:regular:1"){status metadata picks league_id roster_id tiebreaker leg_scoring_result leg_id num_expected_picks}}
```

Result: 66 ms, 1,902 bytes. Trimmed:

```json
{
 "league_id": "1399932549756674048",
 "leg_id": "v1:regular:1",
 "leg_scoring_result": {},
 "metadata": {},
 "num_expected_picks": 16,
 "picks": {
  "202610105": {
   "outcome": "win",
   "team": "CHI",
   "updated_at": 1788213184062,
   "game_id": "202610105"
  },
  "202610107": {
   "outcome": "win",
   "team": "CIN",
   "updated_at": 1788213184132,
   "game_id": "202610107"
  },
  "202610111": {
   "outcome": "win",
   "team": "DET",
   "updated_at": 1788213184195,
   "game_id": "202610111"
  },
  "202610113": {
   "outcome": "win",
   "team": "BUF",
   "updated_at": 1788213184270,
   "game_id": "202610113"
  },
  "202610114": {
   "outcome": "win",
   "team": "BAL",
   "updated_at": 1788213184354,
   "game_id": "202610114"
  },
  "202610115": {
   "outcome": "win",
   "team": "JAX",
   "updated_at": 1788213184434,
   "game_id": "202610115"
  },
  "202610116": {
   "outcome": "win",
   "team": "KC",
   "updated_at": 1788213184555,
   "game_id": "202610116"
  },
  "202610120": {
   "outcome": "win",
   "team": "MIN",
   "updated_at": 1788213184622,
   "game_id": "202610120"
  },
  "202610123": {
   "outcome": "win",
   "team": "DAL",
   "updated_at": 1788213184716,
   "game_id": "202610123"
  },
  "202610125": {
   "outcome": "win",
   "team": "LV",
   "updated_at": 1788213184859,
   "game_id": "202610125"
  },
  "202610126": {
   "outcome": "win",
   "team": "PHI",
   "updated_at": 1788213184928,
   "game_id": "202610126"
  },
  "202610128": {
   "outcome": "win",
   "team": "PIT",
   "updated_at": 1788213184995,
   "game_id": "202610128"
  },
  "202610129": {
   "outcome": "win",
   "team": "LAC",
   "updated_at": 1788213185062,
   "game_id": "202610129"
  },
  "202610130": {
   "outcome": "win",
   "team": "SEA",
   "updated_at": 1788213185128,
   "game_id": "202610130"
  },
  "...": "2 more keys"
 },
 "roster_id": 5,
 "status": "in_progress",
 "tiebreaker": {
  "type": "total_points",
  "value": 30,
  "updated_at": 1788872429320,
  "game_id": "202610116"
 }
}
```



### `get_pickem_legs`

```graphql
get_pickem_legs(league_id: String!, roster_id: Int!): [PickemLeg]
```

Notes: All legs for a roster. Works for any roster id in the pool, so rivals' picks are readable.

Example:

```graphql
{get_pickem_legs(league_id:"1399932549756674048",roster_id:5){status metadata picks league_id roster_id tiebreaker leg_scoring_result leg_id num_expected_picks}}
```

Result: 60 ms, 1,904 bytes. Trimmed:

```json
[
 {
  "league_id": "1399932549756674048",
  "leg_id": "v1:regular:1",
  "leg_scoring_result": {},
  "metadata": {},
  "num_expected_picks": 16,
  "picks": {
   "202610105": {
    "outcome": "win",
    "team": "CHI",
    "updated_at": 1788213184062,
    "game_id": "202610105"
   },
   "202610107": {
    "outcome": "win",
    "team": "CIN",
    "updated_at": 1788213184132,
    "game_id": "202610107"
   },
   "202610111": {
    "outcome": "win",
    "team": "DET",
    "updated_at": 1788213184195,
    "game_id": "202610111"
   },
   "202610113": {
    "outcome": "win",
    "team": "BUF",
    "updated_at": 1788213184270,
    "game_id": "202610113"
   },
   "202610114": {
    "outcome": "win",
    "team": "BAL",
    "updated_at": 1788213184354,
    "game_id": "202610114"
   },
   "202610115": {
    "outcome": "win",
    "team": "JAX",
    "updated_at": 1788213184434,
    "game_id": "202610115"
   },
   "202610116": {
    "outcome": "win",
    "team": "KC",
    "updated_at": 1788213184555,
    "game_id": "202610116"
   },
   "202610120": {
    "outcome": "win",
    "team": "MIN",
    "updated_at": 1788213184622,
    "game_id": "202610120"
   },
   "202610123": {
    "outcome": "win",
    "team": "DAL",
    "updated_at": 1788213184716,
    "game_id": "202610123"
   },
   "202610125": {
    "outcome": "win",
    "team": "LV",
    "updated_at": 1788213184859,
    "game_id": "202610125"
   },
   "202610126": {
    "outcome": "win",
    "team": "PHI",
    "updated_at": 1788213184928,
    "game_id": "202610126"
   },
   "202610128": {
    "outcome": "win",
    "team": "PIT",
    "updated_at": 1788213184995,
    "game_id": "202610128"
   },
   "202610129": {
    "outcome": "win",
    "team": "LAC",
    "updated_at": 1788213185062,
    "game_id": "202610129"
   },
   "202610130": {
    "outcome": "win",
    "team": "SEA",
    "updated_at": 1788213185128,
    "game_id": "202610130"
   },
   "...": "2 more keys"
  },
  "roster_id": 5,
  "status": "in_progress",
  "tiebreaker": {
   "type": "total_points",
   "value": 30,
   "updated_at": 1788872429320,
   "game_id": "202610116"
  }
 }
]
```


Variant `pickem_legs_r1`:

```graphql
{pickem_legs_r1:get_pickem_legs(league_id:"1399932549756674048",roster_id:1){status metadata picks league_id roster_id tiebreaker leg_scoring_result leg_id num_expected_picks}}
```

Result: 76 ms, 3,714 bytes. Trimmed:

```json
[
 {
  "league_id": "1399932549756674048",
  "leg_id": "v1:regular:1",
  "leg_scoring_result": {},
  "metadata": {},
  "num_expected_picks": 16,
  "picks": {
   "202610105": {
    "outcome": "win",
    "team": "CHI",
    "updated_at": 1788132621104,
    "game_id": "202610105"
   },
   "202610107": {
    "outcome": "win",
    "team": "TB",
    "updated_at": 1788132623406,
    "game_id": "202610107"
   },
   "202610111": {
    "outcome": "win",
    "team": "DET",
    "updated_at": 1788132625675,
    "game_id": "202610111"
   },
   "202610113": {
    "outcome": "win",
    "team": "BUF",
    "updated_at": 1788132626681,
    "game_id": "202610113"
   },
   "202610114": {
    "outcome": "win",
    "team": "BAL",
    "updated_at": 1788132629871,
    "game_id": "202610114"
   },
   "202610115": {
    "outcome": "win",
    "team": "JAX",
    "updated_at": 1788132631323,
    "game_id": "202610115"
   },
   "202610116": {
    "outcome": "win",
    "team": "DEN",
    "updated_at": 1788132651973,
    "game_id": "202610116"
   },
   "202610120": {
    "outcome": "win",
    "team": "GB",
    "updated_at": 1788132640390,
    "game_id": "202610120"
   },
   "202610123": {
    "outcome": "win",
    "team": "DAL",
    "updated_at": 1788132649165,
    "game_id": "202610123"
   },
   "202610125": {
    "outcome": "win",
    "team": "LV",
    "updated_at": 1788132643405,
    "game_id": "202610125"
   },
   "202610126": {
    "outcome": "win",
    "team": "PHI",
    "updated_at": 1788132645509,
    "game_id": "202610126"
   },
   "202610128": {
    "outcome": "win",
    "team": "PIT",
    "updated_at": 1788132635163,
    "game_id": "202610128"
   },
   "202610129": {
    "outcome": "win",
    "team": "LAC",
    "updated_at": 1788132646873,
    "game_id": "202610129"
   },
   "202610130": {
    "outcome": "win",
    "team": "SEA",
    "updated_at": 1788132612070,
    "game_id": "202610130"
   },
   "...": "2 more keys"
  },
  "roster_id": 1,
  "status": "in_progress",
  "tiebreaker": {
   "type": "total_points",
   "value": 47,
   "updated_at": 1788132660723,
   "game_id": "202610116"
  }
 },
 {
  "league_id": "1399932549756674048",
  "leg_id": "v1:regular:2",
  "leg_scoring_result": {},
  "metadata": {},
  "num_expected_picks": null,
  "picks": {
   "202610201": {
    "outcome": "win",
    "team": "SEA",
    "updated_at": 1788978528264,
    "game_id": "202610201"
   },
   "202610202": {
    "outcome": "win",
    "team": "CAR",
    "updated_at": 1788978513823,
    "game_id": "202610202"
   },
   "202610203": {
    "outcome": "win",
    "team": "BAL",
    "updated_at": 1788978515172,
    "game_id": "202610203"
   },
   "202610204": {
    "outcome": "win",
    "team": "BUF",
    "updated_at": 1788978511390,
    "game_id": "202610204"
   },
   "202610206": {
    "outcome": "win",
    "team": "CHI",
    "updated_at": 1788978516223,
    "game_id": "202610206"
   },
   "202610209": {
    "outcome": "win",
    "team": "WAS",
    "updated_at": 1788978531359,
    "game_id": "202610209"
   },
   "202610210": {
    "outcome": "win",
    "team": "DEN",
    "updated_at": 1788978525025,
    "game_id": "202610210"
   },
   "202610213": {
    "outcome": "win",
    "team": "CIN",
    "updated_at": 1788978518149,
    "game_id": "202610213"
   },
   "202610216": {
    "outcome": "win",
    "team": "KC",
    "updated_at": 1788978534786,
    "game_id": "202610216"
   },
   "202610221": {
    "outcome": "win",
    "team": "NE",
    "updated_at": 1788978519869,
    "game_id": "202610221"
   },
   "202610224": {
    "outcome": "win",
    "team": "GB",
    "updated_at": 1788978522172,
    "game_id": "202610224"
   },
   "202610229": {
    "outcome": "win",
    "team": "LAC",
    "updated_at": 1788978526803,
    "game_id": "202610229"
   },
   "202610231": {
    "outcome": "win",
    "team": "SF",
    "updated_at": 1788978532088,
    "game_id": "202610231"
   },
   "202610232": {
    "outcome": "win",
    "team": "LAR",
    "updated_at": 1788978535436,
    "game_id": "202610232"
   },
   "...": "2 more keys"
  },
  "roster_id": 1,
  "status": "pre_leg",
  "tiebreaker": {}
 }
]
```



### `get_pickem_picks_for_league`

```graphql
get_pickem_picks_for_league(league_id: String!, leg_id: String!, include_tiebreaker: Boolean): Map
```

Notes: Every member's picks for one leg in one Map (15 KB). `include_tiebreaker: true` adds tiebreakers.

Example:

```graphql
{get_pickem_picks_for_league(league_id:"1399932549756674048",leg_id:"v1:regular:1",include_tiebreaker:true)}
```

Result: 81 ms, 15,589 bytes. Trimmed:

```json
{
 "1": {
  "picks": {
   "202610105": {
    "outcome": "win",
    "team": "CHI",
    "game_id": "202610105",
    "updated_at": 1788132621104
   },
   "202610107": {
    "outcome": "win",
    "team": "TB",
    "game_id": "202610107",
    "updated_at": 1788132623406
   },
   "202610111": {
    "outcome": "win",
    "team": "DET",
    "game_id": "202610111",
    "updated_at": 1788132625675
   },
   "202610113": {
    "outcome": "win",
    "team": "BUF",
    "game_id": "202610113",
    "updated_at": 1788132626681
   },
   "202610114": {
    "outcome": "win",
    "team": "BAL",
    "game_id": "202610114",
    "updated_at": 1788132629871
   },
   "202610115": {
    "outcome": "win",
    "team": "JAX",
    "game_id": "202610115",
    "updated_at": 1788132631323
   },
   "202610116": {
    "outcome": "win",
    "team": "DEN",
    "game_id": "202610116",
    "updated_at": 1788132651973
   },
   "202610120": {
    "outcome": "win",
    "team": "GB",
    "game_id": "202610120",
    "updated_at": 1788132640390
   },
   "202610123": {
    "outcome": "win",
    "team": "DAL",
    "game_id": "202610123",
    "updated_at": 1788132649165
   },
   "202610125": {
    "outcome": "win",
    "team": "LV",
    "game_id": "202610125",
    "updated_at": 1788132643405
   },
   "202610126": {
    "outcome": "win",
    "team": "PHI",
    "game_id": "202610126",
    "updated_at": 1788132645509
   },
   "202610128": {
    "outcome": "win",
    "team": "PIT",
    "game_id": "202610128",
    "updated_at": 1788132635163
   },
   "202610129": {
    "outcome": "win",
    "team": "LAC",
    "game_id": "202610129",
    "updated_at": 1788132646873
   },
   "202610130": {
    "outcome": "win",
    "team": "SEA",
    "game_id": "202610130",
    "updated_at": 1788132612070
   },
   "...": "2 more keys"
  },
  "tiebreaker": {
   "type": "total_points",
   "value": 47,
   "game_id": "202610116",
   "updated_at": 1788132660723
  }
 },
 "2": {
  "picks": {
   "202610105": {
    "outcome": "win",
    "team": "CHI",
    "game_id": "202610105",
    "updated_at": 1788920147061
   },
   "202610107": {
    "outcome": "win",
    "team": "TB",
    "game_id": "202610107",
    "updated_at": 1788269798321
   },
   "202610111": {
    "outcome": "win",
    "team": "DET",
    "game_id": "202610111",
    "updated_at": 1788269794536
   },
   "202610113": {
    "outcome": "win",
    "team": "BUF",
    "game_id": "202610113",
    "updated_at": 1788269794733
   },
   "202610114": {
    "outcome": "win",
    "team": "BAL",
    "game_id": "202610114",
    "updated_at": 1788269800700
   },
   "202610115": {
    "outcome": "win",
    "team": "CLE",
    "game_id": "202610115",
    "updated_at": 1788269806060
   },
   "202610116": {
    "outcome": "win",
    "team": "DEN",
    "game_id": "202610116",
    "updated_at": 1788269853177
   },
   "202610120": {
    "outcome": "win",
    "team": "GB",
    "game_id": "202610120",
    "updated_at": 1788269830868
   },
   "202610123": {
    "outcome": "win",
    "team": "DAL",
    "game_id": "202610123",
    "updated_at": 1788269856635
   },
   "202610125": {
    "outcome": "win",
    "team": "LV",
    "game_id": "202610125",
    "updated_at": 1788269843019
   },
   "202610126": {
    "outcome": "win",
    "team": "PHI",
    "game_id": "202610126",
    "updated_at": 1788269846793
   },
   "202610128": {
    "outcome": "win",
    "team": "PIT",
    "game_id": "202610128",
    "updated_at": 1788269820851
   },
   "202610129": {
    "outcome": "win",
    "team": "LAC",
    "game_id": "202610129",
    "updated_at": 1788269847488
   },
   "202610130": {
    "outcome": "win",
    "team": "SEA",
    "game_id": "202610130",
    "updated_at": 1788269774482
   },
   "...": "2 more keys"
  },
  "tiebreaker": {
   "type": "total_points",
   "value": 49,
   "game_id": "202610116",
   "updated_at": 1788269875267
  }
 },
 "3": {
  "picks": {
   "202610105": {
    "outcome": "win",
    "team": "CHI",
    "game_id": "202610105",
    "updated_at": 1788192457288
   },
   "202610107": {
    "outcome": "win",
    "team": "TB",
    "game_id": "202610107",
    "updated_at": 1788192472620
   },
   "202610111": {
    "outcome": "win",
    "team": "DET",
    "game_id": "202610111",
    "updated_at": 1788192459375
   },
   "202610113": {
    "outcome": "win",
    "team": "BUF",
    "game_id": "202610113",
    "updated_at": 1788192468922
   },
   "202610114": {
    "outcome": "win",
    "team": "IND",
    "game_id": "202610114",
    "updated_at": 1788192499443
   },
   "202610115": {
    "outcome": "win",
    "team": "CLE",
    "game_id": "202610115",
    "updated_at": 1788192511210
   },
   "202610116": {
    "outcome": "win",
    "team": "DEN",
    "game_id": "202610116",
    "updated_at": 1788192605386
   },
   "202610120": {
    "outcome": "win",
    "team": "GB",
    "game_id": "202610120",
    "updated_at": 1788192529108
   },
   "202610123": {
    "outcome": "win",
    "team": "DAL",
    "game_id": "202610123",
    "updated_at": 1788192603665
   },
   "202610125": {
    "outcome": "win",
    "team": "MIA",
    "game_id": "202610125",
    "updated_at": 1788192585122
   },
   "202610126": {
    "outcome": "win",
    "team": "WAS",
    "game_id": "202610126",
    "updated_at": 1788192592384
   },
   "202610128": {
    "outcome": "win",
    "team": "PIT",
    "game_id": "202610128",
    "updated_at": 1788192523995
   },
   "202610129": {
    "outcome": "win",
    "team": "LAC",
    "game_id": "202610129",
    "updated_at": 1788192612712
   },
   "202610130": {
    "outcome": "win",
    "team": "SEA",
    "game_id": "202610130",
    "updated_at": 1788979251688
   },
   "...": "2 more keys"
  },
  "tiebreaker": {
   "type": "total_points",
   "value": 50,
   "game_id": "202610116",
   "updated_at": 1788192658599
  }
 },
 "4": {
  "picks": {
   "202610105": {
    "outcome": "win",
    "team": "CHI",
    "game_id": "202610105",
    "updated_at": 1788204039090
   },
   "202610107": {
    "outcome": "win",
    "team": "CIN",
    "game_id": "202610107",
    "updated_at": 1788204037653
   },
   "202610111": {
    "outcome": "win",
    "team": "DET",
    "game_id": "202610111",
    "updated_at": 1788204040686
   },
   "202610113": {
    "outcome": "win",
    "team": "BUF",
    "game_id": "202610113",
    "updated_at": 1788204043411
   },
   "202610114": {
    "outcome": "win",
    "team": "BAL",
    "game_id": "202610114",
    "updated_at": 1788204086088
   },
   "202610115": {
    "outcome": "win",
    "team": "JAX",
    "game_id": "202610115",
    "updated_at": 1788204044943
   },
   "202610116": {
    "outcome": "win",
    "team": "DEN",
    "game_id": "202610116",
    "updated_at": 1788204059970
   },
   "202610120": {
    "outcome": "win",
    "team": "GB",
    "game_id": "202610120",
    "updated_at": 1788204053132
   },
   "202610123": {
    "outcome": "win",
    "team": "DAL",
    "game_id": "202610123",
    "updated_at": 1788204063987
   },
   "202610125": {
    "outcome": "win",
    "team": "LV",
    "game_id": "202610125",
    "updated_at": 1788204051951
   },
   "202610126": {
    "outcome": "win",
    "team": "PHI",
    "game_id": "202610126",
    "updated_at": 1788204054598
   },
   "202610128": {
    "outcome": "win",
    "team": "PIT",
    "game_id": "202610128",
    "updated_at": 1788204079034
   },
   "202610129": {
    "outcome": "win",
    "team": "LAC",
    "game_id": "202610129",
    "updated_at": 1788204055954
   },
   "202610130": {
    "outcome": "win",
    "team": "SEA",
    "game_id": "202610130",
    "updated_at": 1788204094410
   },
   "...": "2 more keys"
  },
  "tiebreaker": {
   "type": "total_points",
   "value": 31,
   "game_id": "202610116",
   "updated_at": 1788204132175
  }
 },
 "5": {
  "picks": {
   "202610105": {
    "outcome": "win",
    "team": "CHI",
    "game_id": "202610105",
    "updated_at": 1788213184062
   },
   "202610107": {
    "outcome": "win",
    "team": "CIN",
    "game_id": "202610107",
    "updated_at": 1788213184132
   },
   "202610111": {
    "outcome": "win",
    "team": "DET",
    "game_id": "202610111",
    "updated_at": 1788213184195
   },
   "202610113": {
    "outcome": "win",
    "team": "BUF",
    "game_id": "202610113",
    "updated_at": 1788213184270
   },
   "202610114": {
    "outcome": "win",
    "team": "BAL",
    "game_id": "202610114",
    "updated_at": 1788213184354
   },
   "202610115": {
    "outcome": "win",
    "team": "JAX",
    "game_id": "202610115",
    "updated_at": 1788213184434
   },
   "202610116": {
    "outcome": "win",
    "team": "KC",
    "game_id": "202610116",
    "updated_at": 1788213184555
   },
   "202610120": {
    "outcome": "win",
    "team": "MIN",
    "game_id": "202610120",
    "updated_at": 1788213184622
   },
   "202610123": {
    "outcome": "win",
    "team": "DAL",
    "game_id": "202610123",
    "updated_at": 1788213184716
   },
   "202610125": {
    "outcome": "win",
    "team": "LV",
    "game_id": "202610125",
    "updated_at": 1788213184859
   },
   "202610126": {
    "outcome": "win",
    "team": "PHI",
    "game_id": "202610126",
    "updated_at": 1788213184928
   },
   "202610128": {
    "outcome": "win",
    "team": "PIT",
    "game_id": "202610128",
    "updated_at": 1788213184995
   },
   "202610129": {
    "outcome": "win",
    "team": "LAC",
    "game_id": "202610129",
    "updated_at": 1788213185062
   },
   "202610130": {
    "outcome": "win",
    "team": "SEA",
    "game_id": "202610130",
    "updated_at": 1788213185128
   },
   "...": "2 more keys"
  },
  "tiebreaker": {
   "type": "total_points",
   "value": 30,
   "game_id": "202610116",
   "updated_at": 1788872429320
  }
 },
 "6": {
  "picks": {
   "202610105": {
    "outcome": "win",
    "team": "CHI",
    "game_id": "202610105",
    "updated_at": 1788213833704
   },
   "202610107": {
    "outcome": "win",
    "team": "TB",
    "game_id": "202610107",
    "updated_at": 1788213875770
   },
   "202610111": {
    "outcome": "win",
    "team": "DET",
    "game_id": "202610111",
    "updated_at": 1788213847728
   },
   "202610113": {
    "outcome": "win",
    "team": "BUF",
    "game_id": "202610113",
    "updated_at": 1788213860024
   },
   "202610114": {
    "outcome": "win",
    "team": "BAL",
    "game_id": "202610114",
    "updated_at": 1788213865804
   },
   "202610115": {
    "outcome": "win",
    "team": "JAX",
    "game_id": "202610115",
    "updated_at": 1788213867772
   },
   "202610116": {
    "outcome": "win",
    "team": "KC",
    "game_id": "202610116",
    "updated_at": 1788213930493
   },
   "202610120": {
    "outcome": "win",
    "team": "GB",
    "game_id": "202610120",
    "updated_at": 1788213911378
   },
   "202610123": {
    "outcome": "win",
    "team": "DAL",
    "game_id": "202610123",
    "updated_at": 1788213923370
   },
   "202610125": {
    "outcome": "win",
    "team": "LV",
    "game_id": "202610125",
    "updated_at": 1788213914040
   },
   "202610126": {
    "outcome": "win",
    "team": "PHI",
    "game_id": "202610126",
    "updated_at": 1788213919645
   },
   "202610128": {
    "outcome": "win",
    "team": "PIT",
    "game_id": "202610128",
    "updated_at": 1788213891883
   },
   "202610129": {
    "outcome": "win",
    "team": "LAC",
    "game_id": "202610129",
    "updated_at": 1788213920757
   },
   "202610130": {
    "outcome": "win",
    "team": "SEA",
    "game_id": "202610130",
    "updated_at": 1788213776727
   },
   "...": "2 more keys"
  },
  "tiebreaker": {
   "type": "total_points",
   "value": 62,
   "game_id": "202610116",
   "updated_at": 1788324105062
  }
 },
 "7": {
  "picks": {},
  "tiebreaker": {}
 },
 "8": {
  "picks": {
   "202610105": {
    "outcome": "win",
    "team": "CHI",
    "game_id": "202610105",
    "updated_at": 1788623970549
   },
   "202610107": {
    "outcome": "win",
    "team": "TB",
    "game_id": "202610107",
    "updated_at": 1788623984864
   },
   "202610111": {
    "outcome": "win",
    "team": "DET",
    "game_id": "202610111",
    "updated_at": 1788623987329
   },
   "202610113": {
    "outcome": "win",
    "team": "BUF",
    "game_id": "202610113",
    "updated_at": 1788623989293
   },
   "202610114": {
    "outcome": "win",
    "team": "IND",
    "game_id": "202610114",
    "updated_at": 1788623996620
   },
   "202610115": {
    "outcome": "win",
    "team": "JAX",
    "game_id": "202610115",
    "updated_at": 1788624000903
   },
   "202610116": {
    "outcome": "win",
    "team": "DEN",
    "game_id": "202610116",
    "updated_at": 1788624047325
   },
   "202610120": {
    "outcome": "win",
    "team": "GB",
    "game_id": "202610120",
    "updated_at": 1788624025130
   },
   "202610123": {
    "outcome": "win",
    "team": "DAL",
    "game_id": "202610123",
    "updated_at": 1788624043877
   },
   "202610125": {
    "outcome": "win",
    "team": "LV",
    "game_id": "202610125",
    "updated_at": 1788624028994
   },
   "202610126": {
    "outcome": "win",
    "team": "WAS",
    "game_id": "202610126",
    "updated_at": 1788624033622
   },
   "202610128": {
    "outcome": "win",
    "team": "PIT",
    "game_id": "202610128",
    "updated_at": 1788624004862
   },
   "202610129": {
    "outcome": "win",
    "team": "LAC",
    "game_id": "202610129",
    "updated_at": 1788624039174
   },
   "202610130": {
    "outcome": "win",
    "team": "SEA",
    "game_id": "202610130",
    "updated_at": 1788623963292
   },
   "...": "2 more keys"
  },
  "tiebreaker": {
   "type": "total_points",
   "value": 35,
   "game_id": "202610116",
   "updated_at": 1788624069055
  }
 },
 "9": {
  "picks": {
   "202610105": {
    "outcome": "win",
    "team": "CHI",
    "game_id": "202610105",
    "updated_at": 1788306852630
   },
   "202610107": {
    "outcome": "win",
    "team": "CIN",
    "game_id": "202610107",
    "updated_at": 1788306854065
   },
   "202610111": {
    "outcome": "win",
    "team": "DET",
    "game_id": "202610111",
    "updated_at": 1788306855641
   },
   "202610113": {
    "outcome": "win",
    "team": "HOU",
    "game_id": "202610113",
    "updated_at": 1788306859449
   },
   "202610114": {
    "outcome": "win",
    "team": "BAL",
    "game_id": "202610114",
    "updated_at": 1788306872202
   },
   "202610115": {
    "outcome": "win",
    "team": "JAX",
    "game_id": "202610115",
    "updated_at": 1788306860465
   },
   "202610116": {
    "outcome": "win",
    "team": "DEN",
    "game_id": "202610116",
    "updated_at": 1788306890268
   },
   "202610120": {
    "outcome": "win",
    "team": "MIN",
    "game_id": "202610120",
    "updated_at": 1788306880275
   },
   "202610123": {
    "outcome": "win",
    "team": "DAL",
    "game_id": "202610123",
    "updated_at": 1788306889020
   },
   "202610125": {
    "outcome": "win",
    "team": "LV",
    "game_id": "202610125",
    "updated_at": 1788306879353
   },
   "202610126": {
    "outcome": "win",
    "team": "PHI",
    "game_id": "202610126",
    "updated_at": 1788306885732
   },
   "202610128": {
    "outcome": "win",
    "team": "ATL",
    "game_id": "202610128",
    "updated_at": 1788306874998
   },
   "202610129": {
    "outcome": "win",
    "team": "LAC",
    "game_id": "202610129",
    "updated_at": 1788306887209
   },
   "202610130": {
    "outcome": "win",
    "team": "SEA",
    "game_id": "202610130",
    "updated_at": 1788306906427
   },
   "...": "2 more keys"
  },
  "tiebreaker": {}
 },
 "10": {
  "picks": {
   "202610105": {
    "outcome": "win",
    "team": "CHI",
    "game_id": "202610105",
    "updated_at": 1788801393312
   },
   "202610107": {
    "outcome": "win",
    "team": "CIN",
    "game_id": "202610107",
    "updated_at": 1788801258753
   },
   "202610111": {
    "outcome": "win",
    "team": "DET",
    "game_id": "202610111",
    "updated_at": 1788801274751
   },
   "202610113": {
    "outcome": "win",
    "team": "HOU",
    "game_id": "202610113",
    "updated_at": 1788801461209
   },
   "202610114": {
    "outcome": "win",
    "team": "IND",
    "game_id": "202610114",
    "updated_at": 1788801349551
   },
   "202610115": {
    "outcome": "win",
    "team": "JAX",
    "game_id": "202610115",
    "updated_at": 1788801421625
   },
   "202610116": {
    "outcome": "win",
    "team": "DEN",
    "game_id": "202610116",
    "updated_at": 1788801654285
   },
   "202610120": {
    "outcome": "win",
    "team": "MIN",
    "game_id": "202610120",
    "updated_at": 1788801534876
   },
   "202610123": {
    "outcome": "win",
    "team": "DAL",
    "game_id": "202610123",
    "updated_at": 1788801602968
   },
   "202610125": {
    "outcome": "win",
    "team": "LV",
    "game_id": "202610125",
    "updated_at": 1788801491732
   },
   "202610126": {
    "outcome": "win",
    "team": "PHI",
    "game_id": "202610126",
    "updated_at": 1788801565434
   },
   "202610128": {
    "outcome": "win",
    "team": "PIT",
    "game_id": "202610128",
    "updated_at": 1788801374957
   },
   "202610129": {
    "outcome": "win",
    "team": "LAC",
    "game_id": "202610129",
    "updated_at": 1788801588359
   },
   "202610130": {
    "outcome": "win",
    "team": "NE",
    "game_id": "202610130",
    "updated_at": 1788801172287
   },
   "...": "2 more keys"
  },
  "tiebreaker": {
   "type": "total_points",
   "value": 39,
   "game_id": "202610116",
   "updated_at": 1788801670583
  }
 }
}
```



### `get_pickem_scoring_settings`

```graphql
get_pickem_scoring_settings(league_id: Snowflake!): Map
```

Notes: Points per leg, keyed by leg id.

Example:

```graphql
{get_pickem_scoring_settings(league_id:"1399932549756674048")}
```

Result: 76 ms, 351 bytes. Trimmed:

```json
{
 "v1:regular:1": 1,
 "v1:regular:10": 1,
 "v1:regular:11": 1,
 "v1:regular:12": 1,
 "v1:regular:13": 1,
 "v1:regular:14": 1,
 "v1:regular:15": 1,
 "v1:regular:16": 1,
 "v1:regular:17": 1,
 "v1:regular:18": 1,
 "v1:regular:2": 1,
 "v1:regular:3": 1,
 "v1:regular:4": 1,
 "v1:regular:5": 1,
 "...": "4 more keys"
}
```



### `tournament_picks`

```graphql
tournament_picks(round: Int, league_id: Snowflake!, roster_id: Int): [TournamentPick]
```

Notes: Bracket-mania picks. Requires `roster_id` (errors `Please provide a roster_id` without it). Empty here.

Example:

```graphql
{tournament_picks(league_id:"1389357604773322752"){round points team game_id league_id roster_id team_bracket team_seed}}
```

Result: error after 68 ms: `Please provide a roster_id.`


Variant `tournament_picks_r3`:

```graphql
{tournament_picks_r3:tournament_picks(league_id:"1389357604773322752",roster_id:3){round points team game_id league_id roster_id team_bracket team_seed}}
```

Result: 90 ms, 2 bytes. Trimmed:

```json
[]
```



### `all_tournament_picks`

```graphql
all_tournament_picks(league_id: Snowflake!): [TournamentPick]
```

Notes: Empty here.

Example:

```graphql
{all_tournament_picks(league_id:"1389357604773322752"){round points team game_id league_id roster_id team_bracket team_seed}}
```

Result: 80 ms, 2 bytes. Trimmed:

```json
[]
```



## DMs and messages

### `my_dms`

```graphql
my_dms(limit: Int, unread: Boolean): [Dm]
```

Server description: Get a list of DMs for a particular user, with ability to do before query

Notes: DM thread list with the last message inline. `unread: true` filters to unread threads. `limit` works. Threads from people who have not been accepted (see `inbound_requests`) do not appear.

Example:

```graphql
{my_dms(limit:3){title last_message_id dm_id dm_type recent_users last_author_avatar last_author_display_name last_author_id last_author_is_bot last_author_real_name last_message_attachment last_message_text last_message_text_map last_message_time last_pinned_message_id member_can_invite deleted_at hidden_at last_read_id}}
```

Result: 81 ms, 3,683 bytes. Trimmed:

```json
[
 {
  "deleted_at": null,
  "dm_id": "1403496316385988608",
  "dm_type": "single",
  "hidden_at": null,
  "last_author_avatar": "<avatar>",
  "last_author_display_name": "<redacted>",
  "last_author_id": "<user_3>",
  "last_author_is_bot": false,
  "last_author_real_name": null,
  "last_message_attachment": null,
  "last_message_id": "1403514558420619264",
  "last_message_text": "<redacted text>",
  "last_message_text_map": {
   "flairs": {
    "data": [],
    "type": "flair"
   }
  },
  "last_message_time": 1788986456068,
  "...": "5 more keys"
 },
 {
  "deleted_at": null,
  "dm_id": "1400921359709655040",
  "dm_type": "single",
  "hidden_at": null,
  "last_author_avatar": "<avatar>",
  "last_author_display_name": "<redacted>",
  "last_author_id": "<user_3>",
  "last_author_is_bot": false,
  "last_author_real_name": null,
  "last_message_attachment": null,
  "last_message_id": "1403240807422570496",
  "last_message_text": "<redacted text>",
  "last_message_text_map": {
   "flairs": {
    "data": [],
    "type": "flair"
   }
  },
  "last_message_time": 1788921188745,
  "...": "5 more keys"
 },
 "... 1 more"
]
```


Variant `my_dms_unread`:

```graphql
{my_dms_unread:my_dms(unread:true){title last_message_id dm_id dm_type recent_users last_author_avatar last_author_display_name last_author_id last_author_is_bot last_author_real_name last_message_attachment last_message_text last_message_text_map last_message_time last_pinned_message_id member_can_invite deleted_at hidden_at last_read_id}}
```

Result: 81 ms, 2 bytes. Trimmed:

```json
[]
```



### `dm`

```graphql
dm(dm_id: Snowflake!): Dm
```

Server description: Get DM by ID

Notes: One DM thread by id, same fields as a `my_dms` row.

Example:

```graphql
{dm(dm_id:"1403496316385988608"){title last_message_id dm_id dm_type recent_users last_author_avatar last_author_display_name last_author_id last_author_is_bot last_author_real_name last_message_attachment last_message_text last_message_text_map last_message_time last_pinned_message_id member_can_invite deleted_at hidden_at last_read_id}}
```

Result: 59 ms, 1,279 bytes. Trimmed:

```json
{
 "deleted_at": null,
 "dm_id": "1403496316385988608",
 "dm_type": "single",
 "hidden_at": null,
 "last_author_avatar": "<avatar>",
 "last_author_display_name": "<redacted>",
 "last_author_id": "<user_3>",
 "last_author_is_bot": false,
 "last_author_real_name": null,
 "last_message_attachment": null,
 "last_message_id": "1403514558420619264",
 "last_message_text": "<redacted text>",
 "last_message_text_map": {
  "flairs": {
   "data": [],
   "type": "flair"
  }
 },
 "last_message_time": 1788986456068,
 "...": "5 more keys"
}
```



### `dm_members`

```graphql
dm_members(dm_id: Snowflake!): [DmUser]
```

Server description: Get all users within a DM

Notes: Members of a DM with `allow_pn`, `is_owner`, `pending`.

Example:

```graphql
{dm_members(dm_id:"1403496316385988608"){pending is_owner real_name user_id avatar display_name is_bot dm_id allow_pn mention_pn}}
```

Result: 72 ms, 503 bytes. Trimmed:

```json
[
 {
  "allow_pn": true,
  "avatar": "<avatar>",
  "display_name": "<redacted>",
  "dm_id": "1403496316385988608",
  "is_bot": false,
  "is_owner": true,
  "mention_pn": true,
  "pending": null,
  "real_name": null,
  "user_id": "<user_5>"
 },
 {
  "allow_pn": true,
  "avatar": "<avatar>",
  "display_name": "<redacted>",
  "dm_id": "1403496316385988608",
  "is_bot": false,
  "is_owner": null,
  "mention_pn": true,
  "pending": null,
  "real_name": null,
  "user_id": "<user_3>"
 }
]
```



### `get_dm_settings`

```graphql
get_dm_settings(dm_id: Snowflake!): DmUser
```

Server description: Get a DM member

Notes: The caller's DmUser row for a thread.

Example:

```graphql
{get_dm_settings(dm_id:"1403496316385988608"){pending is_owner real_name user_id avatar display_name is_bot dm_id allow_pn mention_pn}}
```

Result: 62 ms, 252 bytes. Trimmed:

```json
{
 "allow_pn": true,
 "avatar": "<avatar>",
 "display_name": "<redacted>",
 "dm_id": "1403496316385988608",
 "is_bot": false,
 "is_owner": null,
 "mention_pn": true,
 "pending": null,
 "real_name": null,
 "user_id": "<user_3>"
}
```



### `get_dm_by_members`

```graphql
get_dm_by_members(members: [Snowflake]): Dm
```

Server description: Grab DM if it exists based on member_ids provided, null if not

Notes: Find the existing thread for a set of user ids. Null when none exists (tested with a made-up id).

Example:

```graphql
{get_dm_by_members(members:["1267685386142887936","1267685386142887937"]){title last_message_id dm_id dm_type recent_users last_author_avatar last_author_display_name last_author_id last_author_is_bot last_author_real_name last_message_attachment last_message_text last_message_text_map last_message_time last_pinned_message_id member_can_invite deleted_at hidden_at last_read_id}}
```

Result: 73 ms, 4 bytes. Trimmed:

```json
null
```



### `search_dms`

```graphql
search_dms(term: String!): [Dm]
```

Server description: Search user related items like leagues, leaguemates, dms, and people in dms

Notes: Substring search over DM participants/titles. `term: "a"` returned nothing; a real name fragment returned the thread.

Example:

```graphql
{search_dms(term:"a"){title last_message_id dm_id dm_type recent_users last_author_avatar last_author_display_name last_author_id last_author_is_bot last_author_real_name last_message_attachment last_message_text last_message_text_map last_message_time last_pinned_message_id member_can_invite deleted_at hidden_at last_read_id}}
```

Result: 117 ms, 2 bytes. Trimmed:

```json
[]
```


Variant `search_dms_cookie`:

```graphql
{search_dms_cookie:search_dms(term:"cookie"){title last_message_id dm_id dm_type recent_users last_author_avatar last_author_display_name last_author_id last_author_is_bot last_author_real_name last_message_attachment last_message_text last_message_text_map last_message_time last_pinned_message_id member_can_invite deleted_at hidden_at last_read_id}}
```

Result: 104 ms, 2,402 bytes. Trimmed:

```json
[
 {
  "deleted_at": null,
  "dm_id": "1400921359709655040",
  "dm_type": "single",
  "hidden_at": null,
  "last_author_avatar": "<avatar>",
  "last_author_display_name": "<redacted>",
  "last_author_id": "<user_3>",
  "last_author_is_bot": false,
  "last_author_real_name": null,
  "last_message_attachment": null,
  "last_message_id": "1403240807422570496",
  "last_message_text": "<redacted text>",
  "last_message_text_map": {
   "flairs": {
    "data": [],
    "type": "flair"
   }
  },
  "last_message_time": 1788921188745,
  "...": "5 more keys"
 },
 {
  "deleted_at": null,
  "dm_id": "1401775878806962176",
  "dm_type": "group",
  "hidden_at": null,
  "last_author_avatar": "<avatar>",
  "last_author_display_name": "<redacted>",
  "last_author_id": "<user_3>",
  "last_author_is_bot": false,
  "last_author_real_name": null,
  "last_message_attachment": null,
  "last_message_id": "1401784493320232960",
  "last_message_text": "<redacted text>",
  "last_message_text_map": {
   "flairs": {
    "data": [],
    "type": "flair"
   }
  },
  "last_message_time": 1788573976406,
  "...": "5 more keys"
 }
]
```



### `messages`

```graphql
messages(before: Snowflake, order_by: String = "desc", parent_id: Snowflake!, show_hidden: Boolean = false): [Message]
```

Server description: Get messages, order_by 'asc' or 'desc', before 'message_id'

Notes: Messages for any parent: a DM id (`parent_type: dm`), a league id (league chat), a draft id. Default `order_by: desc`, newest first; `before: <message_id>` paginates; `order_by: asc` works. Trade offers arrive as messages whose `attachment.data` carries `transaction_id`, `status` and `transactions_by_roster` (a JSON string in DMs, an object in league chat). Text is HTML-escaped (`&#39;`). Reading does not mark anything read.

Example:

```graphql
{messages(parent_id:"1403496316385988608"){text parent_type created attachment client_id author_is_bot text_map message_id author_id parent_id author_achievement author_avatar author_display_name author_real_name author_role_id edited pinned reactions shard_max shard_min user_reactions client_context}}
```

Result: 133 ms, 72,068 bytes. Trimmed:

```json
[
 {
  "attachment": null,
  "author_achievement": null,
  "author_avatar": "<avatar>",
  "author_display_name": "<redacted>",
  "author_id": "<user_3>",
  "author_is_bot": false,
  "author_real_name": null,
  "author_role_id": null,
  "client_context": null,
  "client_id": null,
  "created": 1788986456068,
  "edited": null,
  "message_id": "1403514558420619264",
  "parent_id": "1403496316385988608",
  "...": "8 more keys"
 },
 {
  "attachment": {
   "data": {
    "league_id": "1389357604773322752",
    "status": "proposed",
    "transaction_id": "1403514456687788032",
    "transactions_by_roster": "{\"3\":{\"adds\":[{\"position\":\"RB\",\"status\":\"Active\",\"number\":33,\"first_name\":\"Bhayshul\",\"last_name\":\"Tuten\",\"sport\":\"nfl\",\"team\":\"JAX\",\"player_id\":\"12490\",\"fant...",
    "users_in_league_map": "{\"<id>\":{\"avatar\":\"12e3890501f1107453cca8ca0a78419a\",\"display_name\\\":\\\"<redacted>\",\"is_bot\":false,\"is_owner\":false,\"league_id\":null,\"metadata\":{\"allow_pn\":\"o..."
   },
   "type": "trade_dm"
  },
  "author_achievement": null,
  "author_avatar": "<avatar>",
  "author_display_name": "<redacted>",
  "author_id": "<user_5>",
  "author_is_bot": false,
  "author_real_name": null,
  "author_role_id": null,
  "client_context": null,
  "client_id": null,
  "created": 1788986434711,
  "edited": null,
  "message_id": "1403514468821958657",
  "parent_id": "1403496316385988608",
  "...": "8 more keys"
 },
 "... 15 more"
]
```


Variant `messages_before`:

```graphql
{messages_before:messages(parent_id:"1403496316385988608",before:"1403496316926976000"){text parent_type created attachment client_id author_is_bot text_map message_id author_id parent_id author_achievement author_avatar author_display_name author_real_name author_role_id edited pinned reactions shard_max shard_min user_reactions client_context}}
```

Result: 81 ms, 7,106 bytes. Trimmed:

```json
[
 {
  "attachment": {
   "data": {
    "league_id": "1389357604773322752",
    "status": "proposed",
    "transaction_id": "1403496314087452672",
    "transactions_by_roster": "{\"3\":{\"adds\":[{\"position\":\"QB\",\"status\":\"Active\",\"number\":10,\"first_name\":\"Justin\",\"last_name\":\"Herbert\",\"sport\":\"nfl\",\"team\":\"LAC\",\"player_id\":\"6797\",\"fanta...",
    "users_in_league_map": "{\"<id>\":{\"avatar\":\"12e3890501f1107453cca8ca0a78419a\",\"display_name\\\":\\\"<redacted>\",\"is_bot\":false,\"is_owner\":false,\"league_id\":null,\"metadata\":{\"allow_pn\":\"o..."
   },
   "type": "trade_dm"
  },
  "author_achievement": null,
  "author_avatar": "<avatar>",
  "author_display_name": "<redacted>",
  "author_id": "<user_5>",
  "author_is_bot": false,
  "author_real_name": null,
  "author_role_id": null,
  "client_context": null,
  "client_id": null,
  "created": 1788982106963,
  "edited": null,
  "message_id": "1403496316926976000",
  "parent_id": "1403496316385988608",
  "...": "8 more keys"
 }
]
```


Variant `messages_asc`:

```graphql
{messages_asc:messages(parent_id:"1403496316385988608",order_by:"asc"){text parent_type created attachment client_id author_is_bot text_map message_id author_id parent_id author_achievement author_avatar author_display_name author_real_name author_role_id edited pinned reactions shard_max shard_min user_reactions client_context}}
```

Result: 133 ms, 72,068 bytes. Trimmed:

```json
[
 {
  "attachment": {
   "data": {
    "league_id": "1389357604773322752",
    "status": "proposed",
    "transaction_id": "1403496314087452672",
    "transactions_by_roster": "{\"3\":{\"adds\":[{\"position\":\"QB\",\"status\":\"Active\",\"number\":10,\"first_name\":\"Justin\",\"last_name\":\"Herbert\",\"sport\":\"nfl\",\"team\":\"LAC\",\"player_id\":\"6797\",\"fanta...",
    "users_in_league_map": "{\"<id>\":{\"avatar\":\"12e3890501f1107453cca8ca0a78419a\",\"display_name\\\":\\\"<redacted>\",\"is_bot\":false,\"is_owner\":false,\"league_id\":null,\"metadata\":{\"allow_pn\":\"o..."
   },
   "type": "trade_dm"
  },
  "author_achievement": null,
  "author_avatar": "<avatar>",
  "author_display_name": "<redacted>",
  "author_id": "<user_5>",
  "author_is_bot": false,
  "author_real_name": null,
  "author_role_id": null,
  "client_context": null,
  "client_id": null,
  "created": 1788982106963,
  "edited": null,
  "message_id": "1403496316926976000",
  "parent_id": "1403496316385988608",
  "...": "8 more keys"
 },
 {
  "attachment": {
   "data": {
    "league_id": "1389357604773322752",
    "status": "proposed",
    "transaction_id": "1403497784954441728",
    "transactions_by_roster": "{\"3\":{\"adds\":[{\"position\":\"WR\",\"status\":\"Active\",\"number\":17,\"first_name\":\"Terry\",\"last_name\":\"McLaurin\",\"sport\":\"nfl\",\"team\":\"WAS\",\"player_id\":\"5927\",\"fanta...",
    "users_in_league_map": "{\"<id>\":{\"avatar\":\"12e3890501f1107453cca8ca0a78419a\",\"display_name\\\":\\\"<redacted>\",\"is_bot\":false,\"is_owner\":false,\"league_id\":\"<id>\",\"metadata\":{\"allow_pn\":..."
   },
   "type": "trade_dm"
  },
  "author_achievement": null,
  "author_avatar": "<avatar>",
  "author_display_name": "<redacted>",
  "author_id": "<user_5>",
  "author_is_bot": false,
  "author_real_name": null,
  "author_role_id": null,
  "client_context": null,
  "client_id": null,
  "created": 1788982457386,
  "edited": null,
  "message_id": "1403497786720243712",
  "parent_id": "1403496316385988608",
  "...": "8 more keys"
 },
 "... 15 more"
]
```


Variant `messages_league`:

```graphql
{messages_league:messages(parent_id:"1389357604773322752"){text parent_type created attachment client_id author_is_bot text_map message_id author_id parent_id author_achievement author_avatar author_display_name author_real_name author_role_id edited pinned reactions shard_max shard_min user_reactions client_context}}
```

Result: 97 ms, 21,669 bytes. Trimmed:

```json
[
 {
  "attachment": {
   "data": [
    {
     "poll_id": null,
     "transaction_id": "1400935506820251648",
     "transactions_by_roster": "{...}",
     "type": "trade"
    }
   ],
   "type": "transactions"
  },
  "author_achievement": null,
  "author_avatar": null,
  "author_display_name": "<redacted>",
  "author_id": "<user_1>",
  "author_is_bot": true,
  "author_real_name": null,
  "author_role_id": null,
  "client_context": null,
  "client_id": null,
  "created": 1788589378019,
  "edited": null,
  "message_id": "1401849092367233024",
  "parent_id": "1389357604773322752",
  "...": "8 more keys"
 },
 {
  "attachment": {
   "data": [
    {
     "poll_id": null,
     "transaction_id": "1400935506820251648",
     "transactions_by_roster": "{...}",
     "type": "trade"
    }
   ],
   "type": "transactions"
  },
  "author_achievement": null,
  "author_avatar": null,
  "author_display_name": "<redacted>",
  "author_id": "<user_1>",
  "author_is_bot": true,
  "author_real_name": null,
  "author_role_id": null,
  "client_context": null,
  "client_id": null,
  "created": 1788372008791,
  "edited": null,
  "message_id": "1400937379744714752",
  "parent_id": "1389357604773322752",
  "...": "8 more keys"
 },
 "... 15 more"
]
```



### `message`

```graphql
message(message_id: Snowflake!, parent_id: Snowflake!): Message
```

Not run: needs an id this account cannot produce (message_id and parent_id; not run separately, rows come from messages).

One message by id and parent id.


### `messages_by_reaction`

```graphql
messages_by_reaction(limit: Int, parent_id: Snowflake!, reaction: String!): [Message]
```

Server description: Get messages sorted by number reactions

Notes: Messages sorted by count of one reaction string. Reaction strings not documented; `fire` returned empty.

Example:

```graphql
{messages_by_reaction(parent_id:"1389357604773322752",reaction:"fire",limit:3){text parent_type created attachment client_id author_is_bot text_map message_id author_id parent_id author_achievement author_avatar author_display_name author_real_name author_role_id edited pinned reactions shard_max shard_min user_reactions client_context}}
```

Result: 74 ms, 2 bytes. Trimmed:

```json
[]
```



### `pinned_messages`

```graphql
pinned_messages(parent_id: Snowflake!): [Message]
```

Server description: Get pinned messages for channel

Notes: Pinned messages in a league/DM.

Example:

```graphql
{pinned_messages(parent_id:"1389357604773322752"){text parent_type created attachment client_id author_is_bot text_map message_id author_id parent_id author_achievement author_avatar author_display_name author_real_name author_role_id edited pinned reactions shard_max shard_min user_reactions client_context}}
```

Result: 71 ms, 2 bytes. Trimmed:

```json
[]
```



### `reactions`

```graphql
reactions(message_id: Snowflake!, parent_id: Snowflake!, reaction: String!): [Reaction]
```

Server description: Get reactions of a specific type for a specific message

Not run: needs an id this account cannot produce (a message with reactions).

Reactors for one message and reaction string.


### `mentions`

```graphql
mentions(before: Snowflake, unread: Boolean): [Mention]
```

Server description: List mentions of you, reverse chronological order

Notes: Mentions of the caller. `unread: true` filter, `before` pagination. Empty here.

Example:

```graphql
{mentions{metadata user_id message_id parent_id unread}}
```

Result: 96 ms, 2 bytes. Trimmed:

```json
[]
```



### `inbound_requests`

```graphql
inbound_requests(request_type: String!): [Request]
```

Server description: Inbound requests (someone inviting me to connect as a friend or inviting me to DM)

Notes: Pending requests to the caller. `request_type` values known to work: `dm_single`, `dm_group` (per `send_request` description also `league`, `friend`, `channel`). A DM from someone new sits here until `accept_request` is called; until then the thread is invisible to `my_dms`.

Example:

```graphql
{inbound_requests(request_type:"dm_single"){type_name created type_id requestee_id requester_id request_type type_metadata requestee_avatar requestee_display_name requestee_is_bot requester_avatar requester_display_name requester_is_bot type_description}}
```

Result: 74 ms, 2 bytes. Trimmed:

```json
[]
```


Variant `inbound_dm_group`:

```graphql
{inbound_dm_group:inbound_requests(request_type:"dm_group"){type_name created type_id requestee_id requester_id request_type type_metadata requestee_avatar requestee_display_name requestee_is_bot requester_avatar requester_display_name requester_is_bot type_description}}
```

Result: 72 ms, 2 bytes. Trimmed:

```json
[]
```



### `outbound_requests`

```graphql
outbound_requests(request_type: String!): [Request]
```

Server description: Outbound requests (Friend request invites I sent)

Notes: Requests the caller sent.

Example:

```graphql
{outbound_requests(request_type:"dm_single"){type_name created type_id requestee_id requester_id request_type type_metadata requestee_avatar requestee_display_name requestee_is_bot requester_avatar requester_display_name requester_is_bot type_description}}
```

Result: 69 ms, 2 bytes. Trimmed:

```json
[]
```



### `requests`

```graphql
requests(type_id: Snowflake!, request_type: String!): [Request]
```

Server description: Requests for a type (like who's been invited to a group DM?)

Notes: Requests attached to a type id (who was invited to a group DM).

Example:

```graphql
{requests(type_id:"1403496316385988608",request_type:"dm_single"){type_name created type_id requestee_id requester_id request_type type_metadata requestee_avatar requestee_display_name requestee_is_bot requester_avatar requester_display_name requester_is_bot type_description}}
```

Result: 76 ms, 2 bytes. Trimmed:

```json
[]
```



### `activities`

```graphql
activities(type: String!, before: Snowflake, user_id: Snowflake): [Activity]
```

Server description: List activities (like create_message and create_topic for inbox)

Notes: Inbox activity of a user. `type: "inbox"` returned empty.

Example:

```graphql
{activities(type:"inbox",user_id:"1267685386142887936"){type metadata created user_id type_id}}
```

Result: 87 ms, 2 bytes. Trimmed:

```json
[]
```



### `create_read_receipt`

```graphql
create_read_receipt(parent_type: String!, message_id: Snowflake, topic_id: Snowflake, channel_id: Snowflake, parent_id: Snowflake!): Boolean
```

Server description: Create read receipt

Not run. SIDE EFFECT: marks a parent as read. Not executed.


### `mark_mention_as_read`

```graphql
mark_mention_as_read(message_id: Snowflake!): Boolean
```

Server description: Mark mention as read

Not run. SIDE EFFECT: marks a mention read. Not executed.


## Channels and topics (community feed)

### `channels`

```graphql
channels(channel_ids: [Snowflake]): [Channel]
```

Server description: List channels given channel_ids

Notes: Channel records by id. Every NFL game has a channel (`scores[].metadata.channel_id`), with pregame/postgame topic ids.

Example:

```graphql
{channels(channel_ids:["1360810588774629376"]){my_last_message_ts owner display_order topic_necro_hours topic_create_delay metadata parent_id my_last_topic_ts is_favorite last_topic_id require_phone last_message_read_id description channel_id max_message_length message_create_delay name total_members message_create_amount last_message_id sharding_enabled reaction_create_delay sport message_create_period new_user_message_delay is_private max_topic_length sort_order last_topic_read_id new_user_topic_delay message_create_ban my_last_reaction_ts require_email avatar}}
```

Result: 71 ms, 897 bytes. Trimmed:

```json
[
 {
  "my_last_reaction_ts": null,
  "name": "CHI @ CAR",
  "max_topic_length": null,
  "my_last_topic_ts": null,
  "new_user_message_delay": null,
  "metadata": null,
  "last_topic_read_id": null,
  "description": "game_chat",
  "topic_necro_hours": null,
  "last_topic_id": null,
  "message_create_period": 60,
  "require_phone": null,
  "require_email": null,
  "parent_id": "250000000000000000",
  "...": "20 more keys"
 }
]
```



### `my_channels`

```graphql
my_channels: [Channel]
```

Server description: Get channels for currently logged in user

Notes: Channels the caller joined. Empty.

Example:

```graphql
{my_channels{my_last_message_ts owner display_order topic_necro_hours topic_create_delay metadata parent_id my_last_topic_ts is_favorite last_topic_id require_phone last_message_read_id description channel_id max_message_length message_create_delay name total_members message_create_amount last_message_id sharding_enabled reaction_create_delay sport message_create_period new_user_message_delay is_private max_topic_length sort_order last_topic_read_id new_user_topic_delay message_create_ban my_last_reaction_ts require_email avatar}}
```

Result: 75 ms, 2 bytes. Trimmed:

```json
[]
```



### `channels_for_user`

```graphql
channels_for_user(user_id: Snowflake!): [Channel]
```

Server description: Channels for user

Example:

```graphql
{channels_for_user(user_id:"1267685386142887936"){my_last_message_ts owner display_order topic_necro_hours topic_create_delay metadata parent_id my_last_topic_ts is_favorite last_topic_id require_phone last_message_read_id description channel_id max_message_length message_create_delay name total_members message_create_amount last_message_id sharding_enabled reaction_create_delay sport message_create_period new_user_message_delay is_private max_topic_length sort_order last_topic_read_id new_user_topic_delay message_create_ban my_last_reaction_ts require_email avatar}}
```

Result: 67 ms, 2 bytes. Trimmed:

```json
[]
```



### `channels_by_parent`

```graphql
channels_by_parent(parent_id: Snowflake!): [Channel]
```

Server description: List channels

Example:

```graphql
{channels_by_parent(parent_id:"1360810588774629376"){my_last_message_ts owner display_order topic_necro_hours topic_create_delay metadata parent_id my_last_topic_ts is_favorite last_topic_id require_phone last_message_read_id description channel_id max_message_length message_create_delay name total_members message_create_amount last_message_id sharding_enabled reaction_create_delay sport message_create_period new_user_message_delay is_private max_topic_length sort_order last_topic_read_id new_user_topic_delay message_create_ban my_last_reaction_ts require_email avatar}}
```

Result: 73 ms, 2 bytes. Trimmed:

```json
[]
```



### `recommended_channels`

```graphql
recommended_channels(limit: Int): [Channel]
```

Server description: Recommended channels

Example:

```graphql
{recommended_channels(limit:3){my_last_message_ts owner display_order topic_necro_hours topic_create_delay metadata parent_id my_last_topic_ts is_favorite last_topic_id require_phone last_message_read_id description channel_id max_message_length message_create_delay name total_members message_create_amount last_message_id sharding_enabled reaction_create_delay sport message_create_period new_user_message_delay is_private max_topic_length sort_order last_topic_read_id new_user_topic_delay message_create_ban my_last_reaction_ts require_email avatar}}
```

Result: 73 ms, 2 bytes. Trimmed:

```json
[]
```



### `recommended_categorized_channels`

```graphql
recommended_categorized_channels: List
```

Server description: Recommended Categorized Channels

Notes: 379 KB List of category groups with channel rows.

Example:

```graphql
{recommended_categorized_channels}
```

Result: 257 ms, 379,014 bytes. Trimmed:

```json
[
 {
  "category": "Sports",
  "main": true,
  "channels": [
   {
    "name": "FF News",
    "owner": null,
    "description": "Fantasy Football Breaking News, Injuries, and more",
    "metadata": null,
    "sort_order": "last_created",
    "avatar": "<avatar>",
    "is_private": false,
    "channel_id": "170000000000000000",
    "sport": "nfl",
    "total_members": 1489311,
    "sharding_enabled": false,
    "last_message_id": null,
    "last_topic_id": null,
    "max_message_length": 180,
    "...": "16 more keys"
   },
   {
    "name": "NFL",
    "owner": null,
    "description": "Trending NFL Stories",
    "metadata": null,
    "sort_order": "last_created",
    "avatar": "<avatar>",
    "is_private": false,
    "channel_id": "250000000000000000",
    "sport": "nfl",
    "total_members": 2543363,
    "sharding_enabled": false,
    "last_message_id": null,
    "last_topic_id": null,
    "max_message_length": 180,
    "...": "16 more keys"
   },
   "... 10 more"
  ]
 },
 {
  "category": "Fantasy Football",
  "channels": [
   {
    "name": "FF News",
    "owner": null,
    "description": "Fantasy Football Breaking News, Injuries, and more",
    "metadata": null,
    "sort_order": "last_created",
    "avatar": "<avatar>",
    "is_private": false,
    "channel_id": "170000000000000000",
    "sport": "nfl",
    "total_members": 1489311,
    "sharding_enabled": false,
    "last_message_id": null,
    "last_topic_id": null,
    "max_message_length": 180,
    "...": "16 more keys"
   },
   {
    "name": "FF Leagues",
    "owner": null,
    "description": "Find leagues, mock drafts, and more",
    "metadata": null,
    "sort_order": "last_created",
    "avatar": "<avatar>",
    "is_private": false,
    "channel_id": "170000000000000001",
    "sport": "nfl",
    "total_members": 1179957,
    "sharding_enabled": true,
    "last_message_id": null,
    "last_topic_id": null,
    "max_message_length": null,
    "...": "16 more keys"
   },
   "... 1 more"
  ],
  "autosub": true,
  "prereq": [
   "170000000000000000"
  ]
 },
 "... 18 more"
]
```



### `trending_channels`

```graphql
trending_channels(limit: Int): [Channel]
```

Server description: Trending channels

Notes: Public channels with member counts (NFL 2.5 M members).

Example:

```graphql
{trending_channels(limit:3){my_last_message_ts owner display_order topic_necro_hours topic_create_delay metadata parent_id my_last_topic_ts is_favorite last_topic_id require_phone last_message_read_id description channel_id max_message_length message_create_delay name total_members message_create_amount last_message_id sharding_enabled reaction_create_delay sport message_create_period new_user_message_delay is_private max_topic_length sort_order last_topic_read_id new_user_topic_delay message_create_ban my_last_reaction_ts require_email avatar}}
```

Result: 70 ms, 2,754 bytes. Trimmed:

```json
[
 {
  "my_last_reaction_ts": null,
  "name": "NFL",
  "max_topic_length": null,
  "my_last_topic_ts": null,
  "new_user_message_delay": null,
  "metadata": null,
  "last_topic_read_id": null,
  "description": "Trending NFL Stories",
  "topic_necro_hours": null,
  "last_topic_id": null,
  "message_create_period": 60,
  "require_phone": null,
  "require_email": null,
  "parent_id": null,
  "...": "20 more keys"
 },
 {
  "my_last_reaction_ts": null,
  "name": "FF News",
  "max_topic_length": null,
  "my_last_topic_ts": null,
  "new_user_message_delay": 60,
  "metadata": null,
  "last_topic_read_id": null,
  "description": "Fantasy Football Breaking News, Injuries, and more",
  "topic_necro_hours": null,
  "last_topic_id": null,
  "message_create_period": 60,
  "require_phone": null,
  "require_email": null,
  "parent_id": null,
  "...": "20 more keys"
 },
 "... 1 more"
]
```



### `channel_members`

```graphql
channel_members(channel_id: Snowflake!, after_username: String): [ChannelUser]
```

Server description: List members

Notes: Members of a channel. Returned 10 KB for the NFL channel; timed out (30 s) for a game channel the caller is not in.

Example:

```graphql
{channel_members(channel_id:"1360810588774629376"){user_id avatar display_name is_bot channel_id role_ids}}
```

Result: error after 30001 ms: `TimeoutError: The operation timed out.`


Variant `channel_members_nfl`:

```graphql
{channel_members_nfl:channel_members(channel_id:"250000000000000000"){user_id avatar display_name is_bot channel_id role_ids}}
```

Result: 83 ms, 10,069 bytes. Trimmed:

```json
[
 {
  "avatar": "<avatar>",
  "channel_id": "250000000000000000",
  "display_name": "<redacted>",
  "is_bot": false,
  "role_ids": [
   "250000000000000300"
  ],
  "user_id": "<user_16>"
 },
 {
  "avatar": "<avatar>",
  "channel_id": "250000000000000000",
  "display_name": "<redacted>",
  "is_bot": false,
  "role_ids": [
   "250000000000000300"
  ],
  "user_id": "<user_17>"
 },
 "... 48 more"
]
```



### `channel_bans`

```graphql
channel_bans(channel_id: Snowflake!, after_username: String): [ChannelBan]
```

Server description: List Channel bans

Notes: Timed out after 30 s on both a game channel and the NFL channel; the browser console showed the server answering HTTP 500 with no CORS header. Treat as moderator-only.

Example:

```graphql
{channel_bans(channel_id:"1360810588774629376"){expires user_id avatar display_name is_bot channel_id}}
```

Result: error after 30001 ms: `TimeoutError: The operation timed out.`


Variant `channel_bans_nfl`:

```graphql
{channel_bans_nfl:channel_bans(channel_id:"250000000000000000"){expires user_id avatar display_name is_bot channel_id}}
```

Result: error after 30000 ms: `TimeoutError: The operation timed out.`



### `search_channel_users`

```graphql
search_channel_users(prefix: String!, channel_id: Snowflake!): [ChannelUser]
```

Server description: Search users within a channel

Example:

```graphql
{search_channel_users(prefix:"a",channel_id:"1360810588774629376"){user_id avatar display_name is_bot channel_id role_ids}}
```

Result: 77 ms, 2 bytes. Trimmed:

```json
[]
```



### `search_channel_bans`

```graphql
search_channel_bans(prefix: String!, channel_id: Snowflake!): [ChannelBan]
```

Server description: Search banned users within a channel

Example:

```graphql
{search_channel_bans(prefix:"a",channel_id:"1360810588774629376"){expires user_id avatar display_name is_bot channel_id}}
```

Result: 75 ms, 2 bytes. Trimmed:

```json
[]
```



### `my_channel_bans`

```graphql
my_channel_bans(ban_id: String!): [ChannelBan]
```

Server description: Channels that I'm banned from

Example:

```graphql
{my_channel_bans(ban_id:"x"){expires user_id avatar display_name is_bot channel_id}}
```

Result: 75 ms, 2 bytes. Trimmed:

```json
[]
```



### `channel_tags`

```graphql
channel_tags(channel_id: Snowflake!): [ChannelTag]
```

Server description: Get channel tags

Example:

```graphql
{channel_tags(channel_id:"1360810588774629376"){name tag description color channel_id display_order is_default}}
```

Result: 86 ms, 2 bytes. Trimmed:

```json
[]
```



### `topic`

```graphql
topic(topic_id: Snowflake!, channel_id: Snowflake!): Topic
```

Server description: Get a specific topic

Notes: Errors `You do not have permission` even on public NFL-channel topics. The app must read topics via another path (`trending_topics`, `pinned_topics` work).

Example:

```graphql
{topic(topic_id:"1360810590347493376",channel_id:"1360810588774629376"){hidden metadata title created attachment score client_id author_is_bot author_id topic_id title_map channel_tags channel_id last_message_id last_pinned_message_id last_read_id author_avatar author_display_name pinned reactions shard_max shard_min user_reactions{topic_id channel_id reactor_id reaction reactor_avatar reactor_display_name reactor_is_bot} upvotes num_messages player_tags pushed_by shadowed top_message_id engagement_score num_viewers}}
```

Result: error after 92 ms: `You do not have permission to perform this action`


Variant `topic_nfl`:

```graphql
{topic_nfl:topic(topic_id:"1403482940821831680",channel_id:"250000000000000000"){hidden metadata title created attachment score client_id author_is_bot author_id topic_id title_map channel_tags channel_id last_message_id last_pinned_message_id last_read_id author_avatar author_display_name pinned reactions shard_max shard_min user_reactions{topic_id channel_id reactor_id reaction reactor_avatar reactor_display_name reactor_is_bot} upvotes num_messages player_tags pushed_by shadowed top_message_id engagement_score num_viewers}}
```

Result: error after 91 ms: `You do not have permission to perform this action`



### `topics`

```graphql
topics(before: Snowflake, order_by: String = "last_created", channel_tags: [String], channel_id: Snowflake!, show_hidden: Boolean = false, show_shadowed: Boolean = false): [Topic]
```

Server description: Get topics, order_by 'last_created' or 'last_messaged', before 'topic_id'

Notes: Same permission error as `topic`.

Example:

```graphql
{topics(channel_id:"1360810588774629376"){hidden metadata title created attachment score client_id author_is_bot author_id topic_id title_map channel_tags channel_id last_message_id last_pinned_message_id last_read_id author_avatar author_display_name pinned reactions shard_max shard_min user_reactions{topic_id channel_id reactor_id reaction reactor_avatar reactor_display_name reactor_is_bot} upvotes num_messages player_tags pushed_by shadowed top_message_id engagement_score num_viewers}}
```

Result: error after 76 ms: `You do not have permission to perform this action`


Variant `topics_nfl`:

```graphql
{topics_nfl:topics(channel_id:"250000000000000000"){hidden metadata title created attachment score client_id author_is_bot author_id topic_id title_map channel_tags channel_id last_message_id last_pinned_message_id last_read_id author_avatar author_display_name pinned reactions shard_max shard_min user_reactions{topic_id channel_id reactor_id reaction reactor_avatar reactor_display_name reactor_is_bot} upvotes num_messages player_tags pushed_by shadowed top_message_id engagement_score num_viewers}}
```

Result: error after 86 ms: `You do not have permission to perform this action`



### `topic_feed`

```graphql
topic_feed(limit: Int, before: Snowflake, channel_ids: [Snowflake]): [Topic]
```

Server description: My topic feed

Example:

```graphql
{topic_feed(channel_ids:["1360810588774629376"],limit:3){hidden metadata title created attachment score client_id author_is_bot author_id topic_id title_map channel_tags channel_id last_message_id last_pinned_message_id last_read_id author_avatar author_display_name pinned reactions shard_max shard_min user_reactions{topic_id channel_id reactor_id reaction reactor_avatar reactor_display_name reactor_is_bot} upvotes num_messages player_tags pushed_by shadowed top_message_id engagement_score num_viewers}}
```

Result: 79 ms, 2 bytes. Trimmed:

```json
[]
```



### `latest_topics`

```graphql
latest_topics(limit: Int, channel_ids: [Snowflake]): [Topic]
```

Server description: Get latest topics with limit

Notes: Works but took 5 s.

Example:

```graphql
{latest_topics(channel_ids:["1360810588774629376"],limit:3){hidden metadata title created attachment score client_id author_is_bot author_id topic_id title_map channel_tags channel_id last_message_id last_pinned_message_id last_read_id author_avatar author_display_name pinned reactions shard_max shard_min user_reactions{topic_id channel_id reactor_id reaction reactor_avatar reactor_display_name reactor_is_bot} upvotes num_messages player_tags pushed_by shadowed top_message_id engagement_score num_viewers}}
```

Result: 4984 ms, 3,606 bytes. Trimmed:

```json
[
 {
  "attachment": null,
  "author_avatar": "<avatar>",
  "author_display_name": "<redacted>",
  "author_id": "<user_66>",
  "author_is_bot": false,
  "channel_id": "170000000000000002",
  "channel_tags": null,
  "client_id": null,
  "created": 1788988821933,
  "engagement_score": null,
  "hidden": null,
  "last_message_id": "1403524481544167424",
  "last_pinned_message_id": null,
  "last_read_id": null,
  "...": "17 more keys"
 },
 {
  "attachment": null,
  "author_avatar": "<avatar>",
  "author_display_name": "<redacted>",
  "author_id": "<user_67>",
  "author_is_bot": false,
  "channel_id": "251000000000000000",
  "channel_tags": [
   "hype"
  ],
  "client_id": null,
  "created": 1788988708718,
  "engagement_score": null,
  "hidden": null,
  "last_message_id": "1403524005603860480",
  "last_pinned_message_id": null,
  "last_read_id": null,
  "...": "17 more keys"
 },
 "... 1 more"
]
```



### `active_topics`

```graphql
active_topics(limit: Int, channel_ids: [Snowflake]): [Topic]
```

Server description: Get active topics with limit

Example:

```graphql
{active_topics(channel_ids:["1360810588774629376"],limit:3){hidden metadata title created attachment score client_id author_is_bot author_id topic_id title_map channel_tags channel_id last_message_id last_pinned_message_id last_read_id author_avatar author_display_name pinned reactions shard_max shard_min user_reactions{topic_id channel_id reactor_id reaction reactor_avatar reactor_display_name reactor_is_bot} upvotes num_messages player_tags pushed_by shadowed top_message_id engagement_score num_viewers}}
```

Result: 71 ms, 2 bytes. Trimmed:

```json
[]
```



### `trending_topics`

```graphql
trending_topics(limit: Int, channel_ids: [Snowflake]): [Topic]
```

Server description: Get trending topics with limit

Notes: Works. Returns topic rows (mostly SleeperBot reposts of X links) with `channel_id`, `upvotes`, `num_messages`.

Example:

```graphql
{trending_topics(channel_ids:["1360810588774629376"],limit:3){hidden metadata title created attachment score client_id author_is_bot author_id topic_id title_map channel_tags channel_id last_message_id last_pinned_message_id last_read_id author_avatar author_display_name pinned reactions shard_max shard_min user_reactions{topic_id channel_id reactor_id reaction reactor_avatar reactor_display_name reactor_is_bot} upvotes num_messages player_tags pushed_by shadowed top_message_id engagement_score num_viewers}}
```

Result: 98 ms, 6,793 bytes. Trimmed:

```json
[
 {
  "attachment": null,
  "author_avatar": "<avatar>",
  "author_display_name": "<redacted>",
  "author_id": "<user_69>",
  "author_is_bot": false,
  "channel_id": "250000000000000000",
  "channel_tags": [
   "rumor"
  ],
  "client_id": null,
  "created": 1788978918154,
  "engagement_score": null,
  "hidden": null,
  "last_message_id": "1403523899710349312",
  "last_pinned_message_id": null,
  "last_read_id": null,
  "...": "17 more keys"
 },
 {
  "attachment": null,
  "author_avatar": "<avatar>",
  "author_display_name": "<redacted>",
  "author_id": "<user_69>",
  "author_is_bot": false,
  "channel_id": "170000000000000000",
  "channel_tags": [
   "breaking"
  ],
  "client_id": null,
  "created": 1788983883765,
  "engagement_score": null,
  "hidden": null,
  "last_message_id": "1403523820534444032",
  "last_pinned_message_id": null,
  "last_read_id": null,
  "...": "17 more keys"
 },
 "... 1 more"
]
```



### `active_channel_topics`

```graphql
active_channel_topics(limit: Int, channel_id: Snowflake!): [Topic]
```

Server description: Get active channel topics with limit

Example:

```graphql
{active_channel_topics(channel_id:"1360810588774629376",limit:3){hidden metadata title created attachment score client_id author_is_bot author_id topic_id title_map channel_tags channel_id last_message_id last_pinned_message_id last_read_id author_avatar author_display_name pinned reactions shard_max shard_min user_reactions{topic_id channel_id reactor_id reaction reactor_avatar reactor_display_name reactor_is_bot} upvotes num_messages player_tags pushed_by shadowed top_message_id engagement_score num_viewers}}
```

Result: 77 ms, 2 bytes. Trimmed:

```json
[]
```



### `trending_channel_topics`

```graphql
trending_channel_topics(limit: Int, channel_id: Snowflake!): [Topic]
```

Server description: Get trending channel topics with limit

Example:

```graphql
{trending_channel_topics(channel_id:"1360810588774629376",limit:3){hidden metadata title created attachment score client_id author_is_bot author_id topic_id title_map channel_tags channel_id last_message_id last_pinned_message_id last_read_id author_avatar author_display_name pinned reactions shard_max shard_min user_reactions{topic_id channel_id reactor_id reaction reactor_avatar reactor_display_name reactor_is_bot} upvotes num_messages player_tags pushed_by shadowed top_message_id engagement_score num_viewers}}
```

Result: 75 ms, 2 bytes. Trimmed:

```json
[]
```



### `pinned_topics`

```graphql
pinned_topics(channel_id: Snowflake!): [Topic]
```

Server description: Get pinned topics for channel

Notes: Works for a game channel: the pregame and postgame threads.

Example:

```graphql
{pinned_topics(channel_id:"1360810588774629376"){hidden metadata title created attachment score client_id author_is_bot author_id topic_id title_map channel_tags channel_id last_message_id last_pinned_message_id last_read_id author_avatar author_display_name pinned reactions shard_max shard_min user_reactions{topic_id channel_id reactor_id reaction reactor_avatar reactor_display_name reactor_is_bot} upvotes num_messages player_tags pushed_by shadowed top_message_id engagement_score num_viewers}}
```

Result: 88 ms, 3,793 bytes. Trimmed:

```json
[
 {
  "attachment": {
   "data": {
    "choices": {
     "KWTE": "CHI",
     "N292": "CAR"
    },
    "choices_order": [
     "KWTE",
     "N292"
    ],
    "closes_at": 1789318800000,
    "metadata": {
     "game_id": "202610105",
     "poll_type": "single",
     "season": "2026",
     "season_type": "regular",
     "sport": "nfl"
    },
    "poll_id": "1360810590313938944",
    "prompt": "Select who wins...",
    "user_votes": [],
    "votes": {
     "KWTE": 32117,
     "N292": 6167
    }
   },
   "type": "poll"
  },
  "author_avatar": "<avatar>",
  "author_display_name": "<redacted>",
  "author_id": "<user_15>",
  "author_is_bot": true,
  "channel_id": "1360810588774629376",
  "channel_tags": [
   "game_chat",
   "pre-game"
  ],
  "client_id": null,
  "created": 1778805036680,
  "engagement_score": null,
  "hidden": null,
  "last_message_id": "1403509258623930368",
  "last_pinned_message_id": null,
  "last_read_id": null,
  "...": "17 more keys"
 },
 {
  "attachment": null,
  "author_avatar": "<avatar>",
  "author_display_name": "<redacted>",
  "author_id": "<user_15>",
  "author_is_bot": true,
  "channel_id": "1360810588774629376",
  "channel_tags": [
   "game_chat",
   "post-game"
  ],
  "client_id": null,
  "created": 1778805036689,
  "engagement_score": null,
  "hidden": null,
  "last_message_id": "1360810590385242115",
  "last_pinned_message_id": null,
  "last_read_id": null,
  "...": "17 more keys"
 }
]
```



### `pushed_topics`

```graphql
pushed_topics(channel_id: Snowflake!): [Topic]
```

Server description: Get recently pushed topics for channel

Example:

```graphql
{pushed_topics(channel_id:"1360810588774629376"){hidden metadata title created attachment score client_id author_is_bot author_id topic_id title_map channel_tags channel_id last_message_id last_pinned_message_id last_read_id author_avatar author_display_name pinned reactions shard_max shard_min user_reactions{topic_id channel_id reactor_id reaction reactor_avatar reactor_display_name reactor_is_bot} upvotes num_messages player_tags pushed_by shadowed top_message_id engagement_score num_viewers}}
```

Result: 84 ms, 2 bytes. Trimmed:

```json
[]
```



### `list_poll_votes`

```graphql
list_poll_votes(limit: Int, poll_id: Snowflake!): [PollVote]
```

Not run: needs an id this account cannot produce (poll_id).


### `get_poll`

```graphql
get_poll(poll_id: Snowflake!): Poll
```

Server description: Get a poll by id

Not run: needs an id this account cannot produce (poll_id (no poll observed; league chat polls would carry one in message attachments)).


## Account, friends, social

### `me`

```graphql
me: User
```

Server description: Get info about myself

Notes: The caller. Contains `email`, `phone`, `token` (excluded from this capture), `picks` (Sleeper Picks limits and experiment groups), `data_updated` timestamps. Errors `unauthorized` without a token.

Example:

```graphql
{me{pending metadata phone cookies real_name username created email deleted user_id avatar display_name is_bot currencies picks data_updated notifications solicitable summoner_name summoner_region verification async_bundles ip_city ip_country_code ip_region_codes}}
```

Result: 74 ms, 1,675 bytes. Trimmed:

```json
{
 "async_bundles": [],
 "avatar": "<avatar>",
 "cookies": null,
 "created": 1756602257814,
 "currencies": null,
 "data_updated": {
  "general_terms": 1788211191397,
  "player_follows": 1788589378000,
  "preferences": 1756602257814,
  "privacy_policy": 1756602342767,
  "token": 1788122145921
 },
 "deleted": null,
 "display_name": "<redacted>",
 "email": "<redacted>",
 "ip_city": "Troy",
 "ip_country_code": "US",
 "ip_region_codes": [
  "MI"
 ],
 "is_bot": false,
 "metadata": {
  "promo_funnel": "new_user_single:won0"
 },
 "...": "11 more keys"
}
```



### `user`

```graphql
user(user_id: Snowflake!): User
```

Server description: Get user by userId

Notes: Public user record by id. Same as REST `/user/{id}` (username, display_name, avatar, is_bot).

Example:

```graphql
{user(user_id:"1267685386142887936"){pending metadata phone cookies real_name username created email deleted user_id avatar display_name is_bot currencies picks data_updated notifications solicitable summoner_name summoner_region verification async_bundles ip_city ip_country_code ip_region_codes}}
```

Result: 64 ms, 558 bytes. Trimmed:

```json
{
 "async_bundles": null,
 "avatar": "<avatar>",
 "cookies": null,
 "created": 1756602257814,
 "currencies": null,
 "data_updated": null,
 "deleted": null,
 "display_name": "<redacted>",
 "email": null,
 "ip_city": null,
 "ip_country_code": null,
 "ip_region_codes": null,
 "is_bot": false,
 "metadata": {},
 "...": "11 more keys"
}
```



### `user_by_email_phone_or_username`

```graphql
user_by_email_phone_or_username(email_or_phone_or_username: String!): User
```

Server description: Get user by email, phone, or username

Notes: Lookup by username (lowercase form worked, display-case form did not).

Example:

```graphql
{user_by_email_phone_or_username(email_or_phone_or_username:"Filip96"){pending metadata phone cookies real_name username created email deleted user_id avatar display_name is_bot currencies picks data_updated notifications solicitable summoner_name summoner_region verification async_bundles ip_city ip_country_code ip_region_codes}}
```

Result: error after 76 ms: `Sorry, we could not find the user by Filip96.`


Variant `user_by_username_cc`:

```graphql
{user_by_username_cc:user_by_email_phone_or_username(email_or_phone_or_username:"<username>"){pending metadata phone cookies real_name username created email deleted user_id avatar display_name is_bot currencies picks data_updated notifications solicitable summoner_name summoner_region verification async_bundles ip_city ip_country_code ip_region_codes}}
```

Result: 74 ms, 540 bytes. Trimmed:

```json
{
 "async_bundles": null,
 "avatar": "<avatar>",
 "cookies": null,
 "created": null,
 "currencies": null,
 "data_updated": null,
 "deleted": null,
 "display_name": "<redacted>",
 "email": null,
 "ip_city": null,
 "ip_country_code": null,
 "ip_region_codes": null,
 "is_bot": false,
 "metadata": {},
 "...": "11 more keys"
}
```



### `search_users`

```graphql
search_users(prefix: String!): [User]
```

Server description: Search users by username

Notes: Prefix search on usernames. Returns public User rows.

Example:

```graphql
{search_users(prefix:"filip9"){pending metadata phone cookies real_name username created email deleted user_id avatar display_name is_bot currencies picks data_updated notifications solicitable summoner_name summoner_region verification async_bundles ip_city ip_country_code ip_region_codes}}
```

Result: 84 ms, 2,703 bytes. Trimmed:

```json
[
 {
  "async_bundles": null,
  "avatar": "<avatar>",
  "cookies": null,
  "created": null,
  "currencies": null,
  "data_updated": null,
  "deleted": null,
  "display_name": "<redacted>",
  "email": null,
  "ip_city": null,
  "ip_country_code": null,
  "ip_region_codes": null,
  "is_bot": false,
  "metadata": null,
  "...": "11 more keys"
 },
 {
  "async_bundles": null,
  "avatar": "<avatar>",
  "cookies": null,
  "created": null,
  "currencies": null,
  "data_updated": null,
  "deleted": null,
  "display_name": "<redacted>",
  "email": null,
  "ip_city": null,
  "ip_country_code": null,
  "ip_region_codes": null,
  "is_bot": false,
  "metadata": null,
  "...": "11 more keys"
 },
 "... 3 more"
]
```



### `login`

```graphql
login(password: String, passkey: PublicKeyCredentialInput, email_or_phone_or_username: String, captcha: String, passkey_conversation_id: String): User
```

Server description: Login

Not run. A QUERY field, not a mutation: `login(email_or_phone_or_username, password, captcha, passkey...)` returns a User whose `token` field is the bearer token. Not executed here (the session comes from the browser). A third-party wrapper reports it works; unverified.


### `login_context_by_email_or_phone_or_username`

```graphql
login_context_by_email_or_phone_or_username(email_or_phone_or_username: String!): Map
```

Server description: Provide a potential username, email, or phone num, and get an avatar_url + if user has password.  This is for login screen

Notes: Unauthenticated login-screen helper: returns `has_password`, `has_passkeys`, `masked_email`, avatar for a username. Same case sensitivity as above.

Example:

```graphql
{login_context_by_email_or_phone_or_username(email_or_phone_or_username:"Filip96")}
```

Result: error after 68 ms: `Sorry, we were unable to find anyone using Filip96.`


Variant `login_context_cc`:

```graphql
{login_context_cc:login_context_by_email_or_phone_or_username(email_or_phone_or_username:"<username>")}
```

Result: 75 ms, 271 bytes. Trimmed:

```json
{
 "real_name": null,
 "user_id": "<user_3>",
 "avatar": "<avatar>",
 "display_name": "<redacted>",
 "has_email": true,
 "has_passkeys": false,
 "has_password": true,
 "has_phone": false,
 "masked_email": "<redacted>",
 "masked_phone": null
}
```



### `suggest_username`

```graphql
suggest_username(email: String!): String
```

Server description: Suggest an available username based on an email address

Notes: Returns an available username for an email. Unauthenticated helper.

Example:

```graphql
{suggest_username(email:"nobody@example.com")}
```

Result: 77 ms, 14 bytes. Trimmed:

```json
"nobody937251"
```



### `my_profile`

```graphql
my_profile: UserProfile
```

Notes: KYC profile for Sleeper Picks. Null here.

Example:

```graphql
{my_profile{city first_name last_name user_id region date_of_birth cftc_questionnaire_answered national_id_verification country_code address1 address2 document_verification postal_code national_id4}}
```

Result: 72 ms, 4 bytes. Trimmed:

```json
null
```



### `my_preferences`

```graphql
my_preferences: [Preference]
```

Server description: All preferences for logged in user

Notes: Notification preferences as name/value strings.

Example:

```graphql
{my_preferences{name value type_id}}
```

Result: 92 ms, 949 bytes. Trimmed:

```json
[
 {
  "name": "allow_email",
  "type_id": "1267685386142887936",
  "value": "on"
 },
 {
  "name": "allow_pn",
  "type_id": "1267685386142887936",
  "value": "on"
 },
 "... 10 more"
]
```



### `my_passkeys`

```graphql
my_passkeys: [Passkey]
```

Example:

```graphql
{my_passkeys{created user_id passkey_id authenticator_name}}
```

Result: 90 ms, 2 bytes. Trimmed:

```json
[]
```



### `my_ip_location`

```graphql
my_ip_location: IpLocation
```

Example:

```graphql
{my_ip_location{ip_city ip_country_code ip_region_codes}}
```

Result: 76 ms, 71 bytes. Trimmed:

```json
{
 "ip_city": "Troy",
 "ip_country_code": "US",
 "ip_region_codes": [
  "MI"
 ]
}
```



### `legal_agreements`

```graphql
legal_agreements: [String]
```

Server description: List all user legal agreement types

Example:

```graphql
{legal_agreements}
```

Result: 63 ms, 99 bytes. Trimmed:

```json
[
 "general_terms",
 "privacy_policy",
 "... 2 more"
]
```



### `get_dismissals`

```graphql
get_dismissals: Map
```

Example:

```graphql
{get_dismissals}
```

Result: 73 ms, 185 bytes. Trimmed:

```json
{
 "chopped_league_intro_modal": "true",
 "ftu_promo_line_modal": "true",
 "hasCompletedUnifiedPicksOnboarding": "true",
 "hasVisitedPasskeyPromoModal": "true",
 "hasVisitedTrackTab": "true"
}
```



### `get_async_bundles`

```graphql
get_async_bundles: [String]
```

Server description: Get user async bundles

Example:

```graphql
{get_async_bundles}
```

Result: 68 ms, 2 bytes. Trimmed:

```json
[]
```



### `achievements`

```graphql
achievements(user_id: Snowflake!): [Achievement]
```

Server description: List achievements

Example:

```graphql
{achievements(user_id:"1267685386142887936"){name description created user_id}}
```

Result: 95 ms, 2 bytes. Trimmed:

```json
[]
```


Variant `achievements_other`:

```graphql
{achievements_other:achievements(user_id:"1129924426755289088"){name description created user_id}}
```

Result: 64 ms, 2 bytes. Trimmed:

```json
[]
```



### `all_friends`

```graphql
all_friends: [Friend]
```

Server description: Get all friends for a user

Example:

```graphql
{all_friends{friend_id friend_avatar friend_display_name friend_is_bot friend_username last_contacted}}
```

Result: 85 ms, 2 bytes. Trimmed:

```json
[]
```



### `my_friends`

```graphql
my_friends(limit: Int, after_username: String): [Friend]
```

Server description: Get friends for a user

Example:

```graphql
{my_friends(limit:5){friend_id friend_avatar friend_display_name friend_is_bot friend_username last_contacted}}
```

Result: 66 ms, 2 bytes. Trimmed:

```json
[]
```



### `friend_by_id`

```graphql
friend_by_id(friend_id: Snowflake!): Friend
```

Server description: Grab friend by friend id

Example:

```graphql
{friend_by_id(friend_id:"1267685386142887936"){friend_id friend_avatar friend_display_name friend_is_bot friend_username last_contacted}}
```

Result: 65 ms, 4 bytes. Trimmed:

```json
null
```



### `is_friend`

```graphql
is_friend(friend_id: Snowflake!): Boolean
```

Server description: A query to check if a this user is a friend or not

Example:

```graphql
{is_friend(friend_id:"1267685386142887936")}
```

Result: 69 ms, 5 bytes. Trimmed:

```json
false
```



### `mutual_friends`

```graphql
mutual_friends(friend_id: Snowflake!): [Friend]
```

Server description: Mutual Friends

Example:

```graphql
{mutual_friends(friend_id:"1267685386142887936"){friend_id friend_avatar friend_display_name friend_is_bot friend_username last_contacted}}
```

Result: 65 ms, 2 bytes. Trimmed:

```json
[]
```



### `recently_contacted_friends`

```graphql
recently_contacted_friends: [Friend]
```

Server description: Get recently contacted friends

Example:

```graphql
{recently_contacted_friends{friend_id friend_avatar friend_display_name friend_is_bot friend_username last_contacted}}
```

Result: 69 ms, 2 bytes. Trimmed:

```json
[]
```



### `find_friends`

```graphql
find_friends(my_contact_info: ContactInfo!, contact_infos: [ContactInfo]): [DiscoveredContact]
```

Not run. Uploads contacts. Not executed (PII).


### `existing_contacts`

```graphql
existing_contacts(emails: [String], phone_numbers: [String]): [User]
```

Server description: Existing contacts in app

Not run. Contact matching. Not executed (PII).


### `blocked_users`

```graphql
blocked_users: [BlockedUser]
```

Server description: List blocked users

Example:

```graphql
{blocked_users{user_id blocked_timestamp blocked_user_id blocked_avatar blocked_display_name blocked_is_bot}}
```

Result: 67 ms, 2 bytes. Trimmed:

```json
[]
```



### `blockers`

```graphql
blockers: [BlockedUser]
```

Server description: List blocker IDs

Example:

```graphql
{blockers{user_id blocked_timestamp blocked_user_id blocked_avatar blocked_display_name blocked_is_bot}}
```

Result: 71 ms, 2 bytes. Trimmed:

```json
[]
```



### `my_events`

```graphql
my_events(type: String!): [Event]
```

Example:

```graphql
{my_events(type:"league"){name started description start_time parent_type bucket end_time event_id parent_id}}
```

Result: 75 ms, 2 bytes. Trimmed:

```json
[]
```



### `get_onboarding_rewards`

```graphql
get_onboarding_rewards(sport: String!): OnboardingReward
```

Server description: Get onboarding rewards state

Notes: Onboarding checklist flags.

Example:

```graphql
{get_onboarding_rewards(sport:"nfl"){create_league demo_draft invite_friends learn mock_draft}}
```

Result: 74 ms, 107 bytes. Trimmed:

```json
{
 "create_league": false,
 "demo_draft": false,
 "invite_friends": false,
 "learn": false,
 "mock_draft": false
}
```



### `app_info`

```graphql
app_info: Map
```

Server description: Get app info, like version, etc

Notes: 11 KB of client config: codepush versions, feature flags per region, min parlay multipliers. Public.

Example:

```graphql
{app_info}
```

Result: 116 ms, 11,301 bytes. Trimmed:

```json
{
 "system_user_id": "166666666666666666",
 "min_parlay_multiplier": "1.25",
 "min_promo_parlay_multiplier": "1.25",
 "min_protected_pick_promo_parlay_multiplier": "1.25",
 "min_combo_team_pick_multiplier": "1.25",
 "codepush": {
  "android": {
   "12_0_2": "v1436",
   "12_3_0": "v1499",
   "34_0": "v2454",
   "35_0": "v2479",
   "35_4": "v2480",
   "36_1": "v2488",
   "37_0": "v2493",
   "37_2": "v2500",
   "39_1": "v2505",
   "47_1": "v2578",
   "47_3": "v2587",
   "49_8": "v2664"
  },
  "ios": {
   "12_2": "v1617",
   "12_3": "v1618",
   "34_0": "v3256",
   "35_0": "v3270",
   "35_3": "v3271",
   "35_4": "v3292",
   "36_1": "v3301",
   "37_0": "v3307",
   "37_1": "v3316",
   "39_1": "v3324",
   "47_1": "v3417",
   "47_4": "v3427",
   "49_7": "v3488"
  },
  "android-full": {},
  "android-lite": {
   "47_1": "v19",
   "47_3": "v27"
  },
  "ios-full": {},
  "ios-lite": {
   "47_3": "v31"
  }
 },
 "combo_team_pick_percentage": "0.90",
 "daily_draft_regions": {
  "US": [
   "AK",
   "AL",
   "... 29 more"
  ]
 },
 "dfs_invalid_college_regions": {
  "US": [
   "MO",
   "MD",
   "... 7 more"
  ]
 },
 "dfs_regions": {
  "CA": [],
  "US": []
 },
 "disable_feature": {
  "dfs_multi_game": true,
  "disable_preseason": true,
  "matchmaking": true,
  "refer_a_friend_deposit": false
 },
 "enable_feature": {
  "promo_ligue1_pickem_upsell": true,
  "ab_test_top_tab_in_game": true,
  "disable_socket_channel_score:wnba": false,
  "ab_test_ftu_offer_banner_variant": true,
  "chat_v2_rc1": true,
  "mini_games_bball_draft": true,
  "feed_quote_topics": true,
  "mini_games_soccer_draft": true,
  "unmount_inactive_tabs_v2": true,
  "ab_test_deposit_preset_options": true,
  "score_detail_update_rc1": true,
  "venmo_in_app_webview": true,
  "clubsoccer_worldcup": true,
  "sleeperzone_matchup_header_rc1": true,
  "...": "201 more keys"
 },
 "min_legal_agreement_time": {
  "general_terms": 1772497291310,
  "paid_entry_contests_of_skill": 1700510460982,
  "privacy_policy": 1749066847384
 },
 "min_versions": {
  "android": "116.0",
  "ios": "116.0",
  "android-full": "149.0",
  "android-lite": "145.0",
  "ios-full": "151.0",
  "ios-lite": "119.0"
 },
 "...": "6 more keys"
}
```



## Sleeper Picks, wallet, promos (real-money product)

### `my_balances`

```graphql
my_balances: Map
```

Notes: Wallet balances by category. All empty maps for a no-money account.

Example:

```graphql
{my_balances}
```

Result: 69 ms, 367 bytes. Trimmed:

```json
{
 "valid_league_dues_currencies": {},
 "non_withdrawable_promo_only_currencies": {},
 "valid_winnings_currencies": {},
 "cleared_currencies": {},
 "non_withdrawable_currencies": {},
 "non_withdrawable_non_promo_currencies": {},
 "uncleared_currencies": {},
 "valid_cftc_currencies": {},
 "valid_currencies": {},
 "valid_non_promo_currencies": {},
 "withdrawable_currencies": {}
}
```



### `my_currencies`

```graphql
my_currencies(wallet_type: String, withdrawable_only: Boolean): Map
```

Example:

```graphql
{my_currencies}
```

Result: 66 ms, 2 bytes. Trimmed:

```json
{}
```



### `my_currencies_detailed`

```graphql
my_currencies_detailed(wallet_type: String): Map
```

Example:

```graphql
{my_currencies_detailed}
```

Result: 75 ms, 38 bytes. Trimmed:

```json
{
 "currencies": {},
 "withdrawable": {}
}
```



### `my_currencies_and_transactions`

```graphql
my_currencies_and_transactions(wallet_type: String, transactions_limit: Int, transactions_offset: Int): CurrenciesAndTransactions
```

Notes: Wallet plus recent transactions in one call.

Example:

```graphql
{my_currencies_and_transactions(transactions_limit:2){transactions{status completed created user_id display_data currency_type wallet_type reference_type reference_action reference_id currency_amount} currencies currencies_cftc currencies_league_dues currencies_non_promo non_withdrawable non_withdrawable_non_promo non_withdrawable_promo_only uncleared uncleared_transactions{status completed created user_id display_data currency_type wallet_type reference_type reference_action reference_id currency_amount} withdrawable}}
```

Result: 72 ms, 279 bytes. Trimmed:

```json
{
 "currencies": {},
 "currencies_cftc": {},
 "currencies_league_dues": {},
 "currencies_non_promo": {},
 "non_withdrawable": {},
 "non_withdrawable_non_promo": {},
 "non_withdrawable_promo_only": {},
 "transactions": [],
 "uncleared": {},
 "uncleared_transactions": [],
 "withdrawable": {}
}
```



### `my_currency_transactions`

```graphql
my_currency_transactions(offset: Int, status: String, limit: Int, wallet_type: String, reference_action: String): [CurrencyTransaction]
```

Example:

```graphql
{my_currency_transactions(limit:2){status completed created user_id display_data currency_type wallet_type reference_type reference_action reference_id currency_amount}}
```

Result: 76 ms, 2 bytes. Trimmed:

```json
[]
```



### `my_currency_transaction_by_reference`

```graphql
my_currency_transaction_by_reference(reference_type: String, reference_action: String, reference_id: String): CurrencyTransaction
```

Example:

```graphql
{my_currency_transaction_by_reference(reference_type:"parlay",reference_action:"place",reference_id:"x"){status completed created user_id display_data currency_type wallet_type reference_type reference_action reference_id currency_amount}}
```

Result: 86 ms, 4 bytes. Trimmed:

```json
null
```



### `my_currency_transaction_by_ref_ids`

```graphql
my_currency_transaction_by_ref_ids(reference_type: String, reference_action: String, reference_ids: [String]): CurrencyTransaction
```

Example:

```graphql
{my_currency_transaction_by_ref_ids(reference_type:"parlay",reference_action:"place",reference_ids:["x"]){status completed created user_id display_data currency_type wallet_type reference_type reference_action reference_id currency_amount}}
```

Result: 93 ms, 4 bytes. Trimmed:

```json
null
```



### `promo_transactions_by_parent_reference`

```graphql
promo_transactions_by_parent_reference(reference_type: String, reference_action: String, reference_id: String): [CurrencyTransaction]
```

Not run: needs an id this account cannot produce (a reference id (no transactions)).


### `my_payment_methods`

```graphql
my_payment_methods(wallet_type: String): [PaymentMethod]
```

Example:

```graphql
{my_payment_methods{label name status type display_data provider confirmed}}
```

Result: 74 ms, 2 bytes. Trimmed:

```json
[]
```



### `my_winnings`

```graphql
my_winnings: Winnings
```

Server description: Get a summary of a user's winnings.

Example:

```graphql
{my_winnings{contests_won money_won}}
```

Result: 76 ms, 36 bytes. Trimmed:

```json
{
 "contests_won": 0,
 "money_won": {}
}
```



### `my_parlays`

```graphql
my_parlays(offset: Int, limit: Int, league_id: Snowflake, include_pick_counts: Boolean, status_filter: [String]): [Parlay]
```

Example:

```graphql
{my_parlays(limit:2){status created user_id legs{line{closed status metadata created subject_id subject pick_count outcome sport season_type season game_id market_type subject_type wager_type outcome_type line_type game_status line_id outcome_value payout_multiplier subject_pos_rank subject_position subject_team valid_close_duration_seconds} status line_id graded_at parlay_leg_id} display_data currency_type currency_amount league_id parlay_id graded_at possible_multipliers{lost0 lost1 lost2 team_pick_lost} graded_multiplier graded_payout graded_payout_boost graded_profit_boost max_multiplier max_payout max_payout_boost max_profit_boost multiplier team_pick{status event_id user_id created_at ...
```

Result: 86 ms, 2 bytes. Trimmed:

```json
[]
```



### `my_squad_parlays`

```graphql
my_squad_parlays(limit: Int, include_pick_counts: Boolean): [Parlay]
```

Example:

```graphql
{my_squad_parlays(limit:2){status created user_id legs{line{closed status metadata created subject_id subject pick_count outcome sport season_type season game_id market_type subject_type wager_type outcome_type line_type game_status line_id outcome_value payout_multiplier subject_pos_rank subject_position subject_team valid_close_duration_seconds} status line_id graded_at parlay_leg_id} display_data currency_type currency_amount league_id parlay_id graded_at possible_multipliers{lost0 lost1 lost2 team_pick_lost} graded_multiplier graded_payout graded_payout_boost graded_profit_boost max_multiplier max_payout max_payout_boost max_profit_boost multiplier team_pick{status event_id user_id creat...
```

Result: 77 ms, 2 bytes. Trimmed:

```json
[]
```



### `league_parlays`

```graphql
league_parlays(offset: Int, limit: Int, league_id: Snowflake, include_pick_counts: Boolean, status_filter: [String], user_id_filter: [Snowflake], filter_self: Boolean): [Parlay]
```

Example:

```graphql
{league_parlays(league_id:"1389357604773322752",limit:5){status created user_id legs{line{closed status metadata created subject_id subject pick_count outcome sport season_type season game_id market_type subject_type wager_type outcome_type line_type game_status line_id outcome_value payout_multiplier subject_pos_rank subject_position subject_team valid_close_duration_seconds} status line_id graded_at parlay_leg_id} display_data currency_type currency_amount league_id parlay_id graded_at possible_multipliers{lost0 lost1 lost2 team_pick_lost} graded_multiplier graded_payout graded_payout_boost graded_profit_boost max_multiplier max_payout max_payout_boost max_profit_boost multiplier team_pick...
```

Result: 93 ms, 2 bytes. Trimmed:

```json
[]
```



### `parlay`

```graphql
parlay(parlay_id: Snowflake!, include_pick_counts: Boolean): Parlay
```

Server description: Get single parlay by parlay_id

Not run: needs an id this account cannot produce (parlay_id (no parlays)).


### `num_pending_parlays`

```graphql
num_pending_parlays: Int
```

Example:

```graphql
{num_pending_parlays}
```

Result: 72 ms, 1 bytes. Trimmed:

```json
0
```



### `my_picks_init`

```graphql
my_picks_init: Map
```

Server description: Get picks settings for a user

Example:

```graphql
{my_picks_init}
```

Result: 74 ms, 95 bytes. Trimmed:

```json
{
 "sports_order": [
  "nfl",
  "mlb",
  "... 7 more"
 ]
}
```



### `top_tab_content`

```graphql
top_tab_content(version: String!, eg: String, ftfe: Boolean): [TopTabContentGroup]
```

Server description: Picks Top Tab Content Groups

Example:

```graphql
{top_tab_content(version:"1"){name key content content_type sport}}
```

Result: 72 ms, 2 bytes. Trimmed:

```json
[]
```



### `available_line_promotions`

```graphql
available_line_promotions(include_boosts: Boolean): [LinePromotion]
```

Example:

```graphql
{available_line_promotions(include_boosts:true){type subject_id expires_at sport season_type season game_id subject_type wager_type amount_limit eligible_targets min_required_parlay_multiplier}}
```

Result: 77 ms, 1,947 bytes. Trimmed:

```json
[
 {
  "amount_limit": 20,
  "eligible_targets": [
   "promo_funnel:new_user_single:won0",
   "promo_funnel:new_user_multiple:won0"
  ],
  "expires_at": null,
  "game_id": "202610130",
  "min_required_parlay_multiplier": null,
  "season": "2026",
  "season_type": "regular",
  "sport": "nfl",
  "subject_id": "4943",
  "subject_type": "player",
  "type": "line_discount",
  "wager_type": "passing_yards"
 },
 {
  "amount_limit": 200,
  "eligible_targets": [
   "global"
  ],
  "expires_at": null,
  "game_id": "202610130",
  "min_required_parlay_multiplier": null,
  "season": "2026",
  "season_type": "regular",
  "sport": "nfl",
  "subject_id": "7611",
  "subject_type": "player",
  "type": "over_boost",
  "wager_type": "rushing_yards"
 },
 "... 4 more"
]
```



### `list_all_active_promos`

```graphql
list_all_active_promos: [Promo]
```

Server description: Get all (non-personalized) active promos

Notes: 1,337 promo rows, 313 KB. Public marketing data.

Example:

```graphql
{list_all_active_promos{type metadata amount created expires_at user_id eligible_targets promo_id available_at}}
```

Result: 294 ms, 313,219 bytes. Trimmed:

```json
[
 {
  "amount": 100,
  "available_at": null,
  "created": 1761955305307,
  "eligible_targets": null,
  "expires_at": 2295907290343,
  "metadata": {
   "first_time_deposit": "true",
   "match_rate": "1.0"
  },
  "promo_id": " FFNUKE",
  "type": "deposit_match",
  "user_id": null
 },
 {
  "amount": 100,
  "available_at": null,
  "created": 1756932608060,
  "eligible_targets": null,
  "expires_at": 1798790400000,
  "metadata": {
   "first_time_deposit": "true"
  },
  "promo_id": "100",
  "type": "deposit_match",
  "user_id": null
 },
 "... 1335 more"
]
```



### `list_eligible_promos`

```graphql
list_eligible_promos(flags: Map, location: Location, user_id: Snowflake!): [Promo]
```

Server description: Get promos eligible for user

Example:

```graphql
{list_eligible_promos(user_id:"1267685386142887936"){type metadata amount created expires_at user_id eligible_targets promo_id available_at}}
```

Result: 88 ms, 2 bytes. Trimmed:

```json
[]
```



### `list_promos_by_type`

```graphql
list_promos_by_type(type: String!): [Promo]
```

Server description: Get (non-personalized) promos by type

Notes: `type: "deposit_match"` worked (437 KB); `deposit` errors `unsupported type`.

Example:

```graphql
{list_promos_by_type(type:"deposit"){type metadata amount created expires_at user_id eligible_targets promo_id available_at}}
```

Result: error after 68 ms: `deposit is an unsupported type`


Variant `list_promos_by_type_dm`:

```graphql
{list_promos_by_type_dm:list_promos_by_type(type:"deposit_match"){type metadata amount created expires_at user_id eligible_targets promo_id available_at}}
```

Result: 355 ms, 437,551 bytes. Trimmed:

```json
[
 {
  "amount": 100,
  "available_at": null,
  "created": 1761955305307,
  "eligible_targets": null,
  "expires_at": 2295907290343,
  "metadata": {
   "first_time_deposit": "true",
   "match_rate": "1.0"
  },
  "promo_id": " FFNUKE",
  "type": "deposit_match",
  "user_id": null
 },
 {
  "amount": 100,
  "available_at": null,
  "created": 1756932608060,
  "eligible_targets": null,
  "expires_at": 1798790400000,
  "metadata": {
   "first_time_deposit": "true"
  },
  "promo_id": "100",
  "type": "deposit_match",
  "user_id": null
 },
 "... 1870 more"
]
```



### `list_promo_claims_by_type`

```graphql
list_promo_claims_by_type(user_id: Snowflake!, promo_type: String!): [PromoClaim]
```

Server description: Get promo claims by type for user

Example:

```graphql
{list_promo_claims_by_type(user_id:"1267685386142887936",promo_type:"deposit"){created user_id promo_id promo_type}}
```

Result: error after 67 ms: `deposit is an unsupported type`


Variant `list_promo_claims_dm`:

```graphql
{list_promo_claims_dm:list_promo_claims_by_type(user_id:"1267685386142887936",promo_type:"deposit_match"){created user_id promo_id promo_type}}
```

Result: 86 ms, 2 bytes. Trimmed:

```json
[]
```



### `promo_by_id`

```graphql
promo_by_id(promo_id: String!): Promo
```

Server description: Get promo by ID

Not run: needs an id this account cannot produce (works in principle; promo ids come from list_all_active_promos, not run).


### `is_eligible_for_promo`

```graphql
is_eligible_for_promo(location: Location, league_id: Snowflake, promo_id: String!): Boolean
```

Notes: Errors `promo_kyc_required` for an unverified account.

Example:

```graphql
{is_eligible_for_promo(league_id:"1389357604773322752",promo_id:"x")}
```

Result: error after 70 ms: `promo_kyc_required User identity verification is required to claim this promo`


Variant `is_eligible_for_promo_100`:

```graphql
{is_eligible_for_promo_100:is_eligible_for_promo(promo_id:"100")}
```

Result: error after 85 ms: `promo_kyc_required User identity verification is required to claim this promo`



### `get_promos_page`

```graphql
get_promos_page(flags: Map): PromoPage
```

Server description: Load a user's promos page

Example:

```graphql
{get_promos_page{gifted_promos{status amount username created expires_at user_id promo_id promo_type share_id claimer_user_id giftee_user_id promo_metadata claimer_username} global_line_promos{type subject_id expires_at sport season_type season game_id subject_type wager_type amount_limit eligible_targets min_required_parlay_multiplier} global_promos{type metadata amount created expires_at user_id eligible_targets promo_id available_at} personal_promos{type metadata amount created expires_at user_id eligible_targets promo_id available_at}}}
```

Result: 108 ms, 2,036 bytes. Trimmed:

```json
{
 "gifted_promos": [],
 "global_line_promos": [
  {
   "amount_limit": 20,
   "eligible_targets": [
    "promo_funnel:new_user_single:won0",
    "promo_funnel:new_user_multiple:won0"
   ],
   "expires_at": null,
   "game_id": "202610130",
   "min_required_parlay_multiplier": null,
   "season": "2026",
   "season_type": "regular",
   "sport": "nfl",
   "subject_id": "4943",
   "subject_type": "player",
   "type": "line_discount",
   "wager_type": "passing_yards"
  },
  {
   "amount_limit": 200,
   "eligible_targets": [
    "global"
   ],
   "expires_at": null,
   "game_id": "202610130",
   "min_required_parlay_multiplier": null,
   "season": "2026",
   "season_type": "regular",
   "sport": "nfl",
   "subject_id": "7611",
   "subject_type": "player",
   "type": "over_boost",
   "wager_type": "rushing_yards"
  },
  "... 4 more"
 ],
 "global_promos": [],
 "personal_promos": []
}
```



### `get_promos_shared_to_you`

```graphql
get_promos_shared_to_you: [SharedPromo]
```

Server description: Get a list of promos shared with this user

Example:

```graphql
{get_promos_shared_to_you{status amount username created expires_at user_id promo_id promo_type share_id claimer_user_id giftee_user_id promo_metadata claimer_username}}
```

Result: 78 ms, 2 bytes. Trimmed:

```json
[]
```



### `view_shared_promo`

```graphql
view_shared_promo(user_id: Snowflake!, share_id: Snowflake!): SharedPromo
```

Server description: Load a shared promo

Not run: needs an id this account cannot produce (share_id).


### `get_referral_promo_code`

```graphql
get_referral_promo_code: String
```

Not run. May mint a code. Not executed.


### `give_get_referral_claims`

```graphql
give_get_referral_claims: [Map]
```

Example:

```graphql
{give_get_referral_claims}
```

Result: 66 ms, 2 bytes. Trimmed:

```json
[]
```



### `campaigns_by_email`

```graphql
campaigns_by_email: [Map]
```

Example:

```graphql
{campaigns_by_email}
```

Result: 72 ms, 2 bytes. Trimmed:

```json
[]
```



### `my_orders`

```graphql
my_orders(offset: Int = 0, filter: ContractOrderFilter, limit: Int = 25): [ContractOrder]
```

Example:

```graphql
{my_orders(limit:2){status event_id user_id created_at market_id display_data fee_params fulfilled_order currency_type expected_provider_fee order_id expected_sleeper_fee provider_fee fee_function_id expected_total_fee ask_price ask_quantity market_ticker order_type side sleeper_fee total_fee}}
```

Result: 75 ms, 2 bytes. Trimmed:

```json
[]
```



### `my_active_positions`

```graphql
my_active_positions(currency_type: String = "USD"): [Position]
```

Example:

```graphql
{my_active_positions{event_id created_at market_id display_data updated_at currency_type market_ticker side buy_fees net_cost net_quantity net_quantity_fp realized_cost realized_profit realized_quantity realized_quantity_fp sell_fees}}
```

Result: 66 ms, 2 bytes. Trimmed:

```json
[]
```



### `my_closed_positions`

```graphql
my_closed_positions(offset: Int = 0, limit: Int = 25, currency_type: String = "USD"): [Position]
```

Example:

```graphql
{my_closed_positions(limit:2){event_id created_at market_id display_data updated_at currency_type market_ticker side buy_fees net_cost net_quantity net_quantity_fp realized_cost realized_profit realized_quantity realized_quantity_fp sell_fees}}
```

Result: 72 ms, 2 bytes. Trimmed:

```json
[]
```



### `my_active_derbys`

```graphql
my_active_derbys: [DerbyUser]
```

Example:

```graphql
{my_active_derbys{metadata created user_id derby_id}}
```

Result: 67 ms, 2 bytes. Trimmed:

```json
[]
```



### `my_derby_prizes`

```graphql
my_derby_prizes: [UserDerbyPrize]
```

Server description: Get the current user's derby prizes, most recent first

Example:

```graphql
{my_derby_prizes{type metadata created user_id score currency_type derby_id rank acknowledged_at derby_end_time derby_name derby_start_time prize_amount total_entrants winner_count}}
```

Result: 72 ms, 2 bytes. Trimmed:

```json
[]
```



### `derby_user_parlays`

```graphql
derby_user_parlays(offset: Int, limit: Int, user_id: Snowflake!, derby_id: String!, include_pick_counts: Boolean): [Parlay]
```

Server description: Get a user's pending (not-yet-settled) parlays created during a derby's window. The derby must be currently active, the viewer must be participating in it, and the target user must be on the derby's published leaderboard (the top-ranked participants).

Not run: needs an id this account cannot produce (derby_id (my_active_derbys empty)).


### `derby_user_positions`

```graphql
derby_user_positions(user_id: Snowflake!, currency_type: String = "USD", derby_id: String!): [Position]
```

Server description: Get a user's active CFTC positions opened during a derby's window. The derby must be currently active, the viewer must be participating in it, and the target user must be on the derby's published leaderboard (the top-ranked participants).

Not run: needs an id this account cannot produce (derby_id).


### `check_responsible_gaming_limits`

```graphql
check_responsible_gaming_limits(limits_to_test: [CheckResponsibleGamingLimitInput]): List
```

Notes: Identifier must be one of the strings from `get_responsible_gaming_limit_identifiers` (e.g. `limit_deposit_block`).

Example:

```graphql
{check_responsible_gaming_limits(limits_to_test:[{identifier:"deposit",amount:1,limit_scope:"daily"}])}
```

Result: 71 ms, 286 bytes. Trimmed:

```json
[
 {
  "identifier": "deposit",
  "is_over_limit": [
   "error",
   "Invalid identifier 'deposit'. Must be one of: limit_contest_entry_block, limit_contest_entry_alert, limit_contest_fee_block, limit_contest_fee_alert, limit_d..."
  ]
 }
]
```



### `get_responsible_gaming_limit_identifiers`

```graphql
get_responsible_gaming_limit_identifiers: [String]
```

Example:

```graphql
{get_responsible_gaming_limit_identifiers}
```

Result: 119 ms, 198 bytes. Trimmed:

```json
[
 "limit_contest_entry_block",
 "limit_contest_entry_alert",
 "... 6 more"
]
```



### `tax_forms`

```graphql
tax_forms: Map
```

Notes: Map of year to forms. Empty lists here.

Example:

```graphql
{tax_forms}
```

Result: 75 ms, 24 bytes. Trimmed:

```json
{
 "2024": [],
 "2025": []
}
```



### `download_tax_form`

```graphql
download_tax_form(tax_year: String!, form_type: String!): String
```

Not run. Returns a signed URL for a tax document. Not executed.


### `download_cftc_daily_statement`

```graphql
download_cftc_daily_statement(month: Int!, year: Int!, day: Int!): String
```

Not run. Not executed (financial document).


### `download_cftc_monthly_statement`

```graphql
download_cftc_monthly_statement(month: Int!, year: Int!): String
```

Not run. Not executed (financial document).


### `generate_parlay_transactions_report`

```graphql
generate_parlay_transactions_report(start_time: Int!, end_time: Int!, verification_code: String!, email_or_phone: String!): String
```

Server description: Generate a transaction report for a user

Not run. Needs a verification code and emails a report. Not executed.


### `sweepstakes_entries_count_today`

```graphql
sweepstakes_entries_count_today: Int
```

Example:

```graphql
{sweepstakes_entries_count_today}
```

Result: 62 ms, 1 bytes. Trimmed:

```json
0
```



### `sweepstakes_entries_count_total`

```graphql
sweepstakes_entries_count_total: Int
```

Example:

```graphql
{sweepstakes_entries_count_total}
```

Result: 63 ms, 1 bytes. Trimmed:

```json
0
```



### `get_user_pools`

```graphql
get_user_pools(offset: Int, status: [String], limit: Int, sport: String, pool_type: String): [UserPool]
```

Server description: List of user's user pools

Example:

```graphql
{get_user_pools(limit:5,sport:"nfl"){status metadata created user_id sport pool_id pool_type}}
```

Result: 66 ms, 2 bytes. Trimmed:

```json
[]
```



### `get_user_pool_by_id`

```graphql
get_user_pool_by_id(pool_id: Snowflake): UserPool
```

Notes: With no `pool_id` the server returned an HTML error page (HTTP 500), not a GraphQL error.

Example:

```graphql
{get_user_pool_by_id{status metadata created user_id sport pool_id pool_type}}
```

Result: error after 131 ms: `Error: graphql transport: evaluate: SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON`



### `get_in_progress_user_pools`

```graphql
get_in_progress_user_pools(offset: Int, limit: Int): [UserPool]
```

Server description: List of user's user pools that have not been graded.

Example:

```graphql
{get_in_progress_user_pools(limit:5){status metadata created user_id sport pool_id pool_type}}
```

Result: 60 ms, 2 bytes. Trimmed:

```json
[]
```



### `get_daily_draft_contest`

```graphql
get_daily_draft_contest(contest_id: Snowflake!): DailyDraftContest
```

Not run: needs an id this account cannot produce (contest_id (Sleeper Picks daily draft; account has none)).


### `get_daily_draft_team`

```graphql
get_daily_draft_team(team_id: Snowflake!): DailyDraftTeam
```

Not run: needs an id this account cannot produce (team_id (none)).


### `get_daily_draft_teams_by_draft`

```graphql
get_daily_draft_teams_by_draft(draft_id: Snowflake!): [DailyDraftTeam]
```

Example:

```graphql
{get_daily_draft_teams_by_draft(draft_id:"1389357604773322753"){status period user_id sport points team_id total_points draft_id players total_projections}}
```

Result: 110 ms, 2 bytes. Trimmed:

```json
[]
```



### `active_quests`

```graphql
active_quests: [UserQuest]
```

Server description: Get active quests for user

Example:

```graphql
{active_quests{status version state created event expires_at user_id quest_id event_reqs promo quest_reqs}}
```

Result: 74 ms, 2 bytes. Trimmed:

```json
[]
```



### `get_quest`

```graphql
get_quest(quest_id: String!): UserQuest
```

Server description: Get a quest by id for the authenticated user

Not run: needs an id this account cannot produce (quest_id (active_quests empty)).


### `current_squad_bank`

```graphql
current_squad_bank(league_id: Snowflake!): FullRewardTracker
```

Server description: Get the current squad bank for a super squad

Example:

```graphql
{current_squad_bank(league_id:"1389357604773322752"){version metadata amount created expires_at owner_id reward_tracker_id granted_reward_info reward_type graded_status owner_type additional_goals full_logs{line{closed status metadata created subject_id subject pick_count outcome sport season_type season game_id market_type subject_type wager_type outcome_type line_type game_status line_id outcome_value payout_multiplier subject_pos_rank subject_position subject_team valid_close_duration_seconds} metadata action created user_id reward_tracker_id reward_action_log_id reward_type full_parlay{status created user_id display_data currency_type currency_amount league_id parlay_id graded_at graded_...
```

Result: 77 ms, 4 bytes. Trimmed:

```json
null
```



### `previous_squad_bank`

```graphql
previous_squad_bank(league_id: Snowflake!): FullRewardTracker
```

Server description: Get the previous squad bank for a super squad

Example:

```graphql
{previous_squad_bank(league_id:"1389357604773322752"){version metadata amount created expires_at owner_id reward_tracker_id granted_reward_info reward_type graded_status owner_type additional_goals full_logs{line{closed status metadata created subject_id subject pick_count outcome sport season_type season game_id market_type subject_type wager_type outcome_type line_type game_status line_id outcome_value payout_multiplier subject_pos_rank subject_position subject_team valid_close_duration_seconds} metadata action created user_id reward_tracker_id reward_action_log_id reward_type full_parlay{status created user_id display_data currency_type currency_amount league_id parlay_id graded_at graded...
```

Result: 71 ms, 4 bytes. Trimmed:

```json
null
```



### `squad_bank_by_id`

```graphql
squad_bank_by_id(league_id: Snowflake!, reward_tracker_id: Snowflake!): FullRewardTracker
```

Server description: Get a squad bank for a super squad by ID

Not run: needs an id this account cannot produce (reward_tracker_id (super squad feature not enabled)).


### `recent_squad_banks`

```graphql
recent_squad_banks(league_id: Snowflake!): [RewardTrackerInfo]
```

Server description: Returns a list of info about recent squad banks for a super squad

Example:

```graphql
{recent_squad_banks(league_id:"1389357604773322752"){created expires_at reward_tracker_id}}
```

Result: 69 ms, 2 bytes. Trimmed:

```json
[]
```



### `top_squad_banks`

```graphql
top_squad_banks(league_id: Snowflake!, num_banks: Int!): [FullRewardTracker]
```

Server description: Get the top historical squad banks for a super squad bank

Example:

```graphql
{top_squad_banks(league_id:"1389357604773322752",num_banks:1){version metadata amount created expires_at owner_id reward_tracker_id granted_reward_info reward_type graded_status owner_type additional_goals full_logs{line{closed status metadata created subject_id subject pick_count outcome sport season_type season game_id market_type subject_type wager_type outcome_type line_type game_status line_id outcome_value payout_multiplier subject_pos_rank subject_position subject_team valid_close_duration_seconds} metadata action created user_id reward_tracker_id reward_action_log_id reward_type full_parlay{status created user_id display_data currency_type currency_amount league_id parlay_id graded_a...
```

Result: 90 ms, 2 bytes. Trimmed:

```json
[]
```



### `current_squad_weekly_meter`

```graphql
current_squad_weekly_meter(league_id: Snowflake!): FullRewardTracker
```

Server description: Get the current weekly meter for a super squad

Example:

```graphql
{current_squad_weekly_meter(league_id:"1389357604773322752"){version metadata amount created expires_at owner_id reward_tracker_id granted_reward_info reward_type graded_status owner_type additional_goals full_logs{line{closed status metadata created subject_id subject pick_count outcome sport season_type season game_id market_type subject_type wager_type outcome_type line_type game_status line_id outcome_value payout_multiplier subject_pos_rank subject_position subject_team valid_close_duration_seconds} metadata action created user_id reward_tracker_id reward_action_log_id reward_type full_parlay{status created user_id display_data currency_type currency_amount league_id parlay_id graded_at...
```

Result: 77 ms, 4 bytes. Trimmed:

```json
null
```



### `previous_squad_weekly_meter`

```graphql
previous_squad_weekly_meter(league_id: Snowflake!): FullRewardTracker
```

Server description: Get the previous weekly meter for a super squad

Example:

```graphql
{previous_squad_weekly_meter(league_id:"1389357604773322752"){version metadata amount created expires_at owner_id reward_tracker_id granted_reward_info reward_type graded_status owner_type additional_goals full_logs{line{closed status metadata created subject_id subject pick_count outcome sport season_type season game_id market_type subject_type wager_type outcome_type line_type game_status line_id outcome_value payout_multiplier subject_pos_rank subject_position subject_team valid_close_duration_seconds} metadata action created user_id reward_tracker_id reward_action_log_id reward_type full_parlay{status created user_id display_data currency_type currency_amount league_id parlay_id graded_a...
```

Result: 81 ms, 4 bytes. Trimmed:

```json
null
```



### `weekly_meter_by_id`

```graphql
weekly_meter_by_id(league_id: Snowflake!, reward_tracker_id: Snowflake!): FullRewardTracker
```

Server description: Get a weekly meter for a super squad by ID

Not run: needs an id this account cannot produce (reward_tracker_id).


### `recent_weekly_meters`

```graphql
recent_weekly_meters(league_id: Snowflake!): [RewardTrackerInfo]
```

Server description: Returns a list of info about recent weekly meters for a super squad

Example:

```graphql
{recent_weekly_meters(league_id:"1389357604773322752"){created expires_at reward_tracker_id}}
```

Result: 69 ms, 2 bytes. Trimmed:

```json
[]
```



## League dues

### `league_dues_config`

```graphql
league_dues_config(league_id: Snowflake!): LeagueDuesConfig
```

Server description: Get league dues config

Notes: Dues tracker config. `status: draft, enabled: false` for this league.

Example:

```graphql
{league_dues_config(league_id:"1389357604773322752"){enabled status balance amount settings created_at updated_at currency_type created_by league_id notes reminders_enabled updated_by dues_type payment_deadline notes_text_map season_dues}}
```

Result: 74 ms, 361 bytes. Trimmed:

```json
{
 "amount": null,
 "balance": null,
 "created_at": null,
 "created_by": null,
 "currency_type": null,
 "dues_type": "sleeper_safe",
 "enabled": false,
 "league_id": null,
 "notes": null,
 "notes_text_map": null,
 "payment_deadline": 1788999600000,
 "reminders_enabled": null,
 "season_dues": null,
 "settings": null,
 "...": "3 more keys"
}
```



### `league_dues_balance`

```graphql
league_dues_balance(league_id: Snowflake!): Map
```

Server description: Get current dues balance for a league

Example:

```graphql
{league_dues_balance(league_id:"1389357604773322752")}
```

Result: 81 ms, 33 bytes. Trimmed:

```json
{
 "balance": 0,
 "net_deposits": 0
}
```



### `league_dues_users`

```graphql
league_dues_users(league_id: Snowflake!): LeagueDueUsersWithHash
```

Server description: Get league dues users

Notes: Returns a `hash` that `batch_upsert_league_dues_users` requires as `expected_hash` (optimistic concurrency).

Example:

```graphql
{league_dues_users(league_id:"1389357604773322752"){hash league_dues_users{user_id created_at updated_at created_by updated_by paid_status}}}
```

Result: 76 ms, 45 bytes. Trimmed:

```json
{
 "hash": "13708901",
 "league_dues_users": []
}
```



### `league_dues_user`

```graphql
league_dues_user(user_id: Snowflake!, league_id: Snowflake!): LeagueDuesUser
```

Server description: Get league dues user

Example:

```graphql
{league_dues_user(user_id:"1267685386142887936",league_id:"1389357604773322752"){user_id created_at updated_at created_by updated_by paid_status}}
```

Result: 66 ms, 4 bytes. Trimmed:

```json
null
```



### `league_dues_owed_by_roster`

```graphql
league_dues_owed_by_roster(league_id: Snowflake!): [LeagueDuesRosterOwed]
```

Server description: Get dues owed breakdown by roster

Notes: Per-roster paid status with per-season amounts.

Example:

```graphql
{league_dues_owed_by_roster(league_id:"1389357604773322752"){roster_id owner_id paid_status seasons{season season_dues amount_owed amount_paid}}}
```

Result: 80 ms, 744 bytes. Trimmed:

```json
[
 {
  "owner_id": "<user_10>",
  "paid_status": "unpaid",
  "roster_id": 8,
  "seasons": []
 },
 {
  "owner_id": "<user_9>",
  "paid_status": "unpaid",
  "roster_id": 7,
  "seasons": []
 },
 "... 6 more"
]
```



### `league_dues_transactions`

```graphql
league_dues_transactions(filter: LeagueDuesTransactionFilterInput, league_id: Snowflake!): [LeagueDuesTransaction]
```

Server description: Get league dues transactions

Example:

```graphql
{league_dues_transactions(league_id:"1389357604773322752"){status metadata user_id created_at currency_type reference_id currency_amount league_id payout_config_id transaction_type payout_plan_id paid_for_user_id}}
```

Result: 68 ms, 2 bytes. Trimmed:

```json
[]
```



### `league_dues_payment_methods`

```graphql
league_dues_payment_methods(include_venmo: Boolean = false, include_cards: Boolean = false, include_apple_pay: Boolean = false): [LeagueDuesPaymentMethod]
```

Server description: Get payment methods eligible for league dues

Example:

```graphql
{league_dues_payment_methods{label name status type display_data provider confirmed base_fee fee_percentage}}
```

Result: 74 ms, 2 bytes. Trimmed:

```json
[]
```



### `league_dues_payout_configs`

```graphql
league_dues_payout_configs(status: String, league_id: Snowflake!): [LeagueDuesPayoutConfig]
```

Server description: Get all payout configs for a league

Example:

```graphql
{league_dues_payout_configs(league_id:"1389357604773322752"){status metadata created_at review_window_hours updated_at created_by league_id updated_by payout_config_id config_hash payout_criteria payout_interval payout_structure voting_threshold}}
```

Result: 72 ms, 2 bytes. Trimmed:

```json
[]
```



### `league_dues_payout_config`

```graphql
league_dues_payout_config(league_id: Snowflake!, payout_config_id: Snowflake!): LeagueDuesPayoutConfig
```

Server description: Get a single payout config

Not run: needs an id this account cannot produce (payout_config_id (no configs)).


### `league_dues_payout_plans`

```graphql
league_dues_payout_plans(statuses: [String], league_id: Snowflake!, payout_config_id: Snowflake): [LeagueDuesPayoutPlan]
```

Server description: Get payout plans for a league

Example:

```graphql
{league_dues_payout_plans(league_id:"1389357604773322752"){status metadata created_at updated_at league_id notes payout_config_id execute_bucket payout_structure notes_text_map payout_plan_id poll_id payees}}
```

Result: 68 ms, 2 bytes. Trimmed:

```json
[]
```



### `league_dues_payout_plan`

```graphql
league_dues_payout_plan(league_id: Snowflake!, payout_config_id: Snowflake!, payout_plan_id: String!): LeagueDuesPayoutPlan
```

Server description: Get a single payout plan

Not run: needs an id this account cannot produce (payout_plan_id).


### `league_dues_active_payout_polls`

```graphql
league_dues_active_payout_polls(league_id: Snowflake!): [LeagueDuesPayoutPoll]
```

Server description: Get active payout polls for a league

Example:

```graphql
{league_dues_active_payout_polls(league_id:"1389357604773322752"){text attachment message_id parent_id}}
```

Result: 75 ms, 2 bytes. Trimmed:

```json
[]
```



## Matchmaking (public league finder)

### `search_matchmaking_leagues`

```graphql
search_matchmaking_leagues(size: Int, tags: Map, from: Int, sport: String!, season_type: String!, season: String!, custom_tags: [String], commitment_high: Float, commitment_low: Float, player_count: [Int]): [MatchmakingLobby]
```

Notes: Public league finder. Returns open lobbies with `commitment`, `join_type`, `current_players`.

Example:

```graphql
{search_matchmaking_leagues(sport:"nfl",season_type:"regular",season:"2026",size:2){message tags metadata title is_open owner_id lobby_id game_bucket commitment game current_players custom_tags join_type max_players display_icon}}
```

Result: 78 ms, 2,892 bytes. Trimmed:

```json
[
 {
  "commitment": 50,
  "current_players": 2,
  "custom_tags": null,
  "display_icon": null,
  "game": "fantasy_nfl",
  "game_bucket": "regular_2026",
  "is_open": true,
  "join_type": 2,
  "lobby_id": "1369071214827429888",
  "max_players": 12,
  "message": "<redacted text>",
  "metadata": {
   "best_ball": 0,
   "waiver_budget": 250,
   "disable_adds": 0,
   "divisions": 3,
   "capacity_override": 0,
   "waiver_bid_min": 0,
   "taxi_deadline": 0,
   "draft_rounds": 3,
   "reserve_allow_na": 1,
   "start_week": 1,
   "playoff_seed_type": 0,
   "playoff_teams": 8,
   "veto_votes_needed": 6,
   "num_teams": 12,
   "...": "35 more keys"
  },
  "owner_id": "<user_75>",
  "tags": {
   "best_ball": "0",
   "draft_type": "snake",
   "game_mode": "0",
   "scoring_type": "ppr",
   "type": "dynasty"
  },
  "...": "1 more keys"
 },
 {
  "commitment": 0,
  "current_players": 7,
  "custom_tags": null,
  "display_icon": null,
  "game": "fantasy_nfl",
  "game_bucket": "regular_2026",
  "is_open": true,
  "join_type": 1,
  "lobby_id": "1395409283264307200",
  "max_players": 10,
  "message": "<redacted text>",
  "metadata": {
   "waiver_budget": 100,
   "disable_adds": 0,
   "capacity_override": 0,
   "waiver_bid_min": 0,
   "taxi_deadline": 0,
   "draft_rounds": 3,
   "reserve_allow_na": 0,
   "start_week": 1,
   "playoff_seed_type": 0,
   "playoff_teams": 6,
   "num_teams": 10,
   "daily_waivers_hour": 0,
   "playoff_type": 0,
   "taxi_slots": 0,
   "...": "30 more keys"
  },
  "owner_id": "<user_76>",
  "tags": {
   "best_ball": "0",
   "draft_type": "snake",
   "game_mode": "0",
   "scoring_type": "ppr",
   "type": "redraft"
  },
  "...": "1 more keys"
 }
]
```



### `get_matchmaking_league`

```graphql
get_matchmaking_league(league_id: Snowflake!): MatchmakingLobby
```

Notes: Null for a league that is not listed.

Example:

```graphql
{get_matchmaking_league(league_id:"1389357604773322752"){message tags metadata title is_open owner_id lobby_id game_bucket commitment game current_players custom_tags join_type max_players display_icon}}
```

Result: 81 ms, 4 bytes. Trimmed:

```json
null
```



### `get_matchmaking_league_activity`

```graphql
get_matchmaking_league_activity(league_id: Snowflake!): MatchmakingLeagueActivity
```

Example:

```graphql
{get_matchmaking_league_activity(league_id:"1389357604773322752"){since totals}}
```

Result: 103 ms, 4 bytes. Trimmed:

```json
null
```



### `search_matchmaking_league_users`

```graphql
search_matchmaking_league_users(size: Int, from: Int, league_id: Snowflake!): [MatchmakingUser]
```

Example:

```graphql
{search_matchmaking_league_users(league_id:"1389357604773322752",size:2){message tags metadata is_open username user_id avatar display_name game_bucket game custom_tags commitment_high commitment_low player_count}}
```

Result: 71 ms, 4 bytes. Trimmed:

```json
null
```



### `get_matchmaking_user`

```graphql
get_matchmaking_user(user_id: Snowflake!, game_bucket: String!, game: String!): MatchmakingUser
```

Example:

```graphql
{get_matchmaking_user(user_id:"1267685386142887936",game_bucket:"nfl",game:"nfl"){message tags metadata is_open username user_id avatar display_name game_bucket game custom_tags commitment_high commitment_low player_count}}
```

Result: 72 ms, 4 bytes. Trimmed:

```json
null
```



### `get_user_matchmaking_preferences`

```graphql
get_user_matchmaking_preferences: [MatchmakingUser]
```

Example:

```graphql
{get_user_matchmaking_preferences{message tags metadata is_open username user_id avatar display_name game_bucket game custom_tags commitment_high commitment_low player_count}}
```

Result: 81 ms, 2 bytes. Trimmed:

```json
[]
```



## Items, mascots, companies, misc

### `item_types`

```graphql
item_types: [ItemType]
```

Notes: 44 KB catalogue of mascots/gifts with config.

Example:

```graphql
{item_types{id name type config archetype}}
```

Result: 109 ms, 43,764 bytes. Trimmed:

```json
[
 {
  "archetype": "mascot",
  "config": {
   "cookie_cost": 10,
   "assets_url": "https://sleepercdn.com/images/mascots_v2/01_GoldFish",
   "rarity_class": "1",
   "defeat_effect": "WaterAttack",
   "assets_version": "4",
   "featured": false,
   "rarity": 0.014848484848484849
  },
  "id": "goldfish",
  "name": "Goldfish",
  "type": "goldfish"
 },
 {
  "archetype": "mascot",
  "config": {
   "cookie_cost": 20,
   "assets_url": "https://sleepercdn.com/images/mascots_v2/02_NinjaGirl",
   "rarity_class": "2",
   "defeat_effect": "WindAttack",
   "assets_version": "4",
   "featured": false,
   "rarity": 0.00975609756097561
  },
  "id": "jessica",
  "name": "Jessica",
  "type": "jessica"
 },
 "... 136 more"
]
```



### `my_items`

```graphql
my_items: [Item]
```

Example:

```graphql
{my_items{created item_id item_type_id archetype}}
```

Result: 73 ms, 2 bytes. Trimmed:

```json
[]
```



### `my_purchases`

```graphql
my_purchases: [Purchase]
```

Example:

```graphql
{my_purchases{created receipt_id product_id store_type}}
```

Result: 68 ms, 2 bytes. Trimmed:

```json
[]
```



### `my_purchasable_mascots`

```graphql
my_purchasable_mascots: [ItemType]
```

Notes: Mascots the caller can buy with cookies.

Example:

```graphql
{my_purchasable_mascots{id name type config archetype}}
```

Result: 89 ms, 953 bytes. Trimmed:

```json
[
 {
  "archetype": "mascot",
  "config": {
   "cookie_cost": 20,
   "rarity_class": "2",
   "assets_url": "https://sleepercdn.com/images/mascots_v2/L28_Hercules",
   "defeat_effect": "PowerAttack",
   "assets_version": "4",
   "featured": false,
   "rarity": 0.00975609756097561
  },
  "id": "trojan-man",
  "name": "Trojan Man",
  "type": "trojan-man"
 },
 {
  "archetype": "mascot",
  "config": {
   "cookie_cost": 10,
   "rarity_class": "1",
   "assets_url": "https://sleepercdn.com/images/mascots_v2/26_TRex",
   "defeat_effect": "PowerAttack",
   "assets_version": "4",
   "featured": false,
   "rarity": 0.014848484848484849
  },
  "id": "jurassic-lex",
  "name": "The North",
  "type": "dinosaur"
 },
 "... 1 more"
]
```



### `get_featured_mascots`

```graphql
get_featured_mascots: [ItemType]
```

Example:

```graphql
{get_featured_mascots{id name type config archetype}}
```

Result: 71 ms, 2 bytes. Trimmed:

```json
[]
```



### `purchasable_item_refresh`

```graphql
purchasable_item_refresh: Map
```

Not run. Name suggests it rotates the store. Not executed.


### `companies`

```graphql
companies: [Company]
```

Example:

```graphql
{companies{name description avatar company_id shortcode}}
```

Result: 75 ms, 2 bytes. Trimmed:

```json
[]
```



### `company_users`

```graphql
company_users(company_id: Snowflake!): [CompanyUser]
```

Not run: needs an id this account cannot produce (company_id (companies returned empty)).


### `league_sync_list_leagues`

```graphql
league_sync_list_leagues(cookie: String, provider: String!, s2: String, swid: String): [Map]
```

Not run. Takes ESPN/Yahoo cookies to list leagues for import. Not executed (needs third-party credentials).

