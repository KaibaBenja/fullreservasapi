import { Request, Response } from "express";
import addressServices from "../services/address.service";
import { isValidUUID } from "../../../utils/uuidValidator";

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, zip_code, province_id } = req.body;

    if (!province_id || !isValidUUID(province_id)) {
      res.status(400).json({ message: `country_id inválido, no tiene formato UUID` });
      return
    }

    const provinceFound = await addressServices.provinces.getById(province_id);

    if (!provinceFound) {
      res.status(404).json({ message: `La provincia con el id: ${province_id} no existe.` });
      return
    }

    const cityFound = await addressServices.cities.getByName(name);

    if (cityFound) {
      res.status(409).json({ message: `La ciudad con el nombre: ${name} ya existe.` });
      return
    }

    const result = await addressServices.cities.add({ name, zip_code, province_id });

    if (!result) {
      res.status(400).json({ message: `Error al agregar la ciudad.` });
      return
    }

    const cityExists = await addressServices.cities.getByName(name);

    if (!cityExists) {
      res.status(404).json({ message: `Error al encontrar la ciudad agregada` });
      return
    }

    res.status(201).json({
      message: "Ciudad agregada exitosamente",
      city: cityExists,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
    return
  }
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await addressServices.cities.getAll();

    if (!result) {
      res.status(404).json({ message: `Error al obtener los ciudades.` });
      return
    }

    res.status(201).json({
      message: "Ciudades obtenidas exitosamente",
      cities: result,
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

    const cityFound = await addressServices.cities.getById(id);

    if (!cityFound) {
      res.status(404).json({ message: `La ciudad con el id: ${id} no existe.` });
      return
    }

    res.status(201).json({
      message: "Ciudad encontrada exitosamente",
      city: cityFound,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
    return
  }
};

const editById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, zip_code, province_id } = req.body;

    if (!name && !zip_code && !province_id) {
      res.status(400).json({ message: "Debe enviar al menos un campo para actualizar." });
      return;
    }

    const cityFound = await addressServices.cities.getById(id);

    if (!cityFound) {
      res.status(404).json({ message: `La ciudad con el id: ${id} no existe.` });
      return;
    }

    if (name) {
      const cityWithName = await addressServices.cities.getByName(name);  // Renombré cityFound a cityWithName para evitar conflictos

      if (cityWithName) {
        res.status(409).json({ message: `La ciudad con el nombre: ${name} ya existe.` });
        return;
      }
    }

    if (province_id) {
      if (!isValidUUID(province_id)) {
        res.status(400).json({ message: `province_id inválido, no tiene formato UUID` });
        return;
      }

      const provinceFound = await addressServices.provinces.getById(province_id);

      if (!provinceFound) {
        res.status(404).json({ message: `La provincia con el id: ${province_id} no existe.` });  // Corregí el mensaje para referirse a "provincia"
        return;
      }
    }

    const result = await addressServices.cities.editById({ id, name, zip_code, province_id });

    if (!result) {
      res.status(400).json({ message: `No se pudo actualizar la ciudad.` });
      return;
    }

    const cityUpdated = await addressServices.cities.getById(id);

    if (!cityUpdated) {
      res.status(404).json({ message: `Error al encontrar la ciudad actualizada.` });
      return;
    }

    res.status(200).json({
      message: "Ciudad editada exitosamente",
      country: cityUpdated,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
    return;
  }
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    if (!id || !isValidUUID(id)) {
      res.status(400).json({ message: `ID inválido, no tiene formato UUID` });
      return
    }

    const cityFound = await addressServices.cities.getById(id);

    if (!cityFound) {
      res.status(404).json({ message: `La ciudad con el id: ${id} no existe.` });
      return
    }

    const result = await addressServices.cities.deleteById(id);

    if (!result) {
      res.status(404).json({ message: `Error al eliminar la ciudad.` });
      return
    }

    res.status(200).json({
      message: "Ciudad eliminada exitosamente",
      city: cityFound,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
    return
  }
};


const citiesController = {
  create,
  getAll,
  getById,
  editById,
  deleteById
};

export default citiesController;