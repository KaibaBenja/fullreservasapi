import { IUserRoles } from "../types/userroles.types";
import UserRole from "../models/userroles.model";
import { uuidToBuffer } from "../../../utils/uuidToBuffer";
import { sequelize } from "../../../config/sequalize.config";


const add = async ({ user_id, role_id }: IUserRoles) => {
  try {
    const result = await UserRole.create({
      user_id: uuidToBuffer(user_id),
      role_id: uuidToBuffer(role_id)
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error("Error al asignar el rol al usuario.");
  };
};

const getAll = async () => {
  try {
    const result = await UserRole.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), '_id'],
        [sequelize.literal('BIN_TO_UUID(user_id)'), 'user_id'],
        [sequelize.literal('BIN_TO_UUID(role_id)'), 'role_id'],
      ],
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error("Error al obtener los roles de usuarios.");
  };
};

const getById = async ({ id }: Pick<IUserRoles, "id">) => {
  try {
    const result = await UserRole.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), '_id'],
        [sequelize.literal('BIN_TO_UUID(user_id)'), 'user_id'],
        [sequelize.literal('BIN_TO_UUID(role_id)'), 'role_id'],
      ],
      where: sequelize.literal(`id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error('Error al obtener el rol del usuario por id.');
  };
};

const getAllByFilters = async (filters: Partial<IUserRoles>) => {
  try {
    const { user_id, role_id } = filters;

    const whereConditions: Record<string, any> = {};

    if (user_id) whereConditions.user_id = uuidToBuffer(user_id);
    if (role_id) whereConditions.role_id = uuidToBuffer(role_id);

    const result = await UserRole.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), '_id'],
        [sequelize.literal('BIN_TO_UUID(user_id)'), 'user_id'],
        [sequelize.literal('BIN_TO_UUID(role_id)'), 'role_id'],
      ],
      where: whereConditions
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error('Error al obtener los roles con los filtros proporcionados.');
  }
};

const deleteById = async ({ id }: Pick<IUserRoles, "id">) => {
  try {
    const result = await UserRole.destroy({
      where: { id: sequelize.fn('UUID_TO_BIN', id) }
    });

    return result ? { success: true } : null;
  } catch (error) {
    throw new Error("Error al eliminar el rol del usuario.");
  };
};


export default { add, getAll, getById, getAllByFilters, deleteById };
