import { Model } from 'objection';
import { argon2i } from 'argon2-ffi';
import crypto from 'crypto';

export interface UserType {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  password: string;
  email: string;
  is_admin?: boolean;
  date_added?: Date;
  date_modified?: Date;
}

export default class User extends Model {
  id!: number;
  username!: string;
  password!: string;
  is_admin!: boolean;
  email!: string;
  date_added!: Date;
  date_modified!: Date;

  static get tableName() {
    return 'users';
  }

  async $beforeInsert() {
    const salt = crypto.randomBytes(32);
    const hash = await argon2i.hash(this.password, salt);
    this.username = this.username.toLocaleLowerCase();
    this.password = hash;
    this.date_added = new Date();
  }

  async $beforeUpdate() {
    if (this.username) this.username = this.username.toLocaleLowerCase();
    if (this.password) {
      const salt = crypto.randomBytes(32);
      const hash = await argon2i.hash(this.password, salt);
      this.password = hash;
    }
    this.date_modified = new Date();
  }
}
