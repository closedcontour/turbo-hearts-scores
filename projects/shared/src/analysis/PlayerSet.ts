import { IGame, IPlayer } from "..";
import { IGameAnalysis } from "./api";
import { PlayerSetResult } from "./PlayerSet";

export interface PlayerSetResult {
  players: Set<IPlayer>;
}

function emptyResult() {
  return {
    players: new Set<IPlayer>(),
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
export class PlayerSet implements IGameAnalysis<PlayerSetResult> {
  public initialState() {
    return emptyResult();
  }

  public analyze(current: PlayerSetResult, game: IGame): PlayerSetResult {
    if (!gameValid(game)) {
      return current;
    }
    game.players!.forEach(player => current.players.add(player!));
    return current;
  }
}
