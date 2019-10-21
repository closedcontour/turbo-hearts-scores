import { IGame } from "@turbo-hearts-scores/shared";
import { GameLoader } from "./gameLoader";
import { Api } from "./transport";

export class PlayerGameLoader implements GameLoader {
  private api: Api;
  private playerId: string;

  constructor(api: Api, playerId: string) {
    this.api = api;
    this.playerId = playerId;
  }

  public loadGames(): Promise<IGame[]> {
    return this.api.fetchPlayerGames(this.playerId);
  }
}
