import { getHandResult, IGame, IHand } from "@turbo-hearts-scores/shared";
import * as React from "react";
import { GameLoader } from "../../api/gameLoader";
import { Stats } from "./StatsAnalysis";

interface PlayerStatsPageProps {
  gameLoader: GameLoader;
  playerId: string;
}

interface PlayerStatsPageState {
  games: IGame[];
  stats: undefined | Stats;
}

export class PlayerStatsPage extends React.PureComponent<
  PlayerStatsPageProps,
  PlayerStatsPageState
> {
  public state: PlayerStatsPageState = {
    stats: undefined,
    games: [],
  };

  public async componentDidMount() {
    this.fetchGames();
  }

  public render() {
    return (
      <div className="player-stats-page">
        Games
        {this.renderGames()}
      </div>
    );
  }

  private renderGames() {
    return this.state.games.map(this.renderGame);
  }

  private renderGame = (game: IGame) => {
    const myIndex = game.players!.findIndex(p => p!.id === this.props.playerId);
    const renderHand = (hand: IHand) => {
      const result = getHandResult(hand);
      if (!result.valid) {
        return;
      }
      const scoreElements = [];
      for (let i = 0; i < 4; i++) {
        const adjIndex = (myIndex + i) % 4;
        scoreElements.push(
          <span className="score" key={i}>
            {result.scores[adjIndex]}
          </span>,
        );
      }
      return (
        <div className="hand" key={hand.id}>
          {scoreElements}
        </div>
      );
    };
    const players = [];
    for (let i = 0; i < 4; i++) {
      const adjIndex = (myIndex + i) % 4;
      const p = game.players![adjIndex]!;
      players.push(
        <span className="player" key={p.id}>
          {p.name}
        </span>,
      );
    }
    return (
      <div className="game" key={game.id}>
        <div className="players">{players}</div>
        {game.hands!.map(renderHand)}
      </div>
    );
  };

  private async fetchGames() {
    const allGames = await this.props.gameLoader.loadGames();
    this.setState({ games: allGames });
  }
}
