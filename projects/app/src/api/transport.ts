import { IBasicLeague, ILeague, IPlayer, ISeason } from "./api";

export class Api {
  private baseUrl: string = "http://localhost:8999/api";

  public fetchLeague(leagueId: string) {
    const url = `${this.baseUrl}/league/${leagueId}`;
    return this.get(url).then((league: ILeague) => {
      return league;
    });
  }

  public fetchSeason(seasonId: string) {
    const url = `${this.baseUrl}/season/${seasonId}`;
    return this.get(url).then((season: ISeason) => {
      return season;
    });
  }

  public fetchLeagues() {
    const url = `${this.baseUrl}/leagues`;
    return this.get(url).then((leagues: IBasicLeague[]) => {
      return leagues;
    });
  }

  public fetchPlayers() {
    const url = `${this.baseUrl}/players`;
    return this.get(url).then((players: IPlayer[]) => {
      return players;
    });
  }

  public addPlayerToLeague(leagueId: string, playerId: string) {
    const url = `${this.baseUrl}/league/${leagueId}/add-player`;
    return this.post(url, { playerId }).then((league: IBasicLeague) => {
      return league;
    });
  }

  public createLeague(name: string) {
    const url = `${this.baseUrl}/league`;
    return this.post(url, { name }).then((league: IBasicLeague) => {
      return league;
    });
  }

  public createPlayer(name: string) {
    const url = `${this.baseUrl}/player`;
    return this.post(url, { name }).then((player: IPlayer) => {
      return player;
    });
  }

  public createSeason(leagueId: string, name: string) {
    const url = `${this.baseUrl}/league/${leagueId}/add-season`;
    return this.post(url, { name }).then((season: ISeason) => {
      return season;
    });
  }

  private post(url: string, content: any) {
    return fetch(url, {
      body: JSON.stringify(content),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    }).then(response => {
      return response.json();
    });
  }

  private get(url: string) {
    return fetch(url).then(response => {
      return response.json();
    });
  }
}
