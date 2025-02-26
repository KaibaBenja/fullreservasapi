import express from "express";
import imagesController from "../controllers/images.controller";
import { validateSchema, validateSchemaPartial } from "../../../middlewares/validateSchema";
import { imagesSchema } from "../schemas/images.schema";

export const imagesRoutes = express.Router();


imagesRoutes.post("/", validateSchema(imagesSchema), imagesController.create);
imagesRoutes.get("/", imagesController.getAll);
imagesRoutes.get("/:id", imagesController.getById);
imagesRoutes.patch("/:id", validateSchemaPartial(imagesSchema), imagesController.editById);
imagesRoutes.delete("/:id", imagesController.deleteById);


