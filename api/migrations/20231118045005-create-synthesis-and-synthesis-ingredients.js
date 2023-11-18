'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('synthesis', {
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
                        tableName: 'items',
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
                        tableName: 'items',
                    },
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });

        await queryInterface.createTable('synthesis_ingredients', {
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
                        tableName: 'synthesis',
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
                        tableName: 'items',
                    },
                    key: 'id',
                },
            },
            quantity: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                defaultValue: 1,
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });

        // had to use triggers to get the desired deletion behavior across 3 tables
        //   - need to use a trigger to get a synthesis deleted after deleting one synthesis_ingredient
        //   - that trigger does not fire when a synthesis ingredient is CASCADE DELETED due to a deleted item
        //   - solution is to trigger delete item -> synthesis_ingredient -> synthesis

        // if you delete a synthesis_ingredient, delete the synthesis
        await queryInterface.sequelize.query(
            `
            CREATE TRIGGER delete_synthesis_after_synthesis_ingredients_delete
            AFTER DELETE ON synthesis_ingredients
            FOR EACH ROW
            DELETE FROM synthesis
            WHERE id = old.synthesis_id
            `
        );

        // if you delete an item, delete the synthesis_ingredient
        await queryInterface.sequelize.query(
            `
            CREATE TRIGGER delete_synthesis_ingredient_after_item_delete
            BEFORE DELETE ON items
            FOR EACH ROW
            DELETE FROM synthesis_ingredients
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

        await queryInterface.dropTable('synthesis_ingredients');
        await queryInterface.dropTable('synthesis');
    },
};
