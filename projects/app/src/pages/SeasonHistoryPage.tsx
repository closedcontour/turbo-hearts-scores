import { analyzeGames, IGame, PlayerSet } from "@turbo-hearts-scores/shared";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { VictoryChart, VictoryLine, VictoryTooltip, VictoryVoronoiContainer } from "victory";
import { ScoreHistory } from "../../../shared/src/analysis/ScoreHistory";
import { Api } from "../api/transport";

interface SeasonHistoryPageProps
  extends RouteComponentProps<{ leagueId: string; seasonId: string }> {
  api: Api;
}

interface SeasonHistoryPageState {
  loading: boolean;
  seasonGames: IGame[];
  players: Set<string>;
}

const COLORS = [
  "#2965CC",
  "#29A634",
  "#D99E0B",
  "#D13913",
  "#8F398F",
  "#00B3A4",
  "#DB2C6F",
  "#9BBF30",
  "#96622D",
  "#7157D9",
];

// TODO: this should be a generic GameHistoryPage with a season loader
export class SeasonHistoryPage extends React.PureComponent<
  SeasonHistoryPageProps,
  SeasonHistoryPageState
> {
  public state: SeasonHistoryPageState = {
    loading: false,
    seasonGames: [],
    players: new Set<string>(),
  };

  public render() {
    if (!this.state.seasonGames) {
      return "Loading...";
    }
    return <div className="th-season-history">{this.renderHistory()}</div>;
  }

  public async componentDidMount() {
    this.fetchGames();
  }

  private renderHistory() {
    if (!this.state.seasonGames) {
      return;
    }
    const scoreHistory = analyzeGames(this.state.seasonGames, new ScoreHistory());
    return (
      <div>
        <div className="chart">
          <VictoryChart width={1000} height={500} containerComponent={<VictoryVoronoiContainer />}>
            {Object.keys(scoreHistory.history).map((player, playerIndex) => {
              const playerName = scoreHistory.history[player].name;
              if (!this.state.players.has(playerName)) {
                return null;
              }
              const data = scoreHistory.history[player].deltaHistory.map((d, i) => ({
                x: i,
                y: d,
                label: `${playerName} ${d}`,
              }));
              const style = {
                data: { stroke: COLORS[playerIndex % COLORS.length] },
              };
              return (
                <VictoryLine
                  key={player}
                  data={data}
                  style={style}
                  // tslint:disable-next-line:jsx-no-lambda
                  labelComponent={<VictoryTooltip />}
                />
              );
            })}
          </VictoryChart>
        </div>
        <div className="legend">
          {Object.keys(scoreHistory.history).map((player, playerIndex) => {
            const color = COLORS[playerIndex % COLORS.length];
            const playerName = scoreHistory.history[player].name;
            const togglePlayer = () => {
              if (this.state.players.has(playerName)) {
                this.state.players.delete(playerName);
              } else {
                this.state.players.add(playerName);
              }
              this.forceUpdate();
            };
            return (
              <span className="entry" key={player} onClick={togglePlayer}>
                <span
                  className="sample"
                  style={{
                    backgroundColor: color,
                    opacity: this.state.players.has(playerName) ? 1 : 0.2,
                  }}
                />
                <span className="label">{playerName}</span>
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  private async fetchGames() {
    const seasonId = this.props.match.params.seasonId;
    this.setState({ loading: true });
    const seasonGames = await this.props.api.fetchSeasonGames(seasonId);
    seasonGames.sort((g1, g2) => g1.time - g2.time);
    const players = new Set<string>();
    const playerSet = analyzeGames(seasonGames, new PlayerSet());
    playerSet.players.forEach(player => players.add(player.name));
    this.setState({ loading: false, seasonGames, players });
  }
}
