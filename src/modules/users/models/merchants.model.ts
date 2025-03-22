import { sequelize } from '../../../config/sequalize.config';
import { DataTypes, Model, Optional } from 'sequelize';
import User from "./users.model";

interface MerchantAttributes {
  id: Buffer;
  user_id: Buffer;
  logo_url: string;
  main_category: "COMMERCE" | "SERVICE";
  createdAt?: Date;
  updatedAt?: Date;
};

type MerchantCreationAttributes = Optional<MerchantAttributes, 'id' | 'logo_url' | 'createdAt' | 'updatedAt'>;

class Merchant extends Model<MerchantAttributes, MerchantCreationAttributes> implements MerchantAttributes {
  public id!: Buffer;
  public user_id!: Buffer;
  public logo_url!: string;
  public main_category!: "COMMERCE" | "SERVICE";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
};

Merchant.init(
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
    logo_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    main_category: {
      type: DataTypes.ENUM("COMMERCE", "SERVICE"),
      allowNull: false,
      unique: true
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
    tableName: 'merchant_settings',
    timestamps: true,
    underscored: true,
  },
);

export default Merchant;
