import * as React from "react";
import { RouteComponentProps } from "react-router";
import { IHand, IPlayerHand } from "../api/api";
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
    return (
      <div className="th-game">
        Hand {this.props.match.params.handId}
        {this.state.hand && this.state.hand.playerHands.map(this.renderPlayerHand)}
      </div>
    );
  }

  public componentDidMount() {
    this.fetchHand();
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

  private renderPlayerHand = (playerHand: IPlayerHand) => {
    return <PlayerHand hand={playerHand} onChange={this.applyDelta} />;
  };

  private async fetchHand() {
    const handId = this.props.match.params.handId;
    this.setState({ loading: true });
    const hand = await this.props.api.getHand(handId);
    this.setState({ loading: false, hand });
  }
}
