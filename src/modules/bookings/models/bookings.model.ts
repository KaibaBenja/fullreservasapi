import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../config/sequalize.config';
import User from "../../users/models/users.model";
import Shop from "../../shops/models/shops.model";
import AvailableSlot from "../../shops/models/availableSlots.model";

interface BookingsAttributes {
  id: Buffer;
  user_id: Buffer;
  shop_id: Buffer;
  booked_slot_id: Buffer;
  date: Date;
  guests: number;
  location_type: "INSIDE" | "OUTSIDE";
  floor: "GROUND LEVEL" | "UPPER LEVEL";
  roof_type: "COVERED" | "UNCOVERED";
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  createdAt?: Date;
  updatedAt?: Date;
};

type BookingsCreationAttributes = Optional<BookingsAttributes, 'id' | 'createdAt' | 'updatedAt'>;

class Booking extends Model<BookingsAttributes, BookingsCreationAttributes> implements BookingsAttributes {
  public id!: Buffer;
  public user_id!: Buffer;
  public shop_id!: Buffer;
  public booked_slot_id!: Buffer;
  public date!: Date;
  public guests!: number;
  public location_type!: "INSIDE" | "OUTSIDE";
  public floor!: "GROUND LEVEL" | "UPPER LEVEL";
  public roof_type!: "COVERED" | "UNCOVERED";
  public status!: "PENDING" | "CONFIRMED" | "CANCELLED";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
};

Booking.init(
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
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    shop_id: {
      type: DataTypes.BLOB,
      allowNull: false,
      references: {
        model: Shop,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    booked_slot_id: {
      type: DataTypes.BLOB,
      allowNull: false,
      references: {
        model: AvailableSlot,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    guests: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    location_type: {
      type: DataTypes.ENUM("INSIDE", "OUTSIDE"),
      allowNull: false,
      unique: true
    },
    floor: {
      type: DataTypes.ENUM("GROUND LEVEL", "UPPER LEVEL"),
      allowNull: false,
      unique: true
    },
    roof_type: {
      type: DataTypes.ENUM("COVERED", "UNCOVERED"),
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.ENUM("PENDING", "CONFIRMED", "CANCELLED"),
      allowNull: false,
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
    tableName: 'bookings',
    timestamps: true,
    underscored: true,
  },
);

export default Booking;
