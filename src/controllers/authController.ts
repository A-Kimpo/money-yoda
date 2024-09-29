import { Request, Response } from 'express';

import { AuthService, UserService, TokenService } from '@/services';

export const login = async (req: Request, res: Response) => {
  try {
    const authService = new AuthService();
    const tokenService = new TokenService();

    const { email, password } = req.body;

    const authenticatedUser = await authService.authUser(email, password);

    const { access_token, refresh_token } = await tokenService.createToken(
      authenticatedUser
    );

    await tokenService.setRefreshTokenCookie(res, refresh_token);

    return res.json({
      success: true,
      data: {
        id: authenticatedUser.id,
        access_token: access_token
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
    const tokenService = new TokenService();
    const { refreshToken } = req.cookies;

    await tokenService.revokeRefreshToken(refreshToken);

    res.clearCookie('refreshToken');

    return res.json({ success: true });
  } catch (e: any) {
    return res.json({
      success: false,
      message: e.message || e
    });
  }
};

export const isAuth = async (req: Request, res: Response) => {
  try {
    const tokenService = new TokenService();
    const user_token = await tokenService.getTokenFromHeader(req);

    // verify that access token isn't expired
    tokenService.verifyAccessToken(user_token);

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
    const userService = new UserService();
    const tokenService = new TokenService();

    const user_token = await tokenService.getTokenFromCookie(req);
    const user = await userService.getUserByToken(user_token);

    // verify that refresh token isn't expired
    tokenService.verifyRefreshToken(user_token);

    if (!user) {
      throw new Error('User not found');
    }

    const { new_access_token, new_refresh_token } =
      await tokenService.updateToken(user, req);

    await tokenService.setRefreshTokenCookie(res, new_refresh_token);

    res.json({
      success: true,
      data: {
        id: user.id,
        access_token: new_access_token
      }
    });
  } catch (e: any) {
    res.json({
      success: false,
      message: e.message || e
    });
  }
};
