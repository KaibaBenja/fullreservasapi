import express from "express";
import addressController from "../controllers/address.controller";
import { validateSchema } from "../../../middlewares/validateSchema";
import { countrySchema } from "../schemas/countries.schema";

export const countriesRoutes = express.Router();

countriesRoutes.post("/", validateSchema(countrySchema), addressController.countries.create);
countriesRoutes.get("/", addressController.countries.getAll);
countriesRoutes.get("/:id", addressController.countries.getById);
countriesRoutes.patch("/:id", validateSchema(countrySchema), addressController.countries.editById);
countriesRoutes.delete("/:id", addressController.countries.deleteById);


