import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IAuthTokenPayload } from "../routes/authRoutes";

declare module "express-serve-static-core" {
  interface Request {
    user?: IAuthTokenPayload;
  }
}

export function verifyAuthToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.get("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).end();
  } else {
    jwt.verify(token, req.app.locals.JWT_SECRET as string, (error, decoded) => {
      if (decoded) {
        req.user = decoded as IAuthTokenPayload;
        next();
      } else {
        res.status(403).end();
      }
    });
  }
}
