import * as express from "express";
import { GameModel } from "./models/Game";
import { HandModel } from "./models/Hand";
import { LeagueModel } from "./models/League";
import { PlayerModel } from "./models/Player";
import { PlayerLeagueModel } from "./models/PlayerLeague";
import { SeasonModel } from "./models/Season";

export function getRouter() {
  const router = express.Router();

  router.route("/player").post(async (_req, res) => {
    const player = await PlayerModel.query().insertAndFetch({ name: _req.body.name });
    res.json(player);
  });

  router.route("/players").get(async (_req, res) => {
    const players = await PlayerModel.query()
      .select()
      .orderBy("id", "asc");
    res.json(players);
  });

  router.route("/leagues").get((_req, res) => {
    LeagueModel.query()
      .select()
      .orderBy("id", "asc")
      .then(leagues => {
        res.json(leagues);
      });
  });

  router.route("/league").post((_req, res) => {
    LeagueModel.query()
      .insertAndFetch({ name: _req.body.name })
      .then(league => {
        res.json(league);
      });
  });

  router.route("/league/:leagueId").get(async (_req, res) => {
    const leagues = await LeagueModel.query()
      .where("id", "=", _req.params.leagueId)
      .select();
    const league = leagues[0];
    const seasons = await league.$relatedQuery("seasons");
    const players = await league.$relatedQuery("players");
    res.json({
      ...league,
      seasons,
      players,
    });
  });

  router.route("/season/:seasonId").get(async (_req, res) => {
    const seasons = await SeasonModel.query()
      .where("id", "=", _req.params.seasonId)
      .select();
    const season = seasons[0];
    const league = await season.$relatedQuery("league");
    return res.json({
      ...season,
      league,
    });
  });

  router.route("/league/:leagueId/add-season").post(async (_req, res) => {
    const seasonRequest = _req.body as Partial<SeasonModel>;
    const game = await SeasonModel.query().insertAndFetch({
      leagueId: _req.params.leagueId,
      ...seasonRequest,
    });
    return res.json(game);
  });

  router.route("/league/:leagueId/add-player").post(async (_req, res) => {
    await PlayerLeagueModel.query().insert({
      leagueId: _req.params.leagueId,
      playerId: _req.body.playerId,
    });
    return res.json(true);
  });

  router.route("/season/:seasonId/add-game").post(async (_req, res) => {
    const gameRequest = _req.body as Partial<GameModel>;
    const game = await GameModel.query().insertAndFetch({
      seasonId: _req.params.seasonId,
      ...gameRequest,
    });
    return res.json(game);
  });

  router.route("/game/:gameId").get(async (_req, res) => {
    const games = await GameModel.query()
      .select()
      .where("id", "=", _req.params.gameId);
    const game = games[0];
    const players = await Promise.all([
      game.$relatedQuery("p1"),
      game.$relatedQuery("p2"),
      game.$relatedQuery("p3"),
      game.$relatedQuery("p4"),
    ]);
    const season = ((await game.$relatedQuery("season")) as any) as SeasonModel;
    const league = await season.$relatedQuery("league");
    const hands = await game.$relatedQuery("hands");
    return res.json({
      id: game.id,
      seasonId: game.seasonId,
      players,
      season: {
        ...season,
        league,
      },
      hands,
    });
  });

  router.route("/game/:gameId").patch(async (_req, res) => {
    const gameRequest = _req.body as Partial<GameModel>;
    const game = await GameModel.query().patchAndFetchById(_req.params.gameId, gameRequest);
    return res.json(game);
  });

  router.route("/game/:gameId/add-hand").post(async (_req, res) => {
    const handRequest = _req.body as Partial<HandModel>;
    const hand = await HandModel.query().insertAndFetch({
      gameId: _req.params.gameId,
      ...handRequest,
    });
    return res.json(hand);
  });

  router.route("/hand/:handId").get(async (_req, res) => {
    const hands = await HandModel.query()
      .select()
      .where("id", "=", _req.params.handId);
    const hand = hands[0];
    const game = ((await hand.$relatedQuery("game")) as any) as GameModel;
    const players = await Promise.all([
      game.$relatedQuery("p1"),
      game.$relatedQuery("p2"),
      game.$relatedQuery("p3"),
      game.$relatedQuery("p4"),
    ]);
    res.json({
      ...hand,
      game,
      players,
    });
  });

  router.route("/hand/:handId").patch(async (_req, res) => {
    const handRequest = _req.body as Partial<HandModel>;
    const hand = await HandModel.query().patchAndFetchById(_req.params.handId, handRequest);
    return res.json(hand);
  });

  return router;
}
