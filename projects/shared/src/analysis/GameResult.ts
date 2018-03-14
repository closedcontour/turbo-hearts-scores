import { IGame, scoresToDelta } from "..";
import { getHandResult } from "./";

export interface IGamePlayerResult {
  score: number;
  delta: number;
  moonshots: number;
  antiruns: number;
}

export function getGameResult(game: IGame): IGamePlayerResult[] {
  if (game.hands === undefined || game.hands.length === 0) {
    return [];
  }

  const handResults = game.hands.map(getHandResult);
  const gameResults: IGamePlayerResult[] = [];
  [0, 1, 2, 3].forEach(_i =>
    gameResults.push({
      score: 0,
      delta: 0,
      moonshots: 0,
      antiruns: 0,
    }),
  );
  handResults.forEach(hand => {
    if (!hand.valid) {
      return;
    }
    [0, 1, 2, 3].forEach(i => {
      gameResults[i].score += hand.scores[i];
      gameResults[i].delta += scoresToDelta(hand.scores)[i];
      gameResults[i].moonshots += hand.moonshots[i] ? 1 : 0;
      gameResults[i].antiruns += hand.antiruns[i] ? 1 : 0;
    });
  });
  return gameResults;
}
