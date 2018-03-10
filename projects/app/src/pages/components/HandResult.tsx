import * as React from "react";
import { IHand } from "../../api/api";
import { getHandResult, IHandResult } from "../HandPage";

interface HandResultProps {
  hand: IHand;
}

export class HandResult extends React.Component<HandResultProps, {}> {
  public render() {
    const result = getHandResult(this.props.hand);
    return result.valid ? this.renderHand(result) : this.renderInvalid();
  }

  private renderHand(result: IHandResult) {
    return (
      <div className="th-hand-result">
        {this.props.hand.playerHands.map((_playerHand, i) => {
          return (
            <div key={i} className="score">
              {result.scores[i]}
            </div>
          );
        })}
        <div className="small">
          <a href={`/hand/${this.props.hand.id}`}>✏</a>
        </div>
      </div>
    );
  }

  private renderInvalid() {
    return (
      <div className="th-hand-incomplete">
        <a href={`/hand/${this.props.hand.id}`}>Incomplete hand ✏</a>
      </div>
    );
  }
}
