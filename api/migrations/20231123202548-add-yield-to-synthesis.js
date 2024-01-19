'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('synthesis', 'yield', {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('synthesis', 'yield');
    },
};
