import { IGame, IHand } from "..";
import { IHandAnalysis } from "./api";
import { getHandResult } from "./HandResult";

export function scoresToDelta(scores: number[]): number[] {
  return [
    scores[1] + scores[2] + scores[3] - 3 * scores[0],
    scores[0] + scores[2] + scores[3] - 3 * scores[1],
    scores[0] + scores[1] + scores[3] - 3 * scores[2],
    scores[0] + scores[1] + scores[2] - 3 * scores[3],
  ];
}

export function getGameResult(game: IGame) {
  const scores = [0, 0, 0, 0];
  const hands = game.hands || [];
  hands.forEach(hand => {
    const result = getHandResult(hand);
    if (result.valid) {
      for (let i = 0; i < 4; i++) {
        scores[i] += result.scores[i];
      }
    }
  });
  return {
    scores,
    delta: scoresToDelta(scores),
  };
}

export interface HandSummaryResult {
  [key: string]: {
    totalScore: number;
    totalDelta: number;
    handCount: number;
  };
}

function emptyScore() {
  return {
    totalScore: 0,
    totalDelta: 0,
    handCount: 0,
  };
}

export class HandSummary implements IHandAnalysis<HandSummaryResult> {
  public initialState() {
    return {};
  }

  public analyze(current: HandSummaryResult, hand: IHand): HandSummaryResult {
    const handResult = getHandResult(hand);
    if (!handResult.valid) {
      return current;
    }
    const deltas = scoresToDelta(handResult.scores);
    for (let i = 0; i < 4; i++) {
      const player = hand.players[i];
      const pid = player.id.toString();
      const entry = current[pid] || emptyScore();
      entry.handCount++;
      entry.totalScore += handResult.scores[i];
      entry.totalDelta += deltas[i];
      current[pid] = entry;
    }
    return current;
  }
}
