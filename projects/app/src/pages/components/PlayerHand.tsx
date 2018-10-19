import { IPlayer, IPlayerHand } from "@turbo-hearts-scores/shared";
import classNames = require("classnames");
import * as React from "react";
import { Card } from "./Card";

interface PlayerHandProps {
  player: IPlayer;
  hand: IPlayerHand;
  heartTotal: number;
  score: number;
  moonshot: boolean;
  onChange(delta: Partial<IPlayerHand> & Pick<IPlayerHand, "index">): void;
}

export class PlayerHand extends React.PureComponent<PlayerHandProps, {}> {
  public render() {
    return (
      <div className="th-player-hand">
        <div className="name-and-score">
          {this.renderName()}
          {this.renderScore()}
        </div>
        {this.renderCharges()}
        {this.renderTookSpecials()}
        {this.renderHearts()}
      </div>
    );
  }

  private renderName() {
    return <div className="name">{this.props.player.name}</div>;
  }

  // tslint:disable:jsx-no-lambda
  private renderCharges() {
    const { hand } = this.props;
    return (
      <div className="charges">
        <h5>Charged</h5>
        <Card
          rank="Q"
          suit="SPADES"
          active={hand.chargedQs}
          onClick={() => this.props.onChange({ index: hand.index, chargedQs: !hand.chargedQs })}
        />
        <Card
          rank="A"
          suit="HEARTS"
          active={hand.chargedAh}
          onClick={() => this.props.onChange({ index: hand.index, chargedAh: !hand.chargedAh })}
        />
        <Card
          rank="J"
          suit="DIAMONDS"
          active={hand.chargedJd}
          onClick={() => this.props.onChange({ index: hand.index, chargedJd: !hand.chargedJd })}
        />
        <Card
          rank="10"
          suit="CLUBS"
          active={hand.chargedTc}
          onClick={() => this.props.onChange({ index: hand.index, chargedTc: !hand.chargedTc })}
        />
      </div>
    );
  }

  private renderTookSpecials() {
    const { hand } = this.props;
    return (
      <div className="took-specials">
        <h5>Took</h5>
        <Card
          rank="Q"
          suit="SPADES"
          active={hand.tookQs}
          onClick={() => this.props.onChange({ index: hand.index, tookQs: !hand.tookQs })}
        />
        <Card
          rank="J"
          suit="DIAMONDS"
          active={hand.tookJd}
          onClick={() => this.props.onChange({ index: hand.index, tookJd: !hand.tookJd })}
        />
        <Card
          rank="10"
          suit="CLUBS"
          active={hand.tookTc}
          onClick={() => this.props.onChange({ index: hand.index, tookTc: !hand.tookTc })}
        />
      </div>
    );
  }

  private renderHearts() {
    const { hand, heartTotal } = this.props;
    const hearts = [];
    for (let i = 0; i <= 13; i++) {
      hearts.push(
        <span
          key={i}
          className={classNames("heart-count", {
            active: i <= hand.hearts,
            hidden: i > 13 - heartTotal + hand.hearts,
          })}
          onClick={() => this.props.onChange({ index: hand.index, hearts: i })}
        >
          {i !== 0 && " "}
          {i}
        </span>,
      );
    }
    return <div className="hearts _hearts">♥{hearts}</div>;
  }

  private renderScore() {
    return (
      <div className="score">
        {this.props.score === 100 ? "💯" : this.props.score} {this.props.moonshot && "🚀"}
      </div>
    );
  }
}
