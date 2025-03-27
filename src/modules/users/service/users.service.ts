import { IUser } from "../types/users.types";
import bcrypt from 'bcrypt';
import User from "../models/users.model";
import { formatName } from "../../../utils/formatName";
import { sequelize } from "../../../config/sequalize.config";
import { QueryTypes } from "sequelize";


const add = async ({ full_name, password, email }: IUser) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      full_name: formatName(full_name),
      password: hashedPassword,
      email: email,
    });

    if (!newUser) {
      return null;
    };

    return { full_name: newUser.full_name, email: newUser.email };
  } catch (error) {
    throw new Error("Error al crear un nuevo usuario");
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
        JSON_ARRAYAGG(r.name) AS roles
      FROM users u
      LEFT JOIN userroles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      GROUP BY u.id`,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (!users || users.length === 0) {
      return null;
    };

    return users;
  } catch (error) {
    throw new Error("Error al obtener los usuarios");
  };
};

const getById = async (id: string) => {
  try {
    const user = await sequelize.query(
      `SELECT 
          BIN_TO_UUID(u.id) AS id,
          u.full_name,
          u.email,
          u.created_at,
          u.updated_at,
          JSON_ARRAYAGG(r.name) AS roles
       FROM users u
       LEFT JOIN userroles ur ON u.id = ur.user_id
       LEFT JOIN roles r ON ur.role_id = r.id
       WHERE u.id = UUID_TO_BIN(:userId)
       GROUP BY u.id`,
      {
        type: QueryTypes.SELECT,
        replacements: { userId: id },
      }
    );

    if (!user) {
      return null;
    };

    return user;
  } catch (error) {
    throw new Error('Error al obtener el usuario por id');
  };
};

const getByEmail = async (email: string) => {
  try {
    const user = await User.findOne({
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

    if (!user) {
      return null;
    };

    return user.toJSON();
  } catch (error) {
    throw new Error('Error al obtener el usuario por email');
  };
};

const getByRole = async (roleId: string) => {
  try {
    const users = await sequelize.query(
      `SELECT 
        BIN_TO_UUID(u.id) AS id,
        u.full_name,
        u.email,
        u.created_at,
        u.updated_at,
        JSON_ARRAYAGG(r.name) AS roles
      FROM users u
      LEFT JOIN userroles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.id IN (
        SELECT ur2.user_id 
        FROM userroles ur2 
        WHERE ur2.role_id = UUID_TO_BIN(:roleId)
      ) GROUP BY u.id`,
      {
        type: QueryTypes.SELECT,
        replacements: { roleId: roleId },
      }
    );

    if (!users || users.length === 0) {
      return null;
    };

    return users;
  } catch (error) {
    console.log(error);
    throw new Error('Error al obtener los usuarios por el id de rol');
  };
};

const editById = async ({ id, full_name, password, email }: IUser) => {
  try {
    const updateData: any = {};

    if (full_name) updateData.full_name = formatName(full_name);
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    if (Object.keys(updateData).length === 0) {
      return { hasNoFieldsToUpdate: true };
    };

    const [updatedRowsCount] = await User.update(updateData, {
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`)
    });

    if (updatedRowsCount === 0) {
      return null;
    };

    return { success: true };
  } catch (error) {
    throw new Error('Error al editar el usuario');
  };
};

const deleteById = async (id: string) => {
  try {
    const result = await User.destroy({
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id)})`)
    });

    if (!result) {
      return null;
    };

    return { success: true };
  } catch (error) {
    throw new Error("Error al eliminar el usuario");
  };
};


export default { add, getAll, getById, getByEmail, getByRole, editById, deleteById };
