import { IHand } from "../api";
import { IHandAnalysis } from "./api";
import { getHandResult } from "./HandResult";

export interface VsHandDeltaResult {
  delta: number;
}

export class VsHandDelta implements IHandAnalysis<VsHandDeltaResult> {
  private p1Id: string;
  private p2Id: string;

  constructor(p1Id: string, p2Id: string) {
    this.p1Id = p1Id;
    this.p2Id = p2Id;
  }

  public initialState(): VsHandDeltaResult {
    return {
      delta: 0,
    };
  }

  public analyze(current: VsHandDeltaResult, hand: IHand): VsHandDeltaResult {
    const handResult = getHandResult(hand);
    if (!handResult.valid) {
      return current;
    }

    const p1Idx = hand.players.findIndex(p => p.id === this.p1Id);
    const p2Idx = hand.players.findIndex(p => p.id === this.p2Id);
    if (p1Idx === -1 || p2Idx === -1) {
      return current;
    }

    return {
      delta: current.delta - handResult.scores[p1Idx] + handResult.scores[p2Idx],
    };
  }
}
