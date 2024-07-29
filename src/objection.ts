import Knex from "knex";
import { Model } from "objection";

export const connect = () => {
  const knex = Knex({
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    }
  });

  Model.knex(knex);

  console.log("Connected to database");
}
