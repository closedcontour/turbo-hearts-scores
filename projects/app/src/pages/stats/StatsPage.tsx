import { analyzeGames } from "@turbo-hearts-scores/shared";
import * as React from "react";
import { GameLoader } from "../../api/gameLoader";
import { renderPercent } from "../../util";
import { Card } from "../components/Card";
import { Stats, StatsGameAnalysis } from "./StatsAnalysis";

interface StatsPageProps {
  gameLoader: GameLoader;
}

interface StatsPageState {
  stats: undefined | Stats;
}

export class StatsPage extends React.PureComponent<StatsPageProps, StatsPageState> {
  public state: StatsPageState = {
    stats: undefined,
  };

  public async componentDidMount() {
    this.fetchGames();
  }

  public render() {
    if (this.state.stats !== undefined) {
      return this.renderStats(this.state.stats);
    }
    return null;
  }

  private renderStats(stats: Stats) {
    return (
      <div className="stats-page">
        <h4>
          In <b>{stats.hands}</b> hands:
        </h4>
        <ul>
          <li>A player ran {renderPercent(stats.runs, stats.hands)} of the time.</li>
          <li>A player antiran {renderPercent(stats.antiruns, stats.hands)} of the time.</li>
          <li>
            A player was <Card rank="10" suit="CLUBS" />
            <Card rank="Q" suit="SPADES" />'d in {renderPercent(stats.tq, stats.hands)}.
          </li>
          <li>
            A player took <Card rank="10" suit="CLUBS" />
            <Card rank="J" suit="DIAMONDS" /> in {renderPercent(stats.tj, stats.hands)}.
          </li>
          <li>
            A player took <Card rank="10" suit="CLUBS" />
            <Card rank="Q" suit="SPADES" />
            <Card rank="J" suit="DIAMONDS" /> in {renderPercent(stats.tqj, stats.hands)}.
          </li>
          <li>
            The <Card rank="Q" suit="SPADES" /> was charged in{" "}
            {renderPercent(stats.qsCharges, stats.hands)}, and was taken by the charger{" "}
            {renderPercent(stats.tookOwnQsCharge, stats.qsCharges)} of the time. It was worth it{" "}
            {renderPercent(stats.qsChargeWorthIt, stats.qsCharges)} of the time.
          </li>
          <li>
            The <Card rank="J" suit="DIAMONDS" /> was charged in{" "}
            {renderPercent(stats.jdCharges, stats.hands)}, and was taken by the charger{" "}
            {renderPercent(stats.tookOwnJdCharge, stats.jdCharges)} of the time.
          </li>
          <li>
            The <Card rank="10" suit="CLUBS" /> was charged in{" "}
            {renderPercent(stats.tcCharges, stats.hands)}, and was taken by the charger{" "}
            {renderPercent(stats.tookOwnTcCharge, stats.tcCharges)} of the time. It was worth it{" "}
            {renderPercent(stats.tcChargeWorthIt, stats.tcCharges)} of the time.
          </li>
          <li>
            The <Card rank="A" suit="HEARTS" /> was charged in{" "}
            {renderPercent(stats.ahCharges, stats.hands)}. It was worth it{" "}
            {renderPercent(stats.ahChargeWorthIt, stats.ahCharges)} of the time.
          </li>
          <li>
            The score standard deviation was <b>{stats.handScoreStdDev.toFixed(1)}</b>.
          </li>
        </ul>
      </div>
    );
  }

  private async fetchGames() {
    const allGames = await this.props.gameLoader.loadGames();
    const stats = analyzeGames(allGames, new StatsGameAnalysis());
    this.setState({ stats });
  }
}
