import { Request, Response } from "express";
import * as shopsServices from "../services";
import { isValidUUID } from "../../../utils/uuidValidator";


const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;

    const subcategoryFound = await shopsServices.subcategories.getByName(name);
    if (subcategoryFound) {
      res.status(404).json({ message: `La subcategoria: ${name} ya existe.` });
      return;
    };

    const result = await shopsServices.subcategories.add(req.body);
    if (!result) {
      res.status(400).json({ message: `Error al agregar la subcategoria.` });
      return;
    };

    const subcategoryExists = await shopsServices.subcategories.getByName(name);
    if (!subcategoryExists) {
      res.status(404).json({ message: `Error al encontrar la dirección agregada.` });
      return;
    };

    res.status(201).json({
      message: "Subcategoria agregada exitosamente",
      subcategory: subcategoryExists,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
    return;
  };
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { main_category } = req.query;

    if (main_category && typeof main_category === 'string') {
      if (!["COMMERCE", "SERVICE"].includes(main_category.toUpperCase())) {
        res.status(400).json({ message: `main_category inválido` });
        return;
      }

      const result = await shopsServices.subcategories.getAllByMainCategory(main_category);
      if (!result) {
        res.status(204).json({ message: `No se encontraron subcategorias.` });
        return;
      };

      res.status(201).json({
        message: `Subcategorias: ${main_category} obtenidas exitosamente`,
        subcategories: result,
      });
    } else {
      const result = await shopsServices.subcategories.getAll();
      if (!result) {
        res.status(204).json({ message: `No se encontraron subcategorias.` });
        return;
      };

      res.status(201).json({
        message: "Subcategorias obtenidas exitosamente",
        subcategories: result,
      });
    }
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

    const subcategoryFound = await shopsServices.subcategories.getById(id);
    if (!subcategoryFound) {
      res.status(404).json({ message: `La subcategoria con el id: ${id} no existe.` });
      return;
    };

    res.status(201).json({
      message: "Subcategoria encontrada exitosamente",
      subcategory: subcategoryFound,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
    return;
  };
};

const editById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).json({ message: "Debe enviar al menos un campo para actualizar." });
      return;
    };

    const subcategoryFound = await shopsServices.subcategories.getById(id);
    if (!subcategoryFound) {
      res.status(404).json({ message: `La subcategoria con el id: ${id} no existe.` });
      return;
    };

    if (name) {
      const subcategoryFound = await shopsServices.subcategories.getByName(name);
      if (subcategoryFound) {
        res.status(404).json({ message: `La subcategoria: ${name} ya existe.` });
        return;
      };
    };

    const result = await shopsServices.subcategories.editById({ id, ...req.body });
    if (!result) {
      res.status(400).json({ message: `No se pudo actualizar la subcategoria.` });
      return;
    };

    const addressUpdated = await shopsServices.subcategories.getById(id);
    if (!addressUpdated) {
      res.status(404).json({ message: `Error al encontrar la subcategoria actualizada.` });
      return;
    };

    res.status(200).json({
      message: "Subcategoria editada exitosamente",
      subcategory: addressUpdated,
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

    const subcategoryFound = await shopsServices.subcategories.getById(id);
    if (!subcategoryFound) {
      res.status(404).json({ message: `La subcategoria con el id: ${id} no existe.` });
      return;
    };

    const result = await shopsServices.subcategories.deleteById(id);
    if (!result) {
      res.status(404).json({ message: `Error al eliminar la subcategoria.` });
      return;
    };

    res.status(200).json({
      message: "Subcategoria eliminada exitosamente",
      subcategory: subcategoryFound,
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

