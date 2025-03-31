import { Request, Response } from "express";
import * as addressServices from "../services";
import { validateUUID } from "../../../utils/uuidValidator";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";


const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { street, street_number, extra, city_id, province_id, country_id } = req.body;

    if ((await addressServices.addresses.getAllByFilters({ street, street_number, extra }))) {
      return handleErrorResponse(res, 409, `La dirección ya existe.`);
    };

    if (!(await addressServices.countries.getById({ id: country_id }))) {
      return handleErrorResponse(res, 404, `El país con el id: ${country_id} no existe.`);
    };
    if (!(await addressServices.provinces.getById({ id: province_id }))) {
      return handleErrorResponse(res, 404, `La provincia con el id: ${province_id} no existe.`);
    };
    if (!(await addressServices.cities.getById({ id: city_id }))) {
      return handleErrorResponse(res, 404, `La ciudad con el id: ${city_id} no existe.`);
    };

    if (!(await addressServices.addresses.add(req.body))) {
      return handleErrorResponse(res, 404, `Error al agregar la dirección.`);
    };

    const result = await addressServices.addresses.getAllByFilters({ street, street_number, extra, city_id, province_id, country_id });
    if (!result) return handleErrorResponse(res, 404, `Error al encontrar la dirección agregada.`);

    res.status(201).json({
      message: "Dirección agregada exitosamente",
      address: result,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await addressServices.addresses.getAll();

    res.status(200).json(result ?? []);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAllByFilters = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await addressServices.addresses.getAllByFilters(req.body);

    res.status(201).json(result ?? []);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!validateUUID(id, res)) return;

    const result = await addressServices.addresses.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `La dirección con el id: ${id} no existe.`);

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const editById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { street, street_number, extra } = req.body;

    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({ message: "Debe enviar al menos un campo para actualizar." });
      return;
    };

    if (!(await addressServices.addresses.getById({ id }))) {
      return handleErrorResponse(res, 404, `La dirección con el id: ${id} no existe.`);
    };

    if (street && street_number && extra) {
      if ((await addressServices.addresses.getAllByFilters({ street, street_number, extra }))) {
        return handleErrorResponse(res, 409, `La dirección ya existe.`);
      };
    };

    if (!(await addressServices.addresses.editById({ id, ...req.body }))) {
      return handleErrorResponse(res, 409, `Error al editar la dirección.`);
    };

    const result = await addressServices.addresses.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `La dirección con el id: ${id} no existe.`);

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!validateUUID(id, res)) return;

    const result = await addressServices.addresses.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `La dirección con el id: ${id} no existe.`);

    if (!(await addressServices.addresses.deleteById({ id }))) {
      return handleErrorResponse(res, 404, `Error al eliminar la dirección.`)
    };

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};


export default { create, getAll, getAllByFilters, getById, editById, deleteById };

