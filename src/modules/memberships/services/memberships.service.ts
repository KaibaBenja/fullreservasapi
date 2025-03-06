import { IMemberships } from "../types/memberships.types";
import Membership from "../models/memberships.model";
import { sequelize } from "../../../config/sequalize.config";
import { uuidToBuffer } from "../../../utils/uuidToBuffer";


const add = async ({ user_id, tier, status, expire_date }: IMemberships) => {
  try {
    const data: any = {
      user_id: uuidToBuffer(user_id),
      tier: tier,
    };

    if (status) data.status = status;
    if (expire_date) data.expire_date = expire_date;

    const newMembership = await Membership.create(data);
    if (!newMembership) {
      return null;
    };

    return { success: true };
  } catch (error) {
    throw new Error("Error al agregar la membresia.");
  };
};

const getAll = async () => {
  try {
    const memberships = await Membership.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(user_id)'), 'user_id'],
        'tier',
        'status',
        'expire_date',
        'created_at',
        'updated_at'
      ],
    });

    if (!memberships || memberships.length === 0) {
      return null;
    };

    return memberships.map(membership => membership.toJSON());
  } catch (error) {
    throw new Error("Error al obtener las membresias.");
  };
};

const getById = async (id: string) => {
  try {
    const membership = await Membership.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(user_id)'), 'user_id'],
        'tier',
        'status',
        'expire_date',
        'created_at',
        'updated_at'
      ],
      where: sequelize.literal(`id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    if (!membership) {
      return null;
    };

    return membership.toJSON();
  } catch (error) {
    throw new Error('Error al obtener la membresia.');
  };
};

const getByUserId = async (user_id: string) => {
  try {
    const membership = await Membership.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(user_id)'), 'user_id'],
        'tier',
        'status',
        'expire_date',
        'created_at',
        'updated_at'
      ],
      where: sequelize.literal(`user_id = UUID_TO_BIN(?)`),
      replacements: [user_id],
    });

    if (!membership) {
      return null;
    };

    return membership.toJSON();
  } catch (error) {
    throw new Error('Error al obtener la membresia por id de usuario.');
  };
};

const getAllByTier = async (tier: string) => {
  try {
    const memberships = await Membership.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(user_id)'), 'user_id'],
        'tier',
        'status',
        'expire_date',
        'created_at',
        'updated_at'
      ],
      where: {
        'tier': tier
      }
    });

    if (!memberships || memberships.length === 0) {
      return null;
    };

    return memberships.map(membership => membership.toJSON());
  } catch (error) {
    throw new Error('Error al obtener las membresias por nivel.');
  };
};

const getAllByStatus = async (status: string) => {
  try {
    const memberships = await Membership.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(user_id)'), 'user_id'],
        'tier',
        'status',
        'expire_date',
        'created_at',
        'updated_at'
      ],
      where: {
        'status': status
      }
    });

    if (!memberships || memberships.length === 0) {
      return null;
    };

    return memberships.map(membership => membership.toJSON());
  } catch (error) {
    throw new Error('Error al obtener las membresias por estado.');
  };
};

const editById = async ({ id, tier, status, expire_date }: IMemberships) => {
  try {
    const updateData: any = {};

    if (tier) updateData.tier = tier;
    if (status) updateData.status = status;
    if (expire_date) updateData.expire_date = expire_date;

    const [updatedRowsCount] = await Membership.update(updateData, {
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`),
    });

    if (updatedRowsCount === 0) {
      return null;
    };

    return { success: true };
  } catch (error) {
    throw new Error('Error al editar la membresía.');
  };
};

const deleteById = async (id: string) => {
  try {
    const result = await Membership.destroy({
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id)})`)
    });

    if (!result) {
      return null;
    };

    return { success: true };
  } catch (error) {
    throw new Error("Error al eliminar la membresia.");
  };
};


export default { add, getAll, getById, getByUserId, getAllByTier, getAllByStatus, editById, deleteById };
