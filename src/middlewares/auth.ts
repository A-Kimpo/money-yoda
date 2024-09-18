import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

import { Token, User } from '@/models';
import { isEmpty } from '@/utils';

const findUserByToken = async (req: Request) => {
  const bearerHeader = req.headers['authorization'];

  if (isEmpty(bearerHeader))
    throw new Error('An unexpected error has occurred');

  const access_token = bearerHeader?.split(/\s/)[1];
  const user_token = await Token.query().findOne({
    access_token
  });

  if (!user_token) throw new Error('An unexpected error has occurred');

  return User.query().findOne({
    id: user_token.user_id
  });
};

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await findUserByToken(req);

    if (!user) {
      throw new Error('An unexpected error has occurred');
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

export const authAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await findUserByToken(req);

    if (!user || !user.is_admin) {
      throw new Error('An unexpected error has occurred');
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
