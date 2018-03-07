import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Api } from "../api/transport";

interface GamePageProps extends RouteComponentProps<{ gameId: string }> {
  api: Api;
}

interface GamePageState {
  loading: boolean;
}

export class GamePage extends React.Component<GamePageProps, GamePageState> {
  public state: GamePageState = {
    loading: false,
  };

  public render() {
    return (
      <div className="th-game">
        Game {this.props.match.params.gameId}
        <button onClick={this.addHand}>Add Hand</button>
      </div>
    );
  }

  private addHand = async () => {
    const gameId = this.props.match.params.gameId;
    this.setState({ loading: true });
    const hand = await this.props.api.createHand(gameId);
    this.props.history.push(`/hand/${hand.id}`);
    this.setState({ loading: false });
  };
}
