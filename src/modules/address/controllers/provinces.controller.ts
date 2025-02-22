import { Request, Response } from "express";
import addressServices from "../services/address.service";
import { isValidUUID } from "../../../utils/uuidValidator";

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, country_id } = req.body;

    if (!country_id || !isValidUUID(country_id)) {
      res.status(400).json({ message: `country_id inválido, no tiene formato UUID` });
      return
    }

    const countryFound = await addressServices.countries.getById(country_id);

    if (!countryFound) {
      res.status(404).json({ message: `El Provincia con el id: ${country_id} no existe.` });
      return
    }

    const provinceFound = await addressServices.provinces.getByName(name);

    if (provinceFound) {
      res.status(409).json({ message: `La provincia con el nombre: ${name} ya existe.` });
      return
    }

    const result = await addressServices.provinces.add({ name, country_id });

    if (!result) {
      res.status(400).json({ message: `Error al agregar la Provincia.` });
      return
    }

    const provinceExists = await addressServices.provinces.getByName(name);

    if (!provinceExists) {
      res.status(404).json({ message: `Error al encontrar la Provincia agregada` });
      return
    }

    res.status(201).json({
      message: "Provincia agregado exitosamente",
      province: provinceExists,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
    return
  }
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await addressServices.provinces.getAll();

    if (!result) {
      res.status(404).json({ message: `Error al obtener los Provincias.` });
      return
    }

    res.status(201).json({
      message: "Provincias obtenidos exitosamente",
      provinces: result,
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

    const provinceFound = await addressServices.provinces.getById(id);

    if (!provinceFound) {
      res.status(404).json({ message: `La provincia con el id: ${id} no existe.` });
      return
    }

    res.status(201).json({
      message: "Provincia encontrado exitosamente",
      country: provinceFound,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
    return
  }
};

const editById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, country_id } = req.body;

    if (!name && !country_id) {
      res.status(400).json({ message: "Debe enviar al menos un campo para actualizar." });
      return;
    }

    const provinceFound = await addressServices.provinces.getById(id);

    if (!provinceFound) {
      res.status(404).json({ message: `La provincia con el id: ${id} no existe.` });
      return
    }

    if (name) {
      const provinceFound = await addressServices.provinces.getByName(name);

      if (provinceFound) {
        res.status(409).json({ message: `La provincia con el nombre: ${name} ya existe.` });
        return
      }
    }

    if (country_id) {
      if (!isValidUUID(country_id)) {
        res.status(400).json({ message: `country_id inválido, no tiene formato UUID` });
        return
      }

      const countryFound = await addressServices.countries.getById(country_id);

      if (!countryFound) {
        res.status(404).json({ message: `El Provincia con el id: ${country_id} no existe.` });
        return
      }
    }

    const result = await addressServices.provinces.editById({ id, name, country_id });

    if (!result) {
      res.status(400).json({ message: `No se pudo actualizar la Provincia.` });
      return
    }

    const provinceUpdated = await addressServices.provinces.getById(id);

    if (!provinceUpdated) {
      res.status(404).json({ message: `Error al encontrar la provincia actualizada.` });
      return
    }

    res.status(200).json({
      message: "Provincia editada exitosamente",
      country: provinceUpdated,
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

    const provinceFound = await addressServices.provinces.getById(id);

    if (!provinceFound) {
      res.status(404).json({ message: `La Provincia con el id: ${id} no existe.` });
      return
    }

    const result = await addressServices.provinces.deleteById(id);

    if (!result) {
      res.status(404).json({ message: `Error al eliminar la Provincia.` });
      return
    }

    res.status(200).json({
      message: "Provincia eliminada exitosamente",
      country: provinceFound,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
    return
  }
};


const provincesController = {
  create,
  getAll,
  getById,
  editById,
  deleteById
};

export default provincesController;