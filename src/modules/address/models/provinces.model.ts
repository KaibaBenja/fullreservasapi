import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/sequelize/sequalize.config";
import Country from "./countries.model";


interface ProvinceAttributes {
  id: Buffer; 
  name: string;
  country_id: Buffer; 
  created_at?: Date;
  updated_at?: Date;
}

interface ProvinceCreationAttributes extends Optional<ProvinceAttributes, "id" | "created_at" | "updated_at"> { }

class Province extends Model<ProvinceAttributes, ProvinceCreationAttributes> implements ProvinceAttributes {
  public id!: Buffer;
  public name!: string;
  public country_id!: Buffer;
  public created_at!: Date;
  public updated_at!: Date;
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
    tableName: "provinces",
    timestamps: false,
  }
);



export default Province;
