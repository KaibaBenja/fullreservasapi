import express from "express";
import rolesController from "../controllers/roles.controller";

export const rolesRoutes = express.Router();

rolesRoutes.post("/", rolesController.create);
rolesRoutes.get("/", rolesController.getAll);
rolesRoutes.get("/:id", rolesController.getById);
