import * as React from "react";
import { RouteComponentProps } from "react-router";
import { IBasicLeague, IPlayer } from "../api/api";
import { Api } from "../api/transport";

interface HomePageProps extends RouteComponentProps<{}> {
  api: Api;
}

interface HomePageState {
  loading: boolean;
  leagues: IBasicLeague[];
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
      <div className="th-home">
        <h3>Choose a League</h3>
        {this.state.leagues.map(this.renderLeague)}
        <hr />
        <input type="text" value={this.state.newLeague} onChange={this.handleNewLeagueChange} />
        <button onClick={this.handleNewLeague} disabled={this.state.newLeague.length === 0}>
          Create a New League
        </button>
        <hr />
        <div>{this.state.players.length} Players</div>
        <input type="text" value={this.state.newPlayer} onChange={this.handleNewPlayerChange} />
        <button onClick={this.handleNewPlayer} disabled={this.state.newPlayer.length === 0}>
          Create a New Player
        </button>
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

  private renderLeague = (league: IBasicLeague) => {
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
    this.setState({ loading: false });
    this.fetchData();
  };

  private handleNewPlayer = async () => {
    this.setState({ loading: true });
    await this.props.api.createPlayer(this.state.newPlayer);
    this.setState({ loading: false });
    this.fetchData();
  };
}
