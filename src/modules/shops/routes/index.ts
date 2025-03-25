import express from "express";
import { subcategoriesRoutes } from "./subcategories.routes";
import { shopRoutes } from "./shops.routes";
import { shopsAddressesRoutes } from "./shopsAddresses.routes";
import { imagesRoutes } from "./images.routes";
import { tablesRoutes } from "./tables.routes";
import { availableSlotsRoutes } from "./availableSlots.routes";
import { ratingsRoutes } from "./ratings.routes";
import { menusRoutes } from "./menus.routes";

export const shopsRoutes = express.Router();

shopsRoutes.use("/subcategories", subcategoriesRoutes);
shopsRoutes.use("/details", shopRoutes);
shopsRoutes.use("/addresses", shopsAddressesRoutes);
shopsRoutes.use("/images", imagesRoutes);
shopsRoutes.use("/tables", tablesRoutes);
shopsRoutes.use("/availableSlots", availableSlotsRoutes);
shopsRoutes.use("/ratings", ratingsRoutes);
shopsRoutes.use("/menus", menusRoutes);

