'use strict';

const fs = require('fs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const sql = await fs.readFileSync('./seeders/seed.sql').toString();

        try {
            await queryInterface.sequelize.query(sql);
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    async down(queryInterface, Sequelize) {
        // due to triggers, should delete all synthesis, subcrafts, ingredients
        await queryInterface.bulkDelete('items');
    },
};
