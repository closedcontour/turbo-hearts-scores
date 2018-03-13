import * as Knex from "knex";

export const up = (knex: Knex) =>
  knex.schema.table("Game", table => {
    table.boolean("deleted").defaultTo(false);
  });

export const down = (knex: Knex) =>
  knex.schema.table("Game", table => {
    table.dropColumn("deleted");
  });
