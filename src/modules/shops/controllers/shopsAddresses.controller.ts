import { Request, Response } from "express";
import * as shopsServices from "../services";
import * as addressServices from "../../address/services";
import { isValidUUID } from "../../../utils/uuidValidator";


const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shop_id, address_id } = req.body;

    const shopAddressFound = await shopsServices.shopsAddresses.getByShopAndAddress({ shop_id, address_id });
    if (shopAddressFound) {
      res.status(409).json({ message: `La dirección del negocio ya existe.` });
      return;
    };

    const result = await shopsServices.shopsAddresses.add(req.body);
    if (!result) {
      res.status(400).json({ message: `Error al agregar la dirección del negocio.` });
      return;
    };

    const shopAddressExists = await shopsServices.shopsAddresses.getByShopAndAddress({ shop_id, address_id });
    if (!shopAddressExists) {
      res.status(404).json({ message: `Error al encontrar la dirección del negocio agregada.` });
      return;
    };

    res.status(201).json({
      message: "Dirección del negocio agregada exitosamente",
      shopAddress: shopAddressExists,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
    return;
  };
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await shopsServices.shopsAddresses.getAll();
    if (!result) {
      res.status(204).json({ message: `No se encontraron direcciones de negocios.` });
      return;
    };

    res.status(201).json({
      message: `Direcciones de negocios obtenidas exitosamente`,
      shopsAddresses: result,
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

    const shopAddressFound = await shopsServices.shopsAddresses.getById(id);
    if (!shopAddressFound) {
      res.status(404).json({ message: `La dirección de negocio con el id: ${id} no existe.` });
      return;
    };

    res.status(201).json({
      message: "Dirección de negocio encontrada exitosamente",
      shopAddress: shopAddressFound,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
    return;
  };
};

const editById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { shop_id, address_id } = req.body;

    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({ message: "Debe enviar al menos un campo para actualizar." });
      return;
    };

    if (address_id) {
      const addressFound = await addressServices.addresses.getById(address_id);
      if (!addressFound) {
        res.status(404).json({ message: `La dirección con el id: ${address_id} no existe.` });
        return;
      };
    };

    if (shop_id) {
      const shopFound = await shopsServices.shops.getById(shop_id);
      if (!shopFound) {
        res.status(404).json({ message: `El negocio con el id: ${shop_id} no existe.` });
        return;
      };
    };

    if (address_id && shop_id) {
      const shopAddressFound = await shopsServices.shopsAddresses.getByShopAndAddress({ shop_id, address_id });
      if (shopAddressFound) {
        res.status(409).json({ message: `La dirección del negocio ya existe.` });
        return;
      };
    };

    const result = await shopsServices.shopsAddresses.editById({ id, ...req.body });
    if (!result) {
      res.status(400).json({ message: `No se pudo actualizar la dirección del negocio.` });
      return;
    };

    const shopAddressUpdated = await shopsServices.shopsAddresses.getById(id);
    if (!shopAddressUpdated) {
      res.status(404).json({ message: `Error al encontrar la subcategoria actualizada.` });
      return;
    };

    res.status(200).json({
      message: "Dirección de negocio editada exitosamente",
      shopsAddresses: shopAddressUpdated,
    });
  } catch (error) {
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

    const shopAddressFound = await shopsServices.shopsAddresses.getById(id);
    if (!shopAddressFound) {
      res.status(404).json({ message: `La dirección del negocio con el id: ${id} no existe.` });
      return;
    };

    const result = await shopsServices.shopsAddresses.deleteById(id);
    if (!result) {
      res.status(404).json({ message: `Error al eliminar la dirección del negocio.` });
      return;
    };

    res.status(200).json({
      message: "Dirección del negocio eliminada exitosamente",
      shopAddress: shopAddressFound,
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

