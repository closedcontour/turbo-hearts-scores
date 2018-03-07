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
    return (
      <div className="th-league">{this.state.season && <h1>{this.state.season.name}</h1>}</div>
    );
  }

  public async componentDidMount() {
    this.fetchSeason();
  }

  private async fetchSeason() {
    const seasonId = this.props.match.params.seasonId;
    this.setState({ loading: true });
    const season = await this.props.api.fetchSeason(seasonId);
    this.setState({ loading: false, season });
  }
}
