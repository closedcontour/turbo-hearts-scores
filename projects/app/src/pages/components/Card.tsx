import classNames = require("classnames");
import * as React from "react";

export type Suit = "SPADES" | "HEARTS" | "DIAMONDS" | "CLUBS";

const suitMap = {
  SPADES: {
    char: "♠",
    className: "_spades",
  },
  HEARTS: {
    char: "♥",
    className: "_hearts",
  },
  DIAMONDS: { char: "♦", className: "_diamonds" },
  CLUBS: { char: "♣", className: "_clubs" },
};

export interface CardProps {
  rank: string;
  suit: Suit;
  active?: boolean;
  onClick?(): void;
}

export class Card extends React.Component<CardProps, {}> {
  public render() {
    const suit = suitMap[this.props.suit];
    return (
      <div
        onClick={this.props.onClick}
        className={classNames("th-card", suit.className, { active: this.props.active })}
      >
        {this.props.rank}
        {suit.char}
      </div>
    );
  }
}
