import express from "express";
import { userRoutes } from "./users.routes";
import { rolesRoutes } from "./roles.routes";
import { userrolesRoutes } from "./userroles.routes";
import { merchantsRoutes } from "./merchant.routes";
import { operatorsRoutes } from "./operators.routes";

export const usersRoutes = express.Router();

usersRoutes.use("/details", userRoutes);
usersRoutes.use("/roles", rolesRoutes);
usersRoutes.use("/userroles", userrolesRoutes);
usersRoutes.use("/merchants", merchantsRoutes);
usersRoutes.use("/operators", operatorsRoutes);


