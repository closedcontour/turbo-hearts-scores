import { Model } from "objection";
import { join } from "path";

export class GameModel extends Model {
  public static tableName = "Game";

  public static relationMappings = {
    hands: {
      relation: Model.HasManyRelation,
      modelClass: join(__dirname, "Hand"),
      join: {
        from: "Game.id",
        to: "Hand.gameId",
      },
    },
    season: {
      relation: Model.HasOneRelation,
      modelClass: join(__dirname, "Season"),
      join: {
        from: "Game.seasonId",
        to: "Season.id",
      },
    },
    p1: {
      relation: Model.HasOneRelation,
      modelClass: join(__dirname, "Player"),
      join: {
        from: "Game.p1Id",
        to: "Player.id",
      },
    },
    p2: {
      relation: Model.HasOneRelation,
      modelClass: join(__dirname, "Player"),
      join: {
        from: "Game.p2Id",
        to: "Player.id",
      },
    },
    p3: {
      relation: Model.HasOneRelation,
      modelClass: join(__dirname, "Player"),
      join: {
        from: "Game.p3Id",
        to: "Player.id",
      },
    },
    p4: {
      relation: Model.HasOneRelation,
      modelClass: join(__dirname, "Player"),
      join: {
        from: "Game.p4Id",
        to: "Player.id",
      },
    },
  };

  public readonly id: number;
  public readonly seasonId: number;
  public readonly p1Id: number;
  public readonly p2Id: number;
  public readonly p3Id: number;
  public readonly p4Id: number;
  public readonly deleted: boolean;
  public readonly time: number;
  // date
}
