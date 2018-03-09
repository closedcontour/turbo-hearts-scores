import { Model } from "objection";
import { join } from "path";

export class SeasonModel extends Model {
  public static tableName = "Season";

  public static relationMappings = {
    league: {
      relation: Model.HasOneRelation,
      modelClass: join(__dirname, "League"),
      join: {
        from: "Season.leagueId",
        to: "League.id",
      },
    },
    games: {
      relation: Model.HasManyRelation,
      modelClass: join(__dirname, "Game"),
      join: {
        from: "Season.id",
        to: "Game.seasonId",
      },
    },
  };

  public readonly id: number;
  public readonly leagueId: number;
  public readonly name: string;
}
