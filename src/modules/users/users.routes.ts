import express from "express";
import { validateSchema, validateSchemaPartial } from "../../middlewares/validateSchema";
import { userSchema, updateUserSchema } from "./users.schema";
import usersController from "./users.controller";

export const usersRoutes = express.Router();

usersRoutes.post("/", validateSchema(userSchema), usersController.newUser);

usersRoutes.get("/", usersController.getAll);

usersRoutes.get("/:id", usersController.getById);

usersRoutes.patch("/:id", validateSchemaPartial(updateUserSchema), usersController.editById);

usersRoutes.delete("/:id", usersController.deleteById);
