import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../config/sequalize.config';
import User from "../../users/models/users.model";
import Subcategory from "../models/subcategories.model";

interface ShopsAttributes {
  id: Buffer;
  user_id: Buffer;
  subcategory_id: Buffer;
  name: string;
  phone_number: string;
  shift_type: "SINGLESHIFT" | "DOUBLESHIFT" | "CONTINUOUS";
  average_stay_time: number;
  capacity: number;
  legal_info: string;
  bank_info: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ShopsCreationAttributes extends Optional<ShopsAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

class Shops extends Model<ShopsAttributes, ShopsCreationAttributes> implements ShopsAttributes {
  public id!: Buffer;
  public user_id!: Buffer;
  public subcategory_id!: Buffer;
  public name!: string;
  public phone_number!: string;
  public shift_type!: "SINGLESHIFT" | "DOUBLESHIFT" | "CONTINUOUS";
  public average_stay_time!: number;
  public capacity!: number;
  public legal_info!: string;
  public bank_info!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Shops.init(
  {
    id: {
      type: DataTypes.BLOB,
      allowNull: false,
      primaryKey: true,
      defaultValue: sequelize.literal('UUID_TO_BIN(UUID())'),
    },
    user_id: {
      type: DataTypes.BLOB,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    subcategory_id: {
      type: DataTypes.BLOB,
      allowNull: false,
      references: {
        model: Subcategory,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    shift_type: {
      type: DataTypes.ENUM('SINGLESHIFT', 'DOUBLESHIFT', 'CONTINUOUS'),
      allowNull: false,
    },
    average_stay_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    legal_info: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    bank_info: {
      type: DataTypes.STRING(150),
      allowNull: true,
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
    tableName: 'shops',
    timestamps: false,
    underscored: true,
  }
);

Shops.belongsTo(Subcategory, {
  foreignKey: 'subcategory_id', 
  as: 'subcategory', 
});

export default Shops;
