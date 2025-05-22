import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../config/sequelize/sequalize.config';
import Shop from "./shops.model";

interface AvailableSlotsAttributes {
  id: Buffer;
  shop_id: Buffer;
  start_time: string;
  end_time: string;
  capacity: number;
}

interface AvailableSlotsCreationAttributes extends Optional<AvailableSlotsAttributes, 'id'> { }

class AvailableSlots extends Model<AvailableSlotsAttributes, AvailableSlotsCreationAttributes> implements AvailableSlotsAttributes {
  public id!: Buffer;
  public shop_id!: Buffer;
  public start_time!: string;
  public end_time!: string;
  public capacity!: number;
}

AvailableSlots.init(
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
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
  {
    sequelize,
    tableName: 'available_slots',
    timestamps: false
  }
);

export default AvailableSlots;
