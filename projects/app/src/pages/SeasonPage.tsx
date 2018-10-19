import { analyzeGames, IGame, ISeason, Scoreboard } from "@turbo-hearts-scores/shared";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Api } from "../api/transport";
import { GameResult } from "./components/GameResult";

interface SeasonPageProps extends RouteComponentProps<{ leagueId: string; seasonId: string }> {
  api: Api;
}

interface SeasonPageState {
  loading: boolean;
  loadingGames: boolean;
  season: ISeason | undefined;
  seasonGames: IGame[];
  newSeason: string;
}

export class SeasonPage extends React.PureComponent<SeasonPageProps, SeasonPageState> {
  public state: SeasonPageState = {
    loading: false,
    loadingGames: false,
    season: undefined,
    seasonGames: [],
    newSeason: "",
  };

  public render() {
    if (!this.state.season || !this.state.season.league) {
      return "Loading...";
    }
    const params = this.props.match.params;
    return (
      <div className="th-season th-page">
        <div className="th-nav">
          <a href={`/league/${params.leagueId}`}>← Back to {this.state.season.league.name}</a>
        </div>
        <h1>{this.state.season.name}</h1>
        <h3>
          Leaderboard (<a href={`/league/${params.leagueId}/season/${params.seasonId}/history`}>
            History
          </a>)
        </h3>
        {this.renderLeaderboard()}
        <h3>Games</h3>
        {this.renderGames()}
        <div className="th-button" onClick={this.handleNewGame}>
          New Game
        </div>
      </div>
    );
  }

  public async componentDidMount() {
    this.fetchSeason();
    this.fetchGames();
  }

  private renderLeaderboard() {
    if (!this.state.seasonGames) {
      return null;
    }
    return <div className="leaderboard">{this.renderScoreboard()}</div>;
  }

  private renderGames() {
    if (!this.state.seasonGames) {
      return null;
    }
    const params = this.props.match.params;
    const games = this.state.seasonGames.map(game => {
      return (
        <div key={game.id} className="game">
          <GameResult game={game} leagueId={params.leagueId} seasonId={params.seasonId} />
        </div>
      );
    });
    return (
      <div className="games">
        <div className="scoreboard">{games}</div>
      </div>
    );
  }

  private renderScoreboard() {
    if (!this.state.seasonGames) {
      return;
    }
    const scoreboard = analyzeGames(this.state.seasonGames, new Scoreboard());
    const values = Object.values(scoreboard);
    values.sort((a, b) => b.totalDelta - a.totalDelta);
    return (
      <div className="scoreboard">
        {values.map((value, i) => (
          <div key={value.name}>
            {i === 0 && "👨‍🚀"} {i === values.length - 1 && "🐋"} {value.name} / {value.totalDelta}
          </div>
        ))}
      </div>
    );
  }

  private async fetchSeason() {
    const seasonId = this.props.match.params.seasonId;
    this.setState({ loading: true });
    const season = await this.props.api.fetchSeason(seasonId);
    this.setState({ loading: false, season });
  }

  private async fetchGames() {
    const seasonId = this.props.match.params.seasonId;
    this.setState({ loadingGames: true });
    const seasonGames = await this.props.api.fetchSeasonGames(seasonId);
    this.setState({ loadingGames: false, seasonGames });
  }

  private handleNewGame = async () => {
    const { leagueId, seasonId } = this.props.match.params;
    this.setState({ loading: true });
    const game = await this.props.api.createGame(seasonId);
    this.props.history.push(`/league/${leagueId}/season/${seasonId}/game/${game.id}`);
    this.setState({ loading: false });
  };
}
