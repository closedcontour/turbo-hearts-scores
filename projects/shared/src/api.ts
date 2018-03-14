export interface IPlayer {
  id: string;
  name: string;
}

export type Pass = "LEFT" | "RIGHT" | "ACROSS" | "KEEP";

export const PASSES: Pass[] = ["LEFT", "RIGHT", "ACROSS", "KEEP"];

export interface IHand {
  id: string;
  gameId: string;
  pass: Pass;
  playerHands: IPlayerHand[];
  players: IPlayer[];
  time: number;
}

export interface IPlayerHand {
  index: number;
  player: IPlayer;

  chargedTc: boolean;
  chargedJd: boolean;
  chargedAh: boolean;
  chargedQs: boolean;

  tookTc: boolean;
  tookJd: boolean;
  tookQs: boolean;
  hearts: number;
}

export interface IGame {
  id: string;
  season: ISeason;
  players?: Array<IPlayer | null>;
  hands?: IHand[];
  time: number;
}

export interface ISeason {
  id: string;
  name: string;
  league?: ILeague;
  games?: IGame[];
}

export interface ILeague {
  id: string;
  name: string;
  players?: IPlayer[];
  seasons?: ISeason[];
}
