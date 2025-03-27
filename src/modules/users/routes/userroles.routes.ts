import express from "express";
import { validateSchema, validateSchemaPartial } from "../../../middlewares/validateSchema";
import { userrolesSchema } from "../schemas/userroles.schema";
import userrolesController from "../controllers/userroles.controller";

export const userrolesRoutes = express.Router();

userrolesRoutes.post("/", validateSchema(userrolesSchema), userrolesController.create);
userrolesRoutes.get("/", userrolesController.getAll);
userrolesRoutes.get("/:id", userrolesController.getById);
userrolesRoutes.patch("/:id", validateSchemaPartial(userrolesSchema), userrolesController.editById);
userrolesRoutes.delete("/:id", userrolesController.deleteById);
