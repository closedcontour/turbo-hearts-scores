export interface IPlayer {
  id: number;
  name: string;
}

export interface IHand {
  id: number;
}

export interface IGame {
  id: number;
}

export interface ISeason {
  id: number;
  name: string;
}

export interface IBasicLeague {
  id: number;
  name: string;
}

export interface ILeague extends IBasicLeague {
  players: IPlayer[];
  seasons: ISeason[];
}
