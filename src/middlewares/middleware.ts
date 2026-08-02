import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

interface JwtPayload {
    id: string;
}

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {

    
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Authorization header missing"
        });
    }

    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Invalid authorization format"
        });
    }

    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(
            token,
            process.env.JWT_USER_PASSWORD!
        ) as JwtPayload;
        (req as any).userId = decoded.id;
        next();
    
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            message: "Invalid or expired token",
            
        });
    }
}