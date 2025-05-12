import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/sequalize.config";
import User from "../../users/models/users.model";
import Subcategory from "../models/subcategories.model";
import shopsAddresseses from "../../shops/models/shopAddresses.model";
import Images from "../models/images.model";
import Schedules from "./schedules.model";

interface ShopsAttributes {
  [x: string]: any;
  id: Buffer;
  user_id: Buffer;
  subcategory_id: Buffer;
  name: string;
  phone_number: string;
  shift_type: "SINGLESHIFT" | "DOUBLESHIFT" | "CONTINUOUS";
  average_stay_time: number;
  capacity: number;
  legal_info: string;
  bank_info: string;
  description?: string;
  price_range: 1 | 2 | 3 | 4;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ShopsCreationAttributes
  extends Optional<
    ShopsAttributes,
    "id" | "description" | "createdAt" | "updatedAt"
  > { }

class Shops
  extends Model<ShopsAttributes, ShopsCreationAttributes>
  implements ShopsAttributes {
  public id!: Buffer;
  public user_id!: Buffer;
  public subcategory_id!: Buffer;
  public name!: string;
  public phone_number!: string;
  public shift_type!: "SINGLESHIFT" | "DOUBLESHIFT" | "CONTINUOUS";
  public average_stay_time!: number;
  public capacity!: number;
  public legal_info!: string;
  public bank_info!: string;
  public description!: string;
  public price_range!: 1 | 2 | 3 | 4;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Shops.init(
  {
    id: {
      type: DataTypes.BLOB,
      allowNull: false,
      primaryKey: true,
      defaultValue: sequelize.literal("UUID_TO_BIN(UUID())"),
    },
    user_id: {
      type: DataTypes.BLOB,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    subcategory_id: {
      type: DataTypes.BLOB,
      allowNull: false,
      references: {
        model: Subcategory,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    shift_type: {
      type: DataTypes.ENUM("SINGLESHIFT", "DOUBLESHIFT", "CONTINUOUS"),
      allowNull: false,
    },
    average_stay_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    legal_info: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    bank_info: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    price_range: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: [[1, 2, 3, 4]],
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at",
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updated_at",
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "shops",
    timestamps: false,
    underscored: true,
  }
);

Shops.belongsTo(Subcategory, {
  foreignKey: "subcategory_id",
  as: "subcategory",
});

Shops.hasMany(shopsAddresseses, { foreignKey: "shop_id" });
shopsAddresseses.belongsTo(Shops, { foreignKey: "shop_id" });

Shops.hasMany(Images, { foreignKey: "shop_id" });
Images.belongsTo(Shops, { foreignKey: "shop_id" });

Shops.hasMany(Schedules, { foreignKey: "shop_id", as: "schedules" }); 
Schedules.belongsTo(Shops, { foreignKey: "shop_id" }); 

export default Shops;
