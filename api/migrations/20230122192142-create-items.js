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
    return db.createTable('items', {
        columns: {
            id: { type: 'int', primaryKey: true, autoIncrement: true },
            name: { type: 'string', unique: true, nonNull: true },
            price_type: { type: 'string', notNull: true },
            price: { type: 'int', notNull: true, defaultValue: 0 },
        },
    })
}

exports.down = function (db) {
    return db.dropTable('items')
}

exports._meta = {
    version: 1,
}
