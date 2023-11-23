import { type WhereOptions } from 'sequelize';
import { Category, Item } from '../models/Item';
import { Synthesis } from '../models/Synthesis';
import { SynthesisIngredient } from '../models/SynthesisIngredient';
import { sequelize } from '../sequelize';
import { Craft } from '../enums';
import { SynthesisSubCraft } from '../models/SynthesisSubCraft';

let fireCrystal: Item;
let mythrilIngot: Item;
let mythrilOre: Item;

const clearTables = async (): Promise<void> => {
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

const whereId = (id: number): { where: WhereOptions } => ({ where: { id } });

const createSynthesisAndSubCraft = async (
    itemId: number
): Promise<[number, number]> => {
    const synthesis = await Synthesis.create({
        item_id: itemId,
        crystal_item_id: fireCrystal.id,
        craft: Craft.Goldsmithing,
        craft_level: 40,
    });

    const subCraft = await SynthesisSubCraft.create({
        synthesis_id: synthesis.id,
        craft: Craft.Smithing,
        craft_level: 20,
    });

    return [synthesis.id, subCraft.id];
};

const expectSynthesisAndSubCraftsToBeDeleted = async (
    synthesisId: number,
    subCraftId: number
): Promise<void> => {
    expect(await Synthesis.findOne(whereId(synthesisId))).toBeNull();
    expect(await SynthesisSubCraft.findOne(whereId(subCraftId))).toBeNull();
};

beforeEach(async () => {
    await clearTables();

    fireCrystal = await Item.create({
        name: 'Fire Crystal',
        category: Category.Crystals,
    });

    mythrilIngot = await Item.create({
        name: 'Mythril Ingot',
        category: Category.Goldsmithing,
    });

    mythrilOre = await Item.create({
        name: 'Mythril Ore',
        category: Category.Goldsmithing,
    });
});

afterAll(async () => {
    await sequelize.close();
});

test('deleting a synthesis should delete its related sub crafts', async () => {
    const [synthesisId, subCraftId] = await createSynthesisAndSubCraft(
        mythrilIngot.id
    );

    await Synthesis.destroy(whereId(synthesisId));

    await expectSynthesisAndSubCraftsToBeDeleted(synthesisId, subCraftId);
});

test('deleting a synthesis sub craft should not delete its synthesis', async () => {
    const [synthesisId, subCraftId] = await createSynthesisAndSubCraft(
        mythrilIngot.id
    );

    await SynthesisSubCraft.destroy(whereId(subCraftId));

    expect(await Synthesis.findOne(whereId(synthesisId))).toBeTruthy();
    expect(await SynthesisSubCraft.findOne(whereId(subCraftId))).toBeNull();
});

test('deleting an item should delete the synthesis that uses it and related sub crafts', async () => {
    const [synthesisId, subCraftId] = await createSynthesisAndSubCraft(
        mythrilIngot.id
    );

    await Item.destroy(whereId(mythrilIngot.id));

    await expectSynthesisAndSubCraftsToBeDeleted(synthesisId, subCraftId);
});

test('deleting a synthesis ingredient should delete the synthesis and related sub crafts', async () => {
    const [synthesisId, subCraftId] = await createSynthesisAndSubCraft(
        mythrilIngot.id
    );

    const ingredient = await SynthesisIngredient.create({
        synthesis_id: synthesisId,
        item_id: mythrilOre.id,
    });

    await SynthesisIngredient.destroy(whereId(ingredient.id));

    await expectSynthesisAndSubCraftsToBeDeleted(synthesisId, subCraftId);
});

test('deleting an item should delete the synthesis_ingredient that uses it, the synthesis that uses that ingredient and related sub crafts', async () => {
    const [synthesisId, subCraftId] = await createSynthesisAndSubCraft(
        mythrilIngot.id
    );

    const ingredient = await SynthesisIngredient.create({
        synthesis_id: synthesisId,
        item_id: mythrilOre.id,
    });

    await Item.destroy(whereId(mythrilOre.id));

    expect(
        await SynthesisIngredient.findOne(whereId(ingredient.id))
    ).toBeNull();

    await expectSynthesisAndSubCraftsToBeDeleted(synthesisId, subCraftId);
});
