import { Model } from "objection";

export class SeasonModel extends Model {
  public static tableName = "Season";

  public readonly id: number;
  public readonly leagueId: number;
  public readonly name: string;
}
