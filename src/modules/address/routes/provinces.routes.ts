import express from "express";
import addressController from "../controllers/address.controller";
import { validateSchema, validateSchemaPartial } from "../../../middlewares/validateSchema";
import { provinceSchema } from "../schemas/provinces.schema";

export const provincesRoutes = express.Router();

provincesRoutes.post("/", validateSchema(provinceSchema), addressController.provinces.create);
provincesRoutes.get("/", addressController.provinces.getAll);
provincesRoutes.get("/:id", addressController.provinces.getById);
provincesRoutes.patch("/:id", validateSchemaPartial(provinceSchema), addressController.provinces.editById);
provincesRoutes.delete("/:id", addressController.provinces.deleteById);


