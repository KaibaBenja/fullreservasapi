import { Request, Response } from "express";
import footerService from "../services/footer.service";
import { IFooter } from "../types/footer.types";

const add = async (req: Request, res: Response) => {
  try {
    const data: IFooter = req.body;
    const result = await footerService.add(data);

    if (result) {
      return res
        .status(201)
        .json({ message: "Contenido agregado correctamente", data: result });
    } else {
      return res
        .status(400)
        .json({ message: "No se pudo agregar el contenido" });
    }
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error?.message || "Error al agregar el contenido." });
  }
};

const getAll = async (_req: Request, res: Response) => {
  try {
    const result = await footerService.getAll();

    if (result) {
      return res.status(200).json({ data: result });
    } else {
      return res.status(404).json({ message: "No se encontró contenido." });
    }
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error?.message || "Error al obtener el contenido." });
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await footerService.getById({ id });

    if (result) {
      return res.status(200).json({ data: result });
    } else {
      return res
        .status(404)
        .json({ message: "No se encontró el contenido con ese ID." });
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error?.message || "Error al obtener el contenido por ID.",
    });
  }
};

const getByKey = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const validKey = key as IFooter["key"];
    const result = await footerService.getByKey(validKey);

    if (result) {
      return res.status(200).json({ data: result });
    } else {
      return res
        .status(404)
        .json({ message: "No se encontró el contenido con esa clave." });
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error?.message || "Error al obtener el contenido por clave.",
    });
  }
};

const editById = async (req: Request, res: Response) => {
  try {
    const data: IFooter = req.body;
    const result = await footerService.editById(data);

    if (result) {
      return res
        .status(200)
        .json({ message: "Contenido actualizado correctamente", data: result });
    } else {
      return res
        .status(400)
        .json({ message: "No se pudo actualizar el contenido." });
    }
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error?.message || "Error al editar el contenido." });
  }
};

const deleteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await footerService.deleteById({ id });

    if (result) {
      return res
        .status(200)
        .json({ message: "Contenido eliminado correctamente" });
    } else {
      return res
        .status(404)
        .json({ message: "No se encontró el contenido para eliminar." });
    }
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: error?.message || "Error al eliminar el contenido." });
  }
};

export default { add, getAll, getById, getByKey, editById, deleteById };
