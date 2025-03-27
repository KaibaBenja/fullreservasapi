import express from "express";
import addressesController from "../controllers/addresses.controller";
import { validateSchema, validateSchemaPartial } from "../../../middlewares/validateSchema";
import { addressesSchema } from "../schemas/addresses.schema";

export const addressesRoutes = express.Router();

addressesRoutes.post("/", validateSchema(addressesSchema), addressesController.create);
addressesRoutes.get("/", addressesController.getAll);
addressesRoutes.get("/:id", addressesController.getById);
addressesRoutes.patch("/:id", validateSchemaPartial(addressesSchema), addressesController.editById);
addressesRoutes.delete("/:id", addressesController.deleteById);


