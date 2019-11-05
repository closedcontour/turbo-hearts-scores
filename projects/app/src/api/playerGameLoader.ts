import { IGame } from "@turbo-hearts-scores/shared";
import { GameLoader } from "./gameLoader";
import { Api } from "./transport";

export class PlayerGameLoader implements GameLoader {
  constructor(private api: Api, private playerId: string, private seasonId?: string) {}

  public loadGames(): Promise<IGame[]> {
    if (this.seasonId === undefined) {
      return this.api.fetchPlayerGames(this.playerId);
    } else {
      return this.api.fetchPlayerSeasonGames(this.playerId, this.seasonId);
    }
  }
}
