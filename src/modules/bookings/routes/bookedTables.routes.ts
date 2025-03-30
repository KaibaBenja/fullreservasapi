import express from "express";
import { validateSchema, validateSchemaPartial } from "../../../middlewares/validateSchema";
import { bookedTablesSchema } from "../schemas/bookedTables.schema";
import bookingsController from "../controllers/bookedTables.controller";

export const bookedTablesRoutes = express.Router();

bookedTablesRoutes.post("/", validateSchema(bookedTablesSchema), bookingsController.create);
bookedTablesRoutes.post("/filtered", validateSchemaPartial(bookedTablesSchema), bookingsController.getAllByFilters);
bookedTablesRoutes.post("/filtered-booking/:booking_id", validateSchemaPartial(bookedTablesSchema), bookingsController.getAllByFiltersBookingId);
bookedTablesRoutes.get("/", bookingsController.getAll);
bookedTablesRoutes.get("/:id", bookingsController.getById);
bookedTablesRoutes.patch("/:id", validateSchemaPartial(bookedTablesSchema), bookingsController.editById);
bookedTablesRoutes.delete("/:id", bookingsController.deleteById);
