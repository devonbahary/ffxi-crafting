'use strict'

var dbm
var type
var seed

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
    dbm = options.dbmigrate
    type = dbm.dataType
    seed = seedLink
}

exports.up = function (db) {
    return db.createTable('synthesis_ingredients', {
        columns: {
            id: { type: 'int', primaryKey: true, autoIncrement: true },
            synthesis_id: {
                type: 'int',
                notNull: true,
                foreignKey: {
                    name: 'synthesis_ingredients_synthesis_id_fk',
                    table: 'synthesis',
                    mapping: 'id',
                    rules: {
                        onDelete: 'CASCADE',
                    },
                },
            },
            item_id: {
                type: 'int',
                notNull: true,
                foreignKey: {
                    name: 'synthesis_ingredients_id_fk',
                    table: 'items',
                    mapping: 'id',
                    rules: {
                        onDelete: 'CASCADE',
                    },
                },
            },
            quantity: { type: 'int', defaultValue: 1, notNull: true },
        },
    })
}

exports.down = function (db) {
    return db.dropTable('synthesis_ingredients')
}

exports._meta = {
    version: 1,
}
