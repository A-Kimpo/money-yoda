import { Request, Response } from 'express';

import { User } from '@/models';
import { UserService } from '@/services';
import { isEmpty } from '@/utils';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const userService = new UserService();
    const users = await userService.getAllUsers();

    res.json({
      success: true,
      data: users
    });
  } catch (e) {
    res.json({
      success: false,
      message: e
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { user_id: id } = req.params;

    if (isEmpty(id)) throw new Error('Required params missing');

    const userService = new UserService();
    const user = await userService.getUserById(id);

    res.json({
      success: true,
      data: user
    });
  } catch (e: any) {
    res.json({
      success: false,
      message: e.message || e
    });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const { body: userData } = req;
    const userService = new UserService();

    const isExistUser = await userService.checkExistUser(userData);
    if (isExistUser) throw new Error('Username or email already taken');

    const { id, username } = await userService.createUser(userData);

    res.json({
      success: true,
      message: 'User was created',
      data: { id, username }
    });
  } catch (e: any) {
    res.json({
      success: false,
      message: e.message || e
    });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { user_id: id } = req.params;
    const { body: userData } = req;

    if (isEmpty(id)) throw new Error('An unexpected error has occurred');

    const userService = new UserService();

    await userService.getUserById(id);
    const userUpdate = await User.query().updateAndFetchById(id, userData);

    res.json({
      success: true,
      data: {
        id: userUpdate.id,
        username: userUpdate.username
      }
    });
  } catch (e: any) {
    res.json({
      success: false,
      message: e.message || e
    });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { user_id: id } = req.params;
    if (isEmpty(id)) throw new Error('An unexpected error has occurred');

    const userService = new UserService();

    const resultDelete = await userService.deleteUser(id);

    if (!resultDelete) throw new Error('Deletion failed');

    res.json({
      success: true,
      message: `Account #${id} was deleted`
    });
  } catch (e: any) {
    res.json({
      success: false,
      message: e.message || e
    });
  }
};
