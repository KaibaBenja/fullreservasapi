import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../config/sequelize/sequalize.config';
import Shops from "../models/shops.model";

interface ImagesAttributes {
  id: Buffer;
  shop_id: Buffer;
  image_url: string;
  created_at?: Date;
  updated_at?: Date;
}

interface ImagesCreationAttributes extends Optional<ImagesAttributes, 'id' | 'created_at' | 'updated_at'> { }

class Images extends Model<ImagesAttributes, ImagesCreationAttributes> implements ImagesAttributes {
  public id!: Buffer;
  public shop_id!: Buffer;
  public image_url!: string;
  public created_at!: Date;
  public updated_at!: Date;
}

Images.init(
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
      onDelete: "CASCADE",
    },
    image_url: {
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
    tableName: 'images',
    timestamps: false
  }
);

export default Images;
