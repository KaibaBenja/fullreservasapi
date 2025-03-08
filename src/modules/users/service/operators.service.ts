import { IOperator } from "../types/operators.types";
import Operator from "../models/operators.model";
import { sequelize } from "../../../config/sequalize.config";
import { uuidToBuffer } from "../../../utils/uuidToBuffer";
import { QueryTypes } from "sequelize";


const add = async ({ user_id, shop_id }: IOperator) => {
  try {
    const newOperator = await Operator.create({
      user_id: uuidToBuffer(user_id),
      shop_id: uuidToBuffer(shop_id)
    });

    if (!newOperator) {
      return null;
    };

    return { user_id: newOperator.user_id, shop_id: newOperator.shop_id };
  } catch (error) {
    console.log(error);
    throw new Error("Error al crear un nuevo operador.");
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
          'id', BIN_TO_UUID(o.id),
          'shop_id', BIN_TO_UUID(o.shop_id),
          'created_at', o.created_at,
          'updated_at', o.updated_at
        ) AS operator
      FROM users u
      INNER JOIN operator_settings o ON u.id = o.user_id;`,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (!users || users.length === 0) {
      return null;
    };

    return users;
  } catch (error) {
    throw new Error("Error al obtener los usuarios de tipo operador. ");
  };
};

const getById = async (id: string) => {
  try {
    const operator = await Operator.findOne({
      attributes: [
        [sequelize.literal("BIN_TO_UUID(id)"), "id"],
        [sequelize.literal("BIN_TO_UUID(user_id)"), "user_id"],
        [sequelize.literal("BIN_TO_UUID(shop_id)"), "shop_id"],
        "created_at",
        "updated_at"
      ],
      where: {
        id: sequelize.fn("UUID_TO_BIN", id)
      },
    });

    if (!operator) {
      return null;
    };

    return operator.toJSON();
  } catch (error) {
    console.log(error)
    throw new Error("Error al obtener el operador.");
  };
};

const getAllByShopId = async (shop_id: string) => {
  try {
    const users = await sequelize.query(
      `SELECT 
          BIN_TO_UUID(u.id) AS id,
          u.full_name,
          u.email,
          u.created_at,
          u.updated_at,
          JSON_OBJECT(
            'id', BIN_TO_UUID(o.id),
            'shop_id', BIN_TO_UUID(o.shop_id),
            'created_at', o.created_at,
            'updated_at', o.updated_at
          ) AS operator
       FROM users u
       INNER JOIN operator_settings o ON u.id = o.user_id
       WHERE o.shop_id = UUID_TO_BIN(:shop_id);`,
      {
        replacements: { shop_id },
        type: QueryTypes.SELECT,
      }
    );


    if (!users || users.length === 0) {
      return null;
    };

    return users;
  } catch (error) {
    console.log(error);
    throw new Error('Error al obtener el operador por shop id.');
  };
};

const getByUserId = async (user_id: string) => {
  try {
    const user = await sequelize.query(
      `SELECT 
          BIN_TO_UUID(u.id) AS id,
          u.full_name,
          u.email,
          u.created_at,
          u.updated_at,
          JSON_OBJECT(
            'id', BIN_TO_UUID(o.id),
            'shop_id', BIN_TO_UUID(o.shop_id),
            'created_at', o.created_at,
            'updated_at', o.updated_at
          ) AS operator
       FROM users u
       INNER JOIN operator_settings o ON u.id = o.user_id
       WHERE u.id = UUID_TO_BIN(:user_id);`,
      {
        replacements: { user_id },
        type: QueryTypes.SELECT,
      }
    );


    if (!user || user.length === 0) {
      return null;
    };

    return user;
  } catch (error) {
    throw new Error('Error al obtener el operador por el id usuario.');
  };
};

const getByUserAndShop = async ({ user_id, shop_id }: IOperator) => {
  try {
    const operator = await Operator.findOne({
      attributes: [
        [sequelize.literal("BIN_TO_UUID(id)"), "id"],
        [sequelize.literal("BIN_TO_UUID(user_id)"), "user_id"],
        [sequelize.literal("BIN_TO_UUID(shop_id)"), "shop_id"],
        "created_at",
        "updated_at"
      ],
      where: {
        user_id: sequelize.fn("UUID_TO_BIN", user_id),
        shop_id: sequelize.fn("UUID_TO_BIN", shop_id)
      },
    });

    if (!operator) {
      return null;
    };

    return operator.toJSON();
  } catch (error) {
    throw new Error("Error al obtener el operador.");
  };
};

const editById = async ({ id, user_id, shop_id }: IOperator) => {
  try {
    const updateData: any = {};

    if (user_id) updateData.user_id = uuidToBuffer(user_id);
    if (shop_id) updateData.shop_id = uuidToBuffer(shop_id);

    if (Object.keys(updateData).length === 0) {
      return { hasNoFieldsToUpdate: true };
    };

    const [updatedRowsCount] = await Operator.update(updateData, {
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`)
    });

    if (updatedRowsCount === 0) {
      return null;
    };

    return { success: true };
  } catch (error) {
    throw new Error('Error al editar el operador');
  };
};

const deleteById = async (id: string) => {
  try {
    const result = await Operator.destroy({
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id)})`)
    });

    if (!result) {
      return null;
    };

    return { success: true };
  } catch (error) {
    throw new Error("Error al eliminar el operador");
  };
};


export default { add, getAll, getById, getAllByShopId, getByUserAndShop, getByUserId, editById, deleteById };
