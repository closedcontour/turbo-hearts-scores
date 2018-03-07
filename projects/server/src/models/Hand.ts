import { Model } from "objection";
import { join } from "path";

export class HandModel extends Model {
  public static tableName = "Hand";

  public static relationMappings = {
    game: {
      relation: Model.HasOneRelation,
      modelClass: join(__dirname, "Game"),
      join: {
        from: "Hand.gameId",
        to: "Game.id",
      },
    },
  };

  public readonly id: number;
  public readonly gameId: number;

  public readonly pass: string;

  public readonly p1ChargeJd: boolean;
  public readonly p2ChargeJd: boolean;
  public readonly p3ChargeJd: boolean;
  public readonly p4ChargeJd: boolean;

  public readonly p1ChargeTc: boolean;
  public readonly p2ChargeTc: boolean;
  public readonly p3ChargeTc: boolean;
  public readonly p4ChargeTc: boolean;

  public readonly p1ChargeAh: boolean;
  public readonly p2ChargeAh: boolean;
  public readonly p3ChargeAh: boolean;
  public readonly p4ChargeAh: boolean;

  public readonly p1ChargeQs: boolean;
  public readonly p2ChargeQs: boolean;
  public readonly p3ChargeQs: boolean;
  public readonly p4ChargeQs: boolean;

  public readonly p1TookJd: boolean;
  public readonly p2TookJd: boolean;
  public readonly p3TookJd: boolean;
  public readonly p4TookJd: boolean;

  public readonly p1TookQs: boolean;
  public readonly p2TookQs: boolean;
  public readonly p3TookQs: boolean;
  public readonly p4TookQs: boolean;

  public readonly p1TookTc: boolean;
  public readonly p2TookTc: boolean;
  public readonly p3TookTc: boolean;
  public readonly p4TookTc: boolean;

  public readonly p1Hearts: number;
  public readonly p2Hearts: number;
  public readonly p3Hearts: number;
  public readonly p4Hearts: number;
}
