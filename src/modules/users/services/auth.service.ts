import { uuidToBuffer } from "../../../utils/uuidToBuffer";
import admin from "../../../config/firebase";
import User from "../models/users.model";
import bcrypt from "bcrypt";
import { formatName } from "../../../utils/formatName";
import { IUser } from "../types/users.types";
import { v5 as uuidv5 } from "uuid";
import axios from "axios";

const NAMESPACE = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
export const registerUser = async ({
  full_name,
  password,
  email,
  id,
}: IUser) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const uuid = uuidv5(id!, NAMESPACE);

    const result = await User.create({
      id: uuidToBuffer(uuid),
      full_name: formatName(full_name),
      password: hashedPassword,
      email: email,
    });

    return result ? result.toJSON() : null;
  } catch (error) {
    throw error instanceof Error
      ? error.message
      : "Error al crear un nuevo usuario";
  }
};

export const loginUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );

    if (!response.data.idToken) throw new Error("Invalid credentials");

    const { localId: uid } = response.data;
    const uuid = uuidv5(uid, NAMESPACE);
    const bufferId = uuidToBuffer(uuid);

    const user = await User.findOne({ where: { email, id: bufferId } });
    if (!user) throw new Error("User not found or UID mismatch");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid credentials");

    const token = await admin.auth().createCustomToken(uid);

    return { user: { full_name: user.full_name, email: user.email }, token };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error al iniciar sesión"
    );
  }
};

export const logoutUser = async ({ idToken }: { idToken: string }) => {
  try {
    if (!idToken || typeof idToken !== "string") {
      throw new Error("No ID token provided");
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    await admin.auth().revokeRefreshTokens(decodedToken.uid);

    return { message: "User logged out successfully" };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Invalid token or user already logged out"
    );
  }
};


export default {
  registerUser,
  loginUser,
  logoutUser,
};
