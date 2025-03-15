import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../config/sequalize.config";
import Shop from "../../shops/models/shops.model";
import User from "../../users/models/users.model";
import Booking from "../../bookings/models/bookings.model";

interface RatingAttributes {
  id: Buffer;
  shop_id: Buffer;
  user_id: Buffer;
  booking_id: Buffer;
  rating: number;
  status: "PENDING" | "COMPLETED";
  comment?: string;
  created_at?: Date;
};

interface RatingCreationAttributes extends Optional<RatingAttributes, "id" | "created_at" | "comment"> { };

class Rating extends Model<RatingAttributes, RatingCreationAttributes> implements RatingAttributes {
  public id!: Buffer;
  public shop_id!: Buffer;
  public user_id!: Buffer;
  public booking_id!: Buffer;
  public rating!: number;
  public status!: "PENDING" | "COMPLETED";
  public comment?: string;
  public created_at!: Date;
};

Rating.init(
  {
    id: {
      type: DataTypes.BLOB,
      primaryKey: true,
      defaultValue: sequelize.literal('UUID_TO_BIN(UUID())'),
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
    user_id: {
      type: DataTypes.BLOB,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    booking_id: {
      type: DataTypes.BLOB,
      allowNull: false,
      references: {
        model: Booking,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: false,
      validate: {
        isIn: [[1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0]],
      },
    },
    status: {
      type: DataTypes.ENUM("PENDING", "COMPLETED"),
      allowNull: false,
      defaultValue: "PENDING",
    },
    comment: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Rating",
    tableName: "ratings",
    timestamps: false,
  }
);

export default Rating;
