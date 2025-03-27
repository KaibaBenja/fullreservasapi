import express from "express";
import { validateSchema, validateSchemaPartial } from "../../../middlewares/validateSchema";
import { operatorsSchema } from "../schemas/operators.schema";
import operatorsController from "../controllers/operators.controller";

export const operatorsRoutes = express.Router();

operatorsRoutes.post("/", validateSchema(operatorsSchema), operatorsController.create);
operatorsRoutes.get("/", operatorsController.getAll);
operatorsRoutes.get("/:id", operatorsController.getById);
operatorsRoutes.patch("/:id", validateSchemaPartial(operatorsSchema), operatorsController.editById);
operatorsRoutes.delete("/:id", operatorsController.deleteById);
