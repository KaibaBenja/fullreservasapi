import express from "express";
import shopsAddressesController from "../controllers/shopsAddresses.controller";
import { validateSchema, validateSchemaPartial } from "../../../middlewares/validateSchema";
import { shopsAddressesSchema } from "../schemas/shopsAddresses.schema";

export const shopsAddressesRoutes = express.Router();

shopsAddressesRoutes.post("/", validateSchema(shopsAddressesSchema), shopsAddressesController.create);
shopsAddressesRoutes.get("/", shopsAddressesController.getAll);
shopsAddressesRoutes.get("/:id", shopsAddressesController.getById);
shopsAddressesRoutes.patch("/:id", validateSchemaPartial(shopsAddressesSchema), shopsAddressesController.editById);
shopsAddressesRoutes.delete("/:id", shopsAddressesController.deleteById);


