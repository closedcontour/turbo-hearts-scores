import { IGame } from "..";
import { analyzeHands, IGameAnalysis } from "./api";
import { HandSummary } from "./HandSummary";

export interface ScoreMap {
  [key: string]: {
    name: string;
    games: number;
    totalDelta: number;
  };
}

function emptyEntry(name: string) {
  return {
    name,
    games: 0,
    totalDelta: 0,
  };
}

export class Scoreboard implements IGameAnalysis<ScoreMap> {
  public initialState() {
    return {};
  }

  public analyze(current: ScoreMap, game: IGame): ScoreMap {
    if (!game.players || game.players.length === 0) {
      return current;
    }
    if (game.players.some(p => p == null) || game.hands == null || game.hands.length === 0) {
      return current;
    }
    const handSummary = analyzeHands(game.hands, new HandSummary());
    for (const key in handSummary) {
      if (handSummary.hasOwnProperty(key)) {
        const entry =
          current[key] || emptyEntry(game.players.find(p => p!.id.toString() === key)!.name);
        entry.games++;
        entry.totalDelta += handSummary[key].totalDelta;
        current[key] = entry;
      }
    }
    return current;
  }
}
