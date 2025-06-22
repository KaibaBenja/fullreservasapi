import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../config/sequelize/sequalize.config';
import Addresses from "../../address/models/addresses.model";
import Shops from "./shops.model";

interface shopAddressesAttributes {
  id: Buffer;
  address_id: Buffer;
  shop_id: Buffer;
  created_at?: Date;
  updated_at?: Date;
}

interface shopsAddressesesCreationAttributes extends Optional<shopAddressesAttributes, 'id' | 'created_at' | 'updated_at'> { }

class shopsAddresseses extends Model<shopAddressesAttributes, shopsAddressesesCreationAttributes> implements shopAddressesAttributes {
  public id!: Buffer;
  public address_id!: Buffer;
  public shop_id!: Buffer;
  public created_at!: Date;
  public updated_at!: Date;
}

shopsAddresseses.init(
  {
    id: {
      type: DataTypes.BLOB,
      allowNull: false,
      primaryKey: true,
      defaultValue: sequelize.literal('UUID_TO_BIN(UUID())'),
    },
    address_id: {
      type: DataTypes.BLOB,
      allowNull: false,
      references: {
        model: Addresses,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    shop_id: {
      type: DataTypes.BLOB,
      allowNull: false,
      unique: true,
      references: {
        model: Shops,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'shopsaddresses',
    timestamps: false,
  }
);


export default shopsAddresseses;
