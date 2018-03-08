export interface IPlayer {
  id: number;
  name: string;
}

export type Pass = "LEFT" | "RIGHT" | "ACROSS" | "KEEP";

export interface IHand {
  id: number;
  pass: Pass;
  playerHands: IPlayerHand[];
}

export interface IPlayerHand {
  index: number;
  //   player: IPlayer;
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
  id: number;
  players: IPlayer[];
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

export interface IWireHand {
  id: number;
  gameId: number;

  pass: Pass;

  p1ChargeJd: boolean;
  p2ChargeJd: boolean;
  p3ChargeJd: boolean;
  p4ChargeJd: boolean;

  p1ChargeTc: boolean;
  p2ChargeTc: boolean;
  p3ChargeTc: boolean;
  p4ChargeTc: boolean;

  p1ChargeAh: boolean;
  p2ChargeAh: boolean;
  p3ChargeAh: boolean;
  p4ChargeAh: boolean;

  p1ChargeQs: boolean;
  p2ChargeQs: boolean;
  p3ChargeQs: boolean;
  p4ChargeQs: boolean;

  p1TookJd: boolean;
  p2TookJd: boolean;
  p3TookJd: boolean;
  p4TookJd: boolean;

  p1TookQs: boolean;
  p2TookQs: boolean;
  p3TookQs: boolean;
  p4TookQs: boolean;

  p1TookTc: boolean;
  p2TookTc: boolean;
  p3TookTc: boolean;
  p4TookTc: boolean;

  p1Hearts: number;
  p2Hearts: number;
  p3Hearts: number;
  p4Hearts: number;
}

export function convertWireHand(wireHand: IWireHand): IHand {
  return {
    id: wireHand.id,
    pass: wireHand.pass || "LEFT",
    // game
    playerHands: [
      {
        index: 0,
        chargedAh: wireHand.p1ChargeAh,
        chargedTc: wireHand.p1ChargeTc,
        chargedJd: wireHand.p1ChargeJd,
        chargedQs: wireHand.p1ChargeQs,
        tookJd: wireHand.p1TookJd,
        tookQs: wireHand.p1TookQs,
        tookTc: wireHand.p1TookTc,
        hearts: wireHand.p1Hearts,
      },
      {
        index: 1,
        chargedAh: wireHand.p2ChargeAh,
        chargedTc: wireHand.p2ChargeTc,
        chargedJd: wireHand.p2ChargeJd,
        chargedQs: wireHand.p2ChargeQs,
        tookJd: wireHand.p2TookJd,
        tookQs: wireHand.p2TookQs,
        tookTc: wireHand.p2TookTc,
        hearts: wireHand.p2Hearts,
      },
      {
        index: 2,
        chargedAh: wireHand.p3ChargeAh,
        chargedTc: wireHand.p3ChargeTc,
        chargedJd: wireHand.p3ChargeJd,
        chargedQs: wireHand.p3ChargeQs,
        tookJd: wireHand.p3TookJd,
        tookQs: wireHand.p3TookQs,
        tookTc: wireHand.p3TookTc,
        hearts: wireHand.p3Hearts,
      },
      {
        index: 3,
        chargedAh: wireHand.p4ChargeAh,
        chargedTc: wireHand.p4ChargeTc,
        chargedJd: wireHand.p4ChargeJd,
        chargedQs: wireHand.p4ChargeQs,
        tookJd: wireHand.p4TookJd,
        tookQs: wireHand.p4TookQs,
        tookTc: wireHand.p4TookTc,
        hearts: wireHand.p4Hearts,
      },
    ],
  };
}
