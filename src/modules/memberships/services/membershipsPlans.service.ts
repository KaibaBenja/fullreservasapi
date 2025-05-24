import { IMembershipsPlans } from "../types/membershipsPlans.types";
import MembershipsPlan from "../models/membershipsPlans.model";
import { sequelize } from "../../../config/sequelize/sequalize.config";


const add = async ({ tier_name, price, description }: IMembershipsPlans) => {
  try {
    const data: any = {
      tier_name: tier_name,
      price: price,
    };

    if (description) data.description = description;

    const result = await MembershipsPlan.create(data);

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error("Error al agregar el plan de membresia.");
  };
};

const getAll = async () => {
  try {
    const result = await MembershipsPlan.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'tier_name',
        'price',
        'description',
        'created_at',
        'updated_at'
      ],
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener los planes de membresias.");
  };
};

const getById = async ({ id }: Pick<IMembershipsPlans, "id">) => {
  try {
    const result = await MembershipsPlan.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'tier_name',
        'price',
        'description',
        'created_at',
        'updated_at'
      ],
      where: sequelize.literal(`id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error('Error al obtener el plan de membresía.');
  };
};

const getAllByFilters = async (filters: Partial<IMembershipsPlans>) => {
  try {
    const { tier_name, price, description } = filters;

    const whereConditions: Record<string, any> = {};

    if (tier_name) whereConditions.tier_name = tier_name;
    if (price) whereConditions.price = price;
    if (description) whereConditions.description = description;

    const result = await MembershipsPlan.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'tier_name',
        'price',
        'description',
        'created_at',
        'updated_at'
      ],
      where: whereConditions
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error('Error al obtener los planes de membresias con los filtros proporcionados.');
  }
};

const editById = async ({ id, tier_name, price, description }: IMembershipsPlans) => {
  try {
    const updateData: any = {};

    if (tier_name) updateData.tier_name = tier_name;
    if (price) updateData.status = price;
    if (description) updateData.description = description;

    const [updatedRowsCount] = await MembershipsPlan.update(updateData, {
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`),
    });

    return updatedRowsCount > 0 ? { success: true } : null;
  } catch (error) {
    throw new Error('Error al editar el plan de membresía.');
  };
};

const deleteById = async ({ id }: Pick<IMembershipsPlans, "id">) => {
  try {
    const result = await MembershipsPlan.destroy({
      where: { id: sequelize.fn('UUID_TO_BIN', id) }
    });

    return result ? { success: true } : null;
  } catch (error) {
    throw new Error("Error al eliminar el plan de membresia.");
  };
};


export default { add, getAll, getById, getAllByFilters, editById, deleteById };
