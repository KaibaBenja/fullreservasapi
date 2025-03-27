import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../config/sequalize.config';

interface RoleAttributes {
  id: Buffer;
  name: string;
  description: string;
};

type RoleCreationAttributes = Optional<RoleAttributes, 'id' | 'description'>;

class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  public id!: Buffer;
  public name!: string;
  public description!: string;
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
}, {
  sequelize,
  tableName: 'roles',
  timestamps: false,
});


export default Role;