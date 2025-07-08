import { sequelize } from "../../../config/sequelize/sequalize.config";
import { formatName } from "../../../utils/formatName";
import { uuidToBuffer } from "../../../utils/uuidToBuffer";
import Addresses from "../../address/models/addresses.model";
import ClosedDays from "../models/closedDays.model";
import Images from "../models/images.model";
import Menus from "../models/menus.model";
import Schedules from "../models/schedules.model";
import shopsAddresseses from "../models/shopAddresses.model";
import Shops from "../models/shops.model";
import Subcategories from "../models/subcategories.model";
import { IShops } from "../types/shops.types";

const dayNames = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

const add = async (data: IShops) => {
  const {
    user_id,
    subcategory_id,
    name,
    phone_number,
    shift_type,
    average_stay_time,
    capacity,
    legal_info,
    bank_info,
    description,
    price_range,
  } = data;
  try {
    const result = await Shops.create({
      user_id: uuidToBuffer(user_id),
      subcategory_id: uuidToBuffer(subcategory_id),
      name: formatName(name),
      phone_number: phone_number,
      shift_type: shift_type,
      average_stay_time: average_stay_time,
      capacity: capacity,
      legal_info: legal_info,
      bank_info: bank_info,
      description: description,
      price_range: price_range,
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error("Error al agregar el negocio.");
  }
};

const getAll = async () => {
  try {
    const result = await Shops.findAll({
      attributes: [
        [sequelize.literal("BIN_TO_UUID(Shops.id)"), "id"],
        "name",
        "phone_number",
        "shift_type",
        "average_stay_time",
        "capacity",
        "description",
        "price_range",
        "created_at",
        "updated_at",
      ],
      include: [
        {
          model: Subcategories,
          attributes: [
            [sequelize.literal("BIN_TO_UUID(subcategory.id)"), "id"],
            "name",
            "main_category",
          ],
          as: "subcategory",
        },
        {
          model: Schedules,
          attributes: [
            [sequelize.literal("BIN_TO_UUID(schedules.id)"), "id"],
            "open_time",
            "close_time",
          ],
          as: "schedules",
        },
        {
          model: shopsAddresseses,
          include: [
            {
              model: Addresses,
              attributes: [
                [
                  sequelize.literal(
                    "BIN_TO_UUID(`shopsAddresseses->Address`.`id`)"
                  ),
                  "id",
                ],
                "street",
                "street_number",
                "latitude",
                "longitude",
              ],
            },
          ],
        },
        {
          model: Images,
          attributes: [
            [sequelize.literal("BIN_TO_UUID(Images.id)"), "id"],
            "image_url",
          ],
        },
        {
          model: Menus,
          attributes: [
            [sequelize.literal("BIN_TO_UUID(Menu.id)"), "id"],
            "file_url",
          ],
          as: "Menu",
        },
        {
          model: ClosedDays,
          attributes: [
            [sequelize.literal("BIN_TO_UUID(closed_days.id)"), "id"],
            "day_of_week",
          ],
          as: "closed_days",
        },
      ],
    });

    return result.length ? result.map((res) => res.toJSON()) : null;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const getById = async ({ id }: Pick<IShops, "id">) => {
  try {
    const result = await Shops.findOne({
      attributes: [
        [sequelize.literal("BIN_TO_UUID(Shops.id)"), "shop_id"],
        "name",
        "phone_number",
        "shift_type",
        "average_stay_time",
        "capacity",
        "description",
        "price_range",
        "created_at",
        "updated_at",
      ],
      include: [
        {
          model: Subcategories,
          attributes: [
            [
              sequelize.literal("BIN_TO_UUID(subcategory.id)"),
              "subcategory_id",
            ],
            "name",
            "main_category",
          ],
          as: "subcategory",
        },
        {
          model: Schedules,
          attributes: [
            [sequelize.literal("BIN_TO_UUID(schedules.id)"), "schedule_id"],
            "open_time",
            "close_time",
          ],
          as: "schedules",
        },
        {
          model: shopsAddresseses,
          include: [
            {
              model: Addresses,
              attributes: [
                [
                  sequelize.literal(
                    "BIN_TO_UUID(`shopsAddresseses->Address`.`id`)"
                  ),
                  "address_id",
                ],
                "street",
                "street_number",
                "latitude",
                "longitude",
              ],
            },
          ],
        },
        {
          model: Images,
          attributes: [
            [sequelize.literal("BIN_TO_UUID(Images.id)"), "image_id"],
            "image_url",
          ],
        },
        {
          model: Menus,
          attributes: [
            [sequelize.literal("BIN_TO_UUID(Menu.id)"), "menu_id"],
            "file_url",
          ],
          as: "Menu",
        },
        {
          model: ClosedDays,
          attributes: [
            [sequelize.literal("BIN_TO_UUID(closed_days.id)"), "closed_day_id"],
            "day_of_week",
          ],
          as: "closed_days",
        },
      ],
      where: sequelize.literal(`Shops.id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    return result ? result.toJSON() : null;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const getAllByFilters = async (
  filters: Partial<IShops> & {
    subcategory_name?: string;
    main_category?: string;
  }
) => {
  try {
    const {
      // Filtros de Shops
      id,
      user_id,
      name,
      phone_number,
      shift_type,
      average_stay_time,
      capacity,
      legal_info,
      bank_info,
      price_range,

      // Filtros de Subcategories
      subcategory_id,
      subcategory_name,
      main_category,
    } = filters;

    // Condiciones WHERE para la tabla Shops
    const shopsWhereConditions: Record<string, any> = {};
    if (id) shopsWhereConditions.id = uuidToBuffer(id);
    if (user_id) shopsWhereConditions.user_id = uuidToBuffer(user_id);
    if (subcategory_id)
      shopsWhereConditions.subcategory_id = uuidToBuffer(subcategory_id);
    if (name) shopsWhereConditions.name = name;
    if (phone_number) shopsWhereConditions.phone_number = phone_number;
    if (shift_type) shopsWhereConditions.shift_type = shift_type;
    if (average_stay_time)
      shopsWhereConditions.average_stay_time = average_stay_time;
    if (capacity) shopsWhereConditions.capacity = capacity;
    if (legal_info) shopsWhereConditions.legal_info = legal_info;
    if (bank_info) shopsWhereConditions.bank_info = bank_info;
    if (price_range) shopsWhereConditions.price_range = price_range;

    // Condiciones WHERE para la tabla Subcategories
    const subcategoryWhereConditions: Record<string, any> = {};
    if (subcategory_name) subcategoryWhereConditions.name = subcategory_name;
    if (main_category) subcategoryWhereConditions.main_category = main_category;

    // Configuración del include para Subcategories
    const includeSubcategory: any = {
      model: Subcategories,
      attributes: [
        [sequelize.literal("BIN_TO_UUID(subcategory.id)"), "id"],
        "name",
        "main_category",
      ],
      as: "subcategory",
    };

    // Añadir condiciones WHERE para Subcategories si existen filtros
    if (Object.keys(subcategoryWhereConditions).length > 0) {
      includeSubcategory.where = subcategoryWhereConditions;
    }

    // Realizar la consulta con todos los filtros
    const result = await Shops.findAll({
      attributes: [
        [sequelize.literal("BIN_TO_UUID(Shops.id)"), "id"],
        [sequelize.literal("BIN_TO_UUID(Shops.user_id)"), "user_id"],
        "name",
        "phone_number",
        "shift_type",
        "average_stay_time",
        "capacity",
        "legal_info",
        "bank_info",
        "description",
        "price_range",
        "created_at",
        "updated_at",
      ],
      include: [
        includeSubcategory,
        {
          model: Schedules,
          attributes: ["open_time", "close_time"],
          as: "schedules",
        },
        {
          model: Menus,
          attributes: ["file_url"],
          as: "Menu",
        },
      ],
      where:
        Object.keys(shopsWhereConditions).length > 0
          ? shopsWhereConditions
          : undefined,
    });

    return result.length ? result.map((res) => res.toJSON()) : null;
  } catch (error) {
    throw new Error(
      "Error al obtener los negocios con los filtros proporcionados."
    );
  }
};

const getAllByFiltersUser = async (
  filters: Partial<IShops> & {
    subcategory_name?: string;
    main_category?: string;
    none?: true;
  }
) => {
  try {
    const {
      // Filtros de Shops
      id,
      name,
      shift_type,
      average_stay_time,
      capacity,
      price_range,

      // Filtros de Subcategories
      subcategory_name,
      main_category,
    } = filters;

    // Condiciones WHERE para la tabla Shops
    const shopsWhereConditions: Record<string, any> = {};
    if (id) shopsWhereConditions.id = uuidToBuffer(id);
    if (name) shopsWhereConditions.name = name;
    if (shift_type) shopsWhereConditions.shift_type = shift_type;
    if (average_stay_time)
      shopsWhereConditions.average_stay_time = average_stay_time;
    if (capacity) shopsWhereConditions.capacity = capacity;
    if (price_range) shopsWhereConditions.price_range = price_range;

    // Condiciones WHERE para la tabla Subcategories
    const subcategoryWhereConditions: Record<string, any> = {};
    if (subcategory_name) subcategoryWhereConditions.name = subcategory_name;
    if (main_category) subcategoryWhereConditions.main_category = main_category;

    // Configuración del include para Subcategories
    const includeSubcategory: any = {
      model: Subcategories,
      attributes: ["name", "main_category"],
      as: "subcategory",
    };

    // Añadir condiciones WHERE para Subcategories si existen filtros
    if (Object.keys(subcategoryWhereConditions).length > 0) {
      includeSubcategory.where = subcategoryWhereConditions;
    }

    // Realizar la consulta con todos los filtros
    const result = await Shops.findAll({
      attributes: [
        [sequelize.literal("BIN_TO_UUID(Shops.id)"), "id"],
        "name",
        "phone_number",
        "shift_type",
        "average_stay_time",
        "capacity",
        "description",
        "price_range",
        "created_at",
        "updated_at",
      ],
      include: [
        includeSubcategory,
        {
          model: Schedules,
          attributes: ["open_time", "close_time"],
          as: "schedules",
        },
        {
          model: shopsAddresseses,
          include: [
            {
              model: Addresses,
              attributes: ["street", "street_number", "latitude", "longitude"],
            },
          ],
        },
        {
          model: Images,
          attributes: ["image_url"],
        },
        {
          model: Menus,
          attributes: ["file_url"],
          as: "Menu",
        },
        {
          model: ClosedDays,
          attributes: ["day_of_week"],
          as: "closed_days",
        },
      ],
      where:
        Object.keys(shopsWhereConditions).length > 0
          ? shopsWhereConditions
          : undefined,
    });

    if (!result.length) return null;

    const shops = result.map((res) => {
      const shop = res.toJSON();

      // Extraer datos de dirección
      const address = shop.shopsAddresseses?.[0]?.Address;

      // Eliminar shopsAddresseses del resultado final
      delete shop.shopsAddresseses;

      // Adjuntar dirección si existe
      if (address) {
        shop.street = address.street;
        shop.street_number = address.street_number;
        shop.latitude = address.latitude;
        shop.longitude = address.longitude;
      }

      if (shop.Images && shop.Images.length) {
        shop.images = shop.Images.map((img: any) => img.image_url);
      } else {
        shop.images = [];
      }

      delete shop.Images;

      // ClosedDays ➜ calcular open_days
      const closedDays: number[] =
        shop.closed_days?.map((d: any) => d.day_of_week) || [];
      const allDays = [0, 1, 2, 3, 4, 5, 6];
      const openDays = allDays.filter((d) => !closedDays.includes(d));

      shop.open_days = openDays.map((day) => dayNames[day]);
      delete shop.closed_days;

      return shop;
    });

    // Si se pasó un ID, devolvés un solo comercio
    if (id) return shops[0];

    return shops;
  } catch (error) {
    throw new Error(
      "Error al obtener los negocios con los filtros proporcionados."
    );
  }
};

const getMainCategoryByShopId = async ({ id }: Pick<IShops, "id">) => {
  try {
    const result = await Shops.findOne({
      attributes: [[sequelize.literal("BIN_TO_UUID(Shops.id)"), "id"]],
      include: [
        {
          model: Subcategories,
          attributes: [
            [sequelize.literal("BIN_TO_UUID(subcategory.id)"), "id"],
            "main_category",
          ],
          as: "subcategory",
        },
      ],
      where: sequelize.literal(`Shops.id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error("Error la categoría por id de negocio.");
  }
};

const editById = async (data: IShops) => {
  try {
    const {
      id,
      user_id,
      subcategory_id,
      name,
      phone_number,
      shift_type,
      average_stay_time,
      capacity,
      legal_info,
      bank_info,
      description,
      price_range,
    } = data;
    const updateData: any = {};

    if (user_id) updateData.user_id = uuidToBuffer(user_id);
    if (subcategory_id)
      updateData.subcategory_id = uuidToBuffer(subcategory_id);
    if (name) updateData.name = formatName(name);
    if (phone_number) updateData.phone_number = phone_number;
    if (shift_type) updateData.shift_type = shift_type;
    if (average_stay_time) updateData.average_stay_time = average_stay_time;
    if (capacity) updateData.capacity = capacity;
    if (legal_info) updateData.legal_info = legal_info;
    if (bank_info) updateData.bank_info = bank_info;
    if (description) updateData.description = description;
    if (price_range) updateData.price_range = price_range;

    const [updatedRowsCount] = await Shops.update(updateData, {
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`),
    });

    return updatedRowsCount > 0 ? { success: true } : null;
  } catch (error) {
    throw new Error("Error al editar el negocio.");
  }
};

const deleteById = async ({ id }: Pick<IShops, "id">) => {
  try {
    const result = await Shops.destroy({
      where: { id: sequelize.fn("UUID_TO_BIN", id) },
    });

    return result ? { success: true } : null;
  } catch (error) {
    throw new Error("Error al eliminar el negocio.");
  }
};

export default {
  add,
  getAll,
  getById,
  getAllByFilters,
  getAllByFiltersUser,
  getMainCategoryByShopId,
  editById,
  deleteById,
};
