import { IGame } from "@turbo-hearts-scores/shared";
import { GameLoader } from "./gameLoader";
import { Api } from "./transport";

export class SeasonGameLoader implements GameLoader {
  private api: Api;
  private seasonId: string;

  constructor(api: Api, seasonId: string) {
    this.api = api;
    this.seasonId = seasonId;
  }

  public loadGames(): Promise<IGame[]> {
    return this.api.fetchSeasonGames(this.seasonId);
  }
}
