import { Request, Response } from "express";
import usersServices from "./users.service";
import { isValidUUID } from "../../utils/uuidValidator";

const newUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { full_name, password, email } = req.body;

    const emailExists = await usersServices.getByEmail(email);

    if (emailExists) {
      res.status(409).json({ message: `El usuario con el email: ${email} ya existe.` });
      return
    }

    const result = await usersServices.newUser({ full_name, password, email });

    if (!result) {
      res.status(400).json({ message: `Error al crear el usuario.` });
      return
    }

    const userExists = await usersServices.getByEmail(email);

    if (!userExists) {
      res.status(404).json({ message: `Error al encontrar el usuario.` });
      return
    }

    res.status(201).json({
      message: "Usuario creado exitosamente",
      user: userExists,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
    return
  }
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await usersServices.getAll();

    if (!result) {
      res.status(404).json({ message: `Error al obtener los usuarios.` });
      return
    }

    res.status(201).json({
      message: "Usuarios obtenidos exitosamente",
      user: result,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
    return
  }
};

const getById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {

    if (!id || !isValidUUID(id)) {
      res.status(400).json({ message: `ID inválido, no tiene formato UUID` });
      return
    }

    const userFound = await usersServices.getById(id);

    if (!userFound) {
      res.status(404).json({ message: `El usuario con el id: ${id} no existe..` });
      return
    }

    res.status(201).json({
      message: "Usuario encontrado exitosamente",
      user: userFound,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
    return
  }
};

const editById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { full_name, password, email } = req.body;

  try {
    if (!id || !isValidUUID(id)) {
      res.status(400).json({ message: `ID inválido, no tiene formato UUID` });
      return
    }

    const userFound = await usersServices.getById(id);

    if (!userFound) {
      res.status(404).json({ message: `El usuario con el id: ${id} no existe.` });
      return
    }

    if (email) {
      const emailExists = await usersServices.getByEmail(email);

      if (emailExists) {
        res.status(409).json({ message: `El usuario con el email: ${email} ya existe.` });
        return
      }
    }

    const result = await usersServices.editById({ id, full_name, password, email });

    if (!result) {
      res.status(400).json({ message: `No se pudo actualizar el usuario.` });
      return
    }

    if (result.hasNoFieldsToUpdate) {
      res.status(400).json({ message: `No hay datos para actualizar.` });
      return
    }

    const userUpdated = await usersServices.getById(id);

    if (!userUpdated) {
      res.status(404).json({ message: `Error al encontrar el usuario actualizado.` });
      return
    }

    res.status(200).json({
      message: "Usuario editado exitosamente",
      user: userUpdated,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
    return
  }
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    if (!id || !isValidUUID(id)) {
      res.status(400).json({ message: `ID inválido, no tiene formato UUID` });
      return
    }

    const userFound = await usersServices.getById(id);

    if (!userFound) {
      res.status(404).json({ message: `El usuario con el id: ${id} no existe..` });
      return
    }

    const result = await usersServices.deleteById(id);

    if (!result) {
      res.status(404).json({ message: `Error al eliminar el usuario.` });
      return
    }

    res.status(200).json({
      message: "Usuario eliminado exitosamente",
      user: userFound,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
    return
  }
};

const assignRole = async (req: Request, res: Response): Promise<void> => {
  const { id, roleId } = req.params;

  try {
    if (!id || !isValidUUID(id)) {
      res.status(400).json({ message: `ID inválido, no tiene formato UUID` });
      return
    }

    if (!roleId || !isValidUUID(roleId)) {
      res.status(400).json({ message: `ID de rol inválido, no tiene formato UUID` });
      return
    }

    const userFound = await usersServices.getById(id);

    if (!userFound) {
      res.status(404).json({ message: `El usuario con el id: ${id} no existe.` });
      return
    }

    const rolFound = await usersServices.getRoleById(roleId);

    if (!rolFound) {
      res.status(404).json({ message: `El rol con el id: ${id} no existe.` });
      return
    }

    const assignedRole = await usersServices.checkUserRoleExistence({ user_id: id, role_id: roleId });

    if (assignedRole) {
      res.status(404).json({ message: `El usuario con el id: ${id} ya tiene assignado el rol con el id: ${roleId}.` });
      return
    }

    const assignRole = await usersServices.assignRole({ user_id: id, role_id: roleId });

    if (!assignRole) {
      res.status(404).json({ message: `Error al asignar el rol al usuario.` });
      return
    }

    const result = await usersServices.checkUserRoleExistence({ user_id: id, role_id: roleId });


    if (!result) {
      res.status(404).json({ message: `Error al asignar el rol al usuario.` });
      return
    }

    res.status(200).json({
      message: "Rol asignado exitosamente",
      user: userFound,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
    return
  }
};

const usersController = {
  newUser,
  getAll,
  getById,
  editById,
  deleteById,
  assignRole
};

export default usersController;