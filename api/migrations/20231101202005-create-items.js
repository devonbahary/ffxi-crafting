'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('items', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            category: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            unit_price: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            stack_price: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            stack_size: {
                type: Sequelize.INTEGER,
                defaultValue: 1,
                allowNull: false,
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

        await queryInterface.addIndex('items', ['name']);
        await queryInterface.addIndex('items', ['category']);
        await queryInterface.addIndex('items', ['updated_at']);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('items');
    },
};
