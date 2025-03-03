import express from "express";
import { validateSchema, validateSchemaPartial } from "../../../middlewares/validateSchema";
import { merchantsSchema } from "../schemas/merchants.schema";
import merchantController from "../controllers/merchant.controller";
import upload from "../../../config/multer.config";

export const merchantRoutes = express.Router();

merchantRoutes.post("/", upload.single("logo_url"), validateSchema(merchantsSchema), merchantController.create);
merchantRoutes.get("/", merchantController.getAll);
merchantRoutes.get("/:id", merchantController.getById);
merchantRoutes.patch("/:id", upload.single("logo_url"), validateSchemaPartial(merchantsSchema), merchantController.editById);
merchantRoutes.delete("/:id", merchantController.deleteById);
