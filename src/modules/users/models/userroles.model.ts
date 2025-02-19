import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../config/sequalize.config'; // Asegúrate de tener configurado tu archivo de conexión
import User from "./users.model";
import Role from "./roles.model";


interface UserRoleAttributes {
  id: Buffer;
  user_id: Buffer;
  role_id: Buffer;
}

interface UserRoleCreationAttributes extends Optional<UserRoleAttributes, 'id'> { }

class UserRole extends Model<UserRoleAttributes, UserRoleCreationAttributes> implements UserRoleAttributes {
  public id!: Buffer;
  public user_id!: Buffer;
  public role_id!: Buffer;
}

UserRole.init(
  {
    id: {
      type: DataTypes.BLOB,
      allowNull: false,
      primaryKey: true,
      defaultValue: sequelize.fn('UUID_TO_BIN', sequelize.fn('UUID')),
    },
    user_id: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'UserRole',
    tableName: 'userroles',
    timestamps: false,
  }
);

UserRole.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
UserRole.belongsTo(Role, { foreignKey: 'role_id', onDelete: 'CASCADE' });

export default UserRole;
