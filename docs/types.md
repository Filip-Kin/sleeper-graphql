# Types

116 object types, 19 input objects, 16 scalars, no interfaces, no unions, no enums (Absinthe schema; every enum-like value is a plain String). Example values are harvested from the real responses in `queries.md` (first non-null value seen per field, redacted). A blank example means no response populated the field during this capture.

Scalars: `Snowflake` (numeric id as string), `Map`, `Json`, `List`, `Set`, `SnowflakeList`, `SnowflakeSet`, `MapWithSnowflakeKey`, `MapWithSnowflakeKeyValue`, `LocalizedString`, `LocalizedJson`, `LocalizedMap`, plus Int, Float, String, Boolean. All the custom ones serialise as plain JSON and take no sub-selection.

## Contents

[League](#league), [Roster](#roster), [MatchupLeg](#matchupleg), [LeagueTransaction](#leaguetransaction), [LeagueUser](#leagueuser), [User](#user), [Player](#player), [PlayerNews](#playernews), [Stat](#stat), [Score](#score), [Play](#play), [PlayStat](#playstat), [Team](#team), [Draft](#draft), [DraftPick](#draftpick), [UserDraft](#userdraft), [DraftOffer](#draftoffer), [RosterDraftPick](#rosterdraftpick), [RosterStanding](#rosterstanding), [UserPlayoffStatus](#userplayoffstatus), [LeagueEventLog](#leagueeventlog), [LeaguePlayer](#leagueplayer), [LeagueNote](#leaguenote), [PickemLeg](#pickemleg), [TournamentPick](#tournamentpick), [Dm](#dm), [DmUser](#dmuser), [Message](#message), [Mention](#mention), [Reaction](#reaction), [ReadReceipt](#readreceipt), [Request](#request), [Friend](#friend), [Channel](#channel), [ChannelUser](#channeluser), [ChannelBan](#channelban), [ChannelTag](#channeltag), [Topic](#topic), [TopicReaction](#topicreaction), [Poll](#poll), [PollVote](#pollvote), [Role](#role), [Code](#code), [Event](#event), [File](#file), [Metadata](#metadata), [Preference](#preference), [Achievement](#achievement), [Activity](#activity), [BlockedUser](#blockeduser), [Parlay](#parlay), [ParlayLeg](#parlayleg), [Line](#line), [LinePromotion](#linepromotion), [Promo](#promo), [PromoPage](#promopage), [SharedPromo](#sharedpromo), [PromoClaim](#promoclaim), [CurrencyTransaction](#currencytransaction), [CurrenciesAndTransactions](#currenciesandtransactions), [PaymentMethod](#paymentmethod), [Position](#position), [ContractOrder](#contractorder), [Winnings](#winnings), [UserProfile](#userprofile), [Passkey](#passkey), [IpLocation](#iplocation), [OnboardingReward](#onboardingreward), [UserQuest](#userquest), [UserPool](#userpool), [DailyDraftContest](#dailydraftcontest), [DailyDraftTeam](#dailydraftteam), [DerbyUser](#derbyuser), [UserDerbyPrize](#userderbyprize), [FullRewardTracker](#fullrewardtracker), [RewardActionLog](#rewardactionlog), [RewardTrackerInfo](#rewardtrackerinfo), [LeagueDuesConfig](#leagueduesconfig), [LeagueDuesUser](#leagueduesuser), [LeagueDueUsersWithHash](#leaguedueuserswithhash), [LeagueDuesRosterOwed](#leagueduesrosterowed), [LeagueDuesSeasonPaid](#leagueduesseasonpaid), [LeagueDuesTransaction](#leagueduestransaction), [LeagueDuesPaymentMethod](#leagueduespaymentmethod), [LeagueDuesPaymentResult](#leagueduespaymentresult), [LeagueDuesPayoutConfig](#leagueduespayoutconfig), [LeagueDuesPayoutPlan](#leagueduespayoutplan), [LeagueDuesPayoutPoll](#leagueduespayoutpoll), [MatchmakingLobby](#matchmakinglobby), [MatchmakingUser](#matchmakinguser), [MatchmakingLeagueActivity](#matchmakingleagueactivity), [LeagueGroup](#leaguegroup), [LeagueManualHistory](#leaguemanualhistory), [LeagueHistoryImport](#leaguehistoryimport), [Company](#company), [CompanyUser](#companyuser), [Item](#item), [ItemType](#itemtype), [Purchase](#purchase), [UserRoster](#userroster), [UserTipTransactionLog](#usertiptransactionlog), [ResponsibleGamingLimit](#responsiblegaminglimit), [TopTabContentGroup](#toptabcontentgroup), [DiscoveredContact](#discoveredcontact), [CcDepositResult](#ccdepositresult), [InteractiveBankDepositResult](#interactivebankdepositresult), [PossibleMultipliers](#possiblemultipliers), [UpdateSquadBankGradingModeResult](#updatesquadbankgradingmoderesult)

## League

Fields with an observed example: 27/32.

| field | type | example |
|---|---|---|
| `avatar` | `String` | `"<avatar>"` |
| `company_id` | `Snowflake` |  |
| `display_order` | `Int` | `0` |
| `draft_id` | `Snowflake` | `"1389357604773322753"` |
| `group_id` | `Snowflake` |  |
| `is_full` | `Boolean` | `true` |
| `last_author_avatar` | `String` |  |
| `last_author_display_name` | `String` | `"<redacted>"` |
| `last_author_id` | `Snowflake` | `"<user_1>"` |
| `last_author_is_bot` | `Boolean` | `true` |
| `last_message_attachment` | `Json` | `{"data": [{"poll_id": null, "transaction_id": "1400935506820251648", "transactions_by_roster": {"1": {"added_b...` |
| `last_message_id` | `Snowflake` | `"1401849092367233024"` |
| `last_message_text` | `String` | `"<redacted text>"` |
| `last_message_text_map` | `Json` | `{"flairs": {"data": [], "type": "flair"}}` |
| `last_message_time` | `Int` | `1788589378019` |
| `last_pinned_message_id` | `Snowflake` |  |
| `last_read_id` | `Snowflake` | `"1400193239985745920"` |
| `last_transaction_id` | `Snowflake` | `"1403514456687788032"` |
| `league_id` | `Snowflake` | `"1389357604773322752"` |
| `matchup_legs` | `List` | `[{"round": 1, "metadata": {"modified_at": "2026-08-31 00:06:52.899894Z"}, "leg": 1, "points": null, "players":...` |
| `metadata` | `Map` | `{"auto_continue": "on", "keeper_deadline": "0", "latest_league_winner_roster_id": "3"}` |
| `name` | `String` | `"Pit Podcast powered by BAA"` |
| `previous_league_id` | `Snowflake` | `"1267682977899364352"` |
| `roster_positions` | `List` | `["QB", "RB", "... 14 more"]` |
| `scoring_settings` | `Map` | `{"sack": 1, "fgm_40_49": 0, "pass_int": -1, "fgmiss_50p": 0.5, "pts_allow_0": 10, "pass_2pt": 2, "...": "40 mo...` |
| `season` | `String` | `"2026"` |
| `season_type` | `String` | `"regular"` |
| `settings` | `Map` | `{"best_ball": 0, "waiver_budget": 100, "disable_adds": 0, "capacity_override": 0, "waiver_bid_min": 0, "taxi_d...` |
| `sport` | `String` | `"nfl"` |
| `status` | `String` | `"in_season"` |
| `total_rosters` | `Int` | `8` |
| `user_playoff_status` | `UserPlayoffStatus` |  |

## Roster

Fields with an observed example: 8/12.

| field | type | example |
|---|---|---|
| `co_owners` | `SnowflakeSet` |  |
| `keepers` | `Set` |  |
| `league_id` | `Snowflake` | `"1389357604773322752"` |
| `metadata` | `Map` | `{"league_avatar": null, "league_description": "8-Team PPR  League", "league_name": "coach-staging DO NOT USE"}` |
| `owner_id` | `Snowflake` | `"<user_2>"` |
| `player_map` | `Map` | `{"2747": {"position": "K", "status": "Active", "number": 5, "first_name": "Jason", "last_name": "Myers", "spor...` |
| `players` | `Set` | `["11560", "12507", "... 14 more"]` |
| `reserve` | `Set` |  |
| `roster_id` | `Int` | `1` |
| `settings` | `Map` | `{"fpts": 0, "fpts_decimal": 0, "losses": 0, "ties": 0, "total_moves": 0, "waiver_budget_used": 0, "...": "2 mo...` |
| `starters` | `List` | `["11560", "12507", "... 8 more"]` |
| `taxi` | `Set` |  |

## MatchupLeg

Fields with an observed example: 12/16.

| field | type | example |
|---|---|---|
| `bans` | `Map` |  |
| `custom_points` | `Float` |  |
| `league_id` | `Snowflake` | `"1389357604773322752"` |
| `leg` | `Int` | `1` |
| `matchup_id` | `Int` | `2` |
| `max_points` | `Float` | `153.9199981689453` |
| `picks` | `Map` |  |
| `player_map` | `Map` | `{"2747": {"position": "K", "status": "Active", "number": 5, "first_name": "Jason", "last_name": "Myers", "spor...` |
| `players` | `Set` | `["11560", "12507", "... 14 more"]` |
| `points` | `Float` | `118.44000244140625` |
| `proj_points` | `Float` | `143.72` |
| `roster_id` | `Int` | `1` |
| `round` | `Int` | `1` |
| `starters` | `List` | `["11560", "12507", "... 8 more"]` |
| `starters_games` | `Map` |  |
| `subs` | `Map` | `{"9484": "12506"}` |

## LeagueTransaction

Fields with an observed example: 15/17.

| field | type | example |
|---|---|---|
| `adds` | `Map` | `{"1466": 3, "10859": 5, "12490": 3}` |
| `consenter_ids` | `List` | `[5]` |
| `created` | `Int` | `1788986431814` |
| `creator` | `Snowflake` | `"<user_5>"` |
| `draft_picks` | `List` |  |
| `drops` | `Map` | `{"1466": 5, "10859": 3, "12490": 5}` |
| `league_id` | `Snowflake` | `"1389357604773322752"` |
| `leg` | `Int` | `1` |
| `metadata` | `Map` | `{"rejecter_id": "<user_3>"}` |
| `player_map` | `Map` | `{"1466": {"position": "TE", "status": "Active", "number": 87, "first_name": "Travis", "last_name": "Kelce", "s...` |
| `roster_ids` | `List` | `[3, 5]` |
| `settings` | `Map` | `{"is_counter": 1}` |
| `status` | `String` | `"rejected"` |
| `status_updated` | `Int` | `1788986455788` |
| `transaction_id` | `Snowflake` | `"1403514456687788032"` |
| `type` | `String` | `"trade"` |
| `waiver_budget` | `List` |  |

## LeagueUser

Fields with an observed example: 7/8.

| field | type | example |
|---|---|---|
| `avatar` | `String` | `"<avatar>"` |
| `display_name` | `String` | `"<redacted>"` |
| `is_bot` | `Boolean` | `false` |
| `is_owner` | `Boolean` | `false` |
| `league_id` | `Snowflake` | `"1389357604773322752"` |
| `metadata` | `Map` | `{"allow_pn": "on", "avatar": "<avatar>", "mention_pn": "on", "team_name": "--dangerously-skip-perms"}` |
| `settings` | `Map` |  |
| `user_id` | `Snowflake` | `"<user_3>"` |

## User

Fields with an observed example: 13/26.

| field | type | example |
|---|---|---|
| `async_bundles` | `List` |  |
| `avatar` | `String` | `"<avatar>"` |
| `cookies` | `Int` |  |
| `created` | `Int` | `1756602257814` |
| `currencies` | `Map` |  |
| `data_updated` | `Map` | `{"general_terms": 1788211191397, "player_follows": 1788589378000, "preferences": 1756602257814, "privacy_polic...` |
| `deleted` | `Int` |  |
| `display_name` | `String` | `"<redacted>"` |
| `email` | `String` | `"<redacted>"` |
| `ip_city` | `String` | `"Troy"` |
| `ip_country_code` | `String` | `"US"` |
| `ip_region_codes` | `[String]` | `["MI"]` |
| `is_bot` | `Boolean` | `false` |
| `metadata` | `Json` | `{"promo_funnel": "new_user_single:won0"}` |
| `notifications` | `Map` |  |
| `pending` | `Boolean` |  |
| `phone` | `String` |  |
| `picks` | `Map` | `{"classification_limits": {"max_discount_contest_entry_fee": 10, "max_protected_pick_entry_fee": 30, "max_pre_...` |
| `real_name` | `String` |  |
| `solicitable` | `Boolean` |  |
| `summoner_name` | `String` |  |
| `summoner_region` | `String` |  |
| `token` | `String` |  |
| `user_id` | `Snowflake` | `"<user_3>"` |
| `username` | `String` | `"<redacted>"` |
| `verification` | `String` |  |

## Player

Fields with an observed example: 33/41.

| field | type | example |
|---|---|---|
| `active` | `Boolean` | `true` |
| `age` | `Int` | `24` |
| `birth_city` | `String` |  |
| `birth_country` | `String` |  |
| `birth_date` | `String` | `"2002-01-30"` |
| `birth_state` | `String` |  |
| `college` | `String` | `"Texas"` |
| `depth_chart_order` | `Int` | `1` |
| `depth_chart_position` | `String` | `"RB"` |
| `dl_trading_id` | `Int` | `13661` |
| `espn_id` | `Int` | `3918298` |
| `fantasy_data_id` | `Int` | `23189` |
| `fantasy_positions` | `Set` | `["RB"]` |
| `first_name` | `String` | `"Bijan"` |
| `hashtag` | `String` | `"#patrickmahomes-NFL-KC-15"` |
| `height` | `String` | `"71"` |
| `high_school` | `String` | `"Salpointe (AZ)"` |
| `injury_body_part` | `String` | `"Knee"` |
| `injury_notes` | `String` | `"Surgery"` |
| `injury_start_date` | `String` |  |
| `injury_status` | `String` | `"Questionable"` |
| `last_name` | `String` | `"Robinson"` |
| `metadata` | `Map` | `{"channel_id": "1113708865150545921", "genius_id": "1398582", "rookie_year": "2023"}` |
| `number` | `Int` | `7` |
| `player_id` | `String` | `"9509"` |
| `position` | `String` | `"RB"` |
| `practice_description` | `String` |  |
| `practice_participation` | `String` |  |
| `rotowire_id` | `Int` | `16739` |
| `rotoworld_id` | `Int` | `12198` |
| `sport` | `String` | `"nfl"` |
| `sportradar_id` | `String` | `"f78d68c2-f9da-48e7-b954-26b69efd828d"` |
| `stats_id` | `Int` | `868199` |
| `status` | `String` | `"Active"` |
| `swish_id` | `Int` | `1228244` |
| `team` | `String` | `"ATL"` |
| `team_abbr` | `String` |  |
| `team_changed_at` | `Int` |  |
| `weight` | `String` | `"215"` |
| `yahoo_id` | `Int` | `30977` |
| `years_exp` | `Int` | `3` |

## PlayerNews

Fields with an observed example: 6/6.

| field | type | example |
|---|---|---|
| `metadata` | `LocalizedMap` | `{"description": "The Athletic's Joe Buscaglia writes that wide receiver DJ Moore could help swing the Bills' 2...` |
| `player_id` | `String` | `"4983"` |
| `published` | `Int` | `1788866226000` |
| `source` | `String` | `"rotoballer"` |
| `source_key` | `String` | `"220337"` |
| `sport` | `String` | `"nfl"` |

## Stat

Fields with an observed example: 14/14.

| field | type | example |
|---|---|---|
| `category` | `String` | `"stat"` |
| `company` | `String` | `"sportradar"` |
| `date` | `String` | `"2026-09-13"` |
| `game_id` | `String` | `"season"` |
| `opponent` | `String` | `"HOU"` |
| `player` | `Map` | `{"fantasy_positions": ["QB"], "first_name": "Blake", "injury_body_part": null, "injury_notes": null, "injury_s...` |
| `player_id` | `String` | `"3957"` |
| `season` | `String` | `"2026"` |
| `season_type` | `String` | `"regular"` |
| `sport` | `String` | `"nfl"` |
| `stats` | `Map` | `{"adp_dd_ppr": 64, "bonus_rec_wr": 4.13, "def_fum_td": 0, "fum": 0.04, "fum_lost": 0.02, "gp": 1, "...": "22 m...` |
| `team` | `String` | `"SEA"` |
| `updated_at` | `Int` | `1788988250325` |
| `week` | `Int` | `1` |

## Score

Fields with an observed example: 14/14.

| field | type | example |
|---|---|---|
| `date` | `String` | `"2026-09-13"` |
| `game_id` | `String` | `"202610105"` |
| `metadata` | `Json` | `{"dl_trading_event_id": 2738985, "oddsjam_fixture_id": "20260913DABEBB98", "forecast_temp_low": 72, "day": "20...` |
| `reactions` | `Map` | `{"eyes": 20, "meme_scream_odyssey": 21, "meme_timeout_shaq": 4, "meme_take_my_money": 1, "meme_nfl_bryce_young...` |
| `season` | `String` | `"2026"` |
| `season_type` | `String` | `"regular"` |
| `sport` | `String` | `"nfl"` |
| `start_time` | `Int` | `1789318800000` |
| `status` | `String` | `"pre_game"` |
| `total_comments` | `Int` | `932` |
| `total_reactions` | `Int` | `9664` |
| `total_views` | `Int` | `679341` |
| `updated_at` | `Int` | `1788988885263` |
| `week` | `Int` | `1` |

## Play

Fields with an observed example: 12/13.

| field | type | example |
|---|---|---|
| `date` | `String` | `"2025-09-08"` |
| `game_id` | `String` | `"202510106"` |
| `metadata` | `Json` | `{"away_used_timeouts": 2, "description": "End Game", "home_used_timeouts": 3, "is_scoring_play": false, "play_...` |
| `play_id` | `String` | `"b31296b0-8d2d-11f0-b652-cd6585b5560f"` |
| `play_stats` | `[PlayStat]` | `[{"player": {"position": "DB", "status": "Active", "number": 24, "first_name": "Jay", "last_name": "Ward", "sp...` |
| `provider` | `String` |  |
| `season` | `String` | `"2025"` |
| `season_type` | `String` | `"regular"` |
| `sequence` | `Int` | `1757388792617` |
| `sport` | `String` | `"nfl"` |
| `time` | `Int` | `1757388790000` |
| `updated_at` | `Int` | `1757606938557` |
| `week` | `Int` | `1` |

## PlayStat

Fields with an observed example: 3/4.

| field | type | example |
|---|---|---|
| `player` | `Map` | `{"position": "DB", "status": "Active", "number": 24, "first_name": "Jay", "last_name": "Ward", "sport": "nfl",...` |
| `player_id` | `String` | `"10939"` |
| `stats` | `Map` | `{"idp_fum_rec": 1}` |
| `stats_agg` | `Map` |  |

## Team

Fields with an observed example: 5/6.

| field | type | example |
|---|---|---|
| `active` | `Boolean` | `true` |
| `aliases` | `Map` |  |
| `metadata` | `Map` | `{"bye_week": "6", "channel_id": "262859011462799360", "city": "Detroit", "color1": "0076B6", "color2": "B0B7BC...` |
| `name` | `String` | `"Lions"` |
| `sport` | `String` | `"nfl"` |
| `team` | `String` | `"DET"` |

## Draft

Fields with an observed example: 16/16.

| field | type | example |
|---|---|---|
| `created` | `Int` | `1785611175295` |
| `creators` | `SnowflakeList` | `["<user_2>"]` |
| `draft_id` | `Snowflake` | `"1389357604773322753"` |
| `draft_order` | `MapWithSnowflakeKey` | `{"<user_5>": 7, "<user_2>": 3, "<user_6>": 5, "<user_7>": 1, "<user_8>": 2, "<user_3>": 4, "...": "2 more keys...` |
| `last_message_id` | `Snowflake` | `"1399930419872321536"` |
| `last_message_time` | `Int` | `1788131930848` |
| `last_picked` | `Int` | `1788131930168` |
| `league_id` | `Snowflake` | `"1389357604773322752"` |
| `metadata` | `Map` | `{"description": "", "league_type": "0", "name": "Pit Podcast powered by BAA", "scoring_type": "ppr", "show_tea...` |
| `season` | `String` | `"2026"` |
| `season_type` | `String` | `"regular"` |
| `settings` | `Map` | `{"alpha_sort": 0, "autopause_enabled": 0, "autopause_end_time": 840, "autopause_start_time": 120, "autostart":...` |
| `sport` | `String` | `"nfl"` |
| `start_time` | `Int` | `1788127790950` |
| `status` | `String` | `"complete"` |
| `type` | `String` | `"snake"` |

## DraftPick

Fields with an observed example: 6/7.

| field | type | example |
|---|---|---|
| `draft_id` | `Snowflake` | `"1389357604773322753"` |
| `is_keeper` | `Boolean` |  |
| `metadata` | `Map` | `{"first_name": "Jahmyr", "injury_status": "", "last_name": "Gibbs", "news_updated": "1787807460056", "number":...` |
| `pick_no` | `Int` | `1` |
| `picked_by` | `Snowflake` | `"<user_7>"` |
| `player_id` | `String` | `"9221"` |
| `reactions` | `Map` | `{"1267685386142887936": ["crying"]}` |

## UserDraft

Fields with an observed example: 21/21.

| field | type | example |
|---|---|---|
| `allow_pn` | `Boolean` | `true` |
| `created` | `Int` | `1785611175295` |
| `draft_id` | `Snowflake` | `"1389357604773322753"` |
| `last_message_id` | `Snowflake` | `"1399930419872321536"` |
| `last_message_time` | `Int` | `1788131930848` |
| `last_picked` | `Int` | `1788131930168` |
| `last_read_id` | `Snowflake` | `"1399930419872321536"` |
| `league_id` | `Snowflake` | `"1389357604773322752"` |
| `mention_pn` | `Boolean` | `true` |
| `metadata` | `Map` | `{"description": "", "league_type": "0", "name": "Pit Podcast powered by BAA", "scoring_type": "ppr", "show_tea...` |
| `season` | `String` | `"2026"` |
| `season_type` | `String` | `"regular"` |
| `settings` | `Map` | `{"alpha_sort": 0, "autopause_enabled": 0, "autopause_end_time": 840, "autopause_start_time": 120, "autostart":...` |
| `sport` | `String` | `"nfl"` |
| `start_time` | `Int` | `1788127790950` |
| `status` | `String` | `"complete"` |
| `type` | `String` | `"snake"` |
| `user_avatar` | `String` | `"<avatar>"` |
| `user_display_name` | `String` | `"<redacted>"` |
| `user_id` | `Snowflake` | `"<user_3>"` |
| `user_is_bot` | `Boolean` | `false` |

## DraftOffer

Fields with an observed example: 0/8.

| field | type | example |
|---|---|---|
| `amount` | `Int` |  |
| `draft_id` | `Snowflake` |  |
| `metadata` | `Map` |  |
| `pick_no` | `Int` |  |
| `player_id` | `String` |  |
| `slot` | `Int` |  |
| `time` | `Int` |  |
| `user_id` | `Snowflake` |  |

## RosterDraftPick

Fields with an observed example: 0/6.

| field | type | example |
|---|---|---|
| `league_id` | `Snowflake` |  |
| `owner_id` | `Int` |  |
| `previous_owner_id` | `Int` |  |
| `roster_id` | `Int` |  |
| `round` | `Int` |  |
| `season` | `String` |  |

## RosterStanding

Fields with an observed example: 10/14.

| field | type | example |
|---|---|---|
| `correct_bans` | `Int` |  |
| `correct_picks` | `Int` |  |
| `league_id` | `Snowflake` | `"1267682977899364352"` |
| `losses` | `Int` | `3` |
| `points` | `Float` | `2041.260009765625` |
| `points_against` | `Float` | `1743.5799560546875` |
| `rank` | `Int` | `1` |
| `record` | `String` | `"WWWLWLWWWWWWWL"` |
| `roster_id` | `Int` | `8` |
| `round` | `Int` | `14` |
| `ties` | `Int` | `0` |
| `total_bans` | `Int` |  |
| `total_picks` | `Int` |  |
| `wins` | `Int` | `11` |

## UserPlayoffStatus

Fields with an observed example: 0/6.

| field | type | example |
|---|---|---|
| `bracket` | `String` |  |
| `is_bye` | `Boolean` |  |
| `placement` | `Int` |  |
| `playing_for` | `Int` |  |
| `round` | `Int` |  |
| `seed_by_roster` | `Map` |  |

## LeagueEventLog

Fields with an observed example: 5/5.

| field | type | example |
|---|---|---|
| `created` | `Int` | `1788372058319` |
| `data` | `Json` | `{"user_id": "<user_2>", "changes": {"veto_auto_poll": {"new": 1, "old": 0}}, "usernames": {"<user_2>": "<redac...` |
| `event_type` | `String` | `"league_settings_updated"` |
| `league_id` | `Snowflake` | `"1389357604773322752"` |
| `log_id` | `Snowflake` | `"1400937587484430336"` |

## LeaguePlayer

Fields with an observed example: 2/4.

| field | type | example |
|---|---|---|
| `league_id` | `Snowflake` | `"1389357604773322752"` |
| `metadata` | `Map` |  |
| `player_id` | `String` | `"0"` |
| `settings` | `Map` |  |

## LeagueNote

Fields with an observed example: 2/5.

| field | type | example |
|---|---|---|
| `league_id` | `Snowflake` | `"1389357604773322752"` |
| `text` | `String` |  |
| `text_map` | `Json` |  |
| `type` | `String` | `"commissioner_note"` |
| `updated_at` | `Int` |  |

## PickemLeg

Fields with an observed example: 7/9.

| field | type | example |
|---|---|---|
| `league_id` | `Snowflake` | `"1399932549756674048"` |
| `leg_id` | `String` | `"v1:regular:1"` |
| `leg_scoring_result` | `Map` |  |
| `metadata` | `Map` |  |
| `num_expected_picks` | `Int` | `16` |
| `picks` | `Map` | `{"202610105": {"outcome": "win", "team": "CHI", "updated_at": 1788213184062, "game_id": "202610105"}, "2026101...` |
| `roster_id` | `Int` | `5` |
| `status` | `String` | `"in_progress"` |
| `tiebreaker` | `Map` | `{"type": "total_points", "value": 30, "updated_at": 1788872429320, "game_id": "202610116"}` |

## TournamentPick

Fields with an observed example: 0/8.

| field | type | example |
|---|---|---|
| `game_id` | `String` |  |
| `league_id` | `Snowflake` |  |
| `points` | `Float` |  |
| `roster_id` | `Int` |  |
| `round` | `Int` |  |
| `team` | `String` |  |
| `team_bracket` | `String` |  |
| `team_seed` | `Int` |  |

## Dm

Fields with an observed example: 13/19.

| field | type | example |
|---|---|---|
| `deleted_at` | `Snowflake` |  |
| `dm_id` | `Snowflake` | `"1403496316385988608"` |
| `dm_type` | `String` | `"single"` |
| `hidden_at` | `Snowflake` |  |
| `last_author_avatar` | `String` | `"<avatar>"` |
| `last_author_display_name` | `String` | `"<redacted>"` |
| `last_author_id` | `Snowflake` | `"<user_3>"` |
| `last_author_is_bot` | `Boolean` | `false` |
| `last_author_real_name` | `String` |  |
| `last_message_attachment` | `Json` |  |
| `last_message_id` | `Snowflake` | `"1403514558420619264"` |
| `last_message_text` | `String` | `"<redacted text>"` |
| `last_message_text_map` | `Json` | `{"flairs": {"data": [], "type": "flair"}}` |
| `last_message_time` | `Int` | `1788986456068` |
| `last_pinned_message_id` | `Snowflake` |  |
| `last_read_id` | `Snowflake` | `"1403514558420619264"` |
| `member_can_invite` | `Boolean` |  |
| `recent_users` | `Json` | `[{"avatar": "<avatar>", "display_name": "<redacted>", "is_bot": false, "real_name": null, "user_id": "<user_3>...` |
| `title` | `String` | `"<redacted>"` |

## DmUser

Fields with an observed example: 8/10.

| field | type | example |
|---|---|---|
| `allow_pn` | `Boolean` | `true` |
| `avatar` | `String` | `"<avatar>"` |
| `display_name` | `String` | `"<redacted>"` |
| `dm_id` | `Snowflake` | `"1403496316385988608"` |
| `is_bot` | `Boolean` | `false` |
| `is_owner` | `Boolean` | `true` |
| `mention_pn` | `Boolean` | `true` |
| `pending` | `Boolean` |  |
| `real_name` | `String` |  |
| `user_id` | `Snowflake` | `"<user_3>"` |

## Message

Fields with an observed example: 13/22.

| field | type | example |
|---|---|---|
| `attachment` | `Json` | `{"data": {"league_id": "1389357604773322752", "status": "proposed", "transaction_id": "1403514456687788032", "...` |
| `author_achievement` | `String` |  |
| `author_avatar` | `String` | `"<avatar>"` |
| `author_display_name` | `String` | `"<redacted>"` |
| `author_id` | `Snowflake` | `"<user_3>"` |
| `author_is_bot` | `Boolean` | `false` |
| `author_real_name` | `String` |  |
| `author_role_id` | `Snowflake` |  |
| `client_context` | `String` |  |
| `client_id` | `String` |  |
| `created` | `Int` | `1788986456068` |
| `edited` | `Int` |  |
| `message_id` | `Snowflake` | `"1403514558420619264"` |
| `parent_id` | `Snowflake` | `"1403496316385988608"` |
| `parent_type` | `String` | `"dm"` |
| `pinned` | `Boolean` | `false` |
| `reactions` | `Map` | `{"skull": 2}` |
| `shard_max` | `Int` |  |
| `shard_min` | `Int` |  |
| `text` | `LocalizedString` | `"<redacted text>"` |
| `text_map` | `Json` | `{"flairs": {"data": [], "type": "flair"}}` |
| `user_reactions` | `List` |  |

## Mention

Fields with an observed example: 0/5.

| field | type | example |
|---|---|---|
| `message_id` | `Snowflake` |  |
| `metadata` | `Json` |  |
| `parent_id` | `Snowflake` |  |
| `unread` | `Boolean` |  |
| `user_id` | `Snowflake` |  |

## Reaction

Fields with an observed example: 0/7.

| field | type | example |
|---|---|---|
| `message_id` | `Snowflake` |  |
| `parent_id` | `Snowflake` |  |
| `reaction` | `String` |  |
| `reactor_avatar` | `String` |  |
| `reactor_display_name` | `String` |  |
| `reactor_id` | `Snowflake` |  |
| `reactor_is_bot` | `Boolean` |  |

## ReadReceipt

Fields with an observed example: 4/4.

| field | type | example |
|---|---|---|
| `last_read_id` | `Snowflake` | `"1401849092367233024"` |
| `parent_id` | `Snowflake` | `"1389357604773322752"` |
| `parent_type` | `String` | `"league"` |
| `user_id` | `Snowflake` | `"<user_5>"` |

## Request

Fields with an observed example: 0/14.

| field | type | example |
|---|---|---|
| `created` | `Int` |  |
| `request_type` | `String` |  |
| `requestee_avatar` | `Snowflake` |  |
| `requestee_display_name` | `String` |  |
| `requestee_id` | `Snowflake` |  |
| `requestee_is_bot` | `Boolean` |  |
| `requester_avatar` | `Snowflake` |  |
| `requester_display_name` | `String` |  |
| `requester_id` | `Snowflake` |  |
| `requester_is_bot` | `Boolean` |  |
| `type_description` | `String` |  |
| `type_id` | `Snowflake` |  |
| `type_metadata` | `Json` |  |
| `type_name` | `String` |  |

## Friend

Fields with an observed example: 0/6.

| field | type | example |
|---|---|---|
| `friend_avatar` | `String` |  |
| `friend_display_name` | `String` |  |
| `friend_id` | `Snowflake` |  |
| `friend_is_bot` | `Boolean` |  |
| `friend_username` | `String` |  |
| `last_contacted` | `Int` |  |

## Channel

Fields with an observed example: 17/34.

| field | type | example |
|---|---|---|
| `avatar` | `String` | `"<avatar>"` |
| `channel_id` | `Snowflake` | `"250000000000000000"` |
| `description` | `String` | `"Trending NFL Stories"` |
| `display_order` | `Int` |  |
| `is_favorite` | `Boolean` |  |
| `is_private` | `Boolean` | `false` |
| `last_message_id` | `Snowflake` |  |
| `last_message_read_id` | `Snowflake` |  |
| `last_topic_id` | `Snowflake` |  |
| `last_topic_read_id` | `Snowflake` |  |
| `max_message_length` | `Int` | `180` |
| `max_topic_length` | `Int` |  |
| `message_create_amount` | `Int` | `10` |
| `message_create_ban` | `Int` | `30` |
| `message_create_delay` | `Int` |  |
| `message_create_period` | `Int` | `60` |
| `metadata` | `Map` |  |
| `my_last_message_ts` | `Int` |  |
| `my_last_reaction_ts` | `Int` |  |
| `my_last_topic_ts` | `Int` |  |
| `name` | `String` | `"NFL"` |
| `new_user_message_delay` | `Int` | `60` |
| `new_user_topic_delay` | `Int` |  |
| `owner` | `Snowflake` | `"<user_15>"` |
| `parent_id` | `Snowflake` | `"250000000000000000"` |
| `reaction_create_delay` | `Int` | `60` |
| `require_email` | `Boolean` |  |
| `require_phone` | `Boolean` |  |
| `sharding_enabled` | `Boolean` | `false` |
| `sort_order` | `String` | `"last_created"` |
| `sport` | `String` | `"nfl"` |
| `topic_create_delay` | `Int` |  |
| `topic_necro_hours` | `Int` |  |
| `total_members` | `Int` | `2544755` |

## ChannelUser

Fields with an observed example: 6/6.

| field | type | example |
|---|---|---|
| `avatar` | `String` | `"<avatar>"` |
| `channel_id` | `Snowflake` | `"250000000000000000"` |
| `display_name` | `String` | `"<redacted>"` |
| `is_bot` | `Boolean` | `false` |
| `role_ids` | `Set` | `["250000000000000300"]` |
| `user_id` | `Snowflake` | `"<user_16>"` |

## ChannelBan

Fields with an observed example: 0/6.

| field | type | example |
|---|---|---|
| `avatar` | `String` |  |
| `channel_id` | `Snowflake` |  |
| `display_name` | `String` |  |
| `expires` | `Int` |  |
| `is_bot` | `Boolean` |  |
| `user_id` | `Snowflake` |  |

## ChannelTag

Fields with an observed example: 0/7.

| field | type | example |
|---|---|---|
| `channel_id` | `Snowflake` |  |
| `color` | `String` |  |
| `description` | `String` |  |
| `display_order` | `Int` |  |
| `is_default` | `Boolean` |  |
| `name` | `String` |  |
| `tag` | `String` |  |

## Topic

Fields with an observed example: 23/31.

| field | type | example |
|---|---|---|
| `attachment` | `Json` | `{"data": {"choices": {"KWTE": "CHI", "N292": "CAR"}, "choices_order": ["KWTE", "N292"], "closes_at": 178931880...` |
| `author_avatar` | `String` | `"<avatar>"` |
| `author_display_name` | `String` | `"<redacted>"` |
| `author_id` | `Snowflake` | `"<user_66>"` |
| `author_is_bot` | `Boolean` | `false` |
| `channel_id` | `Snowflake` | `"170000000000000002"` |
| `channel_tags` | `Set` | `["hype"]` |
| `client_id` | `String` |  |
| `created` | `Int` | `1788988821933` |
| `engagement_score` | `Int` |  |
| `hidden` | `Boolean` |  |
| `last_message_id` | `Snowflake` | `"1403524481544167424"` |
| `last_pinned_message_id` | `Snowflake` |  |
| `last_read_id` | `Snowflake` |  |
| `metadata` | `Map` | `{"ab_uri": "", "can_feature": "true", "reaction_request": "true"}` |
| `num_messages` | `Int` | `0` |
| `num_viewers` | `Int` |  |
| `pinned` | `Boolean` | `true` |
| `player_tags` | `Set` | `["nfl-4983"]` |
| `pushed_by` | `Json` | `{"avatar": "<avatar>", "display_name": "<redacted>", "is_bot": false, "timestamp": 1788978994644, "user_id": "...` |
| `reactions` | `Map` | `{"like": 2}` |
| `score` | `Int` | `733808` |
| `shadowed` | `Boolean` |  |
| `shard_max` | `Int` | `50` |
| `shard_min` | `Int` | `0` |
| `title` | `LocalizedString` | `"Full PPR\n\nFlex:\n\nMike evans ❤️\n\nCarnell Tate 👍"` |
| `title_map` | `LocalizedJson` | `{"https://x.com/sleeper_hoops/status/2097796701809504548?s=46&amp;t=2mwtO-cy0s8kfMrnayMVag": {"data": {"embed"...` |
| `top_message_id` | `Snowflake` | `"1364013377591975936"` |
| `topic_id` | `Snowflake` | `"1403524481544167424"` |
| `upvotes` | `Int` | `12` |
| `user_reactions` | `[TopicReaction]` |  |

## TopicReaction

Fields with an observed example: 0/7.

| field | type | example |
|---|---|---|
| `channel_id` | `Snowflake` |  |
| `reaction` | `String` |  |
| `reactor_avatar` | `String` |  |
| `reactor_display_name` | `String` |  |
| `reactor_id` | `Snowflake` |  |
| `reactor_is_bot` | `Boolean` |  |
| `topic_id` | `Snowflake` |  |

## Poll

Fields with an observed example: 0/8.

| field | type | example |
|---|---|---|
| `choices` | `Map` |  |
| `choices_order` | `List` |  |
| `closes_at` | `Int` |  |
| `metadata` | `Map` |  |
| `poll_id` | `Snowflake` |  |
| `prompt` | `String` |  |
| `user_votes` | `List` |  |
| `votes` | `Map` |  |

## PollVote

Fields with an observed example: 0/4.

| field | type | example |
|---|---|---|
| `avatar` | `String` |  |
| `choice_id` | `String` |  |
| `name` | `String` |  |
| `user_id` | `Snowflake` |  |

## Role

Fields with an observed example: 7/7.

| field | type | example |
|---|---|---|
| `is_admin` | `Boolean` | `true` |
| `is_default` | `Boolean` | `true` |
| `name` | `String` | `"Moderator"` |
| `permissions` | `List` | `["member_ban", "member_invite", "... 12 more"]` |
| `role_id` | `Snowflake` | `"250000000000000077"` |
| `role_order` | `Int` | `3` |
| `type_id` | `Snowflake` | `"250000000000000000"` |

## Code

Fields with an observed example: 0/6.

| field | type | example |
|---|---|---|
| `code` | `String` |  |
| `expires_at` | `Int` |  |
| `metadata` | `Map` |  |
| `type` | `String` |  |
| `type_id` | `Snowflake` |  |
| `uses_remaining` | `Int` |  |

## Event

Fields with an observed example: 0/9.

| field | type | example |
|---|---|---|
| `bucket` | `Int` |  |
| `description` | `String` |  |
| `end_time` | `Int` |  |
| `event_id` | `Snowflake` |  |
| `name` | `String` |  |
| `parent_id` | `Snowflake` |  |
| `parent_type` | `String` |  |
| `start_time` | `Int` |  |
| `started` | `Boolean` |  |

## File

Fields with an observed example: 0/13.

| field | type | example |
|---|---|---|
| `channel_id` | `Snowflake` |  |
| `created` | `Int` |  |
| `file_id` | `Snowflake` |  |
| `filename` | `String` |  |
| `filesize` | `Int` |  |
| `height` | `Int` |  |
| `mimetype` | `String` |  |
| `parent_id` | `Snowflake` |  |
| `parent_type` | `String` |  |
| `url` | `String` |  |
| `url_original` | `String` |  |
| `user_id` | `Snowflake` |  |
| `width` | `Int` |  |

## Metadata

Fields with an observed example: 0/5.

| field | type | example |
|---|---|---|
| `created` | `Int` |  |
| `data` | `Map` |  |
| `key` | `String` |  |
| `last_updated` | `Int` |  |
| `type` | `String` |  |

## Preference

Fields with an observed example: 3/3.

| field | type | example |
|---|---|---|
| `name` | `String` | `"allow_email"` |
| `type_id` | `String` | `"1267685386142887936"` |
| `value` | `String` | `"on"` |

## Achievement

Fields with an observed example: 0/4.

| field | type | example |
|---|---|---|
| `created` | `Int` |  |
| `description` | `String` |  |
| `name` | `String` |  |
| `user_id` | `Snowflake` |  |

## Activity

Fields with an observed example: 0/5.

| field | type | example |
|---|---|---|
| `created` | `Int` |  |
| `metadata` | `Json` |  |
| `type` | `String` |  |
| `type_id` | `Snowflake` |  |
| `user_id` | `Snowflake` |  |

## BlockedUser

Fields with an observed example: 0/6.

| field | type | example |
|---|---|---|
| `blocked_avatar` | `String` |  |
| `blocked_display_name` | `String` |  |
| `blocked_is_bot` | `Boolean` |  |
| `blocked_timestamp` | `Int` |  |
| `blocked_user_id` | `Snowflake` |  |
| `user_id` | `Snowflake` |  |

## Parlay

Fields with an observed example: 0/21.

| field | type | example |
|---|---|---|
| `created` | `Int` |  |
| `currency_amount` | `Float` |  |
| `currency_type` | `String` |  |
| `display_data` | `Map` |  |
| `graded_at` | `Int` |  |
| `graded_multiplier` | `String` |  |
| `graded_payout` | `String` |  |
| `graded_payout_boost` | `String` |  |
| `graded_profit_boost` | `String` |  |
| `league_id` | `Snowflake` |  |
| `legs` | `[ParlayLeg]` |  |
| `max_multiplier` | `String` |  |
| `max_payout` | `String` |  |
| `max_payout_boost` | `String` |  |
| `max_profit_boost` | `String` |  |
| `multiplier` | `Float` |  |
| `parlay_id` | `Snowflake` |  |
| `possible_multipliers` | `PossibleMultipliers` |  |
| `status` | `String` |  |
| `team_pick` | `ContractOrder` |  |
| `user_id` | `Snowflake` |  |

## ParlayLeg

Fields with an observed example: 0/5.

| field | type | example |
|---|---|---|
| `graded_at` | `Int` |  |
| `line` | `Line` |  |
| `line_id` | `Snowflake` |  |
| `parlay_leg_id` | `Snowflake` |  |
| `status` | `String` |  |

## Line

Fields with an observed example: 0/26.

| field | type | example |
|---|---|---|
| `closed` | `Int` |  |
| `created` | `Int` |  |
| `game_id` | `String` |  |
| `game_status` | `String` |  |
| `line_id` | `Snowflake` |  |
| `line_type` | `String` |  |
| `market_type` | `String` |  |
| `metadata` | `Map` |  |
| `outcome` | `String` |  |
| `outcome_type` | `String` |  |
| `outcome_value` | `Float` |  |
| `payout_multiplier` | `String` |  |
| `pick_count` | `Int` |  |
| `score` | `Score` |  |
| `season` | `String` |  |
| `season_type` | `String` |  |
| `sport` | `String` |  |
| `status` | `String` |  |
| `subject` | `Map` |  |
| `subject_id` | `String` |  |
| `subject_pos_rank` | `String` |  |
| `subject_position` | `String` |  |
| `subject_team` | `String` |  |
| `subject_type` | `String` |  |
| `valid_close_duration_seconds` | `Int` |  |
| `wager_type` | `String` |  |

## LinePromotion

Fields with an observed example: 10/12.

| field | type | example |
|---|---|---|
| `amount_limit` | `Float` | `20` |
| `eligible_targets` | `[String]` | `["promo_funnel:new_user_single:won0", "promo_funnel:new_user_multiple:won0"]` |
| `expires_at` | `Int` |  |
| `game_id` | `String` | `"202610130"` |
| `min_required_parlay_multiplier` | `String` |  |
| `season` | `String` | `"2026"` |
| `season_type` | `String` | `"regular"` |
| `sport` | `String` | `"nfl"` |
| `subject_id` | `String` | `"4943"` |
| `subject_type` | `String` | `"player"` |
| `type` | `String` | `"line_discount"` |
| `wager_type` | `String` | `"passing_yards"` |

## Promo

Fields with an observed example: 6/9.

| field | type | example |
|---|---|---|
| `amount` | `Float` | `100` |
| `available_at` | `Int` |  |
| `created` | `Int` | `1761955305307` |
| `eligible_targets` | `[String]` |  |
| `expires_at` | `Int` | `2295907290343` |
| `metadata` | `Map` | `{"first_time_deposit": "true", "match_rate": "1.0"}` |
| `promo_id` | `String` | `" FFNUKE"` |
| `type` | `String` | `"deposit_match"` |
| `user_id` | `Snowflake` |  |

## PromoPage

Fields with an observed example: 1/4.

| field | type | example |
|---|---|---|
| `gifted_promos` | `[SharedPromo]` |  |
| `global_line_promos` | `[LinePromotion]` | `[{"amount_limit": 20, "eligible_targets": ["promo_funnel:new_user_single:won0", "promo_funnel:new_user_multipl...` |
| `global_promos` | `[Promo]` |  |
| `personal_promos` | `[Promo]` |  |

## SharedPromo

Fields with an observed example: 0/13.

| field | type | example |
|---|---|---|
| `amount` | `Float` |  |
| `claimer_user_id` | `Snowflake` |  |
| `claimer_username` | `String` |  |
| `created` | `Int` |  |
| `expires_at` | `Int` |  |
| `giftee_user_id` | `Snowflake` |  |
| `promo_id` | `String` |  |
| `promo_metadata` | `Map` |  |
| `promo_type` | `String` |  |
| `share_id` | `Snowflake` |  |
| `status` | `String` |  |
| `user_id` | `Snowflake` |  |
| `username` | `String` |  |

## PromoClaim

Fields with an observed example: 0/4.

| field | type | example |
|---|---|---|
| `created` | `Int` |  |
| `promo_id` | `String` |  |
| `promo_type` | `String` |  |
| `user_id` | `Snowflake` |  |

## CurrencyTransaction

Fields with an observed example: 0/11.

| field | type | example |
|---|---|---|
| `completed` | `Int` |  |
| `created` | `Int` |  |
| `currency_amount` | `Float` |  |
| `currency_type` | `String` |  |
| `display_data` | `Json` |  |
| `reference_action` | `String` |  |
| `reference_id` | `String` |  |
| `reference_type` | `String` |  |
| `status` | `String` |  |
| `user_id` | `Snowflake` |  |
| `wallet_type` | `String` |  |

## CurrenciesAndTransactions

Fields with an observed example: 0/11.

| field | type | example |
|---|---|---|
| `currencies` | `Map` |  |
| `currencies_cftc` | `Map` |  |
| `currencies_league_dues` | `Map` |  |
| `currencies_non_promo` | `Map` |  |
| `non_withdrawable` | `Map` |  |
| `non_withdrawable_non_promo` | `Map` |  |
| `non_withdrawable_promo_only` | `Map` |  |
| `transactions` | `[CurrencyTransaction]` |  |
| `uncleared` | `Map` |  |
| `uncleared_transactions` | `[CurrencyTransaction]` |  |
| `withdrawable` | `Map` |  |

## PaymentMethod

Fields with an observed example: 0/7.

| field | type | example |
|---|---|---|
| `confirmed` | `Boolean` |  |
| `display_data` | `Map` |  |
| `label` | `String` |  |
| `name` | `String` |  |
| `provider` | `String` |  |
| `status` | `String` |  |
| `type` | `String` |  |

## Position

Fields with an observed example: 0/17.

| field | type | example |
|---|---|---|
| `buy_fees` | `Float` |  |
| `created_at` | `Int` |  |
| `currency_type` | `String` |  |
| `display_data` | `Map` |  |
| `event_id` | `Snowflake` |  |
| `market_id` | `Snowflake` |  |
| `market_ticker` | `String` |  |
| `net_cost` | `Float` |  |
| `net_quantity` | `Int` |  |
| `net_quantity_fp` | `String` |  |
| `realized_cost` | `Float` |  |
| `realized_profit` | `Float` |  |
| `realized_quantity` | `Int` |  |
| `realized_quantity_fp` | `String` |  |
| `sell_fees` | `Float` |  |
| `side` | `String` |  |
| `updated_at` | `Int` |  |

## ContractOrder

Fields with an observed example: 0/22.

| field | type | example |
|---|---|---|
| `ask_price` | `Float` |  |
| `ask_quantity` | `Int` |  |
| `created_at` | `Int` |  |
| `currency_type` | `String` |  |
| `display_data` | `Map` |  |
| `event_id` | `Snowflake` |  |
| `expected_provider_fee` | `Float` |  |
| `expected_sleeper_fee` | `Float` |  |
| `expected_total_fee` | `Float` |  |
| `fee_function_id` | `String` |  |
| `fee_params` | `Map` |  |
| `fulfilled_order` | `Json` |  |
| `market_id` | `Snowflake` |  |
| `market_ticker` | `String` |  |
| `order_id` | `Snowflake` |  |
| `order_type` | `String` |  |
| `provider_fee` | `Float` |  |
| `side` | `String` |  |
| `sleeper_fee` | `Float` |  |
| `status` | `String` |  |
| `total_fee` | `Float` |  |
| `user_id` | `Snowflake` |  |

## Winnings

Fields with an observed example: 1/2.

| field | type | example |
|---|---|---|
| `contests_won` | `Int` | `0` |
| `money_won` | `Map` |  |

## UserProfile

Fields with an observed example: 0/14.

| field | type | example |
|---|---|---|
| `address1` | `String` |  |
| `address2` | `String` |  |
| `cftc_questionnaire_answered` | `Boolean` |  |
| `city` | `String` |  |
| `country_code` | `String` |  |
| `date_of_birth` | `String` |  |
| `document_verification` | `Boolean` |  |
| `first_name` | `String` |  |
| `last_name` | `String` |  |
| `national_id4` | `String` |  |
| `national_id_verification` | `String` |  |
| `postal_code` | `String` |  |
| `region` | `String` |  |
| `user_id` | `String` |  |

## Passkey

Fields with an observed example: 0/4.

| field | type | example |
|---|---|---|
| `authenticator_name` | `String` |  |
| `created` | `Int` |  |
| `passkey_id` | `String` |  |
| `user_id` | `Snowflake` |  |

## IpLocation

Fields with an observed example: 3/3.

| field | type | example |
|---|---|---|
| `ip_city` | `String` | `"Troy"` |
| `ip_country_code` | `String` | `"US"` |
| `ip_region_codes` | `[String]` | `["MI"]` |

## OnboardingReward

Fields with an observed example: 5/5.

| field | type | example |
|---|---|---|
| `create_league` | `Boolean` | `false` |
| `demo_draft` | `Boolean` | `false` |
| `invite_friends` | `Boolean` | `false` |
| `learn` | `Boolean` | `false` |
| `mock_draft` | `Boolean` | `false` |

## UserQuest

Fields with an observed example: 0/11.

| field | type | example |
|---|---|---|
| `created` | `Int` |  |
| `event` | `String` |  |
| `event_reqs` | `Map` |  |
| `expires_at` | `Int` |  |
| `promo` | `Map` |  |
| `quest_id` | `String` |  |
| `quest_reqs` | `Map` |  |
| `state` | `Map` |  |
| `status` | `String` |  |
| `user_id` | `Snowflake` |  |
| `version` | `String` |  |

## UserPool

Fields with an observed example: 0/7.

| field | type | example |
|---|---|---|
| `created` | `Int` |  |
| `metadata` | `Map` |  |
| `pool_id` | `Snowflake` |  |
| `pool_type` | `String` |  |
| `sport` | `String` |  |
| `status` | `String` |  |
| `user_id` | `Snowflake` |  |

## DailyDraftContest

Fields with an observed example: 0/8.

| field | type | example |
|---|---|---|
| `contest_id` | `Snowflake` |  |
| `contest_type` | `String` |  |
| `metadata` | `Map` |  |
| `pool_ids` | `SnowflakeSet` |  |
| `results` | `MapWithSnowflakeKey` |  |
| `sport` | `String` |  |
| `status` | `String` |  |
| `team_ids` | `SnowflakeSet` |  |

## DailyDraftTeam

Fields with an observed example: 0/10.

| field | type | example |
|---|---|---|
| `draft_id` | `Snowflake` |  |
| `period` | `String` |  |
| `players` | `List` |  |
| `points` | `Map` |  |
| `sport` | `String` |  |
| `status` | `String` |  |
| `team_id` | `Snowflake` |  |
| `total_points` | `Float` |  |
| `total_projections` | `Float` |  |
| `user_id` | `Snowflake` |  |

## DerbyUser

Fields with an observed example: 0/4.

| field | type | example |
|---|---|---|
| `created` | `Int` |  |
| `derby_id` | `String` |  |
| `metadata` | `Map` |  |
| `user_id` | `Snowflake` |  |

## UserDerbyPrize

Fields with an observed example: 0/15.

| field | type | example |
|---|---|---|
| `acknowledged_at` | `Int` |  |
| `created` | `Int` |  |
| `currency_type` | `String` |  |
| `derby_end_time` | `Int` |  |
| `derby_id` | `String` |  |
| `derby_name` | `String` |  |
| `derby_start_time` | `Int` |  |
| `metadata` | `Map` |  |
| `prize_amount` | `Float` |  |
| `rank` | `Int` |  |
| `score` | `Float` |  |
| `total_entrants` | `Int` |  |
| `type` | `String` |  |
| `user_id` | `Snowflake` |  |
| `winner_count` | `Int` |  |

## FullRewardTracker

Fields with an observed example: 0/16.

| field | type | example |
|---|---|---|
| `additional_goals` | `[Int]` |  |
| `amount` | `String` |  |
| `created` | `Int` |  |
| `expires_at` | `Int` |  |
| `full_logs` | `[RewardActionLog]` |  |
| `goal` | `Int` |  |
| `graded_status` | `String` |  |
| `granted_reward_info` | `Json` |  |
| `metadata` | `Json` |  |
| `num_logs` | `Int` |  |
| `owner_id` | `String` |  |
| `owner_type` | `String` |  |
| `pending_logs` | `[RewardActionLog]` |  |
| `reward_tracker_id` | `Snowflake` |  |
| `reward_type` | `String` |  |
| `version` | `String` |  |

## RewardActionLog

Fields with an observed example: 0/11.

| field | type | example |
|---|---|---|
| `action` | `String` |  |
| `created` | `Int` |  |
| `full_parlay` | `Parlay` |  |
| `line` | `Line` |  |
| `metadata` | `Json` |  |
| `parlay_currency_amount` | `Float` |  |
| `parlay_currency_type` | `String` |  |
| `reward_action_log_id` | `Snowflake` |  |
| `reward_tracker_id` | `Snowflake` |  |
| `reward_type` | `String` |  |
| `user_id` | `Snowflake` |  |

## RewardTrackerInfo

Fields with an observed example: 0/3.

| field | type | example |
|---|---|---|
| `created` | `Int` |  |
| `expires_at` | `Int` |  |
| `reward_tracker_id` | `Snowflake` |  |

## LeagueDuesConfig

Fields with an observed example: 4/17.

| field | type | example |
|---|---|---|
| `amount` | `Int` |  |
| `balance` | `Float` |  |
| `created_at` | `Int` |  |
| `created_by` | `Snowflake` |  |
| `currency_type` | `String` |  |
| `dues_type` | `String` | `"sleeper_safe"` |
| `enabled` | `Boolean` | `false` |
| `league_id` | `Snowflake` |  |
| `notes` | `String` |  |
| `notes_text_map` | `Json` |  |
| `payment_deadline` | `Int` | `1788999600000` |
| `reminders_enabled` | `Boolean` |  |
| `season_dues` | `Map` |  |
| `settings` | `Map` |  |
| `status` | `String` | `"draft"` |
| `updated_at` | `Int` |  |
| `updated_by` | `Snowflake` |  |

## LeagueDuesUser

Fields with an observed example: 0/6.

| field | type | example |
|---|---|---|
| `created_at` | `Int` |  |
| `created_by` | `Snowflake` |  |
| `paid_status` | `String` |  |
| `updated_at` | `Int` |  |
| `updated_by` | `Snowflake` |  |
| `user_id` | `Snowflake` |  |

## LeagueDueUsersWithHash

Fields with an observed example: 1/2.

| field | type | example |
|---|---|---|
| `hash` | `String` | `"13708901"` |
| `league_dues_users` | `[LeagueDuesUser]` |  |

## LeagueDuesRosterOwed

Fields with an observed example: 3/4.

| field | type | example |
|---|---|---|
| `owner_id` | `Snowflake` | `"<user_10>"` |
| `paid_status` | `String` | `"unpaid"` |
| `roster_id` | `Int` | `8` |
| `seasons` | `[LeagueDuesSeasonPaid]` |  |

## LeagueDuesSeasonPaid

Fields with an observed example: 0/4.

| field | type | example |
|---|---|---|
| `amount_owed` | `Float` |  |
| `amount_paid` | `Float` |  |
| `season` | `String` |  |
| `season_dues` | `Float` |  |

## LeagueDuesTransaction

Fields with an observed example: 0/12.

| field | type | example |
|---|---|---|
| `created_at` | `Int` |  |
| `currency_amount` | `Float` |  |
| `currency_type` | `String` |  |
| `league_id` | `Snowflake` |  |
| `metadata` | `Json` |  |
| `paid_for_user_id` | `Snowflake` |  |
| `payout_config_id` | `Snowflake` |  |
| `payout_plan_id` | `String` |  |
| `reference_id` | `String` |  |
| `status` | `String` |  |
| `transaction_type` | `String` |  |
| `user_id` | `Snowflake` |  |

## LeagueDuesPaymentMethod

Fields with an observed example: 0/9.

| field | type | example |
|---|---|---|
| `base_fee` | `Float` |  |
| `confirmed` | `Boolean` |  |
| `display_data` | `Map` |  |
| `fee_percentage` | `Float` |  |
| `label` | `String` |  |
| `name` | `String` |  |
| `provider` | `String` |  |
| `status` | `String` |  |
| `type` | `String` |  |

## LeagueDuesPaymentResult

Fields with an observed example: 0/10.

| field | type | example |
|---|---|---|
| `amount` | `Float` |  |
| `checkout_url` | `String` |  |
| `dues_amount` | `Float` |  |
| `dues_user` | `LeagueDuesUser` |  |
| `fee_amount` | `Float` |  |
| `season` | `String` |  |
| `status` | `String` |  |
| `total_amount` | `Float` |  |
| `transaction_ref` | `String` |  |
| `wallet_amount` | `Float` |  |

## LeagueDuesPayoutConfig

Fields with an observed example: 0/14.

| field | type | example |
|---|---|---|
| `config_hash` | `String` |  |
| `created_at` | `Int` |  |
| `created_by` | `Snowflake` |  |
| `league_id` | `Snowflake` |  |
| `metadata` | `Json` |  |
| `payout_config_id` | `Snowflake` |  |
| `payout_criteria` | `String` |  |
| `payout_interval` | `String` |  |
| `payout_structure` | `Map` |  |
| `review_window_hours` | `Int` |  |
| `status` | `String` |  |
| `updated_at` | `Int` |  |
| `updated_by` | `Snowflake` |  |
| `voting_threshold` | `Float` |  |

## LeagueDuesPayoutPlan

Fields with an observed example: 0/13.

| field | type | example |
|---|---|---|
| `created_at` | `Int` |  |
| `execute_bucket` | `Int` |  |
| `league_id` | `Snowflake` |  |
| `metadata` | `Json` |  |
| `notes` | `String` |  |
| `notes_text_map` | `Json` |  |
| `payees` | `MapWithSnowflakeKeyValue` |  |
| `payout_config_id` | `Snowflake` |  |
| `payout_plan_id` | `String` |  |
| `payout_structure` | `Map` |  |
| `poll_id` | `Snowflake` |  |
| `status` | `String` |  |
| `updated_at` | `Int` |  |

## LeagueDuesPayoutPoll

Fields with an observed example: 0/4.

| field | type | example |
|---|---|---|
| `attachment` | `String` |  |
| `message_id` | `Snowflake` |  |
| `parent_id` | `Snowflake` |  |
| `text` | `String` |  |

## MatchmakingLobby

Fields with an observed example: 13/15.

| field | type | example |
|---|---|---|
| `commitment` | `Float` | `50` |
| `current_players` | `Int` | `2` |
| `custom_tags` | `Set` |  |
| `display_icon` | `String` |  |
| `game` | `String` | `"fantasy_nfl"` |
| `game_bucket` | `String` | `"regular_2026"` |
| `is_open` | `Boolean` | `true` |
| `join_type` | `Int` | `2` |
| `lobby_id` | `Snowflake` | `"1369071214827429888"` |
| `max_players` | `Int` | `12` |
| `message` | `String` | `"<redacted text>"` |
| `metadata` | `Map` | `{"best_ball": 0, "waiver_budget": 250, "disable_adds": 0, "divisions": 3, "capacity_override": 0, "waiver_bid_...` |
| `owner_id` | `Snowflake` | `"<user_75>"` |
| `tags` | `Map` | `{"best_ball": "0", "draft_type": "snake", "game_mode": "0", "scoring_type": "ppr", "type": "dynasty"}` |
| `title` | `String` | `"Olympus⚡️"` |

## MatchmakingUser

Fields with an observed example: 0/14.

| field | type | example |
|---|---|---|
| `avatar` | `String` |  |
| `commitment_high` | `Float` |  |
| `commitment_low` | `Float` |  |
| `custom_tags` | `Set` |  |
| `display_name` | `String` |  |
| `game` | `String` |  |
| `game_bucket` | `String` |  |
| `is_open` | `Boolean` |  |
| `message` | `String` |  |
| `metadata` | `Map` |  |
| `player_count` | `Set` |  |
| `tags` | `Map` |  |
| `user_id` | `Snowflake` |  |
| `username` | `String` |  |

## MatchmakingLeagueActivity

Fields with an observed example: 0/2.

| field | type | example |
|---|---|---|
| `since` | `Int` |  |
| `totals` | `Map` |  |

## LeagueGroup

Fields with an observed example: 0/19.

| field | type | example |
|---|---|---|
| `avatar` | `String` |  |
| `channel_id` | `Snowflake` |  |
| `company_id` | `Snowflake` |  |
| `description` | `String` |  |
| `draft_settings` | `Map` |  |
| `group_id` | `Snowflake` |  |
| `group_settings` | `Map` |  |
| `metadata` | `Map` |  |
| `name` | `String` |  |
| `num_leagues` | `Int` |  |
| `proj_earnings` | `Int` |  |
| `roster_positions` | `List` |  |
| `scoring_settings` | `Map` |  |
| `season` | `String` |  |
| `season_type` | `String` |  |
| `settings` | `Map` |  |
| `sport` | `String` |  |
| `users_in_leagues` | `Int` |  |
| `users_in_queue` | `Int` |  |

## LeagueManualHistory

Fields with an observed example: 0/5.

| field | type | example |
|---|---|---|
| `import_data` | `Map` |  |
| `league_notes` | `List` |  |
| `season` | `String` |  |
| `season_standings` | `List` |  |
| `top_standings` | `Map` |  |

## LeagueHistoryImport

Fields with an observed example: 0/17.

| field | type | example |
|---|---|---|
| `archive_fingerprint` | `String` |  |
| `archive_s3_key` | `String` |  |
| `archive_sha256` | `String` |  |
| `archive_url` | `String` |  |
| `created` | `Int` |  |
| `draft_id` | `Snowflake` |  |
| `error` | `String` |  |
| `import_id` | `Snowflake` |  |
| `league` | `League` |  |
| `league_id` | `Snowflake` |  |
| `provider` | `String` |  |
| `provider_league_id` | `String` |  |
| `schema_version` | `Int` |  |
| `status` | `String` |  |
| `summary` | `Map` |  |
| `updated_at` | `Int` |  |
| `user_id` | `Snowflake` |  |

## Company

Fields with an observed example: 0/5.

| field | type | example |
|---|---|---|
| `avatar` | `String` |  |
| `company_id` | `Snowflake` |  |
| `description` | `String` |  |
| `name` | `String` |  |
| `shortcode` | `String` |  |

## CompanyUser

Fields with an observed example: 0/7.

| field | type | example |
|---|---|---|
| `avatar` | `String` |  |
| `company_id` | `Snowflake` |  |
| `display_name` | `String` |  |
| `is_bot` | `Boolean` |  |
| `is_owner` | `Boolean` |  |
| `real_name` | `String` |  |
| `user_id` | `Snowflake` |  |

## Item

Fields with an observed example: 0/4.

| field | type | example |
|---|---|---|
| `archetype` | `String` |  |
| `created` | `Int` |  |
| `item_id` | `Snowflake` |  |
| `item_type_id` | `String` |  |

## ItemType

Fields with an observed example: 5/5.

| field | type | example |
|---|---|---|
| `archetype` | `String` | `"mascot"` |
| `config` | `Map` | `{"cookie_cost": 10, "assets_url": "https://sleepercdn.com/images/mascots_v2/01_GoldFish", "rarity_class": "1",...` |
| `id` | `String` | `"goldfish"` |
| `name` | `String` | `"Goldfish"` |
| `type` | `String` | `"goldfish"` |

## Purchase

Fields with an observed example: 0/4.

| field | type | example |
|---|---|---|
| `created` | `String` |  |
| `product_id` | `String` |  |
| `receipt_id` | `String` |  |
| `store_type` | `String` |  |

## UserRoster

Fields with an observed example: 0/12.

| field | type | example |
|---|---|---|
| `metadata` | `Map` |  |
| `player_map` | `Map` |  |
| `players` | `Set` |  |
| `roster_id` | `Snowflake` |  |
| `roster_positions` | `List` |  |
| `scoring_settings` | `Map` |  |
| `season` | `String` |  |
| `season_type` | `String` |  |
| `settings` | `Map` |  |
| `sport` | `String` |  |
| `starters` | `List` |  |
| `user_id` | `Snowflake` |  |

## UserTipTransactionLog

Fields with an observed example: 0/9.

| field | type | example |
|---|---|---|
| `created` | `Int` |  |
| `currency_amount` | `Float` |  |
| `currency_type` | `String` |  |
| `metadata` | `Map` |  |
| `receiver_user_id` | `Snowflake` |  |
| `reference_action` | `String` |  |
| `reference_id` | `String` |  |
| `reference_type` | `String` |  |
| `sender_user_id` | `Snowflake` |  |

## ResponsibleGamingLimit

Fields with an observed example: 0/4.

| field | type | example |
|---|---|---|
| `amount` | `Int` |  |
| `created` | `Int` |  |
| `expiration` | `Int` |  |
| `frequency` | `String` |  |

## TopTabContentGroup

Fields with an observed example: 0/5.

| field | type | example |
|---|---|---|
| `content` | `[Map]` |  |
| `content_type` | `String` |  |
| `key` | `String` |  |
| `name` | `String` |  |
| `sport` | `String` |  |

## DiscoveredContact

Fields with an observed example: 0/6.

| field | type | example |
|---|---|---|
| `email` | `String` |  |
| `name` | `String` |  |
| `num_associates` | `Int` |  |
| `num_mutual_associates` | `Int` |  |
| `phone` | `String` |  |
| `user` | `User` |  |

## CcDepositResult

Fields with an observed example: 0/1.

| field | type | example |
|---|---|---|
| `url` | `String` |  |

## InteractiveBankDepositResult

Fields with an observed example: 0/2.

| field | type | example |
|---|---|---|
| `ip` | `String` |  |
| `url` | `String` |  |

## PossibleMultipliers

Fields with an observed example: 0/4.

| field | type | example |
|---|---|---|
| `lost0` | `String` |  |
| `lost1` | `String` |  |
| `lost2` | `String` |  |
| `team_pick_lost` | `String` |  |

## UpdateSquadBankGradingModeResult

Fields with an observed example: 0/2.

| field | type | example |
|---|---|---|
| `current_squad_bank_updated` | `Boolean` |  |
| `league` | `League` |  |

## Input objects

### AuthenticatorResponseInput

| field | type |
|---|---|
| `public_key` | `String` |
| `signature` | `String` |
| `attestation_object` | `String` |
| `authenticator_data` | `String` |
| `client_data_json` | `String` |
| `public_key_algorithm` | `Int` |
| `transports` | `[String]` |
| `user_handle` | `String` |

### CheckResponsibleGamingLimitInput

| field | type |
|---|---|
| `identifier` | `String` |
| `amount` | `Int` |
| `limit_scope` | `String` |

### ClientPossibleMultipliers

| field | type |
|---|---|
| `lost0` | `String` |
| `lost1` | `String` |
| `lost2` | `String` |
| `team_pick_lost` | `String` |

### ContactInfo

| field | type |
|---|---|
| `name` | `String` |
| `phone` | `String` |
| `email` | `String` |

### ContractOrderFilter

| field | type |
|---|---|
| `status` | `String` |
| `event_id` | `Snowflake` |
| `market_id` | `Snowflake` |
| `order_type` | `String` |
| `end_date` | `Int` |
| `start_date` | `Int` |

### InputPickemPick

| field | type |
|---|---|
| `outcome` | `String` |
| `team` | `String` |
| `game_id` | `String` |
| `updated_at` | `Int` |

### InputPickemTiebreaker

| field | type |
|---|---|
| `type` | `String` |
| `value` | `Int` |
| `game_id` | `String` |

### LeagueDuesPayeeInput

| field | type |
|---|---|
| `user_id` | `Snowflake!` |
| `rank` | `Int!` |

### LeagueDuesPayoutChangeInput

| field | type |
|---|---|
| `payout_config_id` | `Snowflake!` |
| `payout_structure` | `Json!` |
| `payout_plan_id` | `String!` |
| `payees` | `[LeagueDuesPayeeInput]!` |

### LeagueDuesPayoutConfigInput

| field | type |
|---|---|
| `status` | `String` |
| `review_window_hours` | `Int` |
| `payout_config_id` | `Snowflake` |
| `config_hash` | `String` |
| `max_week` | `Int` |
| `payout_criteria` | `String!` |
| `payout_interval` | `String!` |
| `payout_structure` | `Json!` |
| `governance` | `String` |
| `voting_threshold` | `Float` |

### LeagueDuesTransactionFilterInput

| field | type |
|---|---|
| `user_id` | `Snowflake` |
| `payout_config_id` | `Snowflake` |
| `transaction_type` | `String` |
| `target_season` | `String` |

### LeagueDuesUserInput

| field | type |
|---|---|
| `user_id` | `Snowflake!` |
| `paid_status` | `String!` |

### Location

| field | type |
|---|---|
| `country` | `String` |
| `region` | `String` |
| `latitude` | `Float` |
| `longitude` | `Float` |

### OfflineWithdrawalAchInfo

| field | type |
|---|---|
| `account_number` | `String` |
| `bank_name` | `String` |
| `name_on_account` | `String` |
| `routing_number` | `String` |

### OfflineWithdrawalPaperCheckInfo

| field | type |
|---|---|
| `state` | `String` |
| `zip` | `String` |
| `city` | `String` |
| `address1` | `String` |
| `address2` | `String` |

### PaymentMethodInput

| field | type |
|---|---|
| `label` | `String` |
| `name` | `String` |
| `type` | `String` |
| `provider` | `String` |

### PlayoffMatchOverride

| field | type |
|---|---|
| `match` | `Int!` |
| `round` | `Int!` |
| `team1` | `Int` |
| `team2` | `Int` |

### PublicKeyCredentialInput

| field | type |
|---|---|
| `id` | `String` |
| `type` | `String` |
| `response` | `AuthenticatorResponseInput` |
| `authenticator_attachment` | `String` |
| `raw_id` | `String` |

### UserFlair

| field | type |
|---|---|
| `subject_id` | `String` |
| `sport` | `String` |
| `subject_type` | `String` |
