import express from "express";
import { validateSchema } from "../../../middlewares/validateSchema";
import { userrolesSchema } from "../schemas/userroles.schema";
import userrolesController from "../controllers/userroles.controller";

export const userrolesRoutes = express.Router();

userrolesRoutes.post("/", validateSchema(userrolesSchema), userrolesController.create);
userrolesRoutes.get("/", userrolesController.getAll);
userrolesRoutes.delete("/:id", userrolesController.deleteById);
