import * as React from "react";
import { RouteComponentProps } from "react-router";
import { IGame, IHand, IPlayer, PASSES } from "../api/api";
import { Api } from "../api/transport";
import { HandResult } from "./components/HandResult";
import { PlayerChooser } from "./components/PlayerChooser";

interface GamePageProps extends RouteComponentProps<{ gameId: string }> {
  api: Api;
}

interface GamePageState {
  loading: boolean;
  game: IGame | undefined;
  leaguePlayers: IPlayer[] | undefined;
  started: boolean;
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
    if (this.state.started) {
      return this.renderScores();
    } else {
      return this.renderPlayerChooser();
    }
  }

  public componentDidMount() {
    this.fetchGame();
  }

  private renderScores() {
    return (
      <div className="th-game">
        Game {this.props.match.params.gameId}
        <div className="hand-scores">{this.state.game!.hands.map(this.renderHand)}</div>
        <button onClick={this.addHand}>Add Hand</button>
      </div>
    );
  }

  private renderHand = (hand: IHand) => {
    return <HandResult hand={hand} />;
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
        <PlayerChooser
          key={i}
          players={this.state.leaguePlayers}
          selectedPlayer={this.state.game.players[i]}
          onPlayerChanged={handlePlayerChanged(i)}
        />,
      );
    }
    const fullGame = this.state.game.players.every(p => p != null);
    const noDupes = new Set(this.state.game.players.map(p => (p == null ? -1 : p.id))).size === 4;
    return (
      <div className="th-game">
        Game {this.props.match.params.gameId}
        {choosers}
        <button disabled={!fullGame || !noDupes} onClick={this.startGame}>
          Start
        </button>
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
    const wireGame = await this.props.api.startGame(
      gameId,
      this.state.game!.players.map(p => (p ? p.id.toString() : null)),
    );
    this.setState({ loading: false, started: true });
  };
}
