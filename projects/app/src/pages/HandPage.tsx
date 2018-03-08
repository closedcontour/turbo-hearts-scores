import classNames = require("classnames");
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { IHand, IPlayerHand, Pass } from "../api/api";
import { Api } from "../api/transport";
import { PlayerHand } from "./components/PlayerHand";

interface HandPageProps extends RouteComponentProps<{ handId: string }> {
  api: Api;
}

interface HandPageState {
  loading: boolean;
  hand: IHand | undefined;
}

interface HandResult {
  valid: boolean;
  invalidReasons: string[];
  scores: number[];
}

function getHandResult(hand?: IHand): HandResult {
  if (hand === undefined) {
    return {
      valid: false,
      invalidReasons: ["Hand isn't loaded"],
      scores: [],
    };
  }
  let chargedQs = 0;
  let chargedJd = 0;
  let chargedTc = 0;
  let chargedAh = 0;
  let tookQs = 0;
  let tookJd = 0;
  let tookTc = 0;
  let hearts = 0;
  for (let i = 0; i <= 3; i++) {
    const playerHand = hand.playerHands[i];
    if (playerHand.chargedAh) {
      chargedAh++;
    }
    if (playerHand.chargedQs) {
      chargedQs++;
    }
    if (playerHand.chargedJd) {
      chargedJd++;
    }
    if (playerHand.chargedTc) {
      chargedTc++;
    }
    if (playerHand.tookQs) {
      tookQs++;
    }
    if (playerHand.tookJd) {
      tookJd++;
    }
    if (playerHand.tookTc) {
      tookTc++;
    }
    hearts += playerHand.hearts;
  }
  const invalidReasons: string[] = [];
  if (chargedTc > 1) {
    invalidReasons.push("Too many charged 10♣.");
  }
  if (chargedJd > 1) {
    invalidReasons.push("Too many charged J♦.");
  }
  if (chargedQs > 1) {
    invalidReasons.push("Too many charged Q♠.");
  }
  if (chargedAh > 1) {
    invalidReasons.push("Too many charged A♥.");
  }
  if (tookJd === 0) {
    invalidReasons.push("Who took the J♦?");
  }
  if (tookJd > 1) {
    invalidReasons.push("Too many J♦.");
  }
  if (tookQs === 0) {
    invalidReasons.push("Who took the Q♠?");
  }
  if (tookQs > 1) {
    invalidReasons.push("Too many Q♠.");
  }
  if (tookTc === 0) {
    invalidReasons.push("Who took the 10♣?");
  }
  if (tookTc > 1) {
    invalidReasons.push("Too many 10♣.");
  }
  if (hearts < 13) {
    invalidReasons.push("Who took the ♥s?");
  }
  if (hearts > 13) {
    invalidReasons.push("Too many ♥s.");
  }
  const scores: number[] = [];
  for (let i = 0; i <= 3; i++) {
    const playerHand = hand.playerHands[i];
    let points = 0;
    if (playerHand.tookQs) {
      points += chargedQs === 1 ? 26 : 13;
    }
    points += chargedAh === 1 ? 2 * playerHand.hearts : playerHand.hearts;
    if (playerHand.hearts === 13 && playerHand.tookQs) {
      points = -points;
    }
    if (playerHand.tookJd) {
      points -= chargedJd === 1 ? 20 : 10;
    }
    if (playerHand.tookTc) {
      points = chargedTc === 1 ? 4 * points : 2 * points;
    }
    scores.push(points);
  }
  return {
    valid: invalidReasons.length === 0,
    invalidReasons,
    scores,
  };
}

export class HandPage extends React.Component<HandPageProps, HandPageState> {
  public state: HandPageState = {
    loading: false,
    hand: undefined,
  };

  public render() {
    const result = getHandResult(this.state.hand);
    return (
      <div className="th-hand th-page">
        {this.state.hand && this.state.hand.pass}
        {this.state.hand &&
          this.state.hand.playerHands.map((playerHand, i) =>
            this.renderPlayerHand(playerHand, result.scores[i]),
          )}
        {this.renderBottom(result)}
      </div>
    );
  }

  public componentDidMount() {
    this.fetchHand();
  }

  private renderBottom(result: HandResult) {
    return (
      <div className={classNames("bottom", { valid: result.valid, invalid: !result.valid })}>
        {result.invalidReasons.join(" ")}
        {result.valid && <div>👍</div>}
      </div>
    );
  }

  private applyDelta = (delta: Partial<IPlayerHand> & Pick<IPlayerHand, "index">) => {
    const handToChange = this.state.hand!.playerHands[delta.index];
    const newPlayerHand = { ...handToChange, ...delta };
    const newPlayerHandArray = this.state.hand!.playerHands.slice();
    newPlayerHandArray[delta.index] = newPlayerHand;
    const newHand: IHand = {
      ...this.state.hand!,
      playerHands: newPlayerHandArray,
    };
    this.setState({ hand: newHand });
  };

  private renderPlayerHand = (playerHand: IPlayerHand, score: number) => {
    return <PlayerHand hand={playerHand} onChange={this.applyDelta} score={score || 0} />;
  };

  private async fetchHand() {
    const handId = this.props.match.params.handId;
    this.setState({ loading: true });
    const hand = await this.props.api.fetchHand(handId);
    this.setState({ loading: false, hand });
  }
}
