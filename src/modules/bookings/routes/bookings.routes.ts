import express from "express";
import { validateSchema, validateSchemaPartial } from "../../../middlewares/validateSchema";
import { bookingSchema, bookingSchemaFiter } from "../schemas/bookings.schema";
import bookingsController from "../controllers/bookings.controller";

export const bookingRoutes = express.Router();

bookingRoutes.post("/", validateSchema(bookingSchema), bookingsController.create);
bookingRoutes.post("/filtered", validateSchemaPartial(bookingSchemaFiter), bookingsController.getAllByFilters);
bookingRoutes.post("/filtered-shop/:shop_id", validateSchemaPartial(bookingSchemaFiter), bookingsController.getAllByFiltersShopId);
bookingRoutes.post("/filtered-user/:user_id", validateSchemaPartial(bookingSchemaFiter), bookingsController.getAllByFiltersUserId);
bookingRoutes.get("/", bookingsController.getAll);
bookingRoutes.get("/:id", bookingsController.getById);
bookingRoutes.patch("/:id", validateSchemaPartial(bookingSchemaFiter), bookingsController.editById);
bookingRoutes.delete("/:id", bookingsController.deleteById);
