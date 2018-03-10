import classNames = require("classnames");
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { IGame, IHand, IPlayer, PASSES } from "../api/api";
import { Api } from "../api/transport";
import { HandResult } from "./components/HandResult";
import { PlayerChooser } from "./components/PlayerChooser";
import { getHandResult } from "./HandPage";

interface GamePageProps extends RouteComponentProps<{ gameId: string }> {
  api: Api;
}

interface GamePageState {
  loading: boolean;
  game: IGame | undefined;
  leaguePlayers: IPlayer[] | undefined;
  started: boolean;
}

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
  game.hands.forEach(hand => {
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

export class GamePage extends React.Component<GamePageProps, GamePageState> {
  public state: GamePageState = {
    loading: false,
    game: undefined,
    leaguePlayers: undefined,
    started: false,
  };

  public render() {
    if (this.state.game === undefined) {
      return <div className="th-game">"Loading..."</div>;
    }
    return this.state.started ? this.renderScores() : this.renderPlayerChooser();
  }

  public componentDidMount() {
    this.fetchGame();
  }

  private renderBackNav() {
    const game = this.state.game!;
    const seasonId = game.season.id;
    return (
      <div className="th-nav">
        <a href={`/season/${seasonId}`}>← Back to {game.season.name}</a>
      </div>
    );
  }

  private renderScores() {
    const game = this.state.game!;
    return (
      <div className="th-game th-page">
        {this.renderBackNav()}
        <div className="cells names">
          {game.players.map(p => this.renderName(p!))}
          <div className="small" />
        </div>
        <div className="hand-scores">{game.hands.map(this.renderHand)}</div>
        <div className="cells summary">
          {this.renderSummary()}
          <div className="small">
            <br />💰
          </div>
        </div>
        <div className="th-button" onClick={this.addHand}>
          Add Hand
        </div>
      </div>
    );
  }

  private renderName = (player: IPlayer) => {
    return (
      <div key={player.id} className="cell">
        {player.name}
      </div>
    );
  };

  private renderHand = (hand: IHand) => {
    return <HandResult hand={hand} key={hand.id} />;
  };

  private renderSummary = () => {
    const game = this.state.game!;
    const result = getGameResult(game);
    return result.scores.map((score, i) => {
      return (
        <div className="cell" key={i}>
          {score}
          <br />
          {result.delta[i]}
        </div>
      );
    });
  };

  private renderPlayerChooser() {
    if (this.state.loading || !this.state.leaguePlayers || !this.state.game) {
      return <div className="th-game">"Loading..."</div>;
    }
    const handlePlayerChanged = (index: number) => (player: IPlayer | undefined) => {
      const newGame = {
        ...this.state.game!,
        players: this.state.game!.players.slice(),
      };
      newGame.players[index] = player;
      this.setState({ game: newGame });
    };
    const choosers: JSX.Element[] = [];
    for (let i = 0; i < 4; i++) {
      choosers.push(
        <div className="chooser-wrapper" key={i}>
          {i + 1}{" "}
          <PlayerChooser
            players={this.state.leaguePlayers}
            selectedPlayer={this.state.game.players[i]}
            onPlayerChanged={handlePlayerChanged(i)}
          />
        </div>,
      );
    }
    const fullGame = this.state.game.players.every(p => p != null);
    const noDupes = new Set(this.state.game.players.map(p => (p == null ? -1 : p.id))).size === 4;
    const onClick = fullGame && noDupes ? this.startGame : undefined;
    return (
      <div className="th-game th-page">
        {this.renderBackNav()}
        <div className="instructions">
          Choose players in seat order from left to right starting anywhere.
        </div>
        <div className="choosers">{choosers}</div>
        <div
          className={classNames("th-button", { invalid: !fullGame || !noDupes })}
          onClick={onClick}
        >
          {!fullGame && "Add more players ✖"}
          {fullGame && !noDupes && "Fix duplicate players ✖"}
          {fullGame && noDupes && "Start Game 👍"}
        </div>
      </div>
    );
  }

  private async fetchGame() {
    const gameId = this.props.match.params.gameId;
    this.setState({ loading: true });
    const game = await this.props.api.fetchGame(gameId);
    const started = game.players.every(p => p != null);
    this.setState({ loading: false, game, started }, this.fetchPlayers);
  }

  private async fetchPlayers() {
    const leagueId = this.state.game!.season.league.id;
    this.setState({ loading: true });
    const league = await this.props.api.fetchLeague(leagueId.toString());
    this.setState({ loading: false, leaguePlayers: league.players });
  }

  private addHand = async () => {
    if (!this.state.game) {
      return;
    }
    const gameId = this.props.match.params.gameId;
    this.setState({ loading: true });
    const pass = PASSES[this.state.game.hands.length];
    const hand = await this.props.api.createHand(gameId, pass);
    this.props.history.push(`/hand/${hand.id}`);
    this.setState({ loading: false });
  };

  private startGame = async () => {
    const gameId = this.props.match.params.gameId;
    this.setState({ loading: true });
    await this.props.api.startGame(
      gameId,
      this.state.game!.players.map(p => (p ? p.id.toString() : null)),
    );
    this.setState({ loading: false, started: true });
  };
}
