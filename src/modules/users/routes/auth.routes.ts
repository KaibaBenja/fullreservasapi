import express from "express";
import { logout, register } from "../controllers/auth.controller";
import { validateSchema, } from "../../../middlewares/validateSchema";
import { login } from "../controllers/auth.controller";
import { userSchema } from "../schemas/users.schema";

export const authRoutes = express.Router();

authRoutes.post("/register", validateSchema(userSchema), register);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
