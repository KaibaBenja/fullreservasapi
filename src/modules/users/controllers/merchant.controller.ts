import { Request, Response } from "express";
import * as usersServices from "../service";
import { handleErrorResponse } from "../../../utils/handleErrorResponse";
import { validateUUID } from "../../../utils/uuidValidator";
import { uploadFileToS3, deleteFileFromS3 } from "../../../middlewares/upload";


const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id } = req.body;
    const file = req.file;

    if (!await usersServices.users.getById(user_id)) {
      return handleErrorResponse(res, 400, `El usuario con el id: ${user_id} no existe.`);
    };

    if (await usersServices.merchants.getByUserAndCategory(req.body)) {
      return handleErrorResponse(res, 400, `El merchant ya existe.`);
    };

    let logo_url: string | undefined;
    if (file) {
      const fileUploaded = await uploadFileToS3(file);

      if (!fileUploaded || !fileUploaded.signedUrl) {
        throw new Error(`Error al subir la imagen: ${file.originalname}.`);
      }

      logo_url = fileUploaded.signedUrl;
    }

    const merchantData = { ...req.body, logo_url };

    if (!await usersServices.merchants.add(merchantData)) {
      return handleErrorResponse(res, 400, `Error al crear el merchant.`);
    };

    const merchantExists = await usersServices.merchants.getByUserAndCategory(req.body);
    if (!merchantExists) return handleErrorResponse(res, 404, `Error al encontrar el merchant agregado.`);

    res.status(201).json({
      message: "Merchant creado exitosamente",
      user: merchantExists,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id } = req.query;
    let message;
    let result;

    if (user_id && typeof user_id === "string") {
      if (!validateUUID(user_id, res)) return;

      const merchantFound = await usersServices.merchants.getByUserId(user_id);
      if (!merchantFound) {
        return handleErrorResponse(res, 404, `El merchant con el id de usuario: ${user_id} no existe.`);
      };

      message = `User merchant obtenido exitosamente.`;
      result = merchantFound;
    } else {
      result = await usersServices.merchants.getAll();
      message = `Merchants obtenidos exitosamente.`;
    };

    if (!result || result.length === 0) {
      return handleErrorResponse(res, 404, "No se encontraron merchants.");
    };

    res.status(200).json({ message, users: result });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!validateUUID(id, res)) return;

    const merchantFound = await usersServices.merchants.getById(id);
    if (!merchantFound) {
      return handleErrorResponse(res, 404, `El merchant con el id: ${id} no existe.`);
    };

    res.status(201).json({
      message: "Merchant encontrado exitosamente.",
      user: merchantFound,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const editById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;
    const file = req.file;

    if (!validateUUID(id, res)) return;

    if ((!req.body || Object.keys(req.body).length === 0) && !file) {
      return handleErrorResponse(res, 400, "Debe enviar al menos un campo para actualizar.");
    };

    if (user_id && !(await usersServices.users.getById(user_id))) {
      return handleErrorResponse(res, 404, `El merchant con el id: ${user_id} no existe.`);
    };

    const merchantFound = await usersServices.merchants.getById(id);
    if (!merchantFound) {
      return handleErrorResponse(res, 404, `El merchant con el id: ${id} no existe.`);
    };

    let imageUrl = merchantFound.logo_url;
    if (file) {
      if (imageUrl) {
        const imageDeleted = await deleteFileFromS3(imageUrl);
        if (!imageDeleted) return handleErrorResponse(res, 500, "Error al eliminar la imagen anterior.");
      };

      const fileUploaded = await uploadFileToS3(file);
      if (!fileUploaded || !fileUploaded.signedUrl) {
        return handleErrorResponse(res, 500, `Error al subir la nueva imagen: ${file.originalname}.`);
      }

      imageUrl = fileUploaded.signedUrl;
    }

    if (!(await usersServices.merchants.editById({ id, ...req.body, imageUrl }))) {
      return handleErrorResponse(res, 404, `Error al editar el usuario.`);
    };

    const merchantExist = await usersServices.merchants.getById(id);
    if (!merchantExist) {
      return handleErrorResponse(res, 404, `El usuario con el id: ${id} no existe.`);
    };

    res.status(200).json({
      message: "Merchant editado exitosamente.",
      merchant: merchantExist,
    });
  } catch (error) {
    console.log(error);
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!validateUUID(id, res)) return;

    const merchantFound = await usersServices.merchants.getById(id);
    if (!merchantFound) {
      return handleErrorResponse(res, 404, `El merchant con el id: ${id} no existe.`);
    };

    if (merchantFound.logo_url) {
      const imageDeleted = await deleteFileFromS3(merchantFound.logo_url);
      if (!imageDeleted) return handleErrorResponse(res, 500, "Error al eliminar la imagen anterior.");
    }

    if (!await usersServices.merchants.deleteById(id)) {
      return handleErrorResponse(res, 404, `Error al eliminar el merchant.`);
    };

    res.status(200).json({
      message: "Merchant eliminado exitosamente.",
      merchant: merchantFound,
    });
  } catch (error) {
    handleErrorResponse(res, 500, "Error interno del servidor.");
  };
};


export default { create, getAll, getById, editById, deleteById };

