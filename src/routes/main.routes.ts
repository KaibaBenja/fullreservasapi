import { Router } from "express";
import { usersRoutes } from "../modules/users/users.routes";

export const mainRoutes = Router();

mainRoutes.use("/users", usersRoutes);