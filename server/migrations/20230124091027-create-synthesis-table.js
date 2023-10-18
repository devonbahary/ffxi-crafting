"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable("synthesis", {
    columns: {
      id: { type: "int", primaryKey: true, autoIncrement: true },
      item_id: {
        type: "int",
        notNull: true,
        foreignKey: {
          name: "synthesis_item_id_fk",
          table: "items",
          mapping: "id",
          rules: {
            onDelete: "CASCADE",
          },
        },
      },
      crystal: { type: "string", notNull: true },
      craft: { type: "string", notNull: true },
    },
  });
};

exports.down = function (db) {
  return db.dropTable("synthesis");
};

exports._meta = {
  version: 1,
};
