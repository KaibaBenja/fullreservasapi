import { IShops } from "../types/shops.types";
import Shops from "../models/shops.model";
import Subcategories from "../models/subcategories.model";
import { sequelize } from "../../../config/sequalize.config";
import { uuidToBuffer } from "../../../utils/uuidToBuffer";
import { formatName } from "../../../utils/formatName";

const add = async ({
  user_id, subcategory_id, name, phone_number, shift_type, average_stay_time, capacity, legal_info, bank_info
}: IShops) => {
  try {
    const newShop = await Shops.create({
      user_id: uuidToBuffer(user_id),
      subcategory_id: uuidToBuffer(subcategory_id),
      name: formatName(name),
      phone_number: phone_number,
      shift_type: shift_type,
      average_stay_time: average_stay_time,
      capacity: capacity,
      legal_info: legal_info,
      bank_info: bank_info
    });

    if (!newShop) {
      return null;
    };

    return newShop;
  } catch (error) {
    throw new Error("Error al agregar el negocio");
  };
};

const getAll = async () => {
  try {
    const shops = await Shops.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(Shops.id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(Shops.user_id)'), 'user_id'],
        'name',
        'phone_number',
        'shift_type',
        'average_stay_time',
        'capacity',
        'legal_info', // QUITAR ESTO DESPUES
        'bank_info', // QUITAR ESTO DESPUES
        'created_at',
        'updated_at'
      ],
      include: [
        {
          model: Subcategories,
          attributes: [
            [sequelize.literal('BIN_TO_UUID(subcategory.id)'), 'id'], // Alias para la columna id de subcategory
            'name',
            'main_category',
          ],
          as: 'subcategory', // Define el alias para la relación
        },
      ],
    });

    if (!shops || shops.length === 0) {
      return null;
    };

    return shops.map(shop => shop.toJSON());
  } catch (error) {
    throw new Error("Error al obtener los negocios");
  };
};

const getById = async (id: string) => {
  try {
    const shop = await Shops.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(Shops.id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(Shops.user_id)'), 'user_id'],
        'name',
        'phone_number',
        'shift_type',
        'average_stay_time',
        'capacity',
        'legal_info', // QUITAR ESTO DESPUES
        'bank_info', // QUITAR ESTO DESPUES
        'created_at',
        'updated_at'
      ],
      include: [
        {
          model: Subcategories,
          attributes: [
            [sequelize.literal('BIN_TO_UUID(subcategory.id)'), 'id'], // Alias para la columna id de subcategory
            'name',
            'main_category',
          ],
          as: 'subcategory', // Define el alias para la relación
        },
      ],
      where: sequelize.literal(`Shops.id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    if (!shop) {
      return null;
    };

    return shop.toJSON();
  } catch (error) {
    console.log(error);
    throw new Error('Error al obtener el negocio por id');
  };
};

const lastCreatedEntry = async ({ user_id, name }: IShops) => {
  try {
    const shop = await Shops.findOne({
      where: {
        user_id: uuidToBuffer(user_id),
        name: formatName(name),
      },
      attributes: [
        [sequelize.literal('BIN_TO_UUID(Shops.id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(Shops.user_id)'), 'user_id'],
        'name',
        'phone_number',
        'shift_type',
        'average_stay_time',
        'capacity',
        'legal_info', // QUITAR ESTO DESPUES
        'bank_info', // QUITAR ESTO DESPUES
        'created_at',
        'updated_at'
      ],
      include: [
        {
          model: Subcategories,
          attributes: [
            [sequelize.literal('BIN_TO_UUID(subcategory.id)'), 'id'], // Alias para la columna id de subcategory
            'name',
            'main_category',
          ],
          as: 'subcategory', // Define el alias para la relación
        },
      ],
      order: [['created_at', 'DESC']],
    });

    if (!shop) {
      return null;
    };

    return shop.toJSON();
  } catch (error) {
    throw new Error('Error al obtener el negocio por user_id y name');
  };
};

const getShopsByMainCategory = async (main_category: string) => {
  try {
    const shops = await Shops.findAll({
      include: [
        {
          model: Subcategories,
          attributes: [
            [sequelize.literal('BIN_TO_UUID(subcategory.id)'), 'id'], // Alias para la columna id de subcategory
            'name',
            'main_category',
          ],
          where: { main_category: main_category },
          as: 'subcategory',
        },
      ],
      attributes: [
        [sequelize.literal('BIN_TO_UUID(Shops.id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(Shops.user_id)'), 'user_id'],
        'name',
        'phone_number',
        'shift_type',
        'average_stay_time',
        'capacity',
        'created_at',
        'updated_at',
      ],
    });

    if (!shops) {
      return null;
    };

    return shops.map(shop => shop.toJSON());
  } catch (error) {
    console.log(error);
    throw new Error('Error al obtener el negocio por main_category');
  };
};

const getShopsBySubcategoryName = async (subcategory: string) => {
  try {
    const shops = await Shops.findAll({
      include: [
        {
          model: Subcategories,
          attributes: [
            [sequelize.literal('BIN_TO_UUID(subcategory.id)'), 'id'],
            'name',
            'main_category',
          ],
          where: { name: subcategory },
          as: 'subcategory',
        },
      ],
      attributes: [
        [sequelize.literal('BIN_TO_UUID(shops.id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(shops.user_id)'), 'user_id'],
        'name',
        'phone_number',
        'shift_type',
        'average_stay_time',
        'capacity',
        'created_at',
        'updated_at',
      ],
    });

    if (!shops) {
      return null;
    };

    return shops.map(shop => shop.toJSON());
  } catch (error) {
    throw new Error('Error al obtener el negocio por subcategory');
  };
};

const editById = async ({
  id, user_id, subcategory_id, name, phone_number, shift_type, average_stay_time, capacity, legal_info, bank_info
}: IShops) => {
  try {
    const updateData: any = {};

    if (user_id) updateData.user_id = uuidToBuffer(user_id);
    if (subcategory_id) updateData.subcategory_id = uuidToBuffer(subcategory_id);
    if (name) updateData.name = formatName(name);
    if (phone_number) updateData.phone_number = phone_number;
    if (shift_type) updateData.shift_type = shift_type;
    if (average_stay_time) updateData.average_stay_time = average_stay_time;
    if (capacity) updateData.capacity = capacity;
    if (legal_info) updateData.legal_info = legal_info;
    if (bank_info) updateData.bank_info = bank_info;

    const [updatedRowsCount] = await Shops.update(updateData, {
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`)
    });

    if (updatedRowsCount === 0) {
      return null;
    };

    return { success: true };
  } catch (error) {
    console.log(error);
    throw new Error('Error al editar el negocio');
  };
};

const deleteById = async (id: string) => {
  try {
    const result = await Shops.destroy({
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id)})`)
    });

    if (!result) {
      return null;
    };

    return { success: true };
  } catch (error) {
    throw new Error("Error al eliminar el negocio");
  };
};


export default {
  add,
  getAll,
  getById,
  lastCreatedEntry,
  getShopsByMainCategory,
  getShopsBySubcategoryName,
  editById,
  deleteById
};
