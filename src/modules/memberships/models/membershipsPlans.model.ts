import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../config/sequelize/sequalize.config';

interface MembershipsPlansAttributes {
  id: Buffer;
  tier_name: string;
  price: number;
  quantity: number;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MembershipsPlansCreationAttributes extends Optional<MembershipsPlansAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

class MembershipPlan extends Model<MembershipsPlansAttributes, MembershipsPlansCreationAttributes> implements MembershipsPlansAttributes {
  public id!: Buffer;
  public tier_name!: string;
  public price!: number;
  public quantity!: number;
  public description!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MembershipPlan.init(
  {
    id: {
      type: DataTypes.BLOB,
      primaryKey: true,
      allowNull: false,
      defaultValue: sequelize.literal('UUID_TO_BIN(UUID())'),
    },
    tier_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
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
    tableName: 'membership_plans',
    timestamps: false,
    underscored: true,
  }
);

export default MembershipPlan;
