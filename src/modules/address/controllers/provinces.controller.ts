import { Request, Response } from "express";
import * as addressServices from "../services";
import { validateUUID } from "../../../utils/uuidValidator";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";


const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { country_id, name } = req.body;

    if (!(await addressServices.countries.getById({ id: country_id }))) {
      return handleErrorResponse(res, 404, `El país con el id: ${country_id} no existe.`);
    }

    if ((await addressServices.provinces.getByName({ name }))) {
      return handleErrorResponse(res, 404, `La provincia: ${name} ya existe.`);
    };

    if (!(await addressServices.provinces.add(req.body))) {
      return handleErrorResponse(res, 404, `Error al agregar la provincia.`);
    };

    const result = await addressServices.provinces.getByName({ name });
    if (!result) return handleErrorResponse(res, 404, `Error al encontrar la provincia agregada.`);

    res.status(201).json({
      message: "Provincia agregada exitosamente",
      province: result,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { country_id } = req.query;
    let result;

    if (country_id && typeof country_id === 'string') {
      if (!validateUUID(country_id, res)) return;
      result = await addressServices.provinces.getByCountryId({ country_id })
    } else {
      result = await addressServices.provinces.getAll();
    };

    res.status(200).json(result ?? []);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!validateUUID(id, res)) return;

    const result = await addressServices.provinces.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `La provincia con el id: ${id} no existe.`);

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const editById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!validateUUID(id, res)) return;

    if (!(await addressServices.provinces.getById({ id }))) {
      return handleErrorResponse(res, 404, `La provincia con el id: ${id} no existe.`);
    };

    if ((await addressServices.provinces.getByName({ name }))) {
      return handleErrorResponse(res, 409, `La provincia: ${name} ya existe.`);
    };

    if (!(await addressServices.provinces.editById({ id, name }))) {
      return handleErrorResponse(res, 404, `Error al editar la probincia.`);
    };

    const result = await addressServices.provinces.getById({ id })
    if (!result) return handleErrorResponse(res, 404, `Error al encontra la probincia editada.`);

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!validateUUID(id, res)) return;

    const result = await addressServices.provinces.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `La provincia con el id: ${id} no existe.`);

    if (!(await addressServices.provinces.deleteById({ id }))) {
      return handleErrorResponse(res, 404, `Error al eliminar la provincia.`)
    };

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};


export default { create, getAll, getById, editById, deleteById };

