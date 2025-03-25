import express from "express";
import { logout, register } from "../controllers/auth.controller";
import { login } from "../controllers/auth.controller";

export const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
