import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../config/sequelize/sequalize.config';

interface RoleAttributes {
  id: Buffer;
  name: string;
  description: string;
  created_at?: Date;
  updated_at?: Date;
};

type RoleCreationAttributes = Optional<RoleAttributes, 'id' | 'description' | 'created_at' | 'updated_at'>;

class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  public id!: Buffer;
  public name!: string;
  public description!: string;
  public created_at!: Date;
  public updated_at!: Date;
};

Role.init({
  id: {
    type: DataTypes.BLOB,
    primaryKey: true,
    defaultValue: sequelize.literal('UUID_TO_BIN(UUID())'),
  },
  name: {
    type: DataTypes.ENUM('CLIENT', 'MERCHANT', 'OPERATOR', 'SUPERADMIN'),
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING(250),
    allowNull: true,
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
}, {
  sequelize,
  tableName: 'roles',
  timestamps: false,
});


export default Role;