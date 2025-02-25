import express from "express";
import { subcategoriesRoutes } from "./subcategories.routes";
import { shopRoutes } from "./shops.routes";

export const shopsRoutes = express.Router();


shopsRoutes.use("/subcategories", subcategoriesRoutes);
shopsRoutes.use("/", shopRoutes);

