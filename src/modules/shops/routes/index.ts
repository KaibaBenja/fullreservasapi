import express from "express";
import { subcategoriesRoutes } from "./subcategories.routes";
import { shopRoutes } from "./shops.routes";
import { shopsAddressesRoutes } from "./shopsAddresses.routes";
import { imagesRoutes } from "./images.routes";
import { tablesRoutes } from "./tables.routes";

export const shopsRoutes = express.Router();


shopsRoutes.use("/subcategories", subcategoriesRoutes);
shopsRoutes.use("/details", shopRoutes);
shopsRoutes.use("/addresses", shopsAddressesRoutes);
shopsRoutes.use("/images", imagesRoutes);
shopsRoutes.use("/tables", tablesRoutes);

