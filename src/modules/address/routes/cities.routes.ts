import express from "express";
import citiesController from "../controllers/cities.controller";
import { validateSchema, validateSchemaPartial } from "../../../middlewares/validateSchema";
import { citiesSchema } from "../schemas/cities.schema";

export const citiesRoutes = express.Router();

citiesRoutes.post("/", validateSchema(citiesSchema), citiesController.create);
citiesRoutes.get("/", citiesController.getAll);
citiesRoutes.get("/:id", citiesController.getById);
citiesRoutes.patch("/:id", validateSchemaPartial(citiesSchema), citiesController.editById);
citiesRoutes.delete("/:id", citiesController.deleteById);


