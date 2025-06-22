import express from "express";
import { validateSchema, validateSchemaPartial } from "../../../middlewares/validateSchema";
import membershipsController from "../controllers/memberships.controller";
import { membershipsSchema, membershipUserSchema } from "../schemas/memberships.schema";

export const membershipRoutes = express.Router();
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
membershipRoutes.post("/", validateSchema(membershipsSchema), membershipsController.create);
membershipRoutes.get("/", membershipsController.getAll);
membershipRoutes.post("/filtered", validateSchemaPartial(membershipsSchema), membershipsController.getAllByFilters);
membershipRoutes.get("/:id", membershipsController.getById);
//patch membership status by userId
membershipRoutes.patch("/status", validateSchema(membershipUserSchema), membershipsController.editStatusByUserId);
membershipRoutes.patch("/:id", validateSchemaPartial(membershipsSchema), membershipsController.editById);
membershipRoutes.delete("/:id", membershipsController.deleteById);


