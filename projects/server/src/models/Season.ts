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
  };

  public readonly id: number;
  public readonly leagueId: number;
  public readonly name: string;
}
