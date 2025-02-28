import { Request, Response } from "express";
import * as shopsServices from "../services";
import * as addressServices from "../../address/services";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";
import { validateUUID } from "../../../utils/uuidValidator";


const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shop_id, address_id } = req.body;

    if (await shopsServices.shopsAddresses.getByShopAndAddress(req.body)) {
      return handleErrorResponse(res, 409, `La dirección del negocio ya existe.`);
    };

    if (!(await shopsServices.shopsAddresses.add(req.body))) {
      return handleErrorResponse(res, 400, `Error al agregar la dirección del negocio.`);
    };

    const shopAddressExists = await shopsServices.shopsAddresses.getByShopAndAddress({ shop_id, address_id });
    if (!shopAddressExists) {
      return handleErrorResponse(res, 404, `Error al encontrar la dirección del negocio agregada.`);
    };

    res.status(201).json({
      message: "Dirección del negocio agregada exitosamente",
      shopAddress: shopAddressExists,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await shopsServices.shopsAddresses.getAll();
    if (!result) return handleErrorResponse(res, 204, `No se encontraron direcciones de negocios.`);

    res.status(201).json({
      message: `Direcciones de negocios obtenidas exitosamente`,
      shopsAddresses: result,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!validateUUID(id, res)) return;

    const shopAddressFound = await shopsServices.shopsAddresses.getById(id);
    if (!shopAddressFound) {
      return handleErrorResponse(res, 404, `La dirección de negocio con el id: ${id} no existe.`);
    };

    res.status(201).json({
      message: "Dirección de negocio encontrada exitosamente",
      shopAddress: shopAddressFound,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const editById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { shop_id, address_id } = req.body;

    if (!req.body || Object.keys(req.body).length === 0) {
      return handleErrorResponse(res, 400, "Debe enviar al menos un campo para actualizar.");
    };

    if (address_id && !(await addressServices.addresses.getById(address_id))) {
      return handleErrorResponse(res, 404, `La dirección con el id: ${address_id} no existe.`);
    }
    if (shop_id && !(await shopsServices.shops.getById(shop_id))) {
      return handleErrorResponse(res, 404, `El negocio con el id: ${shop_id} no existe.`);
    };

    if (address_id && shop_id && !(await shopsServices.shopsAddresses.getByShopAndAddress({ shop_id, address_id }))) {
      return handleErrorResponse(res, 409, `La dirección del negocio ya existe.`);
    };

    if (!(await shopsServices.shopsAddresses.editById({ id, ...req.body }))) {
      return handleErrorResponse(res, 400, `No se pudo actualizar la dirección del negocio.`);
    };

    const shopAddressUpdated = await shopsServices.shopsAddresses.getById(id);
    if (!shopAddressUpdated) return handleErrorResponse(res, 404, `Error al encontrar la subcategoria actualizada.`);

    res.status(200).json({
      message: "Dirección de negocio editada exitosamente",
      shopsAddresses: shopAddressUpdated,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!validateUUID(id, res)) return;

    const shopAddressFound = await shopsServices.shopsAddresses.getById(id);
    if (!shopAddressFound) return handleErrorResponse(res, 404, `La dirección del negocio con el id: ${id} no existe.`);

    if (!(await shopsServices.shopsAddresses.deleteById(id))) {
      return handleErrorResponse(res, 404, `Error al eliminar la dirección del negocio.`);
    };

    res.status(200).json({
      message: "Dirección del negocio eliminada exitosamente",
      shopAddress: shopAddressFound,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};


export default { create, getAll, getById, editById, deleteById };

