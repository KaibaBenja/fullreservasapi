import express from "express";
import { userRoutes } from "./users.routes";
import { rolesRoutes } from "./roles.routes";
import { userrolesRoutes } from "./userroles.routes";

export const usersRoutes = express.Router();

usersRoutes.use("/details", userRoutes);
usersRoutes.use("/roles", rolesRoutes);
usersRoutes.use("/userroles", userrolesRoutes);


