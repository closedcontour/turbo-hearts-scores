import {
  getHandResult,
  IHand,
  IHandResult,
  IPlayer,
  IPlayerHand,
} from "@turbo-hearts-scores/shared";
import classNames = require("classnames");
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Api } from "../api/transport";
import { PlayerHand } from "./components/PlayerHand";

interface HandPageProps extends RouteComponentProps<{ handId: string }> {
  api: Api;
}

interface HandPageState {
  loading: boolean;
  hand: IHand | undefined;
}

export class HandPage extends React.Component<HandPageProps, HandPageState> {
  public state: HandPageState = {
    loading: false,
    hand: undefined,
  };

  public render() {
    const result = getHandResult(this.state.hand);
    if (!this.state.hand) {
      return <div className="th-hand th-page">{this.renderBottom(result)}</div>;
    }
    const heartTotal = this.state.hand.playerHands.reduce((sum, hand) => hand.hearts + sum, 0);
    return (
      <div className="th-hand th-page">
        {this.state.hand.pass}
        {this.state.hand.playerHands.map((playerHand, i) =>
          this.renderPlayerHand(
            playerHand,
            this.state.hand!.players[i],
            result.scores[i],
            result.moonshot[i],
            heartTotal,
          ),
        )}
        {this.renderBottom(result)}
      </div>
    );
  }

  public componentDidMount() {
    this.fetchHand();
  }

  private renderBottom(result: IHandResult) {
    const onClick = !result.valid
      ? undefined
      : () => {
          this.finishHand();
        };
    return (
      <div
        onClick={onClick}
        className={classNames("bottom", { valid: result.valid, invalid: !result.valid })}
      >
        {result.invalidReasons.join(" ")}
        {result.valid && <div className="success">Finish Hand 👍</div>}
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

  private renderPlayerHand = (
    playerHand: IPlayerHand,
    player: IPlayer,
    score: number,
    moonshot: boolean,
    heartTotal: number,
  ) => {
    return (
      <PlayerHand
        player={player}
        hand={playerHand}
        onChange={this.applyDelta}
        score={score || 0}
        moonshot={moonshot}
        heartTotal={heartTotal}
      />
    );
  };

  private async fetchHand() {
    const handId = this.props.match.params.handId;
    this.setState({ loading: true });
    const hand = await this.props.api.fetchHand(handId);
    this.setState({ loading: false, hand });
  }

  private async finishHand() {
    const handId = this.props.match.params.handId;
    this.setState({ loading: true });
    await this.props.api.finishHand(handId, this.state.hand!);
    this.setState({ loading: false });
    this.props.history.push(`/game/${this.state.hand!.gameId}`);
  }
}
