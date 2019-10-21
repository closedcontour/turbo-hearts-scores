import { IGame } from "@turbo-hearts-scores/shared";
import { GameLoader } from "./gameLoader";
import { Api } from "./transport";

export class LeagueGameLoader implements GameLoader {
  private api: Api;
  private leagueId: string;

  constructor(api: Api, leagueId: string) {
    this.api = api;
    this.leagueId = leagueId;
  }

  public loadGames(): Promise<IGame[]> {
    return this.api.fetchLeagueGames(this.leagueId);
  }
}
