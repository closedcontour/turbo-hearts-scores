import { IPlayer } from "@turbo-hearts-scores/shared";
import * as React from "react";

export interface PlayerChooserProps {
  players: IPlayer[];
  selectedPlayer: IPlayer | undefined | null;
  onPlayerChanged(player: IPlayer | undefined): void;
}

export class PlayerChooser extends React.PureComponent<PlayerChooserProps, {}> {
  public render() {
    const selectedId = this.props.selectedPlayer ? this.props.selectedPlayer.id : "";
    return (
      <div className="th-player-chooser">
        <select onChange={this.handlePlayerChooserChange} value={selectedId}>
          <option value="">Choose Player</option>
          {this.props.players.map(player => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  private handlePlayerChooserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const playerId = event.target.value;
    const player = this.props.players.find(p => p.id.toString() === playerId);
    this.props.onPlayerChanged(playerId === "" ? undefined : player);
  };
}
