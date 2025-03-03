import { IMerchant } from "../types/merchants.types";
import User from "../models/users.model";
import Merchant from "../models/merchants.model";
import { sequelize } from "../../../config/sequalize.config";
import { uuidToBuffer } from "../../../utils/uuidToBuffer";
import { QueryTypes } from "sequelize";

const add = async ({ user_id, main_category, logo_url }: IMerchant) => {
  try {
    const data: any = {
      user_id: uuidToBuffer(user_id),
      main_category: main_category,
    };

    if (logo_url) data.logo_url = logo_url;

    const newMerchant = await Merchant.create(data);

    if (!newMerchant) {
      return null;
    };

    return { user_id: newMerchant.user_id, main_category: newMerchant.main_category };
  } catch (error) {
    console.log(error);
    throw new Error("Error al crear un nuevo comerciante.");
  };
};

const getAll = async () => {
  try {
    const users = await sequelize.query(
      `SELECT 
        BIN_TO_UUID(u.id) AS id,
        u.full_name,
        u.email,
        u.created_at,
        u.updated_at,
        JSON_OBJECT(
          'id', BIN_TO_UUID(m.id),
          'logo_url', m.logo_url,
          'main_category', m.main_category,
          'created_at', m.created_at,
          'updated_at', m.updated_at
        ) AS merchant
      FROM users u
      INNER JOIN merchant_settings m ON u.id = m.user_id;`, 
      {
        type: QueryTypes.SELECT,
      }
    );    

    if (!users || users.length === 0) {
      return null;
    };

    return users;
  } catch (error) {
    throw new Error("Error al obtener los usuarios, ");
  };
};

const getById = async (id: string) => {
  try {
    const merchant = await Merchant.findOne({
      attributes: [
        [sequelize.literal("BIN_TO_UUID(id)"), "id"],
        [sequelize.literal("BIN_TO_UUID(user_id)"), "user_id"],
        "logo_url",
        "main_category",
        "created_at",
        "updated_at"
      ],
      where: {
        id: sequelize.fn("UUID_TO_BIN", id)
      },
    });

    if (!merchant) {
      return null;
    };

    return merchant.toJSON();
  } catch (error) {
    throw new Error("Error al obtener el merchant.");
  };
};

const getByUserId = async (userId: string) => {
  try {
    const user = await sequelize.query(
      `SELECT 
          BIN_TO_UUID(u.id) AS id,
          u.full_name,
          u.email,
          u.created_at,
          u.updated_at,
        JSON_OBJECT(
          'id', BIN_TO_UUID(m.id),
          'logo_url', m.logo_url,
          'main_category', m.main_category,
          'created_at', m.created_at,
          'updated_at', m.updated_at
        ) AS merchant
        FROM users u
        LEFT JOIN merchant_settings m ON u.id = m.user_id
        WHERE u.id = UUID_TO_BIN(:userId);`,
      {
        replacements: { userId },
        type: QueryTypes.SELECT,
      }
    );

    if (!user || user.length === 0) {
      return null;
    };

    return user;
  } catch (error) {
    throw new Error('Error al obtener el usuario por id.');
  };
};

const getByMerchantId = async (merchantId: string) => {
  try {
    // Asegúrate de pasar el parámetro correctamente
    const result = await sequelize.query(
      `SELECT 
        BIN_TO_UUID(u.id) AS id,
        u.full_name,
        u.email,
        u.created_at,
        u.updated_at,
        JSON_OBJECT(
          'id', BIN_TO_UUID(m.id),
          'logo_url', m.logo_url,
          'main_category', m.main_category,
          'created_at', m.created_at,
          'updated_at', m.updated_at
        ) AS merchant
      FROM users u
      LEFT JOIN merchant_settings m ON u.id = m.user_id
      WHERE m.id = UUID_TO_BIN(:merchantId);`,  // Usamos el parámetro :merchantId directamente aquí
      {
        replacements: { merchantId },  // Aseguramos que el parámetro se pase correctamente
        type: QueryTypes.SELECT,
      }
    );

    // Verificar si se ha encontrado el merchant
    if (!result || result.length === 0) {
      return null;
    }

    return result; // Devuelve el resultado directamente
  } catch (error) {
    throw new Error('Error al obtener el usuario por el merchantId');
  }
};

const getByUserAndCategory = async ({ user_id, main_category }: IMerchant) => {
  try {
    const merchant = await Merchant.findOne({
      attributes: [
        [sequelize.literal("BIN_TO_UUID(id)"), "id"],
        [sequelize.literal("BIN_TO_UUID(user_id)"), "user_id"],
        "logo_url",
        "main_category",
        "created_at",
        "updated_at"
      ],
      where: {
        user_id: sequelize.fn("UUID_TO_BIN", user_id),
        main_category: main_category,
      },
    });

    if (!merchant) {
      return null;
    };

    return merchant.toJSON();
  } catch (error) {
    throw new Error("Error al obtener el merchant.");
  };
};

const editById = async ({ id, user_id, main_category, logo_url }: IMerchant) => {
  try {
    const updateData: any = {};

    if (user_id) updateData.user_id = uuidToBuffer(user_id);
    if (main_category) updateData.main_category = main_category;
    if (logo_url) updateData.logo_url = logo_url;

    if (Object.keys(updateData).length === 0) {
      return { hasNoFieldsToUpdate: true };
    };

    const [updatedRowsCount] = await Merchant.update(updateData, {
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`)
    });

    if (updatedRowsCount === 0) {
      return null;
    };

    return { success: true };
  } catch (error) {
    throw new Error('Error al editar el merchant');
  };
};

const deleteById = async (id: string) => {
  try {
    const result = await Merchant.destroy({
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id)})`)
    });

    if (!result) {
      return null;
    };

    return { success: true };
  } catch (error) {
    throw new Error("Error al eliminar el merchant");
  };
};


export default { add, getAll, getById, getByUserId, getByMerchantId, getByUserAndCategory, editById, deleteById };
