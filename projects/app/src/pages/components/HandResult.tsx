import { getHandResult, IHand, IHandResult } from "@turbo-hearts-scores/shared";
import * as React from "react";

interface HandResultProps {
  leagueId: string;
  seasonId: string;
  gameId: string;
  hand: IHand;
}

export class HandResult extends React.Component<HandResultProps, {}> {
  public render() {
    const result = getHandResult(this.props.hand);
    return result.valid ? this.renderHand(result) : this.renderInvalid();
  }

  private getEditLink() {
    const { leagueId, seasonId, gameId } = this.props;
    return `/league/${leagueId}/season/${seasonId}/game/${gameId}/hand/${this.props.hand.id}`;
  }

  private renderHand(result: IHandResult) {
    return (
      <div className="th-hand-result">
        {this.props.hand.playerHands.map((_playerHand, i) => {
          return (
            <div key={i} className="score">
              {result.scores[i]} {result.moonshots[i] && "🚀"} {result.antiruns[i] && "💣"}
            </div>
          );
        })}
        <div className="small">
          <a href={this.getEditLink()}>✏</a>
        </div>
      </div>
    );
  }

  private renderInvalid() {
    return (
      <div className="th-hand-incomplete">
        <a href={this.getEditLink()}>Incomplete hand ✏</a>
      </div>
    );
  }
}
