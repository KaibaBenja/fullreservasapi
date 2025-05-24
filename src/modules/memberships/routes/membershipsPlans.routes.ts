import express from "express";
import { validateSchema, validateSchemaPartial } from "../../../middlewares/validateSchema";
import membershipsPlansController from "../controllers/membershipsPlans.controller";
import { membershipsPlansSchema } from "../schemas/membershipsPlans.schema";

export const membershipPlanesRoutes = express.Router();
/**
 * @swagger
 * components:
 *  schemas:
 *      Memberships:
 *          type: object
 *          required:
 *              - id
 *              - user_id
 *              - tier
 *              - status
 *          properties:
 *              id:
 *                  type: binary
 *                  format: uuid
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *              user_id:
 *                  type: binary
 *                  format: uuid
 *                  example: 550e8400-e29b-41d4-a716-446655440000
 *              tier:
 *                  type: string
 *                  enum: [FREE, BASIC, ADVANCED, PREMIUM]
 *                  example: FREE
 *              status:
 *                  type: string
 *                  enum: [ACTIVE, INACTIVE, PENDING, EXPIRED, DELAYED]
 *                  example: EXPIRED
 *              expire_date:
 *                  type: datetime
 *                  example: 25/05/2025 11:00:00.000
 *              created_at:
 *                  type: datetime
 *                  example: 25/05/2025 11:00:00.000
 *              updated_at:
 *                  type: datetime
 *                  example: 25/05/2025 11:00:00.000
 *          example:
 *              id: 550e8400-e29b-41d4-a716-446655440000
 *              user_id: 550e8400-e29b-41d4-a716-446655440000
 *              tier: FREE
 *              status: EXPIRED
 *              expire_date: 25/05/2025 11:00:00.000
 *              created_at: 25/05/2025 11:00:00.000
 *              updated_at: 25/05/2025 11:00:00.000
 */

/**
 * @swagger
 * tags:
 *  name: Membership
 *  description: Membresías de Comerciantes
 */
membershipPlanesRoutes.post("/", validateSchema(membershipsPlansSchema), membershipsPlansController.create);
membershipPlanesRoutes.get("/", membershipsPlansController.getAll);
membershipPlanesRoutes.post("/filtered", validateSchemaPartial(membershipsPlansSchema), membershipsPlansController.getAllByFilters);
membershipPlanesRoutes.get("/:id", membershipsPlansController.getById);
membershipPlanesRoutes.patch("/:id", validateSchemaPartial(membershipsPlansSchema), membershipsPlansController.editById);
membershipPlanesRoutes.delete("/:id", membershipsPlansController.deleteById);


