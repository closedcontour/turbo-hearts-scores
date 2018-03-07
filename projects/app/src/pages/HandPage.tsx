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

  private renderPlayerHand(playerHand: IPlayerHand) {
    return <PlayerHand hand={playerHand} />;
  }

  private async fetchHand() {
    const handId = this.props.match.params.handId;
    this.setState({ loading: true });
    const hand = await this.props.api.getHand(handId);
    this.setState({ loading: false, hand });
  }
}
