import express from "express";
import addressController from "../controllers/address.controller";
import { validateSchema, validateSchemaPartial } from "../../../middlewares/validateSchema";
import { citiesSchema } from "../schemas/cities.schema";

export const citiesRoutes = express.Router();

citiesRoutes.post("/", validateSchema(citiesSchema), addressController.cities.create);
citiesRoutes.get("/", addressController.cities.getAll);
citiesRoutes.get("/:id", addressController.cities.getById);
citiesRoutes.patch("/:id", validateSchemaPartial(citiesSchema), addressController.cities.editById);
citiesRoutes.delete("/:id", addressController.cities.deleteById);


