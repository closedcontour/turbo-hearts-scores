import * as React from "react";
import { IHand } from "../../api/api";
import { getHandResult } from "../HandPage";

interface HandResultProps {
  hand: IHand;
}

export class HandResult extends React.Component<HandResultProps, {}> {
  public render() {
    const result = getHandResult(this.props.hand);
    if (!result.valid) {
      return <a href={`/hand/${this.props.hand.id}`}>Hand not finished.</a>;
    }
    return (
      <a href={`/hand/${this.props.hand.id}`}>
        <div className="th-hand-result">
          {this.props.hand.playerHands.map((_playerHand, i) => {
            return (
              <div key={i} className="score">
                {result.scores[i]}
              </div>
            );
          })}
        </div>
      </a>
    );
  }
}
