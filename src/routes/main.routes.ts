import { Router } from "express";
import { usersRoutes } from "../modules/users/routes";
import { addressRoutes } from "../modules/address/routes";
import { shopsRoutes } from "../modules/shops/routes";

export const mainRoutes = Router();

mainRoutes.use("/users", usersRoutes);
mainRoutes.use("/address", addressRoutes);
mainRoutes.use("/shops", shopsRoutes);
