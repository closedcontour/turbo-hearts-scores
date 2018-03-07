import * as React from "react";
import { RouteComponentProps } from "react-router";
import { IGame } from "../api/api";
import { Api } from "../api/transport";

interface GamePageProps extends RouteComponentProps<{ gameId: string }> {
  api: Api;
}

interface GamePageState {
  loading: boolean;
  game: IGame | undefined;
}

export class GamePage extends React.Component<GamePageProps, GamePageState> {
  public state: GamePageState = {
    loading: false,
    game: undefined,
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
