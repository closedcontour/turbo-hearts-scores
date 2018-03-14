import * as Knex from "knex";

export const up = async (knex: Knex) => {
  await knex.schema.table("Game", table => {
    table.integer("time");
  });
  await knex.schema.table("Hand", table => {
    table.integer("time");
  });
};

export const down = async (knex: Knex) => {
  await knex.schema.table("Game", table => {
    table.dropColumn("time");
  });
  await knex.schema.table("Hand", table => {
    table.dropColumn("time");
  });
};
