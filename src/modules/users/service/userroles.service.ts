import { IUserRoles } from "../types/userroles.types";
import UserRole from "../models/userroles.model";
import { uuidToBuffer } from "../../../utils/uuidToBuffer";
import { sequelize } from "../../../config/sequalize.config";


const add = async ({ user_id, role_id }: IUserRoles) => {
  try {
    const newUserRole = await UserRole.create({
      user_id: uuidToBuffer(user_id),
      role_id: uuidToBuffer(role_id)
    });

    if (!newUserRole) {
      return null;
    };

    return { user_id: newUserRole.user_id, role_id: newUserRole.role_id };
  } catch (error) {
    throw new Error("Error al asignar el rol al usuario");
  };
};

const getAll = async () => {
  try {
    const userroles = await UserRole.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), '_id'],
        [sequelize.literal('BIN_TO_UUID(user_id)'), 'user_id'],
        [sequelize.literal('BIN_TO_UUID(role_id)'), 'role_id'],
      ],
    });

    if (!userroles || userroles.length === 0) {
      return null;
    };

    return userroles.map(userrole => userrole.toJSON());
  } catch (error) {
    throw new Error("Error al obtener los roles de usuarios");
  };
};

const getById = async (id: string) => {
  try {
    const userRole = await UserRole.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), '_id'],
        [sequelize.literal('BIN_TO_UUID(user_id)'), 'user_id'],
        [sequelize.literal('BIN_TO_UUID(role_id)'), 'role_id'],
      ],
      where: sequelize.literal(`id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    if (!userRole) {
      return null;
    };

    return userRole.toJSON();
  } catch (error) {
    throw new Error('Error al obtener el rol del usuario por id');
  };
};

const getByUserId = async (user_id: string) => {
  try {
    const userroles = await UserRole.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), '_id'],
        [sequelize.literal('BIN_TO_UUID(user_id)'), 'user_id'],
        [sequelize.literal('BIN_TO_UUID(role_id)'), 'role_id'],
      ],
      where: sequelize.literal(`user_id = UUID_TO_BIN(?)`),
      replacements: [user_id],
    });

    if (!userroles || userroles.length === 0) {
      return null;
    };

    return userroles.map(userrole => userrole.toJSON());
  } catch (error) {
    throw new Error('Error al obtener los roles por user_id');
  };
};

const getByRoleId = async (role_id: string) => {
  try {
    const userroles = await UserRole.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), '_id'],
        [sequelize.literal('BIN_TO_UUID(user_id)'), 'user_id'],
        [sequelize.literal('BIN_TO_UUID(role_id)'), 'role_id'],
      ],
      where: sequelize.literal(`role_id = UUID_TO_BIN(?)`),
      replacements: [role_id],
    });

    if (!userroles || userroles.length === 0) {
      return null;
    };

    return userroles.map(userrole => userrole.toJSON());
  } catch (error) {
    throw new Error('Error al obtener el rol del usuario por role_id');
  };
};

const getByUserAndRole = async ({ user_id, role_id }: IUserRoles) => {
  try {
    const role = await UserRole.findOne({
      attributes: [
        [sequelize.literal("BIN_TO_UUID(id)"), "id"],
        [sequelize.literal("BIN_TO_UUID(user_id)"), "user_id"],
        [sequelize.literal("BIN_TO_UUID(role_id)"), "role_id"],
      ],
      where: {
        user_id: sequelize.fn("UUID_TO_BIN", user_id),
        role_id: sequelize.fn("UUID_TO_BIN", role_id),
      },
    });

    if (!role) {
      return null;
    };

    return role.toJSON();
  } catch (error) {
    throw new Error("Error al obtener el rol del usuario.");
  };
};

const editById = async ({ id, role_id }: IUserRoles) => {
  try {
    const updateData: any = {};

    if (role_id) updateData.role_id = uuidToBuffer(role_id);

    if (Object.keys(updateData).length === 0) {
      return { hasNoFieldsToUpdate: true };
    };

    const [updatedRowsCount] = await UserRole.update(updateData, {
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`)
    });

    if (updatedRowsCount === 0) {
      return null;
    };

    return { success: true };
  } catch (error) {
    throw new Error('Error al editar el rol de usuario');
  };
};

const deleteById = async (id: string) => {
  try {
    const result = await UserRole.destroy({
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id)})`)
    });

    if (!result) {
      return null;
    };

    return { success: true };
  } catch (error) {
    throw new Error("Error al eliminar el rol del usuario");
  };
};


export default { add, getAll, getById, getByUserId, getByRoleId, getByUserAndRole, editById, deleteById };
