import express from "express";
import { countriesRoutes } from "./countries.routes";
import { provincesRoutes } from "./provinces.routes";
import { citiesRoutes } from "./cities.routes";
import { addressesRoutes } from "./addresses.routes";

export const addressRoutes = express.Router();

addressRoutes.use("/countries", countriesRoutes);
addressRoutes.use("/provinces", provincesRoutes);
addressRoutes.use("/cities", citiesRoutes);
addressRoutes.use("/details", addressesRoutes);

