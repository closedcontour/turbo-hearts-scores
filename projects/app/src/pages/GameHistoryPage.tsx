import { analyzeGames, IGame, PlayerSet } from "@turbo-hearts-scores/shared";
import * as React from "react";
import { VictoryChart, VictoryLine, VictoryTooltip, VictoryVoronoiContainer } from "victory";
import { ScoreHistory } from "../../../shared/src/analysis/ScoreHistory";
import { GameLoader } from "../api/gameLoader";

interface GameHistoryPageProps {
  gameLoader: GameLoader;
  showPlayers?: string[];
}

interface GameHistoryPageState {
  loading: boolean;
  seasonGames: IGame[];
  players: Set<string>;
  width: number;
  height: number;
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

export class GameHistoryPage extends React.PureComponent<
  GameHistoryPageProps,
  GameHistoryPageState
> {
  public state: GameHistoryPageState = {
    loading: false,
    seasonGames: [],
    players: new Set<string>(),
    width: 1000,
    height: 500,
  };

  public render() {
    if (!this.state.seasonGames) {
      return "Loading...";
    }
    return this.renderHistory();
  }

  public async componentDidMount() {
    this.fetchGames();
  }

  private renderHistory() {
    if (!this.state.seasonGames) {
      return;
    }
    const scoreHistory = analyzeGames(this.state.seasonGames, new ScoreHistory());
    const scoresByPlayerOverTime = Object.keys(scoreHistory.history).filter(
      player =>
        this.props.showPlayers === undefined ||
        this.props.showPlayers.includes(scoreHistory.history[player].id),
    );
    return (
      <div className="th-season-history">
        <div className="chart" ref={this.setChartRef}>
          <VictoryChart
            width={this.state.width}
            height={this.state.height}
            containerComponent={<VictoryVoronoiContainer />}
          >
            {scoresByPlayerOverTime.map((player, playerIndex) => {
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
          {scoresByPlayerOverTime.map((player, playerIndex) => {
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
    this.setState({ loading: true });
    const allGames = await this.props.gameLoader.loadGames();
    allGames.sort((g1, g2) => g1.time - g2.time);

    const players = new Set<string>();
    const playerSet = analyzeGames(allGames, new PlayerSet());
    Array.from(playerSet.players)
      .filter(
        player =>
          this.props.showPlayers === undefined || this.props.showPlayers.includes(player.id),
      )
      .forEach(player => players.add(player.name));

    this.setState({ loading: false, seasonGames: allGames, players });
  }

  private setChartRef = (ref: HTMLElement | null) => {
    if (ref != null) {
      this.setState({ width: ref.clientWidth, height: ref.clientHeight });
      window.addEventListener("resize", () => {
        this.setState({ width: ref.clientWidth, height: ref.clientHeight });
      });
    }
  };
}
