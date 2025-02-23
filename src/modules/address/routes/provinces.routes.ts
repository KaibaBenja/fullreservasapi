import express from "express";
import provincesController from "../controllers/provinces.controller";
import { validateSchema, validateSchemaPartial } from "../../../middlewares/validateSchema";
import { provinceSchema } from "../schemas/provinces.schema";

export const provincesRoutes = express.Router();

provincesRoutes.post("/", validateSchema(provinceSchema), provincesController.create);
provincesRoutes.get("/", provincesController.getAll);
provincesRoutes.get("/:id", provincesController.getById);
provincesRoutes.patch("/:id", validateSchemaPartial(provinceSchema), provincesController.editById);
provincesRoutes.delete("/:id", provincesController.deleteById);


