import connection from "../../config/mysql.config";
import { User } from "./users.types";
import { ResultSetHeader } from "mysql2";
import bcrypt from 'bcrypt';

const newUser = async ({ full_name, password, email }: User) => {
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const [result] = await connection.query<ResultSetHeader>(
      `INSERT INTO users (full_name, password, email)
      VALUES (?, ?, ?);`,
      [full_name, hashedPassword, email]
    );

    if (!result.affectedRows) {
      return null;
    }

    return { full_name, email };
  } catch (error) {
    throw new Error("Error al crear un nuevo usuario");
  }
};

const getByEmail = async (email: string) => {
  try {
    const [rows]: [any[], any] = await connection.query(
      `SELECT BIN_TO_UUID(id) AS id, full_name, email, created_at, updated_at FROM users WHERE email = ?`,
      [email]
    );

    if (!rows || (Array.isArray(rows) && rows.length === 0)) {
      return null;
    }

    return rows[0];
  } catch (error) {
    throw new Error('Error al obtener el usuario por email');
  }
};

const getAll = async () => {
  try {
    const [result] = await connection.query(
      `SELECT BIN_TO_UUID(id) AS id, full_name, email, created_at, updated_at FROM users`
    );

    if (!result || (Array.isArray(result) && result.length === 0)) {
      return null;
    }

    return result;
  } catch (error) {
    throw new Error("Error al obtener los usuarios");
  }
};

const getById = async (id: string) => {
  try {
    const [rows]: [any[], any] = await connection.query(
      `SELECT BIN_TO_UUID(id) AS id, full_name, email, created_at, updated_at FROM users WHERE id = UUID_TO_BIN(?)`,
      [id]
    );

    if (!rows || (Array.isArray(rows) && rows.length === 0)) {
      return null;
    }

    return rows[0];
  } catch (error) {
    throw new Error('Error al obtener el usuario por id');
  }
};

const editById = async ({ id, full_name, password, email }: User) => {
  try {
    const fieldsToUpdate = [];
    const values = [];

    if (full_name) {
      fieldsToUpdate.push("full_name = ?");
      values.push(full_name);
    }
    if (email) {
      fieldsToUpdate.push("email = ?");
      values.push(email);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      fieldsToUpdate.push("password = ?");
      values.push(hashedPassword);
    }

    if (fieldsToUpdate.length === 0) {
      return { hasNoFieldsToUpdate : true }
    }

    values.push(id);

    const [result] = await connection.query<ResultSetHeader>(
      `UPDATE users SET ${fieldsToUpdate.join(", ")} WHERE id = UUID_TO_BIN(?)`,
      values
    );

    if (!result.affectedRows) {
      return null;
    }

    return { success: true }

  } catch (error) {
    throw new Error("Error al editar el usuario");
  }
}

const deleteById = async (id: string) => {
  try {
    const [result] = await connection.query<ResultSetHeader>(
      `DELETE FROM users WHERE id = UUID_TO_BIN(?)`, [id]
    );

    if (!result.affectedRows) {
      return null;
    }

    return { success: true };
  } catch (error) {
    throw new Error("Error al obtener los usuarios");
  }
};

const usersService = {
  newUser,
  getByEmail,
  getAll,
  getById,
  editById,
  deleteById
}

export default usersService;