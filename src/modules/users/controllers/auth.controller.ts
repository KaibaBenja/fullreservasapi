import { RequestHandler } from "express";
import { loginUser, logoutUser, registerUser } from "../services/auth.service";
import admin from "../../../config/firebase";

export const register: RequestHandler = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: full_name,
    });
    const user = await registerUser({ ...req.body, id: userRecord.uid });

    if (!user) {
      res.status(400).json({ message: "Error registering user" });
      return;
    }

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Error logging in",
    });
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const user = await loginUser(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Error logging in",
    });
  }
};

export const logout: RequestHandler = async (req, res) => {
  try {
    await logoutUser(req.body);
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out" });
  }
};
