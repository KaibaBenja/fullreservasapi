import { Request, Response } from "express";
import * as shopsServices from "../services";
import { isValidUUID } from "../../../utils/uuidValidator";

const upload = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: "No se pudo subir la imagen." });
    return;
  }

  const file = req.file as Express.MulterS3.File;

  res.status(201).json({
    message: "Imagen subida exitosamente",
    imageUrl: file.location,
  });
};

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shop_id } = req.body;
    const { image_url } = (req.file as any).location;

    const imageFound = await shopsServices.images.getByImageUrl(image_url);
    if (imageFound) {
      res.status(409).json({ message: `La imagen ya existe.` });
      return;
    }

    const shopFound = await shopsServices.shops.getById(shop_id);
    if (!shopFound) {
      res
        .status(404)
        .json({ message: `El negocio con el id: ${shop_id} no existe.` });
      return;
    }

    const result = await shopsServices.images.add(req.body);
    if (!result) {
      res.status(400).json({ message: `Error al agregar la subcategoria.` });
      return;
    }

    const imageExists = await shopsServices.images.lastCreatedEntry({
      shop_id,
      image_url,
    });
    if (!imageExists) {
      res
        .status(404)
        .json({ message: `Error al encontrar la imagen agregada.` });
      return;
    }

    res.status(201).json({
      message: "Imagen agregada exitosamente",
      ìmage: imageExists,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error interno del servidor." });
    return;
  }
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shop_id } = req.query;

    if (shop_id && typeof shop_id === "string") {
      if (!isValidUUID(shop_id)) {
        res.status(400).json({ message: `ID inválido, no tiene formato UUID` });
        return;
      }

      const shopFound = await shopsServices.shops.getById(shop_id);
      if (!shopFound) {
        res
          .status(404)
          .json({ message: `El negocio con el id: ${shop_id} no existe.` });
        return;
      }

      const result = await shopsServices.images.getByShopId(shop_id);
      if (!result) {
        res.status(204).json({ message: `No se encontraron imagenes.` });
        return;
      }

      res.status(201).json({
        message: `Imagenes del negocio: ${shop_id} obtenidas exitosamente`,
        images: result,
      });
    } else {
      const result = await shopsServices.images.getAll();
      if (!result) {
        res.status(204).json({ message: `No se encontraron imagenes.` });
        return;
      }

      res.status(201).json({
        message: "Imagenes obtenidas exitosamente",
        images: result,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
    return;
  }
};

const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id || !isValidUUID(id)) {
      res.status(400).json({ message: `ID inválido, no tiene formato UUID` });
      return;
    }

    const imageFound = await shopsServices.images.getById(id);
    if (!imageFound) {
      res
        .status(404)
        .json({ message: `La imagen con el id: ${id} no existe.` });
      return;
    }

    res.status(201).json({
      message: "Imagen encontrada exitosamente",
      subcategory: imageFound,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
    return;
  }
};

const editById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { shop_id, image_url } = req.body;

    if (!req.body || Object.keys(req.body).length === 0) {
      res
        .status(400)
        .json({ message: "Debe enviar al menos un campo para actualizar." });
      return;
    }

    const imageFound = await shopsServices.images.getById(id);
    if (!imageFound) {
      res
        .status(404)
        .json({ message: `La imagen con el id: ${id} no existe.` });
      return;
    }

    if (shop_id) {
      const shopFound = await shopsServices.shops.getById(shop_id);
      if (!shopFound) {
        res
          .status(404)
          .json({ message: `El negocio con el id: ${shop_id} no existe.` });
        return;
      }
    }

    if (image_url) {
      const imageFound = await shopsServices.images.getByImageUrl(image_url);
      if (imageFound) {
        res.status(409).json({ message: `La imagen ya existe.` });
        return;
      }
    }

    const result = await shopsServices.images.editById({ id, ...req.body });
    if (!result) {
      res.status(400).json({ message: `No se pudo actualizar la imagen.` });
      return;
    }

    const imageUpdated = await shopsServices.images.getById(id);
    if (!imageUpdated) {
      res
        .status(404)
        .json({ message: `Error al encontrar la imagen actualizada.` });
      return;
    }

    res.status(200).json({
      message: "Imagen editada exitosamente",
      subcategory: imageUpdated,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
    return;
  }
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id || !isValidUUID(id)) {
      res.status(400).json({ message: `ID inválido, no tiene formato UUID` });
      return;
    }

    const imageFound = await shopsServices.images.getById(id);
    if (!imageFound) {
      res
        .status(404)
        .json({ message: `La imagen con el id: ${id} no existe.` });
      return;
    }

    const result = await shopsServices.images.deleteById(id);
    if (!result) {
      res.status(404).json({ message: `Error al eliminar la imagen.` });
      return;
    }

    res.status(200).json({
      message: "Imagen eliminada exitosamente",
      subcategory: imageFound,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor." });
    return;
  }
};

export default {
  upload,
  create,
  getAll,
  getById,
  editById,
  deleteById,
};
