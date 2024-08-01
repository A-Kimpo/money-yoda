import { Request, Response } from 'express';

import { User, Token } from '@/models';
import { isEmpty } from '@/utils';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (isEmpty(email) || isEmpty(password))
      throw new Error('All fields must be fill');

    const user = await User.query().findOne({ email });

    if (!user) throw new Error('User not found');

    const verifyPassword = await user.verifyPassword(password);

    if (!verifyPassword) throw new Error('Incorrect username or password');

    const access_token = user.getAccessToken();
    const refresh_token = user.getRefreshToken();

    const user_token = await Token.query().insert({
      user_id: user.id,
      access_token,
      refresh_token
    });

    if (!user_token) throw new Error('An unexpected error has occurred');

    res.cookie('refreshToken', refresh_token, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true
    });

    return res.json({
      success: true,
      data: {
        id: user.id,
        access_token
        // refresh_token
      }
    });
  } catch (e: any) {
    return res.json({
      success: false,
      message: e.message || e
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    await Token.query()
      .findOne({
        refresh_token: refreshToken
      })
      .delete();
    res.clearCookie('refreshToken');
    return res.json({
      success: true
    });
  } catch (e: any) {
    return res.json({
      success: false,
      message: e.message || e
    });
  }
};

export const isAuth = async (req: Request, res: Response) => {
  try {
    const bearerHeader = req.headers['authorization'];

    if (isEmpty(bearerHeader))
      throw new Error('Authorization header is required');

    const access_token = bearerHeader?.split(/\s/)[1];
    const user_token = await Token.query().findOne({
      access_token
    });

    if (!user_token) throw new Error('Unauthorized');

    const user = await User.query().findOne({
      id: user_token.user_id
    });

    if (!user) throw new Error('User not found');

    user.getAccessToken();
    user_token.verifyAccessToken(); // verify that access token isn't expired

    res.json({
      success: true
    });
  } catch (e: any) {
    res.json({
      success: false,
      message: e.message || e
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;

    if (isEmpty(refreshToken))
      throw new Error('Refresh token is not exist in cookies');

    const user_token = await Token.query().findOne({
      refresh_token: refreshToken
    });

    if (!user_token) throw new Error('Refresh token not found');

    user_token.verifyRefreshToken(); // verify that refresh token isn't expired

    const user = await User.query().findOne({
      id: user_token.user_id
    });

    if (!user) throw new Error('User not found');

    const new_access_token = user.getAccessToken();
    const new_refresh_token = user.getRefreshToken();
    const newUA = await user_token.getUA(req.header('User-Agent'));

    await Token.query().patch({
      access_token: new_access_token,
      refresh_token: new_refresh_token,
      ua: newUA
    });

    res.cookie('refreshToken', new_refresh_token, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true
    });

    res.json({
      success: true,
      data: {
        id: user.id,
        access_token: new_access_token
        // refresh_token: new_refresh_token
      }
    });
  } catch (e: any) {
    res.json({
      success: false,
      message: e.message || e
    });
  }
};
