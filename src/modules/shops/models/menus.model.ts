import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../config/sequelize/sequalize.config';
import Shops from "./shops.model";

interface MenusAttributes {
  id: Buffer;
  shop_id: Buffer;
  file_url: string;
  created_at?: Date;
  updated_at?: Date;
}

interface MenusCreationAttributes extends Optional<MenusAttributes, 'id' | 'created_at' | 'updated_at'> { }

class Menus extends Model<MenusAttributes, MenusCreationAttributes> implements MenusAttributes {
  public id!: Buffer;
  public shop_id!: Buffer;
  public file_url!: string;
  public created_at!: Date;
  public updated_at!: Date;
}

Menus.init(
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
        model: Shops,
        key: "id",
      },
      unique: true,
      onDelete: "CASCADE",
    },
    file_url: {
      type: DataTypes.TEXT,
      allowNull: false
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
    tableName: 'menus',
    timestamps: false
  }
);

export default Menus;
