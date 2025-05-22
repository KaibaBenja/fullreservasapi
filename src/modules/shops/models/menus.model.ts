import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../config/sequelize/sequalize.config';
import Shops from "./shops.model";

interface MenusAttributes {
  id: Buffer;
  shop_id: Buffer;
  file_url: string;
}

interface MenusCreationAttributes extends Optional<MenusAttributes, 'id'> { }

class Menus extends Model<MenusAttributes, MenusCreationAttributes> implements MenusAttributes {
  public id!: Buffer;
  public shop_id!: Buffer;
  public file_url!: string;
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
    }
  },
  {
    sequelize,
    tableName: 'menus',
    timestamps: false
  }
);

export default Menus;
