import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../config/sequelize/sequalize.config';
import User from "../../users/models/users.model";
import MembershipPlan from "../models/membershipsPlans.model";

interface MembershipAttributes {
  id: Buffer;
  user_id: Buffer;
  tier: Buffer;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'EXPIRED' | 'DELAYED';
  expire_date?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MembershipCreationAttributes extends Optional<MembershipAttributes, 'id' | 'expire_date' | 'createdAt' | 'updatedAt'> { }

class Membership extends Model<MembershipAttributes, MembershipCreationAttributes> implements MembershipAttributes {
  public id!: Buffer;
  public user_id!: Buffer;
  public tier!: Buffer;
  public status!: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'EXPIRED' | 'DELAYED';
  public expire_date?: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Membership.init(
  {
    id: {
      type: DataTypes.BLOB,
      primaryKey: true,
      allowNull: false,
      defaultValue: sequelize.literal('UUID_TO_BIN(UUID())'),
    },
    user_id: {
      type: DataTypes.BLOB,
      allowNull: false,
      unique: true,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    tier: {
      type: DataTypes.BLOB,
      allowNull: true,
      references: {
        model: MembershipPlan,
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "RESTRICT"
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'PENDING', 'EXPIRED', 'DELAYED'),
      allowNull: false,
      defaultValue: 'INACTIVE',
    },
    expire_date: {
      type: DataTypes.DATE,
      allowNull: true,
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
    tableName: 'memberships',
    timestamps: false,
    underscored: true,
  }
);

export default Membership;
