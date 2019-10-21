import { IGame } from "..";
import { analyzeHands, IGameAnalysis } from "./api";
import { HandSummary } from "./HandSummary";
import { ScoreHistoryResult } from "./ScoreHistory";

export interface ScoreHistoryResult {
  games: number;
  history: {
    [key: string]: {
      name: string;
      id: string;
      deltaHistory: number[];
    };
  };
}

function emptyResult() {
  return {
    games: 0,
    history: {},
  };
}

export function gameValid(game: IGame) {
  if (!game.players || game.players.length === 0) {
    return false;
  }
  if (game.players.some(p => p == null) || game.hands == null || game.hands.length === 0) {
    return false;
  }
  return true;
}

/**
 * This requires that games be iterated on in temporal order.
 */
export class ScoreHistory implements IGameAnalysis<ScoreHistoryResult> {
  public initialState() {
    return emptyResult();
  }

  public analyze(current: ScoreHistoryResult, game: IGame): ScoreHistoryResult {
    if (!gameValid(game)) {
      return current;
    }
    const handSummary = analyzeHands(game.hands!, new HandSummary());
    const allPlayers = new Set([...Object.keys(current.history), ...Object.keys(handSummary)]);
    for (const playerId of allPlayers) {
      if (handSummary.hasOwnProperty(playerId)) {
        let entry = current.history[playerId];
        if (!entry) {
          entry = {
            id: playerId,
            name: game.players!.find(p => p!.id === playerId)!.name,
            deltaHistory: new Array(current.games + 1).fill(0),
          };
          current.history[playerId] = entry;
        }
        const delta = handSummary[playerId].totalDelta;
        if (current.games === 0) {
          entry.deltaHistory.push(delta);
        } else {
          entry.deltaHistory.push(entry.deltaHistory[entry.deltaHistory.length - 1] + delta);
        }
      } else {
        // Player not in game, propagate last value
        const d = current.history[playerId].deltaHistory;
        d.push(d[d.length - 1]);
      }
    }
    current.games++;
    return current;
  }
}
