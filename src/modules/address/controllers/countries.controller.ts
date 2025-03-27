import { Request, Response } from "express";
import * as addressServices from "../services";
import { isValidUUID } from "../../../utils/uuidValidator";

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;

    const countryFound = await addressServices.countries.getByName(name);
    if (countryFound) {
      res.status(409).json({ message: `El país con el nombre: ${name} ya existe.` });
      return
    };

    const result = await addressServices.countries.add({ name });
    if (!result) {
      res.status(400).json({ message: `Error al agregar el país.` });
      return
    };

    const counrtyExists = await addressServices.countries.getByName(name);
    if (!counrtyExists) {
      res.status(404).json({ message: `Error al encontrar el país agregado` });
      return
    };

    res.status(201).json({
      message: "País agregado exitosamente",
      country: counrtyExists,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
    return;
  };
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await addressServices.countries.getAll();
    if (!result) {
      res.status(404).json({ message: `Error al obtener los países.` });
      return
    };

    res.status(201).json({
      message: "Países obtenidos exitosamente",
      country: result,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
    return;
  };
};

const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id || !isValidUUID(id)) {
      res.status(400).json({ message: `ID inválido, no tiene formato UUID` });
      return;
    }

    const countryFound = await addressServices.countries.getById(id);
    if (!countryFound) {
      res.status(404).json({ message: `El país con el id: ${id} no existe..` });
      return;
    };

    res.status(201).json({
      message: "País encontrado exitosamente",
      country: countryFound,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
    return;
  };
};

const editById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!id || !isValidUUID(id)) {
      res.status(400).json({ message: `ID inválido, no tiene formato UUID` });
      return;
    };

    const result = await addressServices.countries.editById({ id, name });
    if (!result) {
      res.status(400).json({ message: `No se pudo actualizar el país.` });
      return;
    };

    const countryUpdated = await addressServices.countries.getById(id);
    if (!countryUpdated) {
      res.status(404).json({ message: `Error al encontrar el país actualizado.` });
      return;
    };

    res.status(200).json({
      message: "País editado exitosamente",
      country: countryUpdated,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
    return;
  };
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    if (!id || !isValidUUID(id)) {
      res.status(400).json({ message: `ID inválido, no tiene formato UUID` });
      return
    }

    const countryFound = await addressServices.countries.getById(id);
    if (!countryFound) {
      res.status(404).json({ message: `El país con el id: ${id} no existe..` });
      return;
    };

    const result = await addressServices.countries.deleteById(id);
    if (!result) {
      res.status(404).json({ message: `Error al eliminar el país.` });
      return;
    };

    res.status(200).json({
      message: "País eliminado exitosamente",
      country: countryFound,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
    return;
  };
};


export default {
  create,
  getAll,
  getById,
  editById,
  deleteById
};

