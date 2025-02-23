import express from "express";
import countriesController from "../controllers/countries.controller";
import { validateSchema } from "../../../middlewares/validateSchema";
import { countrySchema } from "../schemas/countries.schema";

export const countriesRoutes = express.Router();

countriesRoutes.post("/", validateSchema(countrySchema), countriesController.create);
countriesRoutes.get("/", countriesController.getAll);
countriesRoutes.get("/:id", countriesController.getById);
countriesRoutes.patch("/:id", validateSchema(countrySchema), countriesController.editById);
countriesRoutes.delete("/:id", countriesController.deleteById);


