import * as React from "react";
import { RouteComponentProps } from "react-router";
import { ISeason } from "../api/api";
import { Api } from "../api/transport";

interface SeasonPageProps extends RouteComponentProps<{ seasonId: string }> {
  api: Api;
}

interface SeasonPageState {
  loading: boolean;
  season: ISeason | undefined;
  newSeason: string;
}

export class SeasonPage extends React.Component<SeasonPageProps, SeasonPageState> {
  public state: SeasonPageState = {
    loading: false,
    season: undefined,
    newSeason: "",
  };

  public render() {
    if (!this.state.season) {
      return "Loading...";
    }
    return (
      <div className="th-season">
        <a href={`/league/${this.state.season.league.id}`}>
          Back to {this.state.season.league.name}
        </a>
        <h1>{this.state.season.name}</h1>
        <button onClick={this.handleNewGame}>New Game</button>
        {this.renderGames()}
      </div>
    );
  }

  public async componentDidMount() {
    this.fetchSeason();
  }

  private renderGames() {
    if (!this.state.season!.games) {
      return null;
    }
    const games = this.state.season!.games!.map(game => {
      return (
        <div key={game.id} className="game">
          <a href={`/game/${game.id}`}>Game {game.id}</a>
        </div>
      );
    });
    return <div className="games">{games}</div>;
  }

  private async fetchSeason() {
    const seasonId = this.props.match.params.seasonId;
    this.setState({ loading: true });
    const season = await this.props.api.fetchSeason(seasonId);
    this.setState({ loading: false, season });
  }

  private handleNewGame = async () => {
    const seasonId = this.props.match.params.seasonId;
    this.setState({ loading: true });
    const game = await this.props.api.createGame(seasonId);
    this.props.history.push(`/game/${game.id}`);
    this.setState({ loading: false });
  };
}
