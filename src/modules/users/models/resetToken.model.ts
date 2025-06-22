import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../config/sequelize/sequalize.config';
import User from "./users.model";

interface ResetTokenAttributes {
  id: Buffer;
  user_id: Buffer;
  token: string;
  used?: boolean;
  expires_at: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

type ResetTokenCreationAttributes = Optional<ResetTokenAttributes, 'id' | 'used' | 'createdAt' | 'updatedAt'>;

class ResetToken extends Model<ResetTokenAttributes, ResetTokenCreationAttributes> implements ResetTokenAttributes {
  public id!: Buffer;
  public user_id!: Buffer;
  public token!: string;
  public used!: boolean;
  public expires_at!: Date;
  public createdAt?: Date;
  public updatedAt?: Date;
  public user?: User;
};

ResetToken.init({
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
  token: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  used: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'expires_at',
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
}, {
  sequelize,
  tableName: 'reset_tokens',
  timestamps: false,
  underscored: true,
});

export default ResetToken;
