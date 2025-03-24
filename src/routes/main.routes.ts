import { Router } from "express";
import { usersRoutes } from "../modules/users/routes";
import { addressRoutes } from "../modules/address/routes";
import { shopsRoutes } from "../modules/shops/routes";
import { authRoutes } from "../modules/users/routes/auth.routes";

export const mainRoutes = Router();

mainRoutes.use("/users", usersRoutes);
mainRoutes.use("/address", addressRoutes);
mainRoutes.use("/shops", shopsRoutes);
mainRoutes.use("/auth", authRoutes);
