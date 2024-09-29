import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

import { TokenService, UserService } from '@/services';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userService = new UserService();
    const tokenService = new TokenService();

    const user_token = await tokenService.getTokenFromHeader(req);

    tokenService.verifyAccessToken(user_token);

    const user: any = await userService.getUserByToken(user_token);

    // Fetch user data from database
    const userData = { id: user.id, username: user.username };

    // Attach user data to the request object
    (req as any).user = userData;

    next();
  } catch (e: any) {
    res
      .status(httpStatus.UNAUTHORIZED)
      .json({
        success: false,
        message: e.message
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

    // Fetch user data from database
    const userData = { id: user.id, username: user.username };

    // Attach user data to the request object
    (req as any).user = userData;

    next();
  } catch (e: any) {
    res
      .status(httpStatus.UNAUTHORIZED)
      .json({
        success: false,
        message: e.message
      })
      .end();
  }
};
