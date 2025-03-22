import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../config/sequalize.config';
import Booking from "./bookings.model";
import Table from "../../shops/models/tables.model";

interface BookedTablesAttributes {
  id: Buffer;
  booking_id: Buffer;
  table_id: Buffer;
  tables_booked: number;
  guests: number;
};

type BookedTablesCreationAttributes = Optional<BookedTablesAttributes, 'id'>;

class BookedTable extends Model<BookedTablesAttributes, BookedTablesCreationAttributes> implements BookedTablesAttributes {
  public id!: Buffer;
  public booking_id!: Buffer;
  public table_id!: Buffer;
  public tables_booked!: number;
  public guests!: number;
};

BookedTable.init({
  id: {
    type: DataTypes.BLOB,
    primaryKey: true,
    defaultValue: sequelize.literal('UUID_TO_BIN(UUID())'),
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
  table_id: {
    type: DataTypes.BLOB,
    allowNull: false,
    unique: true,
    references: {
      model: Table,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  tables_booked: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  guests: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'booked_tables',
  timestamps: false,
});

export default BookedTable;
