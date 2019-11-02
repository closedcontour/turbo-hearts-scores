import { IGame, IHand } from "..";

export interface IAnalysis<T, R> {
  initialState(): R;
  analyze(current: R, target: T): R;
}

export interface IHandAnalysis<R> extends IAnalysis<IHand, R> {}

export interface IGameAnalysis<R> extends IAnalysis<IGame, R> {}

export function analyzeGames<R>(games: IGame[], analysis: IGameAnalysis<R>): R {
  let current = analysis.initialState();
  for (const game of games) {
    current = analysis.analyze(current, game);
  }
  return current;
}

export function analyzeHands<R>(hands: IHand[], analysis: IHandAnalysis<R>, initialState?: R): R {
  let current = initialState === undefined ? analysis.initialState() : initialState;
  for (const hand of hands) {
    current = analysis.analyze(current, hand);
  }
  return current;
}

export function analyzeGameHands<R>(games: IGame[], analysis: IHandAnalysis<R>): R {
  let current = analysis.initialState();
  for (const game of games) {
    if (game.hands == null) {
      continue;
    }
    for (const hand of game.hands) {
      current = analysis.analyze(current, hand);
    }
  }
  return current;
}
