import { Model } from "objection";
import { join } from "path";

export class LeagueModel extends Model {
  public static tableName = "League";

  public static relationMappings = {
    seasons: {
      relation: Model.HasManyRelation,
      modelClass: join(__dirname, "Season"),
      join: {
        from: "League.id",
        to: "Season.leagueId",
      },
    },
    players: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, "Player"),
      join: {
        from: "League.id",
        through: {
          from: "PlayerLeague.leagueId",
          to: "PlayerLeague.playerId",
        },
        to: "Player.id",
      },
    },
  };

  public readonly id: number;
  public readonly name: string;
}
