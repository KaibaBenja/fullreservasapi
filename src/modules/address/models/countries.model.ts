import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/sequalize.config"; // Ajusta la ruta según tu configuración

interface CountryAttributes {
  id: Buffer;
  name: string;
}

interface CountryCreationAttributes extends Optional<CountryAttributes, "id"> { }

class Country extends Model<CountryAttributes, CountryCreationAttributes> implements CountryAttributes {
  public id!: Buffer;
  public name!: string;
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
  },
  {
    sequelize,
    tableName: "countries",
    timestamps: false,
  }
);

export default Country;
