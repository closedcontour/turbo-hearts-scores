import { ILeague, IPlayer } from "@turbo-hearts-scores/shared";
import classNames = require("classnames");
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Api } from "../api/transport";

interface HomePageProps extends RouteComponentProps<{}> {
  api: Api;
}

interface HomePageState {
  loading: boolean;
  leagues: ILeague[];
  players: IPlayer[];
  newLeague: string;
  newPlayer: string;
}

export class HomePage extends React.Component<HomePageProps, HomePageState> {
  public state: HomePageState = {
    loading: false,
    leagues: [],
    players: [],
    newLeague: "",
    newPlayer: "",
  };

  public render() {
    return (
      <div className="th-home th-page">
        <div className="logo-piece">🏃</div>
        <div className="logo-piece">🚫</div>
        <h3>Leagues</h3>
        <div className="league-list">{this.state.leagues.map(this.renderLeague)}</div>
        <input
          className="th-text-input"
          type="text"
          value={this.state.newLeague}
          onChange={this.handleNewLeagueChange}
          placeholder="Enter a league name"
        />
        <div
          className={classNames("th-button pad", { invalid: this.state.newLeague.length === 0 })}
          onClick={this.handleNewLeague}
        >
          New League
        </div>
        <input
          className="th-text-input"
          type="text"
          value={this.state.newPlayer}
          onChange={this.handleNewPlayerChange}
          placeholder="Enter a short player name"
        />
        <div
          className={classNames("th-button", { invalid: this.state.newPlayer.length === 0 })}
          onClick={this.handleNewPlayer}
        >
          New Player
        </div>
      </div>
    );
  }

  public async componentDidMount() {
    this.fetchData();
  }

  private async fetchData() {
    this.setState({ loading: true });
    const leagues = await this.props.api.fetchLeagues();
    const players = await this.props.api.fetchPlayers();
    this.setState({ loading: false, leagues, players });
  }

  private renderLeague = (league: ILeague) => {
    const nav = () => this.props.history.push(`/league/${league.id}`);
    return (
      <div key={league.id}>
        <a onClick={nav}>{league.name}</a>
      </div>
    );
  };

  private handleNewLeagueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newLeague: event.target.value });
  };

  private handleNewPlayerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newPlayer: event.target.value });
  };

  private handleNewLeague = async () => {
    this.setState({ loading: true });
    await this.props.api.createLeague(this.state.newLeague);
    this.setState({ loading: false, newLeague: "" });
    this.fetchData();
  };

  private handleNewPlayer = async () => {
    this.setState({ loading: true });
    await this.props.api.createPlayer(this.state.newPlayer);
    this.setState({ loading: false, newPlayer: "" });
    this.fetchData();
  };
}
