import { Router } from "express";
import { usersRoutes } from "../modules/users/users.routes";
import { addressRoutes } from "../modules/address/routes/address.routes";

export const mainRoutes = Router();

mainRoutes.use("/users", usersRoutes);
mainRoutes.use("/address", addressRoutes);