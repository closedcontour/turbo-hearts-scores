import * as Knex from "knex";

export const up = (knex: Knex) =>
  knex.schema
    .createTable("League", table => {
      table.increments("id").primary();
      table.string("name");
    })
    .createTable("Player", table => {
      table.increments("id").primary();
      table.string("name");
      table.unique(["name"]);
    })
    .createTable("PlayerLeague", table => {
      table.increments("id").primary();
      table
        .integer("leagueId")
        .unsigned()
        .references("id")
        .inTable("League");
      table
        .integer("playerId")
        .unsigned()
        .references("id")
        .inTable("Player");
    })
    .createTable("Season", table => {
      table.increments("id").primary();
      table.string("name");
      table
        .integer("leagueId")
        .unsigned()
        .references("id")
        .inTable("League");
    })
    .createTable("Game", table => {
      table.increments("id").primary();
      table
        .integer("seasonId")
        .unsigned()
        .references("id")
        .inTable("Season");
      table
        .integer("p1Id")
        .unsigned()
        .references("id")
        .inTable("Player");
      table
        .integer("p2Id")
        .unsigned()
        .references("id")
        .inTable("Player");
      table
        .integer("p3Id")
        .unsigned()
        .references("id")
        .inTable("Player");
      table
        .integer("p4Id")
        .unsigned()
        .references("id")
        .inTable("Player");
    })
    .createTable("Hand", table => {
      table.increments("id").primary();

      table
        .integer("gameId")
        .unsigned()
        .references("id")
        .inTable("Game");

      table.enu("pass", ["LEFT", "RIGHT", "ACROSS", "KEEP"]);

      table.boolean("p1ChargeJd");
      table.boolean("p2ChargeJd");
      table.boolean("p3ChargeJd");
      table.boolean("p4ChargeJd");

      table.boolean("p1ChargeTc");
      table.boolean("p2ChargeTc");
      table.boolean("p3ChargeTc");
      table.boolean("p4ChargeTc");

      table.boolean("p1ChargeAh");
      table.boolean("p2ChargeAh");
      table.boolean("p3ChargeAh");
      table.boolean("p4ChargeAh");

      table.boolean("p1ChargeQs");
      table.boolean("p2ChargeQs");
      table.boolean("p3ChargeQs");
      table.boolean("p4ChargeQs");

      table.boolean("p1TookJd");
      table.boolean("p2TookJd");
      table.boolean("p3TookJd");
      table.boolean("p4TookJd");

      table.boolean("p1TookQs");
      table.boolean("p2TookQs");
      table.boolean("p3TookQs");
      table.boolean("p4TookQs");

      table.boolean("p1TookTc");
      table.boolean("p2TookTc");
      table.boolean("p3TookTc");
      table.boolean("p4TookTc");

      table.integer("p1Hearts").unsigned();
      table.integer("p2Hearts").unsigned();
      table.integer("p3Hearts").unsigned();
      table.integer("p4Hearts").unsigned();
    });

export const down = (knex: Knex) =>
  knex.schema
    .dropTableIfExists("League")
    .dropTableIfExists("Player")
    .dropTableIfExists("PlayerLeague")
    .dropTableIfExists("Season")
    .dropTableIfExists("Game")
    .dropTableIfExists("Hand");
