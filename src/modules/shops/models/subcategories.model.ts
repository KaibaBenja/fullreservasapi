import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../config/sequalize.config';

interface SubcategoriesAttributes {
  id: Buffer;
  name: string;
  main_category: "COMMERCE" | "SERVICE";
  createdAt?: Date;
  updatedAt?: Date;
}

interface SubcategoriesCreationAttributes extends Optional<SubcategoriesAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

class Subcategories extends Model<SubcategoriesAttributes, SubcategoriesCreationAttributes> implements SubcategoriesAttributes {
  public id!: Buffer;
  public name!: string;
  public main_category!: "COMMERCE" | "SERVICE";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Subcategories.init(
  {
    id: {
      type: DataTypes.BLOB,
      allowNull: false,
      primaryKey: true,
      defaultValue: sequelize.literal('UUID_TO_BIN(UUID())'),
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
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
    tableName: 'subcategories',
    timestamps: false,
    underscored: true,
  }
);

export default Subcategories;
