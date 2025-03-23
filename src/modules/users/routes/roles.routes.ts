import express from "express";
import rolesController from "../controllers/roles.controller";

export const rolesRoutes = express.Router();

rolesRoutes.get("/", rolesController.getAll);
rolesRoutes.get("/:id", rolesController.getById);
