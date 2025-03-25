import { IUser } from "../types/users.types";
import bcrypt from 'bcrypt';
import User from "../models/users.model";
import { formatName } from "../../../utils/formatName";
import { sequelize } from "../../../config/sequalize.config";
import { QueryTypes } from "sequelize";


const getAll = async () => {
  try {
    const result = await sequelize.query(
      `SELECT 
        BIN_TO_UUID(u.id) AS id,
        u.full_name,
        u.email,
        u.created_at,
        u.updated_at,
        JSON_ARRAYAGG(r.name) AS roles,
        JSON_OBJECT(
          'tier', m.tier,
          'status', m.status,
          'expire_date', m.expire_date,
          'created_at', m.created_at,
          'updated_at', m.updated_at
        ) AS membership
      FROM users u
      LEFT JOIN userroles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      LEFT JOIN memberships m ON u.id = m.user_id
      GROUP BY u.id, m.tier, m.status, m.expire_date, m.created_at, m.updated_at`,
      {
        type: QueryTypes.SELECT,
      }
    );

    return result.length ? result : null;
  } catch (error) {
    throw new Error("Error al obtener los usuarios.");
  };
};

const getById = async ({ id }: Pick<IUser, "id">) => {
  try {
    const result = await sequelize.query(
      `SELECT 
        BIN_TO_UUID(u.id) AS id,
        u.full_name,
        u.email,
        u.created_at,
        u.updated_at,
        JSON_ARRAYAGG(r.name) AS roles,
        JSON_OBJECT(
          'tier', m.tier,
          'status', m.status,
          'expire_date', m.expire_date,
          'created_at', m.created_at,
          'updated_at', m.updated_at
        ) AS membership
      FROM users u
      LEFT JOIN userroles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      LEFT JOIN memberships m ON u.id = m.user_id
      WHERE u.id = UUID_TO_BIN(:userId)
      GROUP BY u.id, m.tier, m.status, m.expire_date, m.created_at, m.updated_at`,
      {
        type: QueryTypes.SELECT,
        replacements: { userId: id },
      }
    );

    return result.length ? result : null;
  } catch (error) {
    throw new Error('Error al obtener el usuario por id');
  };
};

const getByEmail = async ({ email }: Pick<IUser, "email">) => {
  try {
    const result = await User.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'full_name',
        'email',
        'created_at',
        'updated_at',
      ],
      where: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("email")),
        "=",
        email.toLowerCase()
      ),
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw new Error('Error al obtener el usuario por email.');
  };
};

const getByRole = async (roleId: string) => {
  try {
    const result = await sequelize.query(
      `SELECT 
        BIN_TO_UUID(u.id) AS id,
        u.full_name,
        u.email,
        u.created_at,
        u.updated_at,
        JSON_ARRAYAGG(r.name) AS roles,
        JSON_OBJECT(
          'tier', m.tier,
          'status', m.status,
          'expire_date', m.expire_date,
          'created_at', m.created_at,
          'updated_at', m.updated_at
        ) AS membership
      FROM users u
      LEFT JOIN userroles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      LEFT JOIN memberships m ON u.id = m.user_id
      WHERE u.id IN (
        SELECT ur2.user_id 
        FROM userroles ur2 
        WHERE ur2.role_id = UUID_TO_BIN(:roleId)
      ) 
      GROUP BY u.id, m.tier, m.status, m.expire_date, m.created_at, m.updated_at`,
      {
        type: QueryTypes.SELECT,
        replacements: { roleId: roleId },
      }
    );

    return result.length ? result : null;
  } catch (error) {
    throw new Error('Error al obtener los usuarios por el id de rol.');
  };
};

const editById = async ({ id, full_name, password, email }: IUser) => {
  try {
    const updateData: any = {};

    if (full_name) updateData.full_name = formatName(full_name);
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const [updatedRowsCount] = await User.update(updateData, {
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`)
    });

    return updatedRowsCount > 0 ? { success: true } : null;
  } catch (error) {
    throw new Error('Error al editar el usuario.');
  };
};

const deleteById = async ({ id }: Pick<IUser, "id">) => {
  try {
    const result = await User.destroy({
      where: { id: sequelize.fn('UUID_TO_BIN', id) }
    });

    return result ? { success: true } : null;
  } catch (error) {
    throw new Error("Error al eliminar el usuario.");
  };
};


export default { getAll, getById, getByEmail, getByRole, editById, deleteById };
