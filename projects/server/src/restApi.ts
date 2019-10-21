import { IGame, IHand, ILeague, IPlayer, ISeason, Pass } from "@turbo-hearts-scores/shared";
import * as express from "express";
import { GameModel } from "./models/Game";
import { HandModel } from "./models/Hand";
import { LeagueModel } from "./models/League";
import { PlayerModel } from "./models/Player";
import { PlayerLeagueModel } from "./models/PlayerLeague";
import { SeasonModel } from "./models/Season";

// TODO: compression
// TODO: patches should be in API format, not DB

function timeInSeconds() {
  return Math.floor(new Date().getTime() / 1000);
}

function dbPlayerToApi(player: PlayerModel): IPlayer {
  return {
    id: player.id.toString(),
    name: player.name,
  };
}

function dbHandToApi(hand: HandModel, players: IPlayer[]): IHand {
  return {
    id: hand.id.toString(),
    gameId: hand.gameId.toString(),
    pass: hand.pass as Pass,
    time: hand.time,
    players,
    playerHands: [
      {
        index: 0,
        player: players[0],
        chargedAh: hand.p1ChargeAh,
        chargedTc: hand.p1ChargeTc,
        chargedJd: hand.p1ChargeJd,
        chargedQs: hand.p1ChargeQs,
        tookJd: hand.p1TookJd,
        tookQs: hand.p1TookQs,
        tookTc: hand.p1TookTc,
        hearts: hand.p1Hearts,
      },
      {
        index: 1,
        player: players[1],
        chargedAh: hand.p2ChargeAh,
        chargedTc: hand.p2ChargeTc,
        chargedJd: hand.p2ChargeJd,
        chargedQs: hand.p2ChargeQs,
        tookJd: hand.p2TookJd,
        tookQs: hand.p2TookQs,
        tookTc: hand.p2TookTc,
        hearts: hand.p2Hearts,
      },
      {
        index: 2,
        player: players[2],
        chargedAh: hand.p3ChargeAh,
        chargedTc: hand.p3ChargeTc,
        chargedJd: hand.p3ChargeJd,
        chargedQs: hand.p3ChargeQs,
        tookJd: hand.p3TookJd,
        tookQs: hand.p3TookQs,
        tookTc: hand.p3TookTc,
        hearts: hand.p3Hearts,
      },
      {
        index: 3,
        player: players[3],
        chargedAh: hand.p4ChargeAh,
        chargedTc: hand.p4ChargeTc,
        chargedJd: hand.p4ChargeJd,
        chargedQs: hand.p4ChargeQs,
        tookJd: hand.p4TookJd,
        tookQs: hand.p4TookQs,
        tookTc: hand.p4TookTc,
        hearts: hand.p4Hearts,
      },
    ],
  };
}

function dbGameToApi(
  game: GameModel,
  season: SeasonModel,
  players?: PlayerModel[],
  hands?: HandModel[],
): IGame {
  const mappedPlayers =
    players !== undefined
      ? players.map(player => (player == null ? null : dbPlayerToApi(player)))
      : undefined;
  const anyNullPlayers =
    mappedPlayers === undefined ? true : mappedPlayers.some(player => player == null);
  return {
    id: game.id.toString(),
    season: dbSeasonToApi(season),
    players: mappedPlayers,
    time: game.time,
    hands:
      hands !== undefined && players !== undefined && !anyNullPlayers
        ? hands.map(hand => dbHandToApi(hand, mappedPlayers as IPlayer[]))
        : undefined,
  };
}

function dbSeasonToApi(season: SeasonModel, league?: LeagueModel, games?: GameModel[]): ISeason {
  return {
    id: season.id.toString(),
    name: season.name,
    league: league !== undefined ? dbLeagueToApi(league) : undefined,
    games:
      games !== undefined
        ? games.filter(game => !game.deleted).map(game => dbGameToApi(game, season))
        : undefined,
  };
}

function dbLeagueToApi(
  league: LeagueModel,
  seasons?: SeasonModel[],
  players?: PlayerModel[],
): ILeague {
  return {
    id: league.id.toString(),
    name: league.name,
    seasons:
      seasons !== undefined ? seasons.map(season => dbSeasonToApi(season, league)) : undefined,
    players: players !== undefined ? players.map(dbPlayerToApi) : undefined,
  };
}

export function getRouter() {
  const router = express.Router();

  router.route("/player").post(async (req, res) => {
    const player = await PlayerModel.query().insertAndFetch({ name: req.body.name });
    res.json(dbPlayerToApi(player));
  });

  router.route("/player/:playerId/games").get(async (req, res) => {
    const games = await GameModel.query()
      .eager("[hands,p1,p2,p3,p4,season]")
      .where(q =>
        q
          .where("p1Id", "=", req.params.playerId)
          .orWhere("p2Id", "=", req.params.playerId)
          .orWhere("p3Id", "=", req.params.playerId)
          .orWhere("p4Id", "=", req.params.playerId),
      )
      .orderBy("time", "desc")
      .orderBy("id", "desc")
      .select();
    res.json(
      games
        .filter(game => !game.deleted)
        .map((game: any) =>
          dbGameToApi(game, game.season, [game.p1, game.p2, game.p3, game.p4], game.hands),
        ),
    );
  });

  router.route("/player/:playerId/vs/:playerId2/games").get(async (req, res) => {
    const games = await GameModel.query()
      .eager("[hands,p1,p2,p3,p4,season]")
      .where(q =>
        q
          .where("p1Id", "=", req.params.playerId)
          .orWhere("p2Id", "=", req.params.playerId)
          .orWhere("p3Id", "=", req.params.playerId)
          .orWhere("p4Id", "=", req.params.playerId),
      )
      .andWhere(q =>
        q
          .where("p1Id", "=", req.params.playerId2)
          .orWhere("p2Id", "=", req.params.playerId2)
          .orWhere("p3Id", "=", req.params.playerId2)
          .orWhere("p4Id", "=", req.params.playerId2),
      )
      .orderBy("time", "desc")
      .orderBy("id", "desc")
      .select();
    res.json(
      games
        .filter(game => !game.deleted)
        .map((game: any) =>
          dbGameToApi(game, game.season, [game.p1, game.p2, game.p3, game.p4], game.hands),
        ),
    );
  });

  router.route("/players").get(async (_req, res) => {
    const players = await PlayerModel.query()
      .select()
      .orderBy("id", "asc");
    res.json(players.map(dbPlayerToApi));
  });

  router.route("/leagues").get(async (_req, res) => {
    const leagues = await LeagueModel.query()
      .select()
      .orderBy("id", "asc");
    res.json(leagues.map(league => dbLeagueToApi(league)));
  });

  router.route("/league").post(async (req, res) => {
    const league = await LeagueModel.query().insertAndFetch({ name: req.body.name });
    res.json(dbLeagueToApi(league));
  });

  router.route("/league/:leagueId").get(async (req, res) => {
    const leagues = await LeagueModel.query()
      .eager("[seasons,players]")
      .where("id", "=", req.params.leagueId)
      .select();
    const league = leagues[0] as any;
    res.json(dbLeagueToApi(league, league.seasons, league.players));
  });

  router.route("/league/:leagueId/games").get(async (req, res) => {
    const games = await GameModel.query()
      .eager("[hands,p1,p2,p3,p4,season]")
      .eagerAlgorithm(GameModel.JoinEagerAlgorithm)
      .where("season.leagueId", "=", req.params.leagueId)
      .orderBy("time", "desc")
      .orderBy("id", "desc")
      .select();
    res.json(
      games
        .filter(game => !game.deleted)
        .map((game: any) =>
          dbGameToApi(game, game.season, [game.p1, game.p2, game.p3, game.p4], game.hands),
        ),
    );
  });

  router.route("/season/:seasonId").get(async (req, res) => {
    const seasons = await SeasonModel.query()
      .where("id", "=", req.params.seasonId)
      .eager("[league,games]")
      .select();
    const season = seasons[0] as any;
    res.json(dbSeasonToApi(season, season.league, season.games));
  });

  router.route("/season/:seasonId/games").get(async (req, res) => {
    const games = await GameModel.query()
      .eager("[hands,p1,p2,p3,p4,season]")
      .where("seasonId", "=", req.params.seasonId)
      .orderBy("time", "desc")
      .orderBy("id", "desc")
      .select();
    res.json(
      games
        .filter(game => !game.deleted)
        .map((game: any) =>
          dbGameToApi(game, game.season, [game.p1, game.p2, game.p3, game.p4], game.hands),
        ),
    );
  });

  router.route("/league/:leagueId/add-season").post(async (req, res) => {
    const seasonRequest = req.body as Partial<SeasonModel>;
    const game = await SeasonModel.query().insertAndFetch({
      leagueId: req.params.leagueId,
      ...seasonRequest,
    });
    res.json(game);
  });

  router.route("/league/:leagueId/add-player").post(async (req, res) => {
    await PlayerLeagueModel.query().insert({
      leagueId: req.params.leagueId,
      playerId: req.body.playerId,
    });
    res.json(true);
  });

  router.route("/season/:seasonId/add-game").post(async (req, res) => {
    const gameRequest = req.body as Partial<GameModel>;
    const game = await GameModel.query().insertAndFetch({
      seasonId: req.params.seasonId,
      ...gameRequest,
      time: timeInSeconds(),
    });
    res.json(game);
  });

  router.route("/game/:gameId").get(async (req, res) => {
    const games = await GameModel.query()
      .select()
      .eager("[p1,p2,p3,p4,season,hands]")
      .where("id", "=", req.params.gameId);
    const game = games[0] as any;
    res.json(dbGameToApi(game, game.season, [game.p1, game.p2, game.p3, game.p4], game.hands));
  });

  router.route("/game/:gameId").patch(async (req, res) => {
    const gameRequest = req.body as Partial<GameModel>;
    const game = await GameModel.query().patchAndFetchById(req.params.gameId, gameRequest);
    res.json(game);
  });

  router.route("/game/:gameId").delete(async (req, res) => {
    const deleteRequest = {
      id: req.params.gameId,
      deleted: true,
    };
    const game = await GameModel.query().patchAndFetchById(req.params.gameId, deleteRequest);
    res.json(game);
  });

  router.route("/game/:gameId/add-hand").post(async (req, res) => {
    const handRequest = req.body as Partial<HandModel>;
    const hand = await HandModel.query().insertAndFetch({
      gameId: req.params.gameId,
      ...handRequest,
      time: timeInSeconds(),
    });
    res.json(hand);
  });

  router.route("/hand/:handId").get(async (req, res) => {
    const hands = await HandModel.query()
      .select()
      .eager("[game.[p1,p2,p3,p4]]")
      .where("id", "=", req.params.handId);
    const hand = hands[0] as any;
    res.json(dbHandToApi(hand, [hand.game.p1, hand.game.p2, hand.game.p3, hand.game.p4]));
  });

  router.route("/hand/:handId").patch(async (req, res) => {
    const handRequest = req.body as Partial<HandModel>;
    const hand = await HandModel.query().patchAndFetchById(req.params.handId, handRequest);
    res.json(hand);
  });

  return router;
}
