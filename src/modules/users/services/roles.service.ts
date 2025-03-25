import { IRole } from "../types/roles.types";
import Role from "../models/roles.model";
import { sequelize } from "../../../config/sequalize.config";


const getAll = async () => {
  try {
    const result = await Role.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'name',
        'description',
      ],
    });

    return result.length ? result.map(res => res.toJSON()) : null;
  } catch (error) {
    throw new Error("Error al obtener los roles.");
  };
};

const getById = async ({ id }: Pick<IRole, "id">) => {
  try {
    const result = await Role.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'name',
        'description',
      ],
      where: sequelize.literal(`id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error('Error al obtener el rol por id');
  };
};

const getByName = async ({ name }: Pick<IRole, "name">) => {
  try {
    const result = await Role.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'name',
        'description',
      ],
      where: { 'name': name }
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error('Error al obtener el rol por nombre.');
  };
};


export default { getAll, getById, getByName };
