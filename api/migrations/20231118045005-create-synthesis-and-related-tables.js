'use strict';

const SYNTHESIS = 'synthesis';
const SYNTHESIS_SUB_CRAFTS = 'synthesis_sub_crafts';
const SYNTHESIS_INGREDIENTS = 'synthesis_ingredients';
const ITEMS = 'items';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const crafting = {
            craft: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            craft_level: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        };

        const timestamps = {
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        };

        await queryInterface.createTable(SYNTHESIS, {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            item_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: ITEMS,
                    },
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            crystal_item_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: ITEMS,
                    },
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            ...crafting,
            ...timestamps,
        });

        await queryInterface.addIndex(SYNTHESIS, ['craft']);

        await queryInterface.createTable(SYNTHESIS_SUB_CRAFTS, {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            synthesis_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: SYNTHESIS,
                    },
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            ...crafting,
            ...timestamps,
        });

        await queryInterface.createTable(SYNTHESIS_INGREDIENTS, {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            synthesis_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: SYNTHESIS,
                    },
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            item_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: ITEMS,
                    },
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            quantity: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                defaultValue: 1,
            },
            ...timestamps,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable(SYNTHESIS_INGREDIENTS);
        await queryInterface.dropTable(SYNTHESIS_SUB_CRAFTS);
        await queryInterface.dropTable(SYNTHESIS);
    },
};
