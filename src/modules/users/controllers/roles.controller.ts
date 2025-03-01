import { Request, Response } from "express";
import * as usersServices from "../service";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";
import { validateUUID } from "../../../utils/uuidValidator";


const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const roles = [
      { name: "CLIENT", description: "Cliente estándar" },
      { name: "MERCHANT", description: "Comerciante" },
      { name: "OPERATOR", description: "Operador del sistema" },
      { name: "SUPERADMIN", description: "Administrador con todos los permisos" }
    ];

    for (const role of roles) {
      const roleFound = await usersServices.roles.getByName(role.name);
      if (roleFound) return handleErrorResponse(res, 400, `El rol: ${role.name} ya existe.`);
    };

    roles.map(async (role) => {
      const roleAdded = await usersServices.roles.add(role);
      if (!roleAdded) return handleErrorResponse(res, 400, `Error al agregar el rol: ${role}`);
    })

    for (const role of roles) {
      const roleFound = await usersServices.roles.getByName(role.name);
      if (!roleFound) return handleErrorResponse(res, 400, `Error al buscar el rol: ${role.name} agregado.`);
    };

    const rolesExists = usersServices.roles.getAll();
    if (!rolesExists) return handleErrorResponse(res, 404, `Error al encontrar los roles agregados.`);

    res.status(201).json({
      message: "Roles creados exitosamente",
      user: rolesExists,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await usersServices.roles.getAll();
    if (!result) return handleErrorResponse(res, 204, `No se encontraron roles.`);

    res.status(201).json({
      message: "Roles obtenidos exitosamente",
      roles: result,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!validateUUID(id, res)) return;

    const roleFound = await usersServices.roles.getById(id);
    if (!roleFound) {
      return handleErrorResponse(res, 404, `El rol con el id: ${id} no existe.`);
    };

    res.status(201).json({
      message: "Rol encontrado exitosamente.",
      role: roleFound,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};


export default { create, getAll, getById };

