import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../config/sequalize.config';
import Shop from "./shops.model";

interface TablesAttributes {
  id: Buffer;
  shop_id: Buffer;
  location_type: "INSIDE" | "OUTSIDE";
  floor: "GROUND LEVEL" | "UPPER LEVEL";
  roof_type: "COVERED" | "UNCOVERED";
  capacity: number;
  quantity: number;
}

interface TablesCreationAttributes extends Optional<TablesAttributes, 'id'> { }

class Tables extends Model<TablesAttributes, TablesCreationAttributes> implements TablesAttributes {
  public id!: Buffer;
  public shop_id!: Buffer;
  public location_type!: "INSIDE" | "OUTSIDE";
  public floor!: "GROUND LEVEL" | "UPPER LEVEL";
  public roof_type!: "COVERED" | "UNCOVERED";
  public capacity!: number;
  public quantity!: number;
}

Tables.init(
  {
    id: {
      type: DataTypes.BLOB,
      allowNull: false,
      primaryKey: true,
      defaultValue: sequelize.literal('UUID_TO_BIN(UUID())'),
    },
    shop_id: {
      type: DataTypes.BLOB,
      allowNull: false,
      references: {
        model: Shop,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    location_type: {
      type: DataTypes.ENUM("INSIDE", "OUTSIDE"),
      allowNull: false,
      unique: true
    },
    floor: {
      type: DataTypes.ENUM("GROUND LEVEL", "UPPER LEVEL"),
      allowNull: false,
      unique: true
    },
    roof_type: {
      type: DataTypes.ENUM("COVERED", "UNCOVERED"),
      allowNull: false,
      unique: true
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }, quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'tables',
    timestamps: false
  }
);

export default Tables;
