import { Model } from "objection";

export interface IPlayerLeague {
  id: number;
  leagueId: number;
  playerId: number;
}

export class PlayerLeagueModel extends Model implements IPlayerLeague {
  public static tableName = "PlayerLeague";

  //   public static relationMappings = {
  //     seasons: {
  //       relation: Model.HasManyRelation,
  //       modelClass: join(__dirname, "Season"),
  //       join: {
  //         from: "League.id",
  //         to: "Season.leagueId",
  //       },
  //     },
  //     players: {
  //       relation: Model.ManyToManyRelation,
  //       modelClass: join(__dirname, "Player"),
  //       join: {
  //         from: "League.id",
  //         through: {
  //           from: "PlayerLeague.leagueId",
  //           to: "PlayerLeague.playerId",
  //         },
  //         to: "Player.id",
  //       },
  //     },
  //   };

  public readonly id: number;
  public readonly leagueId: number;
  public readonly playerId: number;
}
