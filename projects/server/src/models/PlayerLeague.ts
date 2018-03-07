import { Model } from "objection";

export interface IPlayerLeague {
  leagueId: number;
  playerId: number;
}

export class PlayerLeagueModel extends Model implements IPlayerLeague {
  public static tableName = "PlayerLeague";

  public readonly leagueId: number;
  public readonly playerId: number;
}
