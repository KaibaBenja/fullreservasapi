import express from "express";
import { validateSchema, validateSchemaPartial } from "../../../middlewares/validateSchema";
import { merchantsSchema } from "../schemas/merchants.schema";
import merchantsController from "../controllers/merchants.controller";
import { uploadSingle } from "../../../middlewares/upload";

export const merchantsRoutes = express.Router();

merchantsRoutes.post("/", uploadSingle("logo_url"), validateSchema(merchantsSchema), merchantsController.create);
merchantsRoutes.get("/", merchantsController.getAll);
merchantsRoutes.get("/:id", merchantsController.getById);
merchantsRoutes.patch("/:id", uploadSingle("logo_url"), validateSchemaPartial(merchantsSchema), merchantsController.editById);
merchantsRoutes.delete("/:id", merchantsController.deleteById);
