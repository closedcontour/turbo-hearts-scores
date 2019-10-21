import { IGame } from "@turbo-hearts-scores/shared";

export interface GameLoader {
  loadGames(): Promise<IGame[]>;
}
