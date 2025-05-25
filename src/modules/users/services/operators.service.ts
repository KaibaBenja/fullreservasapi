import { Op } from "sequelize";
import { sequelize } from "../../../config/sequelize/sequalize.config";
import { uuidToBuffer } from "../../../utils/uuidToBuffer";
import Shop from "../../shops/models/shops.model";
import Operator from "../models/operators.model";
import User from "../models/users.model";
import { IOperator } from "../types/operators.types";


const add = async ({ user_id, shop_id }: IOperator) => {
  try {
    const result = await Operator.create({
      user_id: uuidToBuffer(user_id),
      shop_id: uuidToBuffer(shop_id)
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    console.log(error);

    throw new Error("Error al crear un nuevo operador.");
  };
};

const getAll = async () => {
  try {
    const result = await Operator.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(Operator.id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(Operator.user_id)'), 'user_id'],
        [sequelize.literal('BIN_TO_UUID(Operator.shop_id)'), 'shop_id'],
        'created_at',
        'updated_at'
      ],
      include: [
        {
          model: User,
          as: 'user',
          attributes: [
            'full_name',
            'email',
            'created_at',
            'updated_at',
          ],
        },
        {
          model: Shop,
          as: 'shop',
          attributes: ['name'],
        },
      ],
    });
    
    return result.length ? result : null;
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener los operadores.");
  };
};

const getById = async ({ id }: Pick<IOperator, "id">) => {
  try {
    const result = await Operator.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(Operator.id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(Operator.user_id)'), 'user_id'],
        [sequelize.literal('BIN_TO_UUID(Operator.shop_id)'), 'shop_id'],
        'created_at',
        'updated_at'
      ],
      include: [
        {
          model: User,
          as: 'user',
          attributes: [
            'full_name',
            'email',
            'created_at',
            'updated_at',
          ],
        },
        {
          model: Shop,
          as: 'shop',
          attributes: ['name'],
        },
      ],
      where: sequelize.literal(`Operator.id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener el operador.");
  };
};

const getByShopId = async ({ shop_id }: Pick<IOperator, "shop_id">) => {
  try {
    const result = await Operator.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(Operator.id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(Operator.user_id)'), 'user_id'],
        [sequelize.literal('BIN_TO_UUID(Operator.shop_id)'), 'shop_id'],
        'created_at',
        'updated_at'
      ],
      include: [
        {
          model: User,
          as: 'user',
          attributes: [
            'full_name',
            'email',
            'created_at',
            'updated_at',
          ],
        },
        {
          model: Shop,
          as: 'shop',
          attributes: [
            [sequelize.literal('BIN_TO_UUID(shop.id)'), 'id'],
            'name'
          ],
        },
      ],
      where: sequelize.literal(`shop.id = UUID_TO_BIN(?)`),
      replacements: [shop_id],
    });

    return result.length ? result : null;
  } catch (error) {
    throw new Error('Error al obtener el operador por el id de negocio.');
  };
};

const getByUserAndShop = async ({ user_id, shop_id }: Pick<IOperator, "user_id" | "shop_id">) => {
  try {
    const result = await Operator.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(Operator.id)'), 'id'],
        [sequelize.literal('BIN_TO_UUID(Operator.user_id)'), 'user_id'],
        [sequelize.literal('BIN_TO_UUID(Operator.shop_id)'), 'shop_id'],
        'created_at',
        'updated_at'
      ],
      include: [
        {
          model: User,
          as: 'user',
          attributes: [
            [sequelize.literal('BIN_TO_UUID(user.id)'), 'id'],
            'full_name',
            'email',
            'created_at',
            'updated_at',
          ],
        },
        {
          model: Shop,
          as: 'shop',
          attributes: [
            [sequelize.literal('BIN_TO_UUID(shop.id)'), 'id'],
            'name'
          ],
        },
      ],
      where: {
        [Op.and]: [
          sequelize.where(
            sequelize.col('user.id'),
            '=',
            sequelize.fn('UUID_TO_BIN', user_id)
          ),
          sequelize.where(
            sequelize.col('shop.id'),
            '=',
            sequelize.fn('UUID_TO_BIN', shop_id)
          ),
        ],
      },
    });

    return result.length ? result : null;
  } catch (error) {
    throw new Error("Error al obtener el operador por id de usuario e id de negocio.");
  };
};

const deleteById = async ({ id }: Pick<IOperator, "id">) => {
  try {
    const result = await Operator.destroy({
      where: { id: sequelize.fn('UUID_TO_BIN', id) }
    });

    return result ? { success: true } : null;
  } catch (error) {
    throw new Error("Error al eliminar el operador.");
  };
};


export default { add, getAll, getById, getByShopId, deleteById, getByUserAndShop };
