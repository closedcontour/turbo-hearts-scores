import {
  analyzeGameHands,
  getHandResult,
  IGame,
  IHand,
  IHandAnalysis,
  scoresToDelta,
} from "@turbo-hearts-scores/shared";
import * as React from "react";
import { GameLoader } from "../../api/gameLoader";
import { renderFraction, renderPercent } from "../../util";
import { Card } from "../components/Card";

interface PlayerStatsPageProps {
  gameLoader: GameLoader;
  playerId: string;
}

interface PlayerStatsPageState {
  games: IGame[];
  stats: undefined | PlayerStats;
}

export class PlayerStatsPage extends React.PureComponent<
  PlayerStatsPageProps,
  PlayerStatsPageState
> {
  public state: PlayerStatsPageState = {
    stats: undefined,
    games: [],
  };

  public async componentDidMount() {
    this.fetchGames();
  }

  public render() {
    return (
      <div className="player-stats-page">
        {this.props.playerId}
        <br />
        Stats<br />
        {this.renderStats()}
        Games
        {this.renderGames()}
      </div>
    );
  }

  private renderStats() {
    if (this.state.stats === undefined) {
      return null;
    }
    return (
      <div>
        <div>Hands {this.state.stats.hands}</div>
        <div className="row">
          <div className="th-card">Runs</div>
          <div className="abs">{this.state.stats.runs}</div>
          <div className="pct">
            {renderFraction(this.state.stats.hearts, this.state.stats.hands)}
          </div>
        </div>
        <div>Took (negative outcomes only)</div>
        <div className="row">
          <Card rank="10" suit="CLUBS" />
          <div className="abs">{this.state.stats.tookTc}</div>
          <div className="pct">
            {renderPercent(this.state.stats.tookTc, this.state.stats.hands)}
          </div>
        </div>
        <div className="row">
          <Card rank="J" suit="DIAMONDS" />
          <div className="abs">{this.state.stats.tookJd}</div>
          <div className="pct">
            {renderPercent(this.state.stats.tookJd, this.state.stats.hands)}
          </div>
        </div>
        <div className="row">
          <Card rank="Q" suit="SPADES" />
          <div className="abs">{this.state.stats.tookQs}</div>
          <div className="pct">
            {renderPercent(this.state.stats.tookQs, this.state.stats.hands)}
          </div>
        </div>
        <div className="row">
          <Card rank="" suit="HEARTS" />
          <div className="abs">{this.state.stats.hearts}</div>
          <div className="pct">
            {renderFraction(this.state.stats.hearts, this.state.stats.hands)}
          </div>
        </div>
        <div>Charged</div>
        <div>
          <Card rank="10" suit="CLUBS" /> {this.state.stats.tcCharges}
        </div>
        <div>
          <Card rank="J" suit="DIAMONDS" /> {this.state.stats.jdCharges}
        </div>
        <div>
          <Card rank="Q" suit="SPADES" /> {this.state.stats.qsCharges}
        </div>
        <div>
          <Card rank="A" suit="HEARTS" /> {this.state.stats.ahCharges}
        </div>
      </div>
    );
  }

  private renderGames() {
    return this.state.games.map(this.renderGame);
  }

  private renderGame = (game: IGame) => {
    const myIndex = game.players!.findIndex(p => p!.id === this.props.playerId);
    const renderHand = (hand: IHand) => {
      const result = getHandResult(hand);
      if (!result.valid) {
        return;
      }
      const scoreElements = [];
      for (let i = 0; i < 4; i++) {
        const adjIndex = (myIndex + i) % 4;
        scoreElements.push(
          <span className="score" key={i}>
            {result.scores[adjIndex]}
          </span>,
        );
      }
      return (
        <div className="hand" key={hand.id}>
          {scoreElements}
        </div>
      );
    };
    const players = [];
    for (let i = 0; i < 4; i++) {
      const adjIndex = (myIndex + i) % 4;
      const p = game.players![adjIndex]!;
      players.push(
        <span className="player" key={p.id}>
          {p.name}
        </span>,
      );
    }
    return (
      <div className="game" key={game.id}>
        <div className="players">{players}</div>
        {game.hands!.map(renderHand)}
      </div>
    );
  };

  private async fetchGames() {
    const allGames = await this.props.gameLoader.loadGames();
    const stats = analyzeGameHands(allGames, new PlayerStatsAnalysis(this.props.playerId));
    this.setState({ games: allGames, stats });
  }
}

interface PlayerStats {
  qsCharges: number;
  qsChargeValue: number;
  jdCharges: number;
  jdChargeValue: number;
  tcCharges: number;
  tcChargeValue: number;
  ahCharges: number;
  ahChargeValue: number;
  runs: number;
  tq: number;
  tj: number;
  tookQs: number;
  tookJd: number;
  tookTc: number;
  hearts: number;
  deltas: number[];
  hands: number;
}
class PlayerStatsAnalysis implements IHandAnalysis<PlayerStats> {
  constructor(private playerId: string) {}

  public initialState(): PlayerStats {
    return {
      qsCharges: 0,
      qsChargeValue: 0,
      jdCharges: 0,
      jdChargeValue: 0,
      tcCharges: 0,
      tcChargeValue: 0,
      ahCharges: 0,
      ahChargeValue: 0,
      runs: 0,
      tq: 0,
      tj: 0,
      tookQs: 0,
      tookJd: 0,
      tookTc: 0,
      hearts: 0,
      deltas: [],
      hands: 0,
    };
  }

  public analyze(current: PlayerStats, target: IHand) {
    const myIndex = target.players!.findIndex(p => p!.id === this.playerId);
    if (myIndex === -1) {
      return current;
    }
    const result = getHandResult(target);
    if (!result.valid) {
      return current;
    }
    const myHand = target.playerHands[myIndex];
    const ran = result.moonshots[myIndex];
    if (myHand.chargedAh) {
      current.ahCharges++;
    }
    if (myHand.chargedQs) {
      current.qsCharges++;
    }
    if (myHand.tookQs && !ran) {
      current.tookQs++;
    }
    if (myHand.chargedJd) {
      current.jdCharges++;
    }
    if (myHand.tookJd) {
      current.tookJd++;
    }
    if (myHand.chargedTc) {
      current.tcCharges++;
    }
    if (myHand.tookTc) {
      current.tookTc++;
    }
    if (myHand.hearts > 0 && !ran) {
      current.hearts++;
    }
    if (ran) {
      current.runs++;
    }
    if (myHand.tookQs && myHand.tookTc) {
      current.tq++;
    }
    if (myHand.tookJd && myHand.tookTc) {
      current.tj++;
    }
    current.hands++;
    const deltas = scoresToDelta(result.scores);
    current.deltas.push(deltas[myIndex]);
    return current;
  }
}
