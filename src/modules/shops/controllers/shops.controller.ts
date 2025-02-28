import { Request, Response } from "express";
import * as shopsServices from "../services";
import usersServices from "../../users/users.service";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";
import { validateUUID } from "../../../utils/uuidValidator";


const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, subcategory_id } = req.body;

    const userFound = await usersServices.getById(user_id);
    if (!userFound) return handleErrorResponse(res, 404, `El usuario con el id: ${user_id} no existe.`);

    const subcategoryExists = await shopsServices.subcategories.getById(subcategory_id);
    if (!subcategoryExists) return handleErrorResponse(res, 404, `La subcategoría con el id: ${subcategory_id} no existe.`);

    const newShop = await shopsServices.shops.add(req.body);
    if (!newShop) return handleErrorResponse(res, 500, `Error al agregar el negocio.`);

    const shopsExists = await shopsServices.shops.lastCreatedEntry(req.body);
    if (!shopsExists) return handleErrorResponse(res, 404, ` Error al encontrar el negocio agregado.`);

    res.status(201).json({
      message: "Negocio agregado exitosamente",
      address: shopsExists,
    });
  } catch (error) {
    handleErrorResponse(res, 500, `Error interno del servidor.`);
  }
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { main_category, category } = req.query;
    let result;
    let message;

    if (main_category && typeof main_category === "string") {
      if (!["COMMERCE", "SERVICE"].includes(main_category.toUpperCase())) {
        return handleErrorResponse(res, 400, `La query main_category es inválida.`);
      }

      result = await shopsServices.shops.getShopsByMainCategory(main_category);
      message = `Negocios de tipo ${main_category} obtenidos exitosamente.`;
    }
    else if (category && typeof category === "string") {
      if (!(await shopsServices.subcategories.getByName(category))) {
        return handleErrorResponse(res, 404, `La subcategoría: ${category} no existe.`);
      }

      result = await shopsServices.shops.getShopsBySubcategoryName(category);
      message = `Negocios de tipo ${category} obtenidos exitosamente.`;
    }
    else {
      result = await shopsServices.shops.getAll();
      message = "Negocios obtenidos exitosamente.";
    }

    if (!result || result.length === 0) {
      return handleErrorResponse(res, 404, "No se encontraron negocios.");
    }

    res.status(200).json({ message, shops: result });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};

const getAllPublic = async (req: Request, res: Response): Promise<void> => {
  try {
    const { main_category, category } = req.query;
    let result;
    let message;

    if (main_category && typeof main_category === "string") {
      if (!["COMMERCE", "SERVICE"].includes(main_category.toUpperCase())) {
        return handleErrorResponse(res, 400, `La query main_category es inválida.`);
      }

      result = await shopsServices.shops.getShopsByMainCategory(main_category);
      message = `Negocios de tipo ${main_category} obtenidos exitosamente.`;
    }
    else if (category && typeof category === "string") {
      if (!(await shopsServices.subcategories.getByName(category))) {
        return handleErrorResponse(res, 404, `La subcategoría: ${category} no existe.`);
      }

      result = await shopsServices.shops.getShopsBySubcategoryName(category);
      message = `Negocios de tipo ${category} obtenidos exitosamente.`;
    }
    else {
      result = await shopsServices.shops.getAll();
      message = "Negocios obtenidos exitosamente.";
    }

    if (!result || result.length === 0) {
      return handleErrorResponse(res, 404, "No se encontraron negocios.");
    }

    const sanitizedShops = result.map(({ legal_info, bank_info, id, ...shop }) => ({
      ...shop,
    }));

    res.status(200).json({ message, shops: sanitizedShops });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};

const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!validateUUID(id, res)) return;

    const shopFound = await shopsServices.shops.getById(id);
    if (!shopFound) return handleErrorResponse(res, 404, `El negocio con el id: ${id} no existe.`);

    res.status(201).json({
      message: "Negocio encontrado exitosamente",
      address: shopFound,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getByIdPublic = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!validateUUID(id, res)) return;

    const shopFound = await shopsServices.shops.getById(id);
    if (!shopFound) return handleErrorResponse(res, 404, `El negocio con el id: ${id} no existe.`);

    const { legal_info, bank_info, ...shop } = shopFound;

    res.status(200).json({
      message: "Negocio encontrado exitosamente",
      shop,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  }
};

const editById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { user_id, subcategory_id } = req.body;

    if (!validateUUID(id, res)) return;

    if (!req.body || Object.keys(req.body).length === 0) {
      return handleErrorResponse(res, 400, "Debe enviar al menos un campo para actualizar.");
    };

    if (user_id && validateUUID(user_id, res)) {
      if (!(await usersServices.getById(user_id))) {
        return handleErrorResponse(res, 404, `El usuario con el id: ${user_id} no existe.`);
      };
    };

    if (subcategory_id && validateUUID(subcategory_id, res)) {
      if (!(await usersServices.getById(user_id))) {
        return handleErrorResponse(res, 404, `La subcategoria con el id: ${subcategory_id} no existe.`);
      };
    };

    const result = await shopsServices.shops.editById({ id, ...req.body });
    if (!result) handleErrorResponse(res, 400, `No se pudo actualizar el negocio.`);

    const shopUpdated = await shopsServices.shops.getById(id);
    if (!shopUpdated) handleErrorResponse(res, 400, `Error al encontrar el negocio actualizado.`);

    res.status(200).json({
      message: "Negocio editada exitosamente",
      country: shopUpdated,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!validateUUID(id, res)) return;

    const shopFound = await shopsServices.shops.getById(id);
    if (!shopFound) return handleErrorResponse(res, 404, `El negocio con el id: ${id} no existe.`);

    const result = await shopsServices.shops.deleteById(id);
    if (!result) handleErrorResponse(res, 404, `Error al eliminar el negocio.`);

    res.status(200).json({
      message: "Negocio eliminada exitosamente",
      city: shopFound,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};


export default { create, getAll, getAllPublic, getById, getByIdPublic, editById, deleteById };

