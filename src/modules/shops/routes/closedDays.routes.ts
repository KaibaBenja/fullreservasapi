import express from "express";
import { validateSchema, validateSchemaPartial } from "../../../middlewares/validateSchema";
import closedDaysController from "../controllers/closedDays.controller";
import { ClosedDaysSchema, SoloDaySchema } from "../schemas/closedDays.schema";

export const closedDaysRoutes = express.Router();

closedDaysRoutes.post("/", validateSchema(ClosedDaysSchema), closedDaysController.create); //Crea uno o varios closed_day para un shop. acá en day_of_week deberia entra un array con los valores numericos de los dias que un comercio está cerrado y genera un registro en la tabla por cada dia que entra
closedDaysRoutes.get("/", closedDaysController.getAll); //trae todos los closed_days u opcional por shop_id en query todos los closed_days de un shop
closedDaysRoutes.get("/:id", closedDaysController.getById); //trae un closed_day por id
closedDaysRoutes.patch("/:id", validateSchemaPartial(SoloDaySchema), closedDaysController.editById); //edita un closed_day por id
closedDaysRoutes.delete("/:id", closedDaysController.deleteById); //elimina un closed_day por id
closedDaysRoutes.delete("/all/:shop_id", closedDaysController.deleteAllByShopId); //elimina todos los closed_days de un shop por shop_id
