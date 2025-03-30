import { Request, Response } from "express";
import * as addressServices from "../services";
import { validateUUID } from "../../../utils/uuidValidator";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";


const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, province_id, zip_code } = req.body;

    if (!(await addressServices.provinces.getById({ id: province_id }))) {
      return handleErrorResponse(res, 404, `La provincia con el id: ${province_id} no existe.`);
    };

    if ((await addressServices.cities.getByName({ name }))) {
      return handleErrorResponse(res, 409, `La ciudad: ${name} ya existe.`);
    };

    if ((await addressServices.cities.getByZipCode({ zip_code }))) {
      return handleErrorResponse(res, 409, `La ciudad con el código postal ${zip_code} ya existe.`);
    };

    if (!(await addressServices.cities.add(req.body))) {
      return handleErrorResponse(res, 404, `Error al agregar la ciudad.`);
    };

    const result = await addressServices.cities.getByName({ name });
    if (!result) return handleErrorResponse(res, 404, `Error al encontrar la ciudad agregada.`);

    res.status(201).json({
      message: "Ciudad agregada exitosamente.",
      city: result,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { province_id } = req.query;
    let result;

    if (province_id && typeof province_id === 'string') {
      if (!validateUUID(province_id, res)) return;
      result = await addressServices.cities.getByProvinceId({ province_id })
    } else {
      result = await addressServices.cities.getAll();
    };

    res.status(200).json(result ?? []);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};

const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!validateUUID(id, res)) return;

    const result = await addressServices.cities.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `La ciudad con el id: ${id} no existe.`);

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const editById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, zip_code } = req.body;

    if (!req.body || Object.keys(req.body).length === 0 || (!name && !zip_code)) {
      return handleErrorResponse(res, 400, "Debe enviar al menos un campo para actualizar.");
    };

    if (!(await addressServices.cities.getById({ id }))) {
      return handleErrorResponse(res, 404, `La ciudad con el id: ${id} no existe.`);
    };

    if (name && (await addressServices.cities.getByName({ name }))) {
      return handleErrorResponse(res, 409, `La ciudad: ${name} ya existe.`);
    };

    if (zip_code && (await addressServices.cities.getByZipCode({ zip_code }))) {
      return handleErrorResponse(res, 409, `La ciudad con el código postal ${zip_code} ya existe.`);
    };

    if (!(await addressServices.cities.editById({ id, name, zip_code }))) {
      return handleErrorResponse(res, 404, `Error al editar la ciudad.`);
    };

    const result = await addressServices.cities.getById({ id });
    if (!result) return handleErrorResponse(res, 400, `Error al encontrar la ciudad editada.`);

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!validateUUID(id, res)) return;

    const result = await addressServices.cities.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `La ciudad con el id: ${id} no existe.`);

    if (!(await addressServices.cities.deleteById({ id }))) {
      return handleErrorResponse(res, 404, `Error al eliminar la ciudad.`)
    };

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};


export default { create, getAll, getById, editById, deleteById };
