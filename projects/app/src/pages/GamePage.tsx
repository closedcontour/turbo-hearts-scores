import {
  analyzeGameHands,
  HandSummary,
  IGame,
  IHand,
  IPlayer,
  PASSES,
} from "@turbo-hearts-scores/shared";
import classNames = require("classnames");
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Api } from "../api/transport";
import { HandResult } from "./components/HandResult";
import { PlayerChooser } from "./components/PlayerChooser";

interface GamePageProps
  extends RouteComponentProps<{ leagueId: string; seasonId: string; gameId: string }> {
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
    return this.state.started ? this.renderScores() : this.renderPlayerChooser();
  }

  public componentDidMount() {
    this.fetchGame();
  }

  private renderBackNav() {
    const game = this.state.game!;
    const params = this.props.match.params;
    return (
      <div className="th-nav">
        <a href={`/league/${params.leagueId}/season/${params.seasonId}`}>
          ← Back to {game.season.name}
        </a>
      </div>
    );
  }

  private renderScores() {
    const game = this.state.game;
    if (game == null || game.players == null || game.hands == null) {
      return null;
    }
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
    const { leagueId, seasonId, gameId } = this.props.match.params;
    return (
      <HandResult
        leagueId={leagueId}
        seasonId={seasonId}
        gameId={gameId}
        hand={hand}
        key={hand.id}
      />
    );
  };

  private renderSummary = () => {
    const game = this.state.game;
    if (game == null || game.players == null) {
      return null;
    }
    const result = analyzeGameHands([game], new HandSummary());
    return game.players.map((player, i) => {
      return (
        <div className="cell" key={i}>
          {result[player!.id].totalScore}
          <br />
          {result[player!.id].totalDelta}
        </div>
      );
    });
  };

  private renderPlayerChooser() {
    const game = this.state.game;
    if (this.state.loading || !this.state.leaguePlayers || !game || game.players == null) {
      return <div className="th-game">Loading...</div>;
    }
    const handlePlayerChanged = (index: number) => (player: IPlayer | null) => {
      const newGame = {
        ...game,
        players: game.players!.slice(),
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
            selectedPlayer={game.players[i]}
            onPlayerChanged={handlePlayerChanged(i)}
          />
        </div>,
      );
    }
    const fullGame = game.players.every(p => p != null);
    const noDupes = new Set(game.players.map(p => (p == null ? -1 : p.id))).size === 4;
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
    const started = game.players !== undefined && game.players.every(p => p != null);
    this.setState({ loading: false, game, started }, this.fetchPlayers);
  }

  private async fetchPlayers() {
    const params = this.props.match.params;
    this.setState({ loading: true });
    const league = await this.props.api.fetchLeague(params.leagueId);
    this.setState({ loading: false, leaguePlayers: league.players });
  }

  private addHand = async () => {
    const game = this.state.game;
    if (game == null || game.hands == null) {
      return;
    }
    const gameId = this.props.match.params.gameId;
    this.setState({ loading: true });
    const pass = PASSES[game.hands.length];
    const hand = await this.props.api.createHand(gameId, pass);
    const params = this.props.match.params;
    this.props.history.push(`/league/${params.leagueId}/season/${params.seasonId}/hand/${hand.id}`);
    this.setState({ loading: false });
  };

  private startGame = async () => {
    const game = this.state.game;
    if (game == null || game.players == null) {
      return;
    }
    const gameId = this.props.match.params.gameId;
    this.setState({ loading: true });
    await this.props.api.startGame(gameId, game.players.map(p => (p ? p.id.toString() : null)));
    this.setState({ loading: false, started: true });
  };
}
