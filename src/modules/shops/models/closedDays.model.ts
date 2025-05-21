import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/sequalize.config";
import Shop from "../models/shops.model";

interface ClosedDaysAttributes {
  id: Buffer;
  shop_id: Buffer;
  day_of_week: number;
  created_at?: Date;
};

interface ClosedDaysCreationAttributes extends Optional<ClosedDaysAttributes, "id" | "created_at" > { };

class ClosedDays extends Model<ClosedDaysAttributes, ClosedDaysCreationAttributes> implements ClosedDaysAttributes {
  public id!: Buffer;
  public shop_id!: Buffer;
  public day_of_week!: number;
  public created_at!: Date;
};

ClosedDays.init(
  {
    id: {
      type: DataTypes.BLOB,
      primaryKey: true,
      defaultValue: sequelize.literal('UUID_TO_BIN(UUID())'),
    },
    shop_id: {
      type: DataTypes.BLOB,
      allowNull: false,
      references: {
        model: Shop,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    day_of_week: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      validate: {
        min: 0,
        max: 6,
      },
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "closed_days",
    timestamps: false,
  }
);

export default ClosedDays;
