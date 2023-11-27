'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('synthesis', 'unit_profit', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        });

        await queryInterface.addColumn('synthesis', 'stack_profit', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        });

        await queryInterface.addIndex('synthesis', ['unit_profit']);
        await queryInterface.addIndex('synthesis', ['stack_profit']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('synthesis', 'unit_profit');
        await queryInterface.removeColumn('synthesis', 'stack_profit');
    },
};
