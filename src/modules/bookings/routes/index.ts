import express from "express";
import { bookingRoutes } from "./bookings.routes";
import { bookedTablesRoutes } from "./bookedTables.routes";


export const bookingsRoutes = express.Router();

bookingsRoutes.use("/details", bookingRoutes);
bookingsRoutes.use("/bookedTables", bookedTablesRoutes);



