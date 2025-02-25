import { Request, Response } from "express";
import * as shopsServices from "../services";
import usersServices from "../../users/users.service";
import { isValidUUID } from "../../../utils/uuidValidator";
import { IShops } from "../types/shops.types";


const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, subcategory_id } = req.body;

    if (!user_id || !isValidUUID(user_id)) {
      res.status(400).json({ message: `user_id inválido, no tiene formato UUID` });
      return;
    };
    const userFound = await usersServices.getById(user_id);
    if (!userFound) {
      res.status(404).json({ message: `El usuario con el id: ${user_id} no existe..` });
      return;
    };

    if (!subcategory_id || !isValidUUID(subcategory_id)) {
      res.status(400).json({ message: `subcategory_id inválido, no tiene formato UUID` });
      return;
    };
    const subcategoryFound = await shopsServices.subcategories.getById(subcategory_id);
    if (!subcategoryFound) {
      res.status(404).json({ message: `La subcategoria con el id: ${subcategory_id} no existe.` });
      return;
    };


    const result = await shopsServices.shops.add(req.body);
    if (!result) {
      res.status(400).json({ message: `Error al agregar el negocio.` });
      return;
    };

    const shopsExists = await shopsServices.shops.lastCreatedEntry(req.body);
    if (!shopsExists) {
      res.status(404).json({ message: `Error al encontrar el negocio agregada.` });
      return;
    };

    res.status(201).json({
      message: "Negocio agregado exitosamente",
      address: shopsExists,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
    return;
  };
};

const getAllSecure = async (req: Request, res: Response): Promise<void> => {
  try {
    const { main_category, category } = req.query;
    if (main_category && typeof main_category === 'string') {
      if (!["COMMERCE", "SERVICE"].includes(main_category.toUpperCase())) {
        res.status(400).json({ message: `main_category inválido` });
        return;
      };

      const result = await shopsServices.shops.getShopsByMainCategory(main_category);
      if (!result) {
        res.status(204).json({ message: `No se encontraron shops.` });
        return;
      };

      res.status(201).json({
        message: `Negocios de tipo ${main_category} obtenidos exitosamente.`,
        shops: result,
      });
    } else if (category && typeof category === 'string') {
      const subcategoryFound = await shopsServices.subcategories.getByName(category);
      if (!subcategoryFound) {
        res.status(404).json({ message: `La subcategoria: ${category} no existe.` });
        return;
      };

      const result = await shopsServices.shops.getShopsBySubcategoryName(category);
      if (!result) {
        res.status(204).json({ message: `No se encontraron shops.` });
        return;
      };

      res.status(201).json({
        message: `Negocios de tipo ${category} obtenidos exitosamente.`,
        shops: result,
      });
    }
    else {
      const result = await shopsServices.shops.getAll();
      if (!result) {
        res.status(204).json({ message: `No se encontraron negocios.` });
        return;
      };

      res.status(201).json({
        message: "Negocios obtenidos exitosamente",
        shops: result,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno del servidor." });
    return;
  };
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { main_category, category } = req.query;
    let responseData: { message: string; shops?: any } = { message: "" };

    let result: any = [];

    if (main_category && typeof main_category === "string") {
      if (!["COMMERCE", "SERVICE"].includes(main_category.toUpperCase())) {
        res.status(400).json({ message: `main_category inválido` });
        return;
      }

      result = await shopsServices.shops.getShopsByMainCategory(main_category);
      responseData.message = `Negocios de tipo ${main_category} obtenidos exitosamente.`;
    }

    else if (category && typeof category === "string") {
      const subcategoryFound = await shopsServices.subcategories.getByName(category);
      if (!subcategoryFound) {
        res.status(404).json({ message: `La subcategoria: ${category} no existe.` });
        return;
      }

      result = await shopsServices.shops.getShopsBySubcategoryName(category);
      responseData.message = `Negocios de tipo ${category} obtenidos exitosamente.`;
    }

    else {
      result = await shopsServices.shops.getAll();
      responseData.message = "Negocios obtenidos exitosamente";
    }

    if (!result || result.length === 0) {
      res.status(204).json({ message: `No se encontraron negocios.` });
      return;
    }

    responseData.shops = result.map(({ legal_info, bank_info, ...shop }: IShops) => shop);
    res.status(200).json(responseData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

const getByIdSecure = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id || !isValidUUID(id)) {
      res.status(400).json({ message: `ID inválido, no tiene formato UUID` });
      return;
    };

    const shopFound = await shopsServices.shops.getById(id);
    if (!shopFound) {
      res.status(404).json({ message: `El negocio con el id: ${id} no existe.` });
      return;
    };

    res.status(201).json({
      message: "Negocio encontrado exitosamente",
      address: shopFound,
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

    const shopFound = await shopsServices.shops.getById(id);
    if (!shopFound) {
      res.status(404).json({ message: `El negocio con el id: ${id} no existe.` });
      return;
    }

    const { legal_info, bank_info, ...shop } = shopFound;

    res.status(200).json({
      message: "Negocio encontrado exitosamente",
      shop, 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};


const editById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { user_id, subcategory_id } = req.body;

    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({ message: "Debe enviar al menos un campo para actualizar." });
      return;
    };

    if (user_id) {
      if (!user_id || !isValidUUID(user_id)) {
        res.status(400).json({ message: `user_id inválido, no tiene formato UUID` });
        return;
      };
      const userFound = await usersServices.getById(user_id);
      if (!userFound) {
        res.status(404).json({ message: `El usuario con el id: ${user_id} no existe..` });
        return;
      };
    };

    if (subcategory_id) {
      if (!subcategory_id || !isValidUUID(subcategory_id)) {
        res.status(400).json({ message: `subcategory_id inválido, no tiene formato UUID` });
        return;
      };
      const subcategoryFound = await shopsServices.subcategories.getById(subcategory_id);
      if (!subcategoryFound) {
        res.status(404).json({ message: `La subcategoria con el id: ${subcategory_id} no existe.` });
        return;
      };
    };

    const result = await shopsServices.shops.editById({ id, ...req.body });
    if (!result) {
      res.status(400).json({ message: `No se pudo actualizar el negocio.` });
      return;
    };

    const shopUpdated = await shopsServices.shops.getById(id);
    if (!shopUpdated) {
      res.status(404).json({ message: `Error al encontrar el negocio actualizado.` });
      return;
    };

    res.status(200).json({
      message: "Negocio editada exitosamente",
      country: shopUpdated,
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

    const shopFound = await shopsServices.shops.getById(id);
    if (!shopFound) {
      res.status(404).json({ message: `El negocio con el id: ${id} no existe.` });
      return;
    };

    const result = await shopsServices.shops.deleteById(id);
    if (!result) {
      res.status(404).json({ message: `Error al eliminar el negocio.` });
      return;
    };

    res.status(200).json({
      message: "Negocio eliminada exitosamente",
      city: shopFound,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
    return;
  };
};


export default {
  create,
  getAllSecure,
  getAll,
  getByIdSecure,
  getById,
  editById,
  deleteById
};

