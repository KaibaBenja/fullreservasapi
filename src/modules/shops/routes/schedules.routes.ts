import express from "express";
import schedulesController from "../controllers/schedules.controller";
import { validateSchemaPartial } from "../../../middlewares/validateSchema";
import { schedulesSchema } from "../schemas/schedules.schema ";

export const schedulesRoutes = express.Router();

schedulesRoutes.get("/", schedulesController.getAll);
schedulesRoutes.get("/:id", schedulesController.getById);
schedulesRoutes.patch("/:id", validateSchemaPartial(schedulesSchema), schedulesController.editById);
schedulesRoutes.delete("/:id", schedulesController.deleteById);
