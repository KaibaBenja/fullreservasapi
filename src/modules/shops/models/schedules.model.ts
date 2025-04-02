import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../config/sequalize.config';
import Shop from "./shops.model";

interface SchedulesAttributes {
  id: Buffer;
  shop_id: Buffer;
  open_time : string;
  close_time: string;
}

interface SchedulesCreationAttributes extends Optional<SchedulesAttributes, 'id'> { }

class Schedules extends Model<SchedulesAttributes, SchedulesCreationAttributes> implements SchedulesAttributes {
  public id!: Buffer;
  public shop_id!: Buffer;
  public open_time!: string;
  public close_time!: string;
}

Schedules.init(
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
    open_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    close_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'schedules',
    timestamps: false
  }
);

export default Schedules;
