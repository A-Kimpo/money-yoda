
import { Request, Response } from 'express';
import { UAParser } from 'ua-parser-js';
import jwt from 'jsonwebtoken';

import { User } from '@/models';
import { Token } from '@/models';
import { isEmpty } from '@/utils';
import config from '@/config';

export default class TokenService {
  async createToken(user: User) {
    const access_token = this.getAccessToken(user.id, user.username);
    const refresh_token = this.getRefreshToken(user.id, user.username);
    const user_token = await Token.query().insert({
      user_id: user.id,
      access_token,
      refresh_token
    });

    if (!user_token) throw new Error('An unexpected error has occurred');

    return user_token;
  }

  async updateToken(user: User, req: Request) {
    const new_access_token = this.getAccessToken(user.id, user.username);
    const new_refresh_token = this.getRefreshToken(user.id, user.username);
    const newUA = await this.getUA(req.header('User-Agent'));

    await Token.query().patch({
      access_token: new_access_token,
      refresh_token: new_refresh_token,
      ua: newUA
    });

    return {
      new_access_token,
      new_refresh_token
    };
  }

  getAccessToken(id: number, username: string) {
    return jwt.sign(
      {
        user_id: id,
        username: username
      },
      config.jwt.access_token_secret,
      {
        expiresIn: config.jwt.access_token_expiration
      }
    );
  }

  getRefreshToken(id: number, username: string) {
    return jwt.sign(
      {
        user_id: id,
        username: username
      },
      config.jwt.refresh_token_secret,
      {
        expiresIn: config.jwt.refresh_token_expiration
      }
    );
  }

  getTokenFromHeader = async (req: any) => {
    const bearerHeader = req.headers['authorization'];

    if (isEmpty(bearerHeader))
      throw new Error('Unauthorized: No token provided');

    const access_token = bearerHeader?.split(/\s/)[1];
    const user_token = await Token.query().findOne({
      access_token
    });

    if (!user_token) throw new Error('Unauthorized: Invalid token');

    return user_token;
  };

  getTokenFromCookie = async (req: any) => {
    const { refreshToken } = req.cookies;

    if (isEmpty(refreshToken))
      throw new Error('Refresh token is not exist in cookies');

    const user_token = await Token.query().findOne({
      refresh_token: refreshToken
    });

    if (!user_token) throw new Error('Refresh token not found');

    return user_token;
  };

  verifyAccessToken(token: Token, option = {}) {
    return jwt.verify(
      token.access_token,
      config.jwt.access_token_secret,
      option
    );
  }

  verifyRefreshToken(token: Token, option = {}) {
    return jwt.verify(
      token.refresh_token,
      config.jwt.refresh_token_secret,
      option
    );
  }

  async revokeRefreshToken(refreshToken: string) {
    await Token.query()
      .where('refresh_token', refreshToken)
      .delete();
  }

  async setRefreshTokenCookie(res: Response, refreshToken: string, options = {}) {
    const defaultOptions = {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true
    };

    const cookieOptions = Object.keys(options).length ? options : defaultOptions;

    res.cookie('refreshToken', refreshToken, cookieOptions);
  }

  async getUA(ua: any) {
    const parser = new UAParser();
    parser.setUA(ua);
    const agent = parser.getResult();
    return JSON.stringify({ ...agent });
  }
}