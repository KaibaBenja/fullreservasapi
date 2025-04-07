import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../config/sequalize.config';
import Cities from "./cities.model";
import Provinces from "./provinces.model";
import Countries from "./countries.model";

interface AddressesAttributes {
  id: Buffer;
  street: string;
  street_number: string;
  extra: string;
  city_id: Buffer;
  province_id: Buffer;
  country_id: Buffer;
  description?: string | null;
  latitude: number;
  longitude: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AddressCreationAttributes extends Optional<AddressesAttributes, 'id' | 'description' | 'createdAt' | 'updatedAt'> { }

class Addresses extends Model<AddressesAttributes, AddressCreationAttributes> implements AddressesAttributes {
  public id!: Buffer;
  public street!: string;
  public street_number!: string;
  public extra!: string;
  public city_id!: Buffer;
  public province_id!: Buffer;
  public country_id!: Buffer;
  public description!: string | null;
  public latitude!: number;
  public longitude!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Addresses.init(
  {
    id: {
      type: DataTypes.BLOB,
      allowNull: false,
      primaryKey: true,
      defaultValue: sequelize.literal('UUID_TO_BIN(UUID())'),
    },
    street: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    street_number: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    extra: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    city_id: {
      type: DataTypes.BLOB,
      allowNull: false,
      references: {
        model: Cities,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    province_id: {
      type: DataTypes.BLOB,
      allowNull: false,
      references: {
        model: Provinces,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    country_id: {
      type: DataTypes.BLOB,
      allowNull: false,
      references: {
        model: Countries,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    description: {
      type: DataTypes.STRING(450),
      allowNull: true,
      defaultValue: null,
    },
    latitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false,
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
    tableName: 'addresses',
    timestamps: false,
    underscored: true,
  }
);

export default Addresses;
