import { Model } from "objection";

export class PlayerModel extends Model {
  public static tableName = "Player";

  //   public static relationMappings = {
  //     seasons: {
  //       relation: Model.HasManyRelation,
  //       modelClass: join(__dirname, "Season"),
  //       join: {
  //         from: "League.id",
  //         to: "Season.leagueId",
  //       },
  //     },
  //   };

  public readonly id: number;
  public readonly name: string;
}
