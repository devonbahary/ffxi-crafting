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
            },
            quantity: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                defaultValue: 1,
            },
            ...timestamps,
        });

        // had to use triggers to get the desired deletion behavior across 3 tables
        //   - need to use a trigger to get a synthesis deleted after deleting one synthesis_ingredient
        //   - that trigger does not fire when a synthesis ingredient is CASCADE DELETED due to a deleted item
        //   - solution is to trigger delete item -> synthesis_ingredient -> synthesis

        // if you delete a synthesis_ingredient, delete the synthesis
        await queryInterface.sequelize.query(
            `
            CREATE TRIGGER delete_synthesis_after_synthesis_ingredients_delete
            AFTER DELETE ON ${SYNTHESIS_INGREDIENTS}
            FOR EACH ROW
            DELETE FROM ${SYNTHESIS}
            WHERE id = old.synthesis_id
            `
        );

        // if you delete an item, delete the synthesis_ingredient
        await queryInterface.sequelize.query(
            `
            CREATE TRIGGER delete_synthesis_ingredient_after_item_delete
            BEFORE DELETE ON ${ITEMS}
            FOR EACH ROW
            DELETE FROM ${SYNTHESIS_INGREDIENTS}
            WHERE item_id = old.id
            `
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(
            'DROP TRIGGER delete_synthesis_after_synthesis_ingredients_delete'
        );
        await queryInterface.sequelize.query(
            'DROP TRIGGER delete_synthesis_ingredient_after_item_delete'
        );

        await queryInterface.dropTable(SYNTHESIS_INGREDIENTS);
        await queryInterface.dropTable(SYNTHESIS_SUB_CRAFTS);
        await queryInterface.dropTable(SYNTHESIS);
    },
};
