import { sequelize } from "../../../config/sequelize/sequalize.config";
import { IResetToken } from "../types/resetToken.types";
import ResetToken from "../models/resetToken.model";
import { uuidToBuffer } from "../../../utils/uuidToBuffer";
import crypto from "crypto";
import User from "../models/users.model";
import { Op } from "sequelize";
import { DateTime } from "luxon";


const add = async ({ user_id }: Pick<IResetToken, "user_id">) => {
  try {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = DateTime.utc().plus({ minutes: 15 }).toJSDate(); // 15 minutos

    const result = await ResetToken.create({
      user_id: uuidToBuffer(user_id),
      token: token,
      expires_at: expiresAt
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error("Error al crear el token.");
  };
};

const getAll = async () => {
  try {
    const result = await ResetToken.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(user_id)'), 'user_id'],
        'token',
        'used',
        'expires_at',
        'createdAt',
        'updatedAt',
      ],
    });

    return result.length ? result : null;
  } catch (error) {
    throw new Error("Error al obtener los tokens.");
  };
};

const getById = async ({ id }: Pick<IResetToken, "id">) => {
  try {
    const result = await ResetToken.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(user_id)'), 'user_id'],
        'token',
        'used',
        'expires_at',
        'createdAt',
        'updatedAt',
      ],
      where: sequelize.literal(`id = UUID_TO_BIN(?)`),
      replacements: [id],
    });
    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error('Error al obtener el token por id');
  };
};

const getByToken = async ({ token }: Pick<IResetToken, "token">) => {
  try {
    const result = await ResetToken.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(`ResetToken`.`id`)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(`ResetToken`.`user_id`)'), 'user_id'],
        'token',
        'used',
        'expires_at',
        'created_at',
        'updated_at'
      ],
      include: [
        {
          model: User,
          as: 'user',
          attributes: [
            [sequelize.literal('BIN_TO_UUID(`user`.`id`)'), 'user_id'],
            'full_name',
            'email',
            'firebase_uid',
            'password_changed',
            'created_at',
            'updated_at'
          ],
        }
      ],
      where: {
        [Op.and]: 
        [
          sequelize.where(sequelize.fn('BINARY', sequelize.col('ResetToken.token')), token),
        ]
      },
    });
    return result || null;
  } catch (error) {
    throw new Error('Error al obtener el token por token');
  };
};

const editById = async ({ id, used }: Pick<IResetToken, "id" | "used">) => {
  try {
    const updateData: any = {};

    if (used !== undefined) updateData.used = used;

    const [updatedRowsCount] = await ResetToken.update(updateData, {
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`)
    });

    return updatedRowsCount > 0 ? { success: true } : null;
  } catch (error) {
    throw new Error('Error al editar el token.');
  };
};

const deleteById = async ({ id }: Pick<IResetToken, "id">) => {
  try {
    const result = await ResetToken.destroy({
      where: { id: sequelize.fn('UUID_TO_BIN', id) }
    });

    return result ? { success: true } : null;
  } catch (error) {
    throw new Error("Error al eliminar el token.");
  };
};


export default { add, getAll, getById, getByToken, editById, deleteById };