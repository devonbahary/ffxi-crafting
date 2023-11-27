'use strict';

const LAST_UPDATED = new Date('2023-11-26T19:44:13.867Z');

const timestamps = {
    created_at: LAST_UPDATED,
    updated_at: LAST_UPDATED,
};

const STACK_SIZE_12 = {
    stack_size: 12,
};

const crystal = {
    category: 'Crystals',
    ...STACK_SIZE_12,
};

const seedItems = [
    {
        id: 1,
        name: 'Earth Crystal',
        unit_price: 200,
        stack_price: 800,
        ...crystal,
    },
    {
        id: 2,
        name: 'Wind Crystal',
        unit_price: 300,
        stack_price: 1200,
        ...crystal,
    },
    {
        id: 3,
        name: 'Ice Crystal',
        unit_price: 300,
        stack_price: 3000,
        ...crystal,
    },
    {
        id: 4,
        name: 'Fire Crystal',
        unit_price: 200,
        stack_price: 1000,
        ...crystal,
    },
    {
        id: 5,
        name: 'Water Crystal',
        unit_price: 100,
        stack_price: 400,
        ...crystal,
    },
    {
        id: 6,
        name: 'Lightning Crystal',
        unit_price: 250,
        stack_price: 1100,
        ...crystal,
    },
    {
        id: 7,
        name: 'Light Crystal',
        unit_price: 400,
        stack_price: 4000,
        ...crystal,
    },
    {
        id: 8,
        name: 'Dark Crystal',
        unit_price: 300,
        stack_price: 3000,
        ...crystal,
    },
    {
        id: 9,
        name: 'Sheepskin',
        unit_price: 200,
        stack_price: 3000,
        ...STACK_SIZE_12,
        category: 'Materials.Leathercraft',
    },
    {
        id: 10,
        name: 'Sheep Leather',
        unit_price: 1000,
        stack_price: 10000,
        ...STACK_SIZE_12,
        category: 'Materials.Leathercraft',
    },
    {
        id: 11,
        name: 'Mythril Ingot',
        unit_price: 5500,
        stack_price: 14000,
        ...STACK_SIZE_12,
        category: 'Materials.Goldsmithing',
    },
    {
        id: 12,
        name: 'Mythril Ore',
        unit_price: 1000,
        stack_price: 14000,
        ...STACK_SIZE_12,
        category: 'Materials.Goldsmithing',
    },
    {
        id: 13,
        name: 'Tsurara',
        unit_price: 1,
        stack_price: 2000,
        stack_size: 99,
        category: 'Others.Ninja Tools',
    },
    {
        id: 14,
        name: 'Distilled Water',
        unit_price: 10,
        stack_price: 300,
        ...STACK_SIZE_12,
        category: 'Food.Ingredients',
    },
    {
        id: 15,
        name: 'Rock Salt',
        unit_price: 14,
        stack_price: 400,
        ...STACK_SIZE_12,
        category: 'Materials.Alchemy',
    },
    {
        id: 16,
        name: 'Moblinweave',
        unit_price: 8000,
        stack_price: 25000,
        ...STACK_SIZE_12,
        category: 'Materials.Clothcraft',
    },
    {
        id: 17,
        name: 'Moblin Thread',
        unit_price: 1200,
        stack_price: 20000,
        ...STACK_SIZE_12,
        category: 'Materials.Clothcraft',
    },
    {
        id: 18,
        name: "Fisherman's Boots",
        unit_price: 2000,
        stack_size: 1,
        category: 'Armor.Feet',
    },
    {
        id: 19,
        name: 'Lizard Skin',
        unit_price: 200,
        stack_price: 2000,
        ...STACK_SIZE_12,
        category: 'Materials.Leathercraft',
    },
    {
        id: 20,
        name: 'Grass Cloth',
        unit_price: 300,
        stack_price: 4000,
        ...STACK_SIZE_12,
        category: 'Materials.Clothcraft',
    },
    {
        id: 21,
        name: 'Bronze Scales',
        unit_price: 100,
        stack_price: 500,
        ...STACK_SIZE_12,
        category: 'Materials.Smithing',
    },
];

const seedSyntheses = [
    {
        id: 1,
        item_id: 10,
        crystal_item_id: 8,
        craft: 'Leathercraft',
        craft_level: 2,
        yield: 1,
    },
    {
        id: 2,
        item_id: 11,
        crystal_item_id: 4,
        craft: 'Goldsmithing',
        craft_level: 40,
        yield: 1,
    },
    {
        id: 3,
        item_id: 13,
        crystal_item_id: 3,
        craft: 'Alchemy',
        craft_level: 6,
        yield: 10,
    },
    {
        id: 4,
        item_id: 16,
        crystal_item_id: 1,
        craft: 'Clothcraft',
        craft_level: 23,
        yield: 1,
    },
    {
        id: 5,
        item_id: 18,
        crystal_item_id: 1,
        craft: 'Leathercraft',
        craft_level: 20,
        yield: 1,
    },
];

const seedSynthesisIngredients = [
    {
        id: 1,
        synthesis_id: 1,
        item_id: 9,
        quantity: 1,
    },
    {
        id: 2,
        synthesis_id: 2,
        item_id: 12,
        quantity: 4,
    },
    {
        id: 3,
        synthesis_id: 3,
        item_id: 14,
        quantity: 2,
    },
    {
        id: 4,
        synthesis_id: 3,
        item_id: 15,
        quantity: 1,
    },
    {
        id: 5,
        synthesis_id: 4,
        item_id: 17,
        quantity: 3,
    },
    {
        id: 6,
        synthesis_id: 5,
        item_id: 19,
        quantity: 2,
    },
    {
        id: 7,
        synthesis_id: 5,
        item_id: 20,
        quantity: 1,
    },
    {
        id: 8,
        synthesis_id: 5,
        item_id: 21,
        quantity: 1,
    },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            'items',
            seedItems.map((item) => ({ ...item, ...timestamps }))
        );

        await queryInterface.bulkInsert(
            'synthesis',
            seedSyntheses.map((synthesis) => ({ ...synthesis, ...timestamps }))
        );

        await queryInterface.bulkInsert(
            'synthesis_ingredients',
            seedSynthesisIngredients.map((ingredient) => ({
                ...ingredient,
                ...timestamps,
            }))
        );
    },

    async down(queryInterface, Sequelize) {
        // due to triggers, should delete all synthesis, subcrafts, ingredients
        await queryInterface.bulkDelete('items');
    },
};
