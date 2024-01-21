import { Category, Craft } from '../enums';
import {
    Item,
    Synthesis,
    SynthesisIngredient,
    SynthesisSubCraft,
} from '../models';
import { sequelize } from '../sequelize';

const getRandomName = (): string => {
    // https://dev.to/oyetoket/fastest-way-to-generate-random-strings-in-javascript-2k5a
    return Math.random().toString(20).substr(2, 6);
};

export const clearTables = async (): Promise<void> => {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    for (const table of [
        'synthesis_ingredients',
        'synthesis_sub_crafts',
        'synthesis',
        'items',
    ]) {
        await sequelize.query(`TRUNCATE TABLE ${table}`);
    }

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
};

export const createRandomItem = async (
    seed: Partial<Item> = {}
): Promise<Item> => {
    try {
        return await Item.create({
            name: getRandomName(),
            category: Category.Alchemy,
            stackSize: 12,
            unitPrice: Math.round(Math.random() * 1000),
            stackPrice:
                seed.stackSize !== 1 ? Math.round(Math.random() * 10000) : null,
            ...seed,
        });
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export const createSynthesisAndRelatedRecords = async (
    productSeed: Partial<Item> = {}
): Promise<{
    synthesis: Synthesis;
    product: Item;
    crystal: Item;
    subCraft: SynthesisSubCraft;
    synthesisIngredient: SynthesisIngredient;
    ingredient: Item;
}> => {
    const product = await createRandomItem({
        ...productSeed,
    });

    const crystal = await createRandomItem({
        category: Category.Crystals,
    });

    const ingredient = await createRandomItem();

    const synthesis = await Synthesis.create({
        itemId: product.id,
        crystalItemId: crystal.id,
        craft: Craft.Alchemy,
        craftLevel: 5,
        yield: 1,
    });

    const subCraft = await SynthesisSubCraft.create({
        synthesisId: synthesis.id,
        craft: Craft.Woodworking,
        craftLevel: 2,
    });

    const synthesisIngredient = await SynthesisIngredient.create({
        synthesisId: synthesis.id,
        itemId: ingredient.id,
        quantity: 1,
    });

    return {
        synthesis,
        product,
        crystal,
        subCraft,
        synthesisIngredient,
        ingredient,
    };
};
