import { analyzeGames, VsDeltaHistory } from "@turbo-hearts-scores/shared";
import * as React from "react";
import { VictoryChart, VictoryLine, VictoryTooltip, VictoryVoronoiContainer } from "victory";
import { GameLoader } from "../api/gameLoader";

interface VsPageProps {
  gameLoader: GameLoader;
  p1Id: string;
  p2Id: string;
}

interface VsPageState {
  loading: boolean;
  deltas: number[];
  width: number;
  height: number;
  p1Name?: string;
  p2Name?: string;
}

export class VsPage extends React.PureComponent<VsPageProps, VsPageState> {
  public state: VsPageState = {
    loading: false,
    deltas: [],
    width: 1000,
    height: 500,
    p1Name: undefined,
    p2Name: undefined,
  };

  public render() {
    if (!this.state.deltas) {
      return "Loading...";
    }
    return this.renderHistory();
  }

  public async componentDidMount() {
    this.fetchGames();
  }

  private renderHistory() {
    if (!this.state.deltas) {
      return;
    }
    return (
      <div className="th-vs-page">
        <div className="chart" ref={this.setChartRef}>
          <VictoryChart
            width={this.state.width}
            height={this.state.height}
            containerComponent={<VictoryVoronoiContainer />}
          >
            <VictoryLine
              key={this.props.p1Id}
              data={this.state.deltas.map((d, i) => ({
                x: i,
                y: d,
                label:
                  d > 0
                    ? `${this.state.p2Name} owes ${this.state.p1Name} ${d}`
                    : `${this.state.p1Name} owes ${this.state.p2Name} ${0 - d}`,
              }))}
              style={{
                data: { stroke: "#D13913" },
              }}
              // tslint:disable-next-line:jsx-no-lambda
              labelComponent={<VictoryTooltip />}
            />
          </VictoryChart>
        </div>
        <div className="legend">
          <span className="entry">
            <span className="sample" style={{ backgroundColor: "#D13913" }} />
            <span className="label">
              {this.state.p1Name} vs {this.state.p2Name}
            </span>
          </span>
        </div>
      </div>
    );
  }

  private async fetchGames() {
    this.setState({ loading: true });
    const allGames = await this.props.gameLoader.loadGames();
    allGames.sort((g1, g2) => g1.time - g2.time);
    const deltas = analyzeGames(allGames, new VsDeltaHistory(this.props.p1Id, this.props.p2Id))
      .deltaHistory;
    const p1Game = allGames.find(
      game =>
        game.players != null &&
        game.players.find(p => p != null && p.id === this.props.p1Id) !== null,
    );
    const p1 =
      p1Game != null &&
      p1Game.players != null &&
      p1Game.players.find(p => p != null && p.id === this.props.p1Id);
    const p1Name = p1 ? p1.name : undefined;
    const p2Game = allGames.find(
      game =>
        game.players != null &&
        game.players.find(p => p != null && p.id === this.props.p2Id) !== null,
    );
    const p2 =
      p2Game != null &&
      p2Game.players != null &&
      p2Game.players.find(p => p != null && p.id === this.props.p2Id);
    const p2Name = p2 ? p2.name : undefined;
    this.setState({ loading: false, deltas, p1Name, p2Name });
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
