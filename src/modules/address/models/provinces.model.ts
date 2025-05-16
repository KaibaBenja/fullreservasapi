import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/sequalize.config";
import Country from "./countries.model";


interface ProvinceAttributes {
  id: Buffer; 
  name: string;
  country_id: Buffer; 
}

interface ProvinceCreationAttributes extends Optional<ProvinceAttributes, "id"> { }

class Province extends Model<ProvinceAttributes, ProvinceCreationAttributes> implements ProvinceAttributes {
  public id!: Buffer;
  public name!: string;
  public country_id!: Buffer;
}


Province.init(
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
    country_id: {
      type: DataTypes.BLOB,
      allowNull: false,
      references: {
        model: Country,
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    tableName: "provinces",
    timestamps: false,
  }
);



export default Province;
