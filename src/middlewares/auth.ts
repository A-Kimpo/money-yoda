import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

import { TokenService, UserService } from '@/services';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenService = new TokenService();

    const user_token = await tokenService.getTokenFromHeader(req);

    tokenService.verifyAccessToken(user_token);

    next();
  } catch (e: any) {
    res
      .status(httpStatus.UNAUTHORIZED)
      .json({
        success: false,
        message: 'Unauthorized'
      })
      .end();
  }
};

export const authAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userService = new UserService();
    const tokenService = new TokenService();

    const user_token = await tokenService.getTokenFromHeader(req);

    tokenService.verifyAccessToken(user_token);

    const user = await userService.getUserByToken(user_token);

    if (!user?.is_admin) {
      throw new Error('Access denied');
    }

    next();
  } catch (e: any) {
    res
      .status(httpStatus.UNAUTHORIZED)
      .json({
        success: false,
        message: 'Unauthorized'
      })
      .end();
  }
};
