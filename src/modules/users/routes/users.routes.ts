import express from "express";
import { validateSchema, validateSchemaPartial } from "../../../middlewares/validateSchema";
import { userSchema } from "../schemas/users.schema";
import usersController from "../controllers/users.controller";

export const userRoutes = express.Router();

userRoutes.post("/", validateSchema(userSchema), usersController.create);
userRoutes.get("/", usersController.getAll);
userRoutes.get("/:id", usersController.getById);
userRoutes.patch("/:id", validateSchemaPartial(userSchema), usersController.editById);
userRoutes.delete("/:id", usersController.deleteById);
