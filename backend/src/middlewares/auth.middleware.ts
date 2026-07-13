import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { HttpStatus } from '../common/enums/httpStatus.enum';
import { ApiResponse } from '../common/response/ApiResponse';
import { MESSAGES } from '../common/constants/statusMessages';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Response | void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;

  if (!token) {
    return res.status(HttpStatus.UNAUTHORIZED).json(ApiResponse.error(MESSAGES.AUTH.UNAUTHORIZED));
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_ACCESS_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(HttpStatus.UNAUTHORIZED).json(ApiResponse.error(MESSAGES.AUTH.INVALID_TOKEN));
  }
};
