import express from "express";
import availableSlotsController from "../controllers/availableSlots.controller";
import { validateSchema, validateSchemaPartial } from "../../../middlewares/validateSchema";
import { availableSlotsSchema } from "../schemas/availableSlots.schema";

export const availableSlotsRoutes = express.Router();

availableSlotsRoutes.post("/", validateSchema(availableSlotsSchema), availableSlotsController.create);
availableSlotsRoutes.get("/", availableSlotsController.getAll);
availableSlotsRoutes.post("/filtered/:shop_id", availableSlotsController.getAllByFilters);
availableSlotsRoutes.get("/:id", availableSlotsController.getById);
availableSlotsRoutes.patch("/:id", validateSchemaPartial(availableSlotsSchema), availableSlotsController.editById);
availableSlotsRoutes.delete("/:id", availableSlotsController.deleteById);
