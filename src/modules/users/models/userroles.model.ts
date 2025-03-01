import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../config/sequalize.config';
import User from "./users.model";
import Role from "./roles.model";

interface UserRoleAttributes {
  id: Buffer;
  user_id: Buffer;
  role_id: Buffer;
};

type UserRoleCreationAttributes = Optional<UserRoleAttributes, 'id'>;

class UserRole extends Model<UserRoleAttributes, UserRoleCreationAttributes> implements UserRoleAttributes {
  public id!: Buffer;
  public user_id!: Buffer;
  public role_id!: Buffer;
};

UserRole.init({
  id: {
    type: DataTypes.BLOB,
    primaryKey: true,
    defaultValue: sequelize.literal('UUID_TO_BIN(UUID())'),
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
  role_id: {
    type: DataTypes.BLOB,
    allowNull: false,
    references: {
      model: Role,
      key: "id",
    },
    onDelete: "CASCADE",
  },
}, {
  sequelize,
  tableName: 'userroles',
  timestamps: false,
});

export default UserRole;
