import { Request, Response } from "express";
import * as shopsServices from "../services";
import * as addressServices from "../../address/services";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";
import { validateUUID } from "../../../utils/uuidValidator";


const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shop_id, address_id } = req.body;

    if (!validateUUID(shop_id, res)) return;
    if (!validateUUID(address_id, res)) return;
    
    if (!(await shopsServices.shops.getById({id: shop_id}))) {
      return handleErrorResponse(res, 404, `El negocio con el id: ${shop_id} no existe.`);
    };

    if (!(await addressServices.addresses.getById({id: address_id}))) {
      return handleErrorResponse(res, 404, `El dirección con el id: ${shop_id} no existe.`);
    };

    if (await shopsServices.shopsAddresses.getByShopAndAddress(req.body)) {
      return handleErrorResponse(res, 409, `La dirección del negocio ya existe.`);
    };

    if (!(await shopsServices.shopsAddresses.add(req.body))) {
      return handleErrorResponse(res, 400, `Error al agregar la dirección del negocio.`);
    };
    const result = await shopsServices.shopsAddresses.getByShopAndAddress({ shop_id, address_id });
    if (!result) return handleErrorResponse(res, 404, `Error al encontrar la dirección del negocio agregada.`);

    res.status(201).json({
      message: "Dirección del negocio agregada exitosamente.",
      shopAddress: result,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await shopsServices.shopsAddresses.getAll();

    res.status(201).json(result ?? []);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!validateUUID(id, res)) return;

    const result = await shopsServices.shopsAddresses.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `La dirección de negocio con el id: ${id} no existe.`);

    res.status(201).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const editById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { address_id } = req.body;
    if (!validateUUID(id, res)) return;
    if (!validateUUID(address_id, res)) return;

    if (!req.body || Object.keys(req.body).length === 0) {
      return handleErrorResponse(res, 400, "Debe enviar al menos un campo para actualizar.");
    };

    if (address_id && !(await addressServices.addresses.getById({id: address_id}))) {
      return handleErrorResponse(res, 404, `La dirección con el id: ${address_id} no existe.`);
    }

    if (!(await shopsServices.shopsAddresses.editById({ id, ...req.body }))) {
      return handleErrorResponse(res, 400, `No se pudo actualizar la dirección del negocio.`);
    };

    const result = await shopsServices.shopsAddresses.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `Error al encontrar la dirección del negocio actualizada.`);

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!validateUUID(id, res)) return;

    const result = await shopsServices.shopsAddresses.getById({ id });
    if (!result) return handleErrorResponse(res, 404, `La dirección del negocio con el id: ${id} no existe.`);

    if (!(await shopsServices.shopsAddresses.deleteById({ id }))) {
      return handleErrorResponse(res, 400, `Error al eliminar la dirección del negocio.`);
    };

    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};


export default { create, getAll, getById, editById, deleteById };

