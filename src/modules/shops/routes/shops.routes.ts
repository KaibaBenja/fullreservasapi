import express from "express";
import shopsController from "../controllers/shops.controller";
import { validateSchema, validateSchemaPartial } from "../../../middlewares/validateSchema";
import { shopsSchema } from "../schemas/shops.schema";

export const shopRoutes = express.Router();

shopRoutes.post("/", validateSchema(shopsSchema), shopsController.create);
shopRoutes.get("/", shopsController.getAll);
shopRoutes.get("/public", shopsController.getAllPublic);
shopRoutes.get("/:id", shopsController.getById);
shopRoutes.get("/public/:id", shopsController.getByIdPublic);
shopRoutes.patch("/:id", validateSchemaPartial(shopsSchema), shopsController.editById);
shopRoutes.delete("/:id", shopsController.deleteById);


