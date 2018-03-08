import * as React from "react";
import { IPlayer } from "../../api/api";

export interface PlayerChooserProps {
  players: IPlayer[];
  selectedPlayer: IPlayer | undefined | null;
  onPlayerChanged(player: IPlayer | undefined): void;
}

export class PlayerChooser extends React.Component<PlayerChooserProps, {}> {
  public render() {
    const selectedId = this.props.selectedPlayer ? this.props.selectedPlayer.id : "";
    return (
      <select onChange={this.handlePlayerChooserChange} value={selectedId}>
        <option value="">Choose Player</option>
        {this.props.players.map(player => (
          <option key={player.id} value={player.id}>
            {player.name}
          </option>
        ))}
      </select>
    );
  }

  private handlePlayerChooserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const playerId = event.target.value;
    const player = this.props.players.find(p => p.id.toString() === playerId);
    this.props.onPlayerChanged(playerId === "" ? undefined : player);
  };
}
