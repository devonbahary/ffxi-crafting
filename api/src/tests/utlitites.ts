import { Category, Craft } from '../enums';
import {
    Item,
    Synthesis,
    SynthesisIngredient,
    SynthesisSubCraft,
} from '../models';
import { sequelize } from '../sequelize';

let randomName = 'hello';

const getRandomName = (): string => {
    randomName += 1;
    return randomName;
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
    return await Item.create({
        name: getRandomName(),
        category: Category.Alchemy,
        unitPrice: Math.round(Math.random() * 1000),
        stackPrice: Math.round(Math.random() * 10000),
        stackSize: 12,
        ...seed,
    });
};

export const createSynthesisAndRelatedRecords = async (): Promise<{
    synthesis: Synthesis;
    product: Item;
    crystal: Item;
    subCraft: SynthesisSubCraft;
    synthesisIngredient: SynthesisIngredient;
    ingredient: Item;
}> => {
    const product = await createRandomItem();

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
