import { IUser } from "./types/users.types";
import { IuserRoles } from "./types/userroles.types";
import bcrypt from 'bcrypt';
import User from "./models/users.model";
import Role from "./models/roles.model";
import UserRole from "./models/userroles.model";
import { sequelize } from "../../config/sequalize.config";

const newUser = async ({ full_name, password, email }: IUser) => {
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const newUser = await User.create({
      full_name: full_name,
      password: hashedPassword,
      email: email,
    });

    if (!newUser) {
      return null;
    }

    return { full_name: newUser.full_name, email: newUser.email };
  } catch (error) {
    console.log(error);
    throw new Error("Error al crear un nuevo usuario");
  }
};

const getByEmail = async (email: string) => {
  try {
    const user = await User.findOne({
      where: { email: email },
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'full_name',
        'email',
        'created_at',
        'updated_at',
      ],
    });

    if (!user) {
      return null;
    }

    return user.toJSON();
  } catch (error) {
    throw new Error('Error al obtener el usuario por email');
  }
};

const getAll = async () => {
  try {
    const users = await User.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'full_name',
        'email',
        'created_at',
        'updated_at',
      ],
    });

    if (!users || users.length === 0) {
      return null;
    }

    return users.map(user => user.toJSON());
  } catch (error) {
    throw new Error("Error al obtener los usuarios");
  }
};

const getById = async (id: string) => {
  try {
    const user = await User.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'full_name',
        'email',
        'created_at',
        'updated_at',
      ],
      where: sequelize.literal(`id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    if (!user) {
      return null;
    }

    return user.toJSON();
  } catch (error) {
    throw new Error('Error al obtener el usuario por id');
  }
};

const editById = async ({ id, full_name, password, email }: IUser) => {
  try {
    const updateData: any = {};

    if (full_name) {
      updateData.full_name = full_name;
    }

    if (email) {
      updateData.email = email;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    if (Object.keys(updateData).length === 0) {
      return { hasNoFieldsToUpdate: true };
    }

    const [updatedRowsCount] = await User.update(updateData, {
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`)
    });

    if (updatedRowsCount === 0) {
      return null;
    }

    return { success: true };
  } catch (error) {
    console.log(error);
    throw new Error('Error al editar el usuario');
  }
};

const deleteById = async (id: string) => {
  try {
    const result = await User.destroy({
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id)})`)
    });

    if (!result) {
      return null;
    }

    return { success: true };
  } catch (error) {
    throw new Error("Error al eliminar el usuario");
  }
};

const getRoleById = async (id: string) => {
  try {
    const role = await Role.findOne({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(id)'), 'id'],
        'name',
        'description',
      ],
      where: sequelize.literal(`id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    if (!role) {
      return null;
    }

    return role.toJSON();
  } catch (error) {
    throw new Error("Error al obtener el rol");
  }
};

const checkUserRoleExistence = async ({ user_id, role_id }: IuserRoles) => {
  try {
    const role = await UserRole.findOne({
      attributes: [
        [sequelize.literal("BIN_TO_UUID(id)"), "id"],
        "user_id",
        "role_id",
      ],
      where: {
        user_id: sequelize.fn("UUID_TO_BIN", user_id),
        role_id: sequelize.fn("UUID_TO_BIN", role_id),
      },
    });

    if (!role) {
      return null;
    }

    return role.toJSON();
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener el rol del usuario.");
  }
};


const assignRole = async ({ user_id, role_id }: IuserRoles) => {
  try {
    const userIdBuffer = Buffer.from(user_id.replace(/-/g, ""), "hex");
    const roleIdBuffer = Buffer.from(role_id.replace(/-/g, ""), "hex");

    const newUserRole = await UserRole.create({
      user_id: userIdBuffer,
      role_id: roleIdBuffer
    });

    if (!newUserRole) {
      return null;
    }

    return newUserRole.toJSON();
  } catch (error) {
    throw new Error("Error al asignar el rol del usuario.");
  }
};



const usersService = {
  newUser,
  getByEmail,
  getAll,
  getById,
  editById,
  deleteById,
  getRoleById,
  checkUserRoleExistence,
  assignRole
};

export default usersService;