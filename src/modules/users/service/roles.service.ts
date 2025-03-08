import { IRole } from "../types/roles.types";
import Role from "../models/roles.model";
import { sequelize } from "../../../config/sequalize.config";


const add = async ({ name, description }: IRole) => {
  try {
    const newRole = await Role.create({
      name: name,
      description: description,
    });

    if (!newRole) {
      return null;
    };

    return { name: newRole.name, description: newRole.description };
  } catch (error) {
    throw new Error("Error al agregar el nuevo rol");
  };
};

const getAll = async () => {
  try {
    const roles = await Role.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'name',
        'description',
      ],
    });

    if (!roles || roles.length === 0) {
      return null;
    };

    return roles.map(role => role.toJSON());
  } catch (error) {
    throw new Error("Error al obtener los roles");
  };
};

const getById = async (id: string) => {
  try {
    const role = await Role.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'name',
        'description',
      ],
      where: sequelize.literal(`id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    if (!role) {
      return null;
    };

    return role.toJSON();
  } catch (error) {
    throw new Error('Error al obtener el rol por id');
  };
};

const getByName = async (name: string) => {
  try {
    const role = await Role.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'name',
        'description',
      ],
      where: {
        'name': name
      }
    });

    if (!role) {
      return null;
    };

    return role.toJSON();
  } catch (error) {
    throw new Error('Error al obtener el rol por nombre');
  };
};


export default { add, getAll, getById, getByName };
