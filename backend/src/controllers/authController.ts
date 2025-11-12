import { Request, Response } from "express";
import * as authService from "../services/adminAuthService";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const admin = await authService.registerAdmin(username, password);
    res.status(201).json({ message: "Admin created", admin });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const result = await authService.loginAdmin(username, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
