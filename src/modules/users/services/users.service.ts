import bcrypt from 'bcrypt';
import admin from '../../../config/firebase';
import { sequelize } from "../../../config/sequelize/sequalize.config";
import Membership from '../../../modules/memberships/models/memberships.model';
import MembershipPlan from '../../../modules/memberships/models/membershipsPlans.model';
import { formatName } from "../../../utils/formatName";
import Role from '../models/roles.model';
import User from "../models/users.model";
import { serializeUsers } from '../serializers/user.serializer';
import { IUser } from "../types/users.types";
import { IUserWithRelations } from '../types/userWithRelations.types';

const getAll = async () => {
  try {
    const user = await User.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(User.id)'), 'id'],
        'full_name',
        'email',
        'passwordChanged',
        'created_at',
        'updated_at',
      ],
      include: [
        {
          model: Role,
          as: 'roles',
          attributes: ['name'],
          through: { attributes: [] }, // no queremos info de userroles
        },
        {
          model: Membership,
          as: 'membership',
          attributes: [
            [sequelize.literal('BIN_TO_UUID(tier)'), 'tier'],
            'status',
            'expire_date',
            'created_at',
            'updated_at',
          ],
          include: [
            {
              model: MembershipPlan,
              as: 'membership_plan',
              attributes: ['tier_name', 'price', 'description', 'created_at', 'updated_at'],
            },
          ],
        },
      ],
    });
    const plainUsers = user.map(user => user.get({ plain: true }) as IUserWithRelations);
    const result = serializeUsers(plainUsers);
    return result.length ? result : null;
  } catch (error) {
    throw new Error("Error al obtener los usuarios.");
  };
};

const getById = async ({ id }: Pick<IUser, "id">) => {
  try {
    const user = await User.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(User.id)'), 'id'],
        'full_name',
        'email',
        'passwordChanged',
        'created_at',
        'updated_at',
      ],
      include: [
        {
          model: Role,
          as: 'roles',
          attributes: ['name'],
          through: { attributes: [] }, // no queremos info de userroles
        },
        {
          model: Membership,
          as: 'membership',
          attributes: [
            [sequelize.literal('BIN_TO_UUID(tier)'), 'tier'],
            'status',
            'expire_date',
            'created_at',
            'updated_at',
          ],
          include: [
            {
              model: MembershipPlan,
              as: 'membership_plan',
              attributes: ['tier_name', 'price', 'description', 'created_at', 'updated_at'],
            },
          ],
        },
      ],
      where: sequelize.literal(`User.id = UUID_TO_BIN(?)`),
      replacements: [id],
    });
    const plainUsers = user.map(user => user.get({ plain: true }) as IUserWithRelations);
    const result = serializeUsers(plainUsers);
    return result.length ? result : null;
  } catch (error) {
    throw new Error('Error al obtener el usuario por id');
  };
};

const getByEmail = async ({ email }: Pick<IUser, "email">) => {
  try {
    const user = await User.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(User.id)'), 'id'],
        'full_name',
        'email',
        'passwordChanged',
        'created_at',
        'updated_at',
      ],
      include: [
        {
          model: Role,
          as: 'roles',
          attributes: ['name'],
          through: { attributes: [] }, // no queremos info de userroles
        },
        {
          model: Membership,
          as: 'membership',
          attributes: [
            [sequelize.literal('BIN_TO_UUID(tier)'), 'tier'],
            'status',
            'expire_date',
            'created_at',
            'updated_at',
          ],
          include: [
            {
              model: MembershipPlan,
              as: 'membership_plan',
              attributes: ['tier_name', 'price', 'description', 'created_at', 'updated_at'],
            },
          ],
        },
      ],
      where: sequelize.where(
        sequelize.fn("LOWER", sequelize.col('email')),
        "=",
        email.toLowerCase()
      ),
    });
    const plainUsers = user.map(user => user.get({ plain: true }) as IUserWithRelations);
    const result = serializeUsers(plainUsers);
    return result.length ? result : null;
  } catch (error) {
    throw new Error('Error al obtener el usuario por email.');
  };
};

const getByRole = async (roleId: string) => {
  try {
    const user = await User.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(User.id)'), 'id'],
        'full_name',
        'email',
        'passwordChanged',
        'created_at',
        'updated_at',
      ],
      include: [
        {
          model: Role,
          as: 'roles',
          attributes: [
            [sequelize.literal('BIN_TO_UUID(roles.id)'), 'id'],
            'name'
          ],
          through: { attributes: [] }, // no queremos info de userroles
        },
        {
          model: Membership,
          as: 'membership',
          attributes: [
            [sequelize.literal('BIN_TO_UUID(tier)'), 'tier'],
            'status',
            'expire_date',
            'created_at',
            'updated_at',
          ],
          include: [
            {
              model: MembershipPlan,
              as: 'membership_plan',
              attributes: ['tier_name', 'price', 'description', 'created_at', 'updated_at'],
            },
          ],
        },
      ],
      where: sequelize.literal(`roles.id = UUID_TO_BIN(?)`),
      replacements: [roleId],
    });
    const plainUsers = user.map(user => user.get({ plain: true }) as IUserWithRelations);
    const result = serializeUsers(plainUsers);
    return result.length ? result : null;
  } catch (error) {
    throw new Error('Error al obtener los usuarios por el id de rol.');
  };
};

const getByShopId = async (shopId: string) => {
  try {
    const user = await User.findAll({
      attributes: [
        [sequelize.literal('BIN_TO_UUID(User.id)'), 'id'],
        'full_name',
        'email',
        'passwordChanged',
        'created_at',
        'updated_at',
      ],
      include: [
        {
          model: Role,
          as: 'roles',
          attributes: [
            [sequelize.literal('BIN_TO_UUID(roles.id)'), 'id'],
            'name'
          ],
          through: { attributes: [] }, // no queremos info de userroles
        },
        {
          model: Membership,
          as: 'membership',
          attributes: [
            [sequelize.literal('BIN_TO_UUID(tier)'), 'tier'],
            'status',
            'expire_date',
            'created_at',
            'updated_at',
          ],
          include: [
            {
              model: MembershipPlan,
              as: 'membership_plan',
              attributes: ['tier_name', 'price', 'description', 'created_at', 'updated_at'],
            },
          ],
        },
      ],
      where: sequelize.literal(`User.id = (SELECT user_id FROM shops WHERE id = UUID_TO_BIN(?))`),
      replacements: [shopId],
    });
    const plainUsers = user.map(user => user.get({ plain: true }) as IUserWithRelations);
    const result = serializeUsers(plainUsers);
    return result.length ? result : null;
  } catch (error) {
    throw new Error('Error al obtener el usuario por el id de tienda.');
  }
};

const verifyPassword = async ({ id }: Pick<IUser, "id">, current_password: string) => {
  try {
    const user = await User.findOne({
      attributes: [
        'password',
      ],
      where: sequelize.literal(`User.id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    if (!user || !user.password) return false;

    const isMatch = await bcrypt.compare(current_password, user.password);
    return isMatch;
  } catch (error) {
    throw new Error('Error al verificar la contraseña del usuario');
  };
};

const editById = async (data: Partial<IUser> & { id: string }) => {
  const { id, full_name, password, email, passwordChanged } = data;
  try {
    const updateData: any = {};
    const firebaseUpdate: admin.auth.UpdateRequest = {};
    if (full_name) {
      updateData.full_name = formatName(full_name);
      firebaseUpdate.displayName = updateData.full_name;
    }

    if (email) {
      updateData.email = email
      firebaseUpdate.email = email;
    }

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
      firebaseUpdate.password = password;
    }

    if (passwordChanged  !== undefined) updateData.passwordChanged = passwordChanged;

    const user = await User.findOne({
      attributes: [
        'firebase_uid',
      ],
      where: sequelize.literal(`User.id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    if (!user || !user.firebase_uid) {
      throw new Error('Usuario no encontrado en FB.');
    }

    await admin.auth().updateUser(user.firebase_uid, firebaseUpdate);

    const [updatedRowsCount] = await User.update(updateData, {
      where: sequelize.literal(`id = UUID_TO_BIN(${sequelize.escape(id!)})`)
    });

    return updatedRowsCount > 0 ? { success: true } : null;
  } catch (error) {
    console.log(error);
    throw new Error('Error al editar el usuario.');
  };
};

const deleteById = async ({ id }: Pick<IUser, "id">) => {
  try {
    const user = await User.findOne({
      attributes: [
        'firebase_uid',
      ],
      where: sequelize.literal(`User.id = UUID_TO_BIN(?)`),
      replacements: [id],
    });

    if (!user || !user.firebase_uid) {
      throw new Error('Usuario no encontrado en FB.');
    }

    await admin.auth().deleteUser(user.firebase_uid);

    const result = await User.destroy({
      where: { id: sequelize.fn('UUID_TO_BIN', id) }
    });

    return result ? { success: true } : null;
  } catch (error) {
    throw new Error("Error al eliminar el usuario.");
  };
};


export default { getAll, getById, getByEmail, getByRole, getByShopId, editById, deleteById, verifyPassword };
