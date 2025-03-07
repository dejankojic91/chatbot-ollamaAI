import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: string; 
}

export const authenticateUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          res.status(401).json({ message: "Unauthorized - No token provided" });
          return;
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

        req.user = decoded.id;
        next(); 
    } catch (error) {
        res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
};
