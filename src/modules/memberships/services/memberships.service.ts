import { sequelize } from "../../../config/sequelize/sequalize.config";
import { uuidToBuffer } from "../../../utils/uuidToBuffer";
import Membership from "../models/memberships.model";
import MembershipPlan from "../models/membershipsPlans.model";
import { IMemberships } from "../types/memberships.types";


const add = async ({ user_id, tier, status, expire_date }: IMemberships) => {
  try {
    const data: any = {
      user_id: uuidToBuffer(user_id),
      tier: uuidToBuffer(tier),
    };

    if (status) data.status = status;
    if (expire_date) data.expire_date = expire_date;

    const result = await Membership.create(data);

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error("Error al agregar la membresia.");
  };
};

const getAll = async () => {
  try {
    const result = await Membership.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(Membership.id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(user_id)'), 'user_id'],
        [sequelize.literal('BIN_TO_UUID(tier)'), 'tier'],
        'status',
        'expire_date',
        'created_at',
        'updated_at'
      ],
      include: [
        {
          model: MembershipPlan,
          attributes: [
            [sequelize.literal('BIN_TO_UUID(membership_plan.id)'), 'id'],
            'tier_name',
            'price',
            'description',
            'created_at',
            'updated_at'
          ],
          as: 'membership_plan'
        }
      ]
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error("Error al obtener las membresias.");
  };
};

const getById = async ({ id }: Pick<IMemberships, "id">) => {
  try {
    const result = await Membership.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(Membership.id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(user_id)'), 'user_id'],
        [sequelize.literal('BIN_TO_UUID(tier)'), 'tier'],
        'status',
        'expire_date',
        'created_at',
        'updated_at'
      ],
      include: [
        {
          model: MembershipPlan,
          attributes: [
            [sequelize.literal('BIN_TO_UUID(membership_plan.id)'), 'id'],
            'tier_name',
            'price',
            'description',
            'created_at',
            'updated_at'
          ],
          as: 'membership_plan',
        }
      ],
      where: sequelize.literal(`Membership.id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error('Error al obtener la membresia.');
  };
};

const getAllByFilters = async (filters: Partial<IMemberships>) => {
  try {
    const { user_id, tier, status, expire_date } = filters;

    const whereConditions: Record<string, any> = {};

    if (user_id) whereConditions.user_id = uuidToBuffer(user_id);
    if (tier) whereConditions.tier = uuidToBuffer(tier);
    if (status) whereConditions.status = status;
    if (expire_date) whereConditions.expire_date = expire_date;

    const result = await Membership.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(Membership.id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(user_id)'), 'user_id'],
        [sequelize.literal('BIN_TO_UUID(tier)'), 'tier'],
        'status',
        'expire_date',
        'created_at',
        'updated_at'
      ],
      include: [
        {
          model: MembershipPlan,
          attributes: [
            [sequelize.literal('BIN_TO_UUID(membership_plan.id)'), 'id'],
            'tier_name',
            'price',
            'description',
            'created_at',
            'updated_at'
          ],
          as: 'membership_plan'
        }
      ],
      where: whereConditions
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error('Error al obtener las membresias con los filtros proporcionados.');
  }
};

const editById = async ({ id, tier, status, expire_date }: IMemberships) => {
  try {
    const updateData: any = {};

    if (tier) updateData.tier = uuidToBuffer(tier);
    if (status) updateData.status = status;
    if (expire_date) updateData.expire_date = expire_date;

    const [updatedRowsCount] = await Membership.update(updateData, {
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`),
    });

    return updatedRowsCount > 0 ? { success: true } : null;
  } catch (error) {
    throw new Error('Error al editar la membresía.');
  };
};

const deleteById = async ({ id }: Pick<IMemberships, "id">) => {
  try {
    const result = await Membership.destroy({
      where: { id: sequelize.fn('UUID_TO_BIN', id) }
    });

    return result ? { success: true } : null;
  } catch (error) {
    throw new Error("Error al eliminar la membresia.");
  };
};


export default { add, getAll, getById, getAllByFilters, editById, deleteById };