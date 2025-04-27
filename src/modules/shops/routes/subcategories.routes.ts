import express from "express";
import subcategoriesController from "../controllers/subcategories.controller";
import { validateSchema, validateSchemaPartial } from "../../../middlewares/validateSchema";
import { subcategoriesSchema } from "../schemas/subcategories.schema";
import { upload } from "../../../middlewares/upload";

export const subcategoriesRoutes = express.Router();

subcategoriesRoutes.post("/",  upload("subcategories").single("logo"),  validateSchema(subcategoriesSchema), subcategoriesController.create);
subcategoriesRoutes.get("/", subcategoriesController.getAll);
subcategoriesRoutes.get("/:id", subcategoriesController.getById);
subcategoriesRoutes.patch("/:id", upload("subcategories").single("logo"), validateSchemaPartial(subcategoriesSchema), subcategoriesController.editById);
subcategoriesRoutes.delete("/:id", subcategoriesController.deleteById);


