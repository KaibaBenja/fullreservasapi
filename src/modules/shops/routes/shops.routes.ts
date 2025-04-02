import express from "express";
import shopsController from "../controllers/shops.controller";
import { validateSchema, validateSchemaPartial } from "../../../middlewares/validateSchema";
import { shopsSchema, filterShopSchema, filterShopSchemaUser } from "../schemas/shops.schema";

export const shopRoutes = express.Router();

shopRoutes.post("/", validateSchema(shopsSchema), shopsController.create);
shopRoutes.post("/filtered", validateSchemaPartial(filterShopSchema), shopsController.getAllByFilters);
shopRoutes.post("/filtered-user", validateSchemaPartial(filterShopSchemaUser), shopsController.getAllByFiltersUser);
shopRoutes.get("/", shopsController.getAll);
shopRoutes.get("/public", shopsController.getAllPublic);
shopRoutes.get("/public/:id", shopsController.getByIdPublic);
shopRoutes.get("/:id", shopsController.getById);
shopRoutes.patch("/:id", validateSchemaPartial(shopsSchema), shopsController.editById);
shopRoutes.delete("/:id", shopsController.deleteById);



