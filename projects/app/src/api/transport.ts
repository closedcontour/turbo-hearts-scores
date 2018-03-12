import { IGame, IHand, ILeague, IPlayer, ISeason, Pass } from "@turbo-hearts-scores/shared";

const API_HOST = window.location.hostname === "localhost" ? "localhost:7999" : window.location.host;

export class Api {
  private baseUrl: string = `http://${API_HOST}/api`;

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
    return this.get(url).then((leagues: ILeague[]) => {
      return leagues;
    });
  }

  public fetchPlayers() {
    const url = `${this.baseUrl}/players`;
    return this.get(url).then((players: IPlayer[]) => {
      return players;
    });
  }

  public fetchSeasonGames(seasonId: string) {
    const url = `${this.baseUrl}/season/${seasonId}/games`;
    return this.get(url).then((games: IGame[]) => {
      return games;
    });
  }

  public addPlayerToLeague(leagueId: string, playerId: string) {
    const url = `${this.baseUrl}/league/${leagueId}/add-player`;
    return this.post(url, { playerId }).then((league: ILeague) => {
      return league;
    });
  }

  public createLeague(name: string) {
    const url = `${this.baseUrl}/league`;
    return this.post(url, { name }).then((league: ILeague) => {
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

  public createGame(seasonId: string) {
    const url = `${this.baseUrl}/season/${seasonId}/add-game`;
    return this.post(url, {}).then((game: IGame) => {
      return game;
    });
  }

  public createHand(gameId: string, pass: Pass) {
    const url = `${this.baseUrl}/game/${gameId}/add-hand`;
    return this.post(url, { pass }).then((hand: IHand) => {
      return hand;
    });
  }

  public async fetchHand(handId: string) {
    const url = `${this.baseUrl}/hand/${handId}`;
    const hand = await this.get(url);
    return hand as IHand;
  }

  public async fetchGame(gameId: string) {
    const url = `${this.baseUrl}/game/${gameId}`;
    const game = await this.get(url);
    return game as IGame;
  }

  public async startGame(gameId: string, playerIds: Array<string | null>) {
    const url = `${this.baseUrl}/game/${gameId}`;
    const wireGame = await this.patch(url, {
      id: gameId,
      p1Id: playerIds[0],
      p2Id: playerIds[1],
      p3Id: playerIds[2],
      p4Id: playerIds[3],
    });
    return wireGame;
  }

  public async finishHand(handId: string, hand: IHand) {
    const url = `${this.baseUrl}/hand/${handId}`;
    const wireHand = await this.patch(url, {
      id: handId,
      pass: hand.pass,
      p1ChargeJd: hand.playerHands[0].chargedJd,
      p2ChargeJd: hand.playerHands[1].chargedJd,
      p3ChargeJd: hand.playerHands[2].chargedJd,
      p4ChargeJd: hand.playerHands[3].chargedJd,

      p1ChargeTc: hand.playerHands[0].chargedTc,
      p2ChargeTc: hand.playerHands[1].chargedTc,
      p3ChargeTc: hand.playerHands[2].chargedTc,
      p4ChargeTc: hand.playerHands[3].chargedTc,

      p1ChargeAh: hand.playerHands[0].chargedAh,
      p2ChargeAh: hand.playerHands[1].chargedAh,
      p3ChargeAh: hand.playerHands[2].chargedAh,
      p4ChargeAh: hand.playerHands[3].chargedAh,

      p1ChargeQs: hand.playerHands[0].chargedQs,
      p2ChargeQs: hand.playerHands[1].chargedQs,
      p3ChargeQs: hand.playerHands[2].chargedQs,
      p4ChargeQs: hand.playerHands[3].chargedQs,

      p1TookJd: hand.playerHands[0].tookJd,
      p2TookJd: hand.playerHands[1].tookJd,
      p3TookJd: hand.playerHands[2].tookJd,
      p4TookJd: hand.playerHands[3].tookJd,

      p1TookQs: hand.playerHands[0].tookQs,
      p2TookQs: hand.playerHands[1].tookQs,
      p3TookQs: hand.playerHands[2].tookQs,
      p4TookQs: hand.playerHands[3].tookQs,

      p1TookTc: hand.playerHands[0].tookTc,
      p2TookTc: hand.playerHands[1].tookTc,
      p3TookTc: hand.playerHands[2].tookTc,
      p4TookTc: hand.playerHands[3].tookTc,

      p1Hearts: hand.playerHands[0].hearts,
      p2Hearts: hand.playerHands[1].hearts,
      p3Hearts: hand.playerHands[2].hearts,
      p4Hearts: hand.playerHands[3].hearts,
    });
    return wireHand;
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

  private patch(url: string, content: any) {
    return fetch(url, {
      body: JSON.stringify(content),
      headers: {
        "content-type": "application/json",
      },
      method: "PATCH",
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
