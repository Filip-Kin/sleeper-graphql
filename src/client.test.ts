import { describe, expect, test } from "bun:test";
import {
  createTransport,
  decodeEntities,
  getPlayers,
  leagueRosters,
  leagueTransactionsByStatus,
  matchupLegs,
  messages,
  myDms,
  PLAYER_BATCH_SIZE,
  SleeperGraphQLError,
  SleeperTransportError,
  sportInfo,
  statsForPlayersInWeek,
  unwrap,
  type FetchLike,
  type Gql,
  type GqlResponse,
} from "./client.ts";

// #region fixtures (shapes copied from live responses, ids and names replaced)

const ROSTER_FIXTURE = {
  data: {
    league_rosters: [
      {
        roster_id: 3,
        league_id: "1000000000000000001",
        owner_id: "2000000000000000001",
        co_owners: null,
        players: ["4983", "2747", "SEA"],
        starters: ["4983", "SEA"],
        reserve: null,
        taxi: null,
        keepers: null,
        settings: { fpts: 0, fpts_decimal: 0, losses: 0, ties: 0, total_moves: 0, waiver_budget_used: 0, waiver_position: 6, wins: 0 },
        metadata: null,
        player_map: {
          "4983": {
            player_id: "4983",
            first_name: "DJ",
            last_name: "Moore",
            position: "WR",
            team: "BUF",
            status: "Active",
            injury_status: null,
            fantasy_positions: ["WR"],
            number: 2,
            years_exp: 8,
            news_updated: 1788880849707,
          },
        },
      },
    ],
  },
};

const MATCHUP_FIXTURE = {
  data: {
    matchup_legs: [
      {
        league_id: "1000000000000000001",
        roster_id: 1,
        matchup_id: 2,
        round: 1,
        leg: 1,
        points: null,
        proj_points: null,
        max_points: null,
        custom_points: null,
        players: ["11560", "2747"],
        starters: ["11560", "2747"],
        starters_games: null,
        subs: null,
        player_map: null,
      },
    ],
  },
};

const TX_FIXTURE = {
  data: {
    league_transactions_by_status: [
      {
        transaction_id: "3000000000000000001",
        league_id: "1000000000000000001",
        type: "trade",
        status: "proposed",
        leg: 1,
        created: 1788986431814,
        status_updated: null,
        creator: "2000000000000000002",
        roster_ids: [3, 5],
        consenter_ids: [5],
        adds: { "1466": 3, "10859": 5 },
        drops: { "1466": 5, "10859": 3 },
        draft_picks: null,
        waiver_budget: null,
        settings: { expires_at: 1789159000 },
        metadata: null,
        player_map: null,
      },
    ],
  },
};

const DMS_FIXTURE = {
  data: {
    my_dms: [
      {
        dm_id: "4000000000000000001",
        dm_type: "single",
        title: null,
        last_message_id: "5000000000000000009",
        last_message_time: 1788986456068,
        last_message_text: "Rejected: our own lineup gains only -19.",
        last_message_attachment: null,
        last_author_id: "2000000000000000001",
        last_author_display_name: "Coach",
        last_read_id: "5000000000000000009",
        recent_users: [{ user_id: "2000000000000000001", display_name: "Coach", avatar: null, is_bot: false }],
        hidden_at: null,
        deleted_at: null,
      },
    ],
  },
};

const MESSAGES_FIXTURE = {
  data: {
    messages: [
      {
        message_id: "5000000000000000009",
        parent_id: "4000000000000000001",
        parent_type: "dm",
        author_id: "2000000000000000001",
        author_display_name: "Coach",
        author_is_bot: false,
        created: 1788986456068,
        edited: null,
        text: "It&#39;s a no from me",
        attachment: null,
        pinned: null,
        reactions: null,
      },
    ],
  },
};

const SPORT_INFO_FIXTURE = {
  data: {
    sport_info: {
      week: 1,
      leg: 1,
      season: "2026",
      season_type: "regular",
      league_season: "2026",
      previous_season: "2025",
      season_start_date: "2026-09-09",
      display_week: 1,
      league_create_season: "2026",
      season_has_scores: true,
    },
  },
};

const STATS_FIXTURE = {
  data: {
    stats_for_players_in_week: [
      {
        player_id: "4983",
        category: "proj",
        week: 1,
        season: "2026",
        season_type: "regular",
        game_id: "202610113",
        opponent: "HOU",
        team: "BUF",
        date: "2026-09-13",
        company: "rotowire",
        updated_at: null,
        stats: { pts_ppr: 12.09, pts_half_ppr: 10.02, pts_std: 7.96, rec: 4.13 },
      },
    ],
  },
};

// #endregion

interface Captured {
  url: string;
  headers: Record<string, string>;
  body: { query: string; variables?: Record<string, unknown> };
}

/** Fetch stub that records requests and answers from a queue of fixtures. */
function fakeFetch(responses: unknown[], status = 200): { fetch: FetchLike; calls: Captured[] } {
  const calls: Captured[] = [];
  const queue = [...responses];
  const fetchImpl: FetchLike = async (url, init) => {
    const body = JSON.parse(String(init.body)) as Captured["body"];
    calls.push({ url, headers: (init.headers as Record<string, string>) ?? {}, body });
    const next = queue.shift();
    const text = typeof next === "string" ? next : JSON.stringify(next ?? {});
    return new Response(text, { status, headers: { "content-type": "application/json" } });
  };
  return { fetch: fetchImpl, calls };
}

function client(responses: unknown[], token?: string): { gql: Gql; calls: Captured[] } {
  const f = fakeFetch(responses);
  return { gql: createTransport({ fetch: f.fetch, token }), calls: f.calls };
}

describe("transport", () => {
  test("posts query and variables with the token as the authorization header", async () => {
    const { gql, calls } = client([SPORT_INFO_FIXTURE], "tok-123");
    await gql("{sport_info(sport:\"nfl\")}", { a: 1 });
    expect(calls).toHaveLength(1);
    const call = calls[0]!;
    expect(call.url).toBe("https://sleeper.app/graphql");
    expect(call.headers.authorization).toBe("tok-123");
    expect(call.headers["content-type"]).toBe("application/json");
    expect(call.body.variables).toEqual({ a: 1 });
  });

  test("omits the authorization header and the variables key when not given", async () => {
    const { gql, calls } = client([SPORT_INFO_FIXTURE]);
    await gql("{sport_info(sport:\"nfl\")}");
    expect(calls[0]!.headers.authorization).toBeUndefined();
    expect("variables" in calls[0]!.body).toBe(false);
  });

  test("throws SleeperTransportError on a non-JSON body (the server sends HTML pages on some bad requests)", async () => {
    const f = fakeFetch(["<!DOCTYPE html><html></html>"]);
    const gql = createTransport({ fetch: f.fetch });
    await expect(gql("{me{user_id}}")).rejects.toBeInstanceOf(SleeperTransportError);
  });

  test("throws SleeperTransportError on HTTP errors", async () => {
    const f = fakeFetch([{ error: "nope" }], 500);
    const gql = createTransport({ fetch: f.fetch });
    await expect(gql("{me{user_id}}")).rejects.toBeInstanceOf(SleeperTransportError);
  });
});

describe("unwrap", () => {
  test("returns the named field", () => {
    expect(unwrap({ data: { x: 1 } }, "x")).toBe(1);
  });

  test("throws with the server's code and message", () => {
    const res: GqlResponse<Record<string, unknown>> = {
      data: { me: null },
      errors: [{ code: "unauthorized", message: "Unauthorized", path: ["me"] }],
    };
    expect(() => unwrap(res, "me")).toThrow(/unauthorized Unauthorized/);
    try {
      unwrap(res, "me");
    } catch (e) {
      expect(e).toBeInstanceOf(SleeperGraphQLError);
      expect((e as SleeperGraphQLError).errors[0]?.code).toBe("unauthorized");
    }
  });

  test("throws when the field is absent", () => {
    expect(() => unwrap({ data: {} }, "x")).toThrow(/field missing/);
  });
});

describe("helpers", () => {
  test("leagueRosters passes league_id as a variable and returns player_map", async () => {
    const { gql, calls } = client([ROSTER_FIXTURE]);
    const rosters = await leagueRosters(gql, "1000000000000000001");
    expect(calls[0]!.body.variables).toEqual({ league_id: "1000000000000000001" });
    expect(calls[0]!.body.query).toContain("league_rosters(league_id:$league_id)");
    expect(rosters[0]!.player_map?.["4983"]?.team).toBe("BUF");
    expect(rosters[0]!.settings?.waiver_position).toBe(6);
  });

  test("matchupLegs sends round as an Int variable", async () => {
    const { gql, calls } = client([MATCHUP_FIXTURE]);
    const legs = await matchupLegs(gql, "1000000000000000001", 1);
    expect(calls[0]!.body.variables).toEqual({ league_id: "1000000000000000001", round: 1 });
    expect(legs[0]!.matchup_id).toBe(2);
    expect(legs[0]!.points).toBeNull();
  });

  test("getPlayers aliases ids and splits into batches of 60", async () => {
    const ids = Array.from({ length: PLAYER_BATCH_SIZE + 1 }, (_, i) => String(1000 + i));
    const batch1: Record<string, unknown> = {};
    for (let i = 0; i < PLAYER_BATCH_SIZE; i++) batch1[`p${i}`] = { player_id: ids[i], team: "BUF" };
    const batch2 = { p0: null };
    const { gql, calls } = client([{ data: batch1 }, { data: batch2 }]);
    const players = await getPlayers(gql, ids);
    expect(calls).toHaveLength(2);
    expect(calls[0]!.body.query).toContain("p59:get_player(sport:$sport, player_id:$p59)");
    expect(calls[0]!.body.query).not.toContain("p60:");
    expect(calls[0]!.body.variables?.p59).toBe(ids[59]);
    expect(calls[1]!.body.variables).toEqual({ sport: "nfl", p0: ids[60] });
    expect(players[ids[0]!]?.team).toBe("BUF");
    expect(players[ids[60]!]).toBeNull();
  });

  test("getPlayers de-duplicates ids", async () => {
    const { gql, calls } = client([{ data: { p0: { player_id: "4983" } } }]);
    await getPlayers(gql, ["4983", "4983"]);
    expect(Object.keys(calls[0]!.body.variables ?? {})).toEqual(["sport", "p0"]);
  });

  test("getPlayers surfaces server errors", async () => {
    const { gql } = client([{ data: {}, errors: [{ message: "boom" }] }]);
    await expect(getPlayers(gql, ["1"])).rejects.toBeInstanceOf(SleeperGraphQLError);
  });

  test("leagueTransactionsByStatus reads proposed trades", async () => {
    const { gql, calls } = client([TX_FIXTURE]);
    const tx = await leagueTransactionsByStatus(gql, "1000000000000000001", "proposed", 1);
    expect(calls[0]!.body.variables).toEqual({ league_id: "1000000000000000001", status: "proposed", leg: 1 });
    expect(tx[0]!.adds).toEqual({ "1466": 3, "10859": 5 });
    expect(tx[0]!.consenter_ids).toEqual([5]);
  });

  test("myDms passes limit and unread", async () => {
    const { gql, calls } = client([DMS_FIXTURE]);
    const dms = await myDms(gql, { limit: 5, unread: true });
    expect(calls[0]!.body.variables).toEqual({ limit: 5, unread: true });
    expect(dms[0]!.dm_type).toBe("single");
  });

  test("messages defaults to desc and forwards before", async () => {
    const { gql, calls } = client([MESSAGES_FIXTURE, MESSAGES_FIXTURE]);
    await messages(gql, "4000000000000000001");
    expect(calls[0]!.body.variables).toEqual({ parent_id: "4000000000000000001", before: null, order_by: "desc" });
    const older = await messages(gql, "4000000000000000001", { before: "5000000000000000009", orderBy: "asc" });
    expect(calls[1]!.body.variables).toEqual({ parent_id: "4000000000000000001", before: "5000000000000000009", order_by: "asc" });
    expect(decodeEntities(older[0]!.text ?? "")).toBe("It's a no from me");
  });

  test("sportInfo returns the state map", async () => {
    const { gql } = client([SPORT_INFO_FIXTURE]);
    const s = await sportInfo(gql);
    expect(s.week).toBe(1);
    expect(s.previous_season).toBe("2025");
  });

  test("statsForPlayersInWeek defaults to projections", async () => {
    const { gql, calls } = client([STATS_FIXTURE]);
    const rows = await statsForPlayersInWeek(gql, ["4983"], { season: "2026", week: 1 });
    expect(calls[0]!.body.variables).toEqual({
      category: "proj",
      week: 1,
      sport: "nfl",
      season_type: "regular",
      season: "2026",
      player_ids: ["4983"],
    });
    expect(rows[0]!.stats.pts_ppr).toBe(12.09);
  });
});

describe("decodeEntities", () => {
  test("decodes numeric and named entities", () => {
    expect(decodeEntities("a &#39;b&#39; &amp; &quot;c&quot; &lt;d&gt;")).toBe("a 'b' & \"c\" <d>");
  });
});
