import express from "express";
import { footerRoutes } from "./footer.routes";


export const contentBlocksRoutes = express.Router();

contentBlocksRoutes.use("/footer", footerRoutes);



