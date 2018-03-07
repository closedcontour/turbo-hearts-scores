import * as React from "react";
import { Ah, IPlayerHand, Jd, Qs, Tc } from "../../api/api";

interface PlayerHandProps {
  hand: IPlayerHand;
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

  private renderCharges() {
    return (
      <div className="charges">
        <h5>Charges</h5>
        {Qs} {Ah} {Jd} {Tc}
      </div>
    );
  }

  private renderTookSpecials() {
    return (
      <div className="took-specials">
        <h5>Took</h5>
        {Qs} {Ah} {Jd} {Tc}
      </div>
    );
  }

  private renderHearts() {
    return <div className="hearts">0 Hearts</div>;
  }
}
