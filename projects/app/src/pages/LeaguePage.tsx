import { ILeague, IPlayer, ISeason } from "@turbo-hearts-scores/shared";
import classNames = require("classnames");
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Api } from "../api/transport";
import { PlayerChooser } from "./components/PlayerChooser";

interface LeaguePageProps extends RouteComponentProps<{ leagueId: string }> {
  api: Api;
}

interface LeaguePageState {
  loading: boolean;
  league: ILeague | undefined;
  players: IPlayer[];
  newSeason: string;
  playerToAdd: IPlayer | undefined;
}

export class LeaguePage extends React.Component<LeaguePageProps, LeaguePageState> {
  public state: LeaguePageState = {
    loading: false,
    league: undefined,
    players: [],
    newSeason: "",
    playerToAdd: undefined,
  };

  public render() {
    return (
      <div className="th-league th-page">
        <div className="th-nav">
          <a href="/">← Back to Home</a>
        </div>
        {this.state.league && <h1>{this.state.league.name}</h1>}
        <div className="side-by-side">
          <div className="left">
            <h3>Seasons</h3>
            <div className="season-list">
              {this.state.league && this.state.league.seasons!.map(this.renderSeason)}
            </div>
            <input
              className="th-text-input"
              type="text"
              value={this.state.newSeason}
              onChange={this.handleNewSeasonChange}
              placeholder="Enter new season name"
            />
            <div
              className={classNames("th-button", { invalid: this.state.newSeason.length === 0 })}
              onClick={this.handleNewSeason}
            >
              New Season
            </div>
          </div>
          <div className="right">
            <h3>Players</h3>
            <div className="player-list">
              {this.state.league && this.state.league.players!.map(this.renderPlayer)}
            </div>
            {this.state.league && this.renderAddPlayer()}
          </div>
        </div>
      </div>
    );
  }

  public async componentDidMount() {
    this.fetchPlayers();
    this.fetchLeague();
  }

  private renderAddPlayer() {
    const playerIdsInLeague = new Set(this.state.league!.players!.map(p => p.id));
    const addablePlayers = this.state.players.filter(p => !playerIdsInLeague.has(p.id));
    return (
      <div>
        <PlayerChooser
          players={addablePlayers}
          selectedPlayer={this.state.playerToAdd}
          onPlayerChanged={this.handlePlayerChooserChange}
        />
        <div
          className={classNames("th-button", { invalid: this.state.playerToAdd == null })}
          onClick={this.handleAddPlayer}
        >
          Add Player
        </div>
      </div>
    );
  }

  private async fetchLeague() {
    const leagueId = this.props.match.params.leagueId;
    this.setState({ loading: true });
    const league = await this.props.api.fetchLeague(leagueId);
    this.setState({ loading: false, league });
  }

  private async fetchPlayers() {
    this.setState({ loading: true });
    const players = await this.props.api.fetchPlayers();
    this.setState({ loading: false, players });
  }

  private renderSeason = (season: ISeason) => {
    const nav = () =>
      this.props.history.push(`/league/${this.props.match.params.leagueId}/season/${season.id}`);
    return (
      <div key={season.id}>
        <a onClick={nav}>{season.name}</a>
      </div>
    );
  };

  private renderPlayer = (player: IPlayer) => {
    return <div key={player.id}>{player.name}</div>;
  };

  private handleNewSeasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newSeason: event.target.value });
  };

  private handlePlayerChooserChange = (player: IPlayer | undefined) => {
    this.setState({ playerToAdd: player });
  };

  private handleNewSeason = async () => {
    const leagueId = this.props.match.params.leagueId;
    this.setState({ loading: true });
    await this.props.api.createSeason(leagueId, this.state.newSeason);
    this.setState({ loading: false, newSeason: "" });
    this.fetchLeague();
  };

  private handleAddPlayer = async () => {
    const leagueId = this.props.match.params.leagueId;
    const playerId = this.state.playerToAdd!.id.toString();
    this.setState({ loading: true });
    await this.props.api.addPlayerToLeague(leagueId, playerId);
    this.setState({ loading: false, playerToAdd: undefined });
    this.fetchLeague();
  };
}
