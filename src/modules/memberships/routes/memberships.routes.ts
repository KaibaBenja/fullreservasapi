import express from "express";
import membershipsController from "../controllers/memberships.controller";
import { validateSchema, validateSchemaPartial } from "../../../middlewares/validateSchema";
import { membershipsSchema } from "../schemas/memberships.schema";

export const membershipRoutes = express.Router();

membershipRoutes.post("/", validateSchema(membershipsSchema), membershipsController.create);
membershipRoutes.get("/", membershipsController.getAll);
membershipRoutes.get("/:id", membershipsController.getById);
membershipRoutes.patch("/:id", validateSchemaPartial(membershipsSchema), membershipsController.editById);
membershipRoutes.delete("/:id", membershipsController.deleteById);


