import express from "express";
import { membershipRoutes } from "./memberships.routes";

export const membershipsRoutes = express.Router();

membershipsRoutes.use("/", membershipRoutes);


