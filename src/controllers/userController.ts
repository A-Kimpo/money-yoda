import { Request, Response } from 'express';

import { User } from '@/models';
import { isEmpty } from '@/utils';

export const getAll = async (req: Request, res: Response) => {
  try {
    const users = await User.query();

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

export const getById = async (req: Request, res: Response) => {
  try {
    const { user_id: id } = req.params;

    if (isEmpty(id)) throw new Error('Required params missing');

    const user = await User.query().findById(id);

    if (!user) throw new Error('User not found');

    const data: any = { ...user };
    delete data.password;

    res.json({
      success: true,
      data: data
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
    let { username, email, password } = req.body;

    if (isEmpty(username) || isEmpty(email) || isEmpty(password)) {
      throw new Error('All fields must be fill');
    }

    const isExists = await User.query()
      .select('users.email')
      .where('users.email', '=', email)
      .orWhere('users.username', '=', username);

    if (isExists.length > 0) throw new Error('Username or email already taken');

    const user = await User.query().insertAndFetch({
      username,
      email,
      password
    });

    res.json({
      success: true,
      message: 'User was created',
      data: {
        id: user.id,
        username: user.username
      }
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

    const { username, email, password } = req.body;

    if (isEmpty(id)) throw new Error('An unexpected error has occurred');

    const user = await User.query().findById(id);

    if (!user) throw new Error('User not found');

    const bodyData: any = { password };
    const newData: any = {};

    if (!isEmpty(username)) {
      const isExists = await User.query().findOne({ username });
      if (!isExists) newData.username = username;
    }

    if (!isEmpty(email)) {
      const isExists = await User.query().findOne({ email });
      if (!isExists) newData.email = email;
    }

    for (const key in bodyData) {
      if (!isEmpty(bodyData[key])) {
        newData[key] = bodyData[key];
      }
    }

    if (Object.keys(newData).length === 0)
      throw new Error('None of the data has been changed');

    const userUpdate = await User.query().updateAndFetchById(id, newData);

    await res.json({
      success: true,
      data: {
        id: userUpdate.id,
        username: userUpdate.username
      }
    });
  } catch (e: any) {
    await res.json({
      success: false,
      message: e.message || e
    });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { user_id: id } = req.params;

    if (isEmpty(id)) throw new Error('An unexpected error has occurred');

    const resultDelete = await User.query().deleteById(id);

    if (!resultDelete) throw new Error('An unexpected error has occurred');

    await res.json({
      success: true,
      message: `Account #${id} was deleted`
    });
  } catch (e: any) {
    await res.json({
      success: false,
      message: e.message || e
    });
  }
};
