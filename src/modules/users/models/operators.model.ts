import { sequelize } from '../../../config/sequelize/sequalize.config';
import { DataTypes, Model, Optional } from 'sequelize';
import User from "./users.model";
import Shop from "../../shops/models/shops.model";

interface OperatorAttributes {
  id: Buffer;
  user_id: Buffer;
  shop_id: Buffer;
  createdAt?: Date;
  updatedAt?: Date;
};

type OperatorCreationAttributes = Optional<OperatorAttributes, 'id' | 'createdAt' | 'createdAt' | 'updatedAt'>;

class Operator extends Model<OperatorAttributes, OperatorCreationAttributes> implements OperatorAttributes {
  public id!: Buffer;
  public user_id!: Buffer;
  public shop_id!: Buffer;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
};

Operator.init(
  {
    id: {
      type: DataTypes.BLOB,
      primaryKey: true,
      allowNull: false,
      defaultValue: sequelize.literal('UUID_TO_BIN(UUID())'),
    },
    user_id: {
      type: DataTypes.BLOB,
      allowNull: false,
      unique: true,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
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
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'operator_settings',
    timestamps: true,
    underscored: true,
  },
);

export default Operator;
