import { getGameResult, IGame, IGamePlayerResult, IPlayer } from "@turbo-hearts-scores/shared";
import * as React from "react";

interface GameResultProps {
  leagueId: string;
  seasonId: string;
  game: IGame;
}

export class GameResult extends React.PureComponent<GameResultProps, {}> {
  public render() {
    const { leagueId, seasonId, game } = this.props;
    const results = getGameResult(game);
    return (
      <div className="game-result">
        {results.length === 0 && <div className="invalid">⚠️ Game doesn't have any results</div>}
        {results.map((result, i) => this.renderGameResult(game.players![i]!, result))}
        <a href={`/league/${leagueId}/season/${seasonId}/game/${game.id}`}>✏</a>
      </div>
    );
  }

  private renderGameResult(player: IPlayer, result: IGamePlayerResult) {
    let badges = "";
    for (let i = 0; i < result.moonshots; i++) {
      badges = badges + "🚀";
    }
    for (let i = 0; i < result.antiruns; i++) {
      badges = badges + "💣";
    }
    return (
      <div className="player">
        <div>{player.name}</div>
        <div>
          {result.delta} {badges}
        </div>
      </div>
    );
  }
}
