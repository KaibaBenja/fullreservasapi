import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../config/sequelize/sequalize.config';
import User from "./users.model";
import Role from "./roles.model";

interface UserRoleAttributes {
  id: Buffer;
  user_id: Buffer;
  role_id: Buffer;
  created_at?: Date;
  updated_at?: Date;
};

type UserRoleCreationAttributes = Optional<UserRoleAttributes, 'id' | 'created_at' | 'updated_at'>;

class UserRole extends Model<UserRoleAttributes, UserRoleCreationAttributes> implements UserRoleAttributes {
  public id!: Buffer;
  public user_id!: Buffer;
  public role_id!: Buffer;
  public created_at!: Date;
  public updated_at!: Date;
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
  tableName: 'userroles',
  timestamps: false,
});

export default UserRole;
