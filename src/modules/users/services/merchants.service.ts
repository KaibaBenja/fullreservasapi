import { IMerchant } from "../types/merchants.types";
import Merchant from "../models/merchants.model";
import { sequelize } from "../../../config/sequelize/sequalize.config";
import { uuidToBuffer } from "../../../utils/uuidToBuffer";
import { QueryTypes } from "sequelize";


const add = async ({ user_id, main_category, logo_url }: IMerchant) => {
  try {
    const data: any = {
      user_id: uuidToBuffer(user_id),
      main_category: main_category,
    };

    if (logo_url) data.logo_url = logo_url;

    const result = await Merchant.create(data);

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error("Error al crear un nuevo comerciante.");
  };
};

const getAll = async () => {
  try {
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
      INNER JOIN merchant_settings m ON u.id = m.user_id;`,
      {
        type: QueryTypes.SELECT,
      }
    );

    return result.length ? result : null;
  } catch (error) {
    throw new Error("Error al obtener los comerciantes.");
  };
};

const getById = async ({ id }: Pick<IMerchant, "id">) => {
  try {
    const result = await Merchant.findOne({
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

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error("Error al obtener el comerciante.");
  };
};

const getByUserId = async ({ user_id }: Pick<IMerchant, "user_id">) => {
  try {
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
        WHERE u.id = UUID_TO_BIN(:user_id);`,
      {
        replacements: { user_id },
        type: QueryTypes.SELECT,
      }
    );

    return result.length ? result : null;
  } catch (error) {
    throw new Error('Error al obtener el comerciante por id.');
  };
};

const getByUserAndCategory = async ({ user_id, main_category }: IMerchant) => {
  try {
    const result = await Merchant.findOne({
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

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error("Error al obtener el comerciante por id de usuario y categoria.");
  };
};

const editById = async ({ id, main_category, logo_url }: IMerchant) => {
  try {
    const updateData: any = {};

    if (main_category) updateData.main_category = main_category;
    if (logo_url) updateData.logo_url = logo_url;

    const [updatedRowsCount] = await Merchant.update(updateData, {
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`)
    });

    return updatedRowsCount > 0 ? { success: true } : null;
  } catch (error) {
    throw new Error('Error al editar el comerciante.');
  };
};

const deleteById = async ({ id }: Pick<IMerchant, "id">) => {
  try {
    const result = await Merchant.destroy({
      where: { id: sequelize.fn('UUID_TO_BIN', id) }
    });

    return result ? { success: true } : null;
  } catch (error) {
    throw new Error("Error al eliminar el comerciante.");
  };
};


export default { add, getAll, getById, getByUserId, getByUserAndCategory, editById, deleteById };
