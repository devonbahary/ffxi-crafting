'use strict';

const ITEMS = 'items';
const SYNTHESIS = 'synthesis';
const SYNTHESIS_INGREDIENTS = 'synthesis_ingredients';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(
            'DROP TRIGGER delete_synthesis_after_synthesis_ingredients_delete'
        );

        await queryInterface.sequelize.query(
            'DROP TRIGGER delete_synthesis_ingredient_after_item_delete'
        );

        await queryInterface.changeColumn('synthesis_ingredients', 'item_id', {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
                model: {
                    tableName: ITEMS,
                },
                key: 'id',
            },
            onDelete: 'CASCADE',
        });
    },

    async down(queryInterface, Sequelize) {
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

        await queryInterface.changeColumn('synthesis_ingredients', 'item_id', {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: {
                model: {
                    tableName: ITEMS,
                },
                key: 'id',
            },
        });
    },
};
