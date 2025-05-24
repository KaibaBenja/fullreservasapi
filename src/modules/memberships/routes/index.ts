import express from "express";
import { membershipRoutes } from "./memberships.routes";
import { membershipPlanesRoutes } from "./membershipsPlans.routes";

export const membershipsRoutes = express.Router();

membershipsRoutes.use("/details", membershipRoutes);
membershipsRoutes.use("/plans", membershipPlanesRoutes);


