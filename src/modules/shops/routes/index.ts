import express from "express";
import { subcategoriesRoutes } from "./subcategories.routes";

export const shopsRoutes = express.Router();


shopsRoutes.use("/subcategories", subcategoriesRoutes);

