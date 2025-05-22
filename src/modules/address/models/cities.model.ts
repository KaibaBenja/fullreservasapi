import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/sequelize/sequalize.config";
import Province from "./provinces.model";

interface CityAttributes {
  id: Buffer;
  name: string;
  zip_code: string;
  province_id: Buffer;
}

interface CityCreationAttributes extends Optional<CityAttributes, "id"> { }

class City extends Model<CityAttributes, CityCreationAttributes> implements CityAttributes {
  public id!: Buffer;
  public name!: string;
  public zip_code!: string;
  public province_id!: Buffer;
}

City.init(
  {
    id: {
      type: DataTypes.BLOB,
      primaryKey: true,
      allowNull: false,
      defaultValue: sequelize.literal('(UUID_TO_BIN(UUID()))')
    },
    name: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    zip_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    province_id: {
      type: DataTypes.BLOB,
      allowNull: false,
      references: {
        model: Province,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "City",
    tableName: "cities",
    timestamps: false,
  }
);

export default City;
