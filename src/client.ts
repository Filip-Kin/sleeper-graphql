// Typed client for Sleeper's undocumented GraphQL API (https://sleeper.app/graphql).
//
// The transport is deliberately small: you give it a fetch-compatible function
// and a token, it posts {query, variables} and hands back {data, errors}. Every
// helper below uses GraphQL variables (verified to work against the live server
// on 2026-09-09), so ids are never spliced into query text.
//
// Read-only helpers only. Mutations are documented in docs/mutations.md; add
// them on your side with the same transport.

// #region transport

export type FetchLike = (input: string, init: RequestInit) => Promise<Response>;

export interface GqlError {
  code?: string;
  message: string;
  path?: (string | number)[];
  locations?: { line: number; column: number }[];
}

export interface GqlResponse<T> {
  data?: T;
  errors?: GqlError[];
}

export type Variables = Record<string, unknown>;

/** One GraphQL round trip. `T` is the shape of `data`. */
export type Gql = <T>(query: string, variables?: Variables) => Promise<GqlResponse<T>>;

export interface TransportOptions {
  /** Bearer token from `localStorage.token` in the web app, or the `token` field of the `login` query. Omit for public reads. */
  token?: string;
  /** Defaults to globalThis.fetch. Pass a wrapper that goes through a logged-in browser page if you want the site's origin on the request. */
  fetch?: FetchLike;
  endpoint?: string;
  headers?: Record<string, string>;
}

export class SleeperTransportError extends Error {
  readonly status: number;
  constructor(status: number, body: string) {
    super(`sleeper graphql: HTTP ${status}: ${body.slice(0, 200)}`);
    this.name = "SleeperTransportError";
    this.status = status;
  }
}

export class SleeperGraphQLError extends Error {
  readonly errors: GqlError[];
  constructor(field: string, errors: GqlError[]) {
    const first = errors[0];
    super(`sleeper graphql ${field}: ${first?.code ?? ""} ${first?.message ?? "unknown error"}`.trim());
    this.name = "SleeperGraphQLError";
    this.errors = errors;
  }
}

export const DEFAULT_ENDPOINT = "https://sleeper.app/graphql";

export function createTransport(opts: TransportOptions = {}): Gql {
  const doFetch: FetchLike = opts.fetch ?? ((input, init) => fetch(input, init));
  const endpoint = opts.endpoint ?? DEFAULT_ENDPOINT;
  return async <T>(query: string, variables?: Variables): Promise<GqlResponse<T>> => {
    const headers: Record<string, string> = { "content-type": "application/json", ...opts.headers };
    if (opts.token) headers.authorization = opts.token;
    const res = await doFetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(variables ? { query, variables } : { query }),
    });
    const text = await res.text();
    if (!res.ok) throw new SleeperTransportError(res.status, text);
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      // The server answers some bad requests with an HTML page and HTTP 200.
      throw new SleeperTransportError(res.status, text);
    }
    return parsed as GqlResponse<T>;
  };
}

/** Pull one root field out of a response, or throw with the server's error. */
export function unwrap<T>(res: GqlResponse<Record<string, T>>, field: string): T {
  if (res.errors && res.errors.length > 0) throw new SleeperGraphQLError(field, res.errors);
  const value = res.data?.[field];
  if (value === undefined) throw new SleeperGraphQLError(field, [{ message: "field missing from response" }]);
  return value;
}

// #endregion

// #region types

/** Numeric id serialised as a string. */
export type Snowflake = string;

/** The mini player record Sleeper embeds in `player_map` fields. */
export interface PlayerMapEntry {
  player_id: string;
  first_name: string | null;
  last_name: string | null;
  position: string | null;
  team: string | null;
  status: string | null;
  injury_status: string | null;
  fantasy_positions: string[] | null;
  number: number | null;
  years_exp: number | null;
  news_updated: number | null;
}

export interface RosterSettings {
  wins: number;
  losses: number;
  ties: number;
  fpts: number;
  fpts_decimal: number;
  fpts_against?: number;
  fpts_against_decimal?: number;
  waiver_position: number;
  waiver_budget_used: number;
  total_moves: number;
}

export interface Roster {
  roster_id: number;
  league_id: Snowflake;
  owner_id: Snowflake | null;
  co_owners: Snowflake[] | null;
  players: string[] | null;
  starters: string[] | null;
  reserve: string[] | null;
  taxi: string[] | null;
  keepers: string[] | null;
  settings: RosterSettings | null;
  metadata: Record<string, string> | null;
  player_map: Record<string, PlayerMapEntry> | null;
}

export interface MatchupLeg {
  league_id: Snowflake;
  roster_id: number;
  matchup_id: number | null;
  round: number;
  leg: number;
  points: number | null;
  proj_points: number | null;
  max_points: number | null;
  custom_points: number | null;
  players: string[] | null;
  starters: string[] | null;
  starters_games: Record<string, string> | null;
  subs: Record<string, unknown> | null;
  player_map: Record<string, PlayerMapEntry> | null;
}

export interface Player {
  player_id: string;
  first_name: string | null;
  last_name: string | null;
  position: string | null;
  fantasy_positions: string[] | null;
  team: string | null;
  status: string | null;
  active: boolean | null;
  injury_status: string | null;
  injury_body_part: string | null;
  injury_notes: string | null;
  injury_start_date: string | null;
  practice_participation: string | null;
  practice_description: string | null;
  depth_chart_order: number | null;
  depth_chart_position: string | null;
  number: number | null;
  age: number | null;
  years_exp: number | null;
  team_changed_at: number | null;
  metadata: Record<string, string> | null;
}

export type TransactionStatus = "proposed" | "complete" | "rejected" | "failed" | (string & {});
export type TransactionType = "trade" | "free_agent" | "waiver" | (string & {});

export interface LeagueTransaction {
  transaction_id: Snowflake;
  league_id: Snowflake;
  type: TransactionType;
  status: TransactionStatus;
  leg: number;
  created: number;
  status_updated: number | null;
  creator: Snowflake | null;
  roster_ids: number[] | null;
  consenter_ids: number[] | null;
  /** player_id -> roster_id that receives the player */
  adds: Record<string, number> | null;
  /** player_id -> roster_id that loses the player */
  drops: Record<string, number> | null;
  draft_picks: unknown[] | null;
  waiver_budget: unknown[] | null;
  settings: Record<string, number> | null;
  metadata: Record<string, string> | null;
  player_map: Record<string, PlayerMapEntry> | null;
}

export interface DmRecentUser {
  user_id: Snowflake;
  display_name: string | null;
  avatar: string | null;
  is_bot: boolean | null;
}

export interface Dm {
  dm_id: Snowflake;
  dm_type: "single" | "group" | (string & {});
  title: string | null;
  last_message_id: Snowflake | null;
  last_message_time: number | null;
  last_message_text: string | null;
  last_message_attachment: unknown;
  last_author_id: Snowflake | null;
  last_author_display_name: string | null;
  last_read_id: Snowflake | null;
  recent_users: DmRecentUser[] | null;
  hidden_at: Snowflake | null;
  deleted_at: Snowflake | null;
}

export interface Message {
  message_id: Snowflake;
  parent_id: Snowflake;
  parent_type: "dm" | "league" | "draft" | (string & {});
  author_id: Snowflake | null;
  author_display_name: string | null;
  author_is_bot: boolean | null;
  created: number;
  edited: number | null;
  /** HTML-escaped by the server (an apostrophe reads back as `&#39;`). */
  text: string | null;
  attachment: unknown;
  pinned: boolean | null;
  reactions: Record<string, number> | null;
}

export interface SportInfo {
  week: number;
  leg: number;
  season: string;
  season_type: string;
  league_season: string;
  previous_season: string;
  season_start_date: string;
  display_week: number;
  league_create_season: string;
  season_has_scores: boolean;
}

export interface PlayerWeekStat {
  player_id: string;
  category: "stat" | "proj" | (string & {});
  week: number | null;
  season: string;
  season_type: string;
  game_id: string | null;
  opponent: string | null;
  team: string | null;
  date: string | null;
  company: string | null;
  updated_at: number | null;
  stats: Record<string, number>;
}

// #endregion

// #region selections

const PLAYER_MAP_SEL = "player_map";

export const ROSTER_SEL = `roster_id league_id owner_id co_owners players starters reserve taxi keepers settings metadata ${PLAYER_MAP_SEL}`;
export const MATCHUP_LEG_SEL = `league_id roster_id matchup_id round leg points proj_points max_points custom_points players starters starters_games subs ${PLAYER_MAP_SEL}`;
export const PLAYER_SEL =
  "player_id first_name last_name position fantasy_positions team status active injury_status injury_body_part injury_notes injury_start_date practice_participation practice_description depth_chart_order depth_chart_position number age years_exp team_changed_at metadata";
export const TRANSACTION_SEL =
  "transaction_id league_id type status leg created status_updated creator roster_ids consenter_ids adds drops draft_picks waiver_budget settings metadata player_map";
export const DM_SEL =
  "dm_id dm_type title last_message_id last_message_time last_message_text last_message_attachment last_author_id last_author_display_name last_read_id recent_users hidden_at deleted_at";
export const MESSAGE_SEL = "message_id parent_id parent_type author_id author_display_name author_is_bot created edited text attachment pinned reactions";
export const SPORT_INFO_SEL = "week leg season season_type league_season previous_season season_start_date display_week league_create_season season_has_scores";
export const STAT_SEL = "player_id category week season season_type game_id opponent team date company updated_at stats";

// #endregion

// #region helpers

/** Uncached replacement for REST /league/{id}/rosters, with `player_map` (injury status per rostered player). */
export async function leagueRosters(gql: Gql, leagueId: Snowflake): Promise<Roster[]> {
  const res = await gql<{ league_rosters: Roster[] }>(
    `query($league_id: Snowflake!){league_rosters(league_id:$league_id){${ROSTER_SEL}}}`,
    { league_id: leagueId },
  );
  return unwrap(res, "league_rosters");
}

/** Uncached replacement for REST /league/{id}/matchups/{week}, with projections and `player_map`. */
export async function matchupLegs(gql: Gql, leagueId: Snowflake, round: number): Promise<MatchupLeg[]> {
  const res = await gql<{ matchup_legs: MatchupLeg[] }>(
    `query($league_id: Snowflake!, $round: Int!){matchup_legs(league_id:$league_id, round:$round){${MATCHUP_LEG_SEL}}}`,
    { league_id: leagueId, round },
  );
  return unwrap(res, "matchup_legs");
}

/** Largest alias batch verified in one request (60 returned in 91 ms with no nulls). */
export const PLAYER_BATCH_SIZE = 60;

/** Fresh player records by id, batched with aliases. Unknown ids come back as null. */
export async function getPlayers(gql: Gql, playerIds: readonly string[], sport = "nfl"): Promise<Record<string, Player | null>> {
  const out: Record<string, Player | null> = {};
  const unique = [...new Set(playerIds)];
  for (let i = 0; i < unique.length; i += PLAYER_BATCH_SIZE) {
    const chunk = unique.slice(i, i + PLAYER_BATCH_SIZE);
    const vars: Variables = { sport };
    const fields = chunk.map((id, n) => {
      vars[`p${n}`] = id;
      return `p${n}:get_player(sport:$sport, player_id:$p${n}){${PLAYER_SEL}}`;
    });
    const decls = chunk.map((_, n) => `$p${n}: String!`).join(", ");
    const res = await gql<Record<string, Player | null>>(`query($sport: String!, ${decls}){${fields.join(" ")}}`, vars);
    if (res.errors && res.errors.length > 0) throw new SleeperGraphQLError("get_player", res.errors);
    chunk.forEach((id, n) => {
      out[id] = res.data?.[`p${n}`] ?? null;
    });
  }
  return out;
}

/** Transactions in one week by status. Use "proposed" for pending trade offers; REST never lists them. */
export async function leagueTransactionsByStatus(
  gql: Gql,
  leagueId: Snowflake,
  status: TransactionStatus,
  leg: number,
): Promise<LeagueTransaction[]> {
  const res = await gql<{ league_transactions_by_status: LeagueTransaction[] }>(
    `query($league_id: Snowflake!, $status: String!, $leg: Int!){league_transactions_by_status(league_id:$league_id, status:$status, leg:$leg){${TRANSACTION_SEL}}}`,
    { league_id: leagueId, status, leg },
  );
  return unwrap(res, "league_transactions_by_status");
}

export interface MyDmsOptions {
  limit?: number;
  unread?: boolean;
}

/** DM threads for the token's user. Requires a token. */
export async function myDms(gql: Gql, opts: MyDmsOptions = {}): Promise<Dm[]> {
  const res = await gql<{ my_dms: Dm[] }>(`query($limit: Int, $unread: Boolean){my_dms(limit:$limit, unread:$unread){${DM_SEL}}}`, {
    limit: opts.limit ?? null,
    unread: opts.unread ?? null,
  });
  return unwrap(res, "my_dms");
}

export interface MessagesOptions {
  /** Return messages older than this message id. */
  before?: Snowflake;
  orderBy?: "asc" | "desc";
}

/** Messages in a DM, league chat or draft chat. Reading does not mark them read. */
export async function messages(gql: Gql, parentId: Snowflake, opts: MessagesOptions = {}): Promise<Message[]> {
  const res = await gql<{ messages: Message[] }>(
    `query($parent_id: Snowflake!, $before: Snowflake, $order_by: String){messages(parent_id:$parent_id, before:$before, order_by:$order_by){${MESSAGE_SEL}}}`,
    { parent_id: parentId, before: opts.before ?? null, order_by: opts.orderBy ?? "desc" },
  );
  return unwrap(res, "messages");
}

/** Current week and season, same data as REST /state/{sport}. */
export async function sportInfo(gql: Gql, sport = "nfl"): Promise<SportInfo> {
  const res = await gql<{ sport_info: SportInfo }>(`query($sport: String!){sport_info(sport:$sport)}`, { sport });
  return unwrap(res, "sport_info");
}

/** Stats ("stat") or projections ("proj") for a list of players in one week. */
export async function statsForPlayersInWeek(
  gql: Gql,
  playerIds: readonly string[],
  opts: { season: string; week: number; category?: "stat" | "proj"; sport?: string; seasonType?: string },
): Promise<PlayerWeekStat[]> {
  const res = await gql<{ stats_for_players_in_week: PlayerWeekStat[] }>(
    `query($category: String!, $week: Int!, $sport: String!, $season_type: String!, $season: String!, $player_ids: [String]){stats_for_players_in_week(category:$category, week:$week, sport:$sport, season_type:$season_type, season:$season, player_ids:$player_ids){${STAT_SEL}}}`,
    {
      category: opts.category ?? "proj",
      week: opts.week,
      sport: opts.sport ?? "nfl",
      season_type: opts.seasonType ?? "regular",
      season: opts.season,
      player_ids: [...playerIds],
    },
  );
  return unwrap(res, "stats_for_players_in_week");
}

/** Decode the HTML entities Sleeper stores in message text. */
export function decodeEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCodePoint(Number(n)))
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

// #endregion
