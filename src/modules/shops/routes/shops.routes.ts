import express from "express";
import shopsController from "../controllers/shops.controller";
import { validateSchema, validateSchemaPartial } from "../../../middlewares/validateSchema";
import { shopsSchema } from "../schemas/shops.schema";

export const shopRoutes = express.Router();

shopRoutes.post("/", validateSchema(shopsSchema), shopsController.create);
shopRoutes.get("/secure", shopsController.getAllSecure); // ruta segura
shopRoutes.get("/", shopsController.getAll); 
shopRoutes.get("/secure/:id", shopsController.getByIdSecure); // ruta segura
shopRoutes.get("/:id", shopsController.getById);
shopRoutes.patch("/:id", validateSchemaPartial(shopsSchema), shopsController.editById);
shopRoutes.delete("/:id", shopsController.deleteById);


