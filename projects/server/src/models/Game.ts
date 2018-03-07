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
  };

  public readonly id: number;
  public readonly seasonId: number;
  public readonly p1Id: number;
  public readonly p2Id: number;
  public readonly p3Id: number;
  public readonly p4Id: number;

  // date
}
