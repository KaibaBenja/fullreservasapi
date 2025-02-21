import { DataTypes, Model, Sequelize } from 'sequelize';
import { sequelize } from '../../../config/sequalize.config';

class Role extends Model {
  public id!: Buffer;
  public name!: 'CLIENT' | 'MERCHANT' | 'OPERATOR' | 'SUPERADMIN';
  public description?: string;
}

Role.init({
  id: {
    type: DataTypes.BLOB(),
    allowNull: false,
    primaryKey: true,
    defaultValue: Sequelize.literal('(UUID_TO_BIN(UUID()))')
  },
  name: {
    type: DataTypes.ENUM('CLIENT', 'MERCHANT', 'OPERATOR', 'SUPERADMIN'),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.STRING(250),
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'roles',
  timestamps: false
});

export default Role;