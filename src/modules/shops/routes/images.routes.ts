import express from "express";
import imagesController from "../controllers/images.controller";
import {
  validateSchema,
  validateSchemaPartial,
} from "../../../middlewares/validateSchema";
import { imagesSchema } from "../schemas/images.schema";
import upload from "../../../config/multer.config";

export const imagesRoutes = express.Router();

imagesRoutes.post("/", upload.array("image_url"), validateSchema(imagesSchema), imagesController.create);
imagesRoutes.get("/", imagesController.getAll);
imagesRoutes.get("/:id", imagesController.getById);
imagesRoutes.patch("/:id", upload.single("image_url"), validateSchemaPartial(imagesSchema), imagesController.editById);
imagesRoutes.delete("/:id", imagesController.deleteById);
