import {
  analyzeHands,
  getHandResult,
  IGame,
  IGameAnalysis,
  IHand,
  IHandAnalysis,
  IPlayerHand,
  scoresToDelta,
} from "@turbo-hearts-scores/shared";
import { PlayerHand } from "../components/PlayerHand";

export interface Stats {
  hands: number;
  jdCharges: number;
  ahCharges: number;
  ahChargeWorthIt: number;
  tcCharges: number;
  tcChargeWorthIt: number;
  qsCharges: number;
  qsChargeWorthIt: number;
  tq: number;
  tj: number;
  tqj: number;
  tookOwnJdCharge: number;
  tookOwnQsCharge: number;
  tookOwnTcCharge: number;
  runs: number;
  antiruns: number;
  scoreSumSquared: number;
  handScoreStdDev: number;
}

function initialStats() {
  return {
    ahCharges: 0,
    ahChargeWorthIt: 0,
    hands: 0,
    jdCharges: 0,
    scoreSumSquared: 0,
    tcCharges: 0,
    tcChargeWorthIt: 0,
    qsCharges: 0,
    qsChargeWorthIt: 0,
    tookOwnJdCharge: 0,
    tookOwnQsCharge: 0,
    tookOwnTcCharge: 0,
    tq: 0,
    tj: 0,
    tqj: 0,
    runs: 0,
    antiruns: 0,
    handScoreStdDev: 0,
  };
}

function wasChargeWorthItCalculator(
  hand: IHand,
  charged: (hand: IPlayerHand) => boolean,
  mut: (hand: IPlayerHand) => IPlayerHand,
) {
  let charger = -1;
  for (let i = 0; i < hand.playerHands.length; i++) {
    const ph = hand.playerHands[i];
    if (charged(ph)) {
      charger = i;
      break;
    }
  }
  if (charger === -1) {
    throw new Error("no charge");
  }
  const result = getHandResult(hand);
  const deltaWithCharge = scoresToDelta(result.scores);
  const copy: IHand = {
    ...hand,
    playerHands: hand.playerHands.slice(),
  };
  copy.playerHands[charger] = mut(hand.playerHands[charger]);
  const resultWithoutCharge = getHandResult(copy);
  const deltaWithoutCharge = scoresToDelta(resultWithoutCharge.scores);
  return deltaWithCharge[charger] > deltaWithoutCharge[charger];
}

function wasQsChargeWorthIt(hand: IHand) {
  return wasChargeWorthItCalculator(hand, ph => ph.chargedQs, ph => ({ ...ph, chargedQs: false }));
}

function wasTcChargeWorthIt(hand: IHand) {
  return wasChargeWorthItCalculator(hand, ph => ph.chargedTc, ph => ({ ...ph, chargedTc: false }));
}

function wasAhChargeWorthIt(hand: IHand) {
  return wasChargeWorthItCalculator(hand, ph => ph.chargedAh, ph => ({ ...ph, chargedAh: false }));
}

export class StatsHandAnalysis implements IHandAnalysis<Stats> {
  public initialState(): Stats {
    return initialStats();
  }

  public analyze(current: Stats, hand: IHand): Stats {
    const handResult = getHandResult(hand);
    if (!handResult.valid) {
      return current;
    }
    current.hands++;
    for (const score of handResult.scores) {
      current.scoreSumSquared += Math.pow(score, 2);
    }
    for (const playerHand of hand.playerHands) {
      if (playerHand.chargedAh) {
        current.ahCharges++;
        if (wasAhChargeWorthIt(hand)) {
          current.ahChargeWorthIt++;
        }
      }
      if (playerHand.chargedJd) {
        current.jdCharges++;
      }
      if (playerHand.chargedTc) {
        current.tcCharges++;
        if (wasTcChargeWorthIt(hand)) {
          current.tcChargeWorthIt++;
        }
      }
      if (playerHand.chargedQs) {
        current.qsCharges++;
        if (wasQsChargeWorthIt(hand)) {
          current.qsChargeWorthIt++;
        }
      }
      if (playerHand.tookJd && playerHand.tookTc) {
        current.tj++;
      }
      if (playerHand.tookQs && playerHand.tookTc) {
        current.tq++;
      }
      if (playerHand.tookQs && playerHand.tookTc && playerHand.tookJd) {
        current.tqj++;
      }
      if (playerHand.tookQs && playerHand.hearts === 12) {
        current.antiruns++;
      }
      if (playerHand.tookQs && playerHand.hearts === 13) {
        current.runs++;
      }
      if (playerHand.chargedQs && playerHand.tookQs) {
        current.tookOwnQsCharge++;
      }
      if (playerHand.chargedJd && playerHand.tookJd) {
        current.tookOwnJdCharge++;
      }
      if (playerHand.chargedTc && playerHand.tookTc) {
        current.tookOwnTcCharge++;
      }
    }
    current.handScoreStdDev = Math.sqrt(current.scoreSumSquared / current.hands);
    return current;
  }
}

export class StatsGameAnalysis implements IGameAnalysis<Stats> {
  public initialState(): Stats {
    return initialStats();
  }

  public analyze(current: Stats, game: IGame): Stats {
    if (!game.players || game.players.length === 0) {
      return current;
    }
    if (game.players.some(p => p == null) || game.hands == null || game.hands.length === 0) {
      return current;
    }

    analyzeHands(game.hands, new StatsHandAnalysis(), current);

    return current;
  }
}
