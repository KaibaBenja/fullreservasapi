import express from "express";
import { validateSchema, validateSchemaPartial } from "../../../middlewares/validateSchema";
import { ratingsSchema } from "../schemas/ratings.schema";
import ratingsController from "../controllers/ratings.controller";

export const ratingsRoutes = express.Router();

ratingsRoutes.post("/", validateSchema(ratingsSchema), ratingsController.create);
ratingsRoutes.post("/filtered", validateSchemaPartial(ratingsSchema), ratingsController.getAllByFilters);
ratingsRoutes.post("/filtered-shop/:shop_id", validateSchemaPartial(ratingsSchema), ratingsController.getAllByFiltersShopId);
ratingsRoutes.post("/filtered-user/:user_id", validateSchemaPartial(ratingsSchema), ratingsController.getAllByFiltersUserId);
ratingsRoutes.get("/", ratingsController.getAll);
ratingsRoutes.get("/:id", ratingsController.getById);
ratingsRoutes.patch("/:id", validateSchemaPartial(ratingsSchema), ratingsController.editById);
ratingsRoutes.delete("/:id", ratingsController.deleteById);
