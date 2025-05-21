import express from "express";
import { availableSlotsRoutes } from "./availableSlots.routes";
import { closedDaysRoutes } from "./closedDays.routes";
import { imagesRoutes } from "./images.routes";
import { menusRoutes } from "./menus.routes";
import { ratingsRoutes } from "./ratings.routes";
import { schedulesRoutes } from "./schedules.routes";
import { shopRoutes } from "./shops.routes";
import { shopsAddressesRoutes } from "./shopsAddresses.routes";
import { subcategoriesRoutes } from "./subcategories.routes";
import { tablesRoutes } from "./tables.routes";

export const shopsRoutes = express.Router();

shopsRoutes.use("/subcategories", subcategoriesRoutes);
shopsRoutes.use("/details", shopRoutes);
shopsRoutes.use("/addresses", shopsAddressesRoutes);
shopsRoutes.use("/images", imagesRoutes);
shopsRoutes.use("/tables", tablesRoutes);
shopsRoutes.use("/availableSlots", availableSlotsRoutes);
shopsRoutes.use("/ratings", ratingsRoutes);
shopsRoutes.use("/menus", menusRoutes);
shopsRoutes.use("/schedules", schedulesRoutes);
shopsRoutes.use("/closed-days", closedDaysRoutes);

