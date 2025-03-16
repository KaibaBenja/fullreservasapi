import express from "express";
import menusController from "../controllers/menus.controller";
import { validateSchema, validateSchemaPartial } from "../../../middlewares/validateSchema";
import { menusSchema } from "../schemas/menus.schema";
import { upload } from "../../../middlewares/upload";

export const menusRoutes = express.Router();

menusRoutes.post("/", upload("menus").single("file_url"), validateSchema(menusSchema), menusController.create);
menusRoutes.get("/", menusController.getAll);
menusRoutes.get("/:id", menusController.getById);
menusRoutes.patch("/:id", upload("menus").single("file_url"), validateSchemaPartial(menusSchema), menusController.editById);
menusRoutes.delete("/:id", menusController.deleteById);
menusRoutes.delete("/shop/:shop_id", menusController.deleteByShopId);
