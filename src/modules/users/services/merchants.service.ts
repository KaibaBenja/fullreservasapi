import Shop from "../../shops/models/shops.model";
import { sequelize } from "../../../config/sequelize/sequalize.config";
import { uuidToBuffer } from "../../../utils/uuidToBuffer";
import Merchant from "../models/merchants.model";
import User from "../models/users.model";
import { IMerchant } from "../types/merchants.types";


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
    const result = await User.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(User.id)'), 'id'],
        'full_name',
        'email',
        'created_at',
        'updated_at',
      ],
      include: [
        {
          model: Merchant,
          as: 'merchant',
          attributes: [
            [sequelize.literal('BIN_TO_UUID(merchant.id)'), 'id'],
            'logo_url',
            'main_category',
            'created_at',
            'updated_at',
          ],
        },
      ],
      where: sequelize.literal(`merchant.user_id = User.id`),
    });
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
    const result = await User.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(User.id)'), 'id'],
        'full_name',
        'email',
        'created_at',
        'updated_at',
      ],
      include: [
        {
          model: Merchant,
          as: 'merchant',
          attributes: [
            [sequelize.literal('BIN_TO_UUID(merchant.id)'), 'id'],
            'logo_url',
            'main_category',
            'created_at',
            'updated_at',
          ],
        },
      ],
      where: sequelize.literal(`merchant.user_id = UUID_TO_BIN(?)`),
      replacements: [user_id],
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error('Error al obtener el comerciante por id.');
  };
};

const getByShopId = async (shopId: string) => {
  try {
    const result = await Merchant.findOne({
      subQuery: false,
      attributes: [
        [sequelize.literal("BIN_TO_UUID(Merchant.id)"), "id"],
        [sequelize.literal("BIN_TO_UUID(Merchant.user_id)"), "user_id"],
        "logo_url",
        "main_category",
        "created_at",
        "updated_at"
      ],
      include: [
        {
          model: User,
          as: "user",
          attributes: [
            [sequelize.literal("BIN_TO_UUID(user.id)"), "id"],
            "full_name",
          ],
          include: [
            {
              model: Shop,
              as: "shop",
              attributes: [
                [sequelize.literal("BIN_TO_UUID(`user->shop`.`id`)"), "id"],
                "name",
              ],
              where: sequelize.where(
                sequelize.col("user->shop.id"),
                "=",
                sequelize.literal(`UUID_TO_BIN('${shopId}')`)
              ),
              required: true,
            },
          ],
        },
      ],
    });
    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error("Error al obtener el comerciante por id de tienda.");
  }
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


export default { add, getAll, getById, getByUserId, getByShopId, getByUserAndCategory, editById, deleteById };
