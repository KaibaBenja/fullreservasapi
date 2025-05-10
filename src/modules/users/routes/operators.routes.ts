import express from "express";
import { validateSchema } from "../../../middlewares/validateSchema";
import operatorsController from "../controllers/operators.controller";
import { operatorsSchema } from "../schemas/operators.schema";

export const operatorsRoutes = express.Router();
/**
 * @swagger
 * components:
 *  schemas:
 *      operator_settings:
 *          type: object
 *          required:
 *              - id
 *              - user_id
 *              - shop_id
 *          properties:
 *              id:
 *                  type: binary
 *                  format: uuid
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *              user_id:
 *                  type: varchar
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *              shop_id:
 *                  type: varchar
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *              created_at:
 *                  type: date-time
 *                  example: 2025-05-09 20:07:47.000000
 *              updated_at:
 *                  type: date-time
 *                  example: 2025-05-09 20:07:47.000000
 *          example:
 *              id: 550e8400-e29b-41d4-a716-446655440000
 *              user_id: 550e8400-e29b-41d4-a716-446655440000
 *              shop_id: 550e8400-e29b-41d4-a716-446655440000
 *              created_at: 2025-05-09 20:07:47.000000
 *              updated_at: 2025-05-09 20:07:47.000000
 */

/**
 * @swagger
 * tags:
 *  name: Operator
 *  description: Operadores
 */
operatorsRoutes.post("/", validateSchema(operatorsSchema), operatorsController.create);
operatorsRoutes.get("/", operatorsController.getAll);
operatorsRoutes.get("/:id", operatorsController.getById);
operatorsRoutes.delete("/:id", operatorsController.deleteById);
