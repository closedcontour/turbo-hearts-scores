import * as React from "react";
import { IPlayerHand } from "../../api/api";
import { Card } from "./Card";

interface PlayerHandProps {
  hand: IPlayerHand;
  onChange(delta: Partial<IPlayerHand> & Pick<IPlayerHand, "index">): void;
}

export class PlayerHand extends React.Component<PlayerHandProps, {}> {
  public render() {
    return (
      <div className="th-player-hand">
        {this.renderName()}
        {this.renderCharges()}
        {this.renderTookSpecials()}
        {this.renderHearts()}
      </div>
    );
  }

  private renderName() {
    return null;
  }

  // tslint:disable:jsx-no-lambda
  private renderCharges() {
    const { hand } = this.props;
    return (
      <div className="charges">
        <h5>Charges</h5>
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
    const h = this.props.hand.hearts;
    const s = h === 1 ? "♥" : "♥s";
    return (
      <div className="hearts">
        {h} {s}
      </div>
    );
  }
}