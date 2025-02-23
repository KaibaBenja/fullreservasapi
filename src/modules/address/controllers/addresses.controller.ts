import { Request, Response } from "express";
import * as addressServices from "../services";
import { isValidUUID } from "../../../utils/uuidValidator";

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { street, street_number, city_id, province_id, country_id } = req.body;

    const addressFound = await addressServices.addresses.getByAddress(street, street_number);
    if (addressFound) {
      res.status(404).json({ message: `La dirección: ${street} ${street_number} ya existe.` });
      return;
    };

    const cityFound = await addressServices.cities.getById(city_id);
    if (!cityFound) {
      res.status(404).json({ message: `La ciudad con el id: ${city_id} no existe.` });
      return;
    };

    const provinceFound = await addressServices.provinces.getById(province_id);
    if (!provinceFound) {
      res.status(404).json({ message: `La provincia con el id: ${province_id} no existe.` });
      return;
    };

    const countryFound = await addressServices.countries.getById(country_id);
    if (!countryFound) {
      res.status(404).json({ message: `El país con el id: ${country_id} no existe.` });
      return;
    };

    const result = await addressServices.addresses.add(req.body);
    if (!result) {
      res.status(400).json({ message: `Error al agregar la dirección.` });
      return;
    };

    const addressExists = await addressServices.addresses.getByAddress(street, street_number);
    if (!addressExists) {
      res.status(404).json({ message: `Error al encontrar la dirección agregada.` });
      return;
    };

    res.status(201).json({
      message: "Dirección agregada exitosamente",
      address: addressExists,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
    return;
  };
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await addressServices.addresses.getAll();

    if (!result) {
      res.status(404).json({ message: `Error al obtener las direcciones.` });
      return;
    };

    res.status(201).json({
      message: "Direcciones obtenidas exitosamente",
      addresses: result,
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
    };

    const addressFound = await addressServices.addresses.getById(id);
    if (!addressFound) {
      res.status(404).json({ message: `La dirección con el id: ${id} no existe.` });
      return;
    };

    res.status(201).json({
      message: "Dirección encontrada exitosamente",
      address: addressFound,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
    return;
  };
};

const editById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { street, street_number,  city_id, province_id, country_id } = req.body;

    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({ message: "Debe enviar al menos un campo para actualizar." });
      return;
    };

    const addressFound = await addressServices.addresses.getById(id);
    if (!addressFound) {
      res.status(404).json({ message: `La dirección con el id: ${id} no existe.` });
      return;
    };

    if (street && street_number) {
      const addressFound = await addressServices.addresses.getByAddress(street, street_number);
      if (addressFound) {
        res.status(404).json({ message: `La dirección: ${street} ${street_number} ya existe.` });
        return;
      };
    };

    if (city_id) {
      const cityFound = await addressServices.cities.getById(city_id);
      if (!cityFound) {
        res.status(404).json({ message: `La ciudad con el id: ${city_id} no existe.` });
        return;
      };
    };

    if (province_id) {
      const provinceFound = await addressServices.provinces.getById(province_id);
      if (!provinceFound) {
        res.status(404).json({ message: `La provincia con el id: ${province_id} no existe.` });
        return;
      };
    };

    if (country_id) {
      const countryFound = await addressServices.countries.getById(country_id);
      if (!countryFound) {
        res.status(404).json({ message: `El país con el id: ${country_id} no existe.` });
        return;
      };
    };

    const result = await addressServices.addresses.editById({ id, ...req.body });
    if (!result) {
      res.status(400).json({ message: `No se pudo actualizar la dirección.` });
      return;
    };

    const addressUpdated = await addressServices.addresses.getById(id);
    if (!addressUpdated) {
      res.status(404).json({ message: `Error al encontrar la dirección actualizada.` });
      return;
    };

    res.status(200).json({
      message: "Dirección editada exitosamente",
      country: addressUpdated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno del servidor." });
    return;
  };
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id || !isValidUUID(id)) {
      res.status(400).json({ message: `ID inválido, no tiene formato UUID` });
      return;
    };

    const addressFound = await addressServices.addresses.getById(id);
    if (!addressFound) {
      res.status(404).json({ message: `La dirección con el id: ${id} no existe.` });
      return;
    };

    const result = await addressServices.addresses.deleteById(id);
    if (!result) {
      res.status(404).json({ message: `Error al eliminar la dirección.` });
      return;
    };

    res.status(200).json({
      message: "Dirección eliminada exitosamente",
      city: addressFound,
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

