import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/sequelize/sequalize.config"; // Ajusta la ruta según tu configuración

interface CountryAttributes {
  id: Buffer;
  name: string;
  created_at?: Date;
  updated_at?: Date;
}

interface CountryCreationAttributes extends Optional<CountryAttributes, "id" | "created_at" | "updated_at"> { }

class Country extends Model<CountryAttributes, CountryCreationAttributes> implements CountryAttributes {
  public id!: Buffer;
  public name!: string;
  public created_at!: Date;
  public updated_at!: Date;
}

Country.init(
  {
    id: {
      type: DataTypes.BLOB,
      allowNull: false,
      primaryKey: true,
      defaultValue: sequelize.literal("UUID_TO_BIN(UUID())"),
    },
    name: {
      type: DataTypes.STRING(250),
      allowNull: false,
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
    tableName: "countries",
    timestamps: false,
  }
);

export default Country;
