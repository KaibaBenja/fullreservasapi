import express from "express";
import tablesController from "../controllers/tables.controller";
import { validateSchema, validateSchemaPartial } from "../../../middlewares/validateSchema";
import { tablesSchema } from "../schemas/tables.schema";

export const tablesRoutes = express.Router();

tablesRoutes.post("/", validateSchema(tablesSchema), tablesController.create);
tablesRoutes.get("/", tablesController.getAll);
tablesRoutes.post("/filteredShop/:shop_id", validateSchemaPartial(tablesSchema), tablesController.getAllByFiltersShopId);
tablesRoutes.post("/filtered", validateSchemaPartial(tablesSchema), tablesController.getAllByFilters);
tablesRoutes.get("/:id", tablesController.getById);
tablesRoutes.patch("/:id", validateSchemaPartial(tablesSchema), tablesController.editById);
tablesRoutes.delete("/:id", tablesController.deleteById);
