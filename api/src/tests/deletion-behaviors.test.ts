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
        itemId,
        yield: 1,
        crystalItemId: fireCrystal.id,
        craft: Craft.Goldsmithing,
        craftLevel: 40,
    });

    const subCraft = await SynthesisSubCraft.create({
        synthesisId: synthesis.id,
        craft: Craft.Smithing,
        craftLevel: 20,
    });

    return [synthesis.id, subCraft.id];
};

const expectSynthesisAndSubCraftsToBeDeleted = async (
    synthesisId: number,
    subCraftId: number
): Promise<void> => {
    expect(await Synthesis.findByPk(synthesisId)).toBeNull();
    expect(await SynthesisSubCraft.findByPk(subCraftId)).toBeNull();
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

test('deleting a synthesis should delete its related sub crafts and ingredients', async () => {
    const [synthesisId, subCraftId] = await createSynthesisAndSubCraft(
        mythrilIngot.id
    );

    const ingredient = await SynthesisIngredient.create({
        synthesisId,
        itemId: mythrilOre.id,
    });

    await Synthesis.destroy(whereId(synthesisId));

    await expectSynthesisAndSubCraftsToBeDeleted(synthesisId, subCraftId);
    expect(await SynthesisIngredient.findByPk(ingredient.id)).toBeNull();
});

test('deleting a synthesis sub craft should not delete its synthesis', async () => {
    const [synthesisId, subCraftId] = await createSynthesisAndSubCraft(
        mythrilIngot.id
    );

    await SynthesisSubCraft.destroy(whereId(subCraftId));

    expect(await Synthesis.findByPk(synthesisId)).toBeTruthy();
    expect(await SynthesisSubCraft.findByPk(subCraftId)).toBeNull();
});

test('deleting a synthesis ingredient should not delete its synthesis', async () => {
    const [synthesisId] = await createSynthesisAndSubCraft(mythrilIngot.id);

    const ingredient = await SynthesisIngredient.create({
        synthesisId,
        itemId: mythrilOre.id,
    });

    await SynthesisIngredient.destroy(whereId(ingredient.id));

    expect(await Synthesis.findByPk(synthesisId)).toBeTruthy();
});

test('deleting an item produced by a synthesis should delete the synthesis, its sub crafts, and ingredients', async () => {
    const [synthesisId, subCraftId] = await createSynthesisAndSubCraft(
        mythrilIngot.id
    );

    const ingredient = await SynthesisIngredient.create({
        synthesisId,
        itemId: mythrilOre.id,
    });

    await Item.destroy(whereId(mythrilIngot.id));

    await expectSynthesisAndSubCraftsToBeDeleted(synthesisId, subCraftId);
    expect(await SynthesisIngredient.findByPk(ingredient.id)).toBeNull();
});

test('deleting a crystal used by a synthesis should delete the synthesis, its sub crafts, and ingredients', async () => {
    const [synthesisId, subCraftId] = await createSynthesisAndSubCraft(
        mythrilIngot.id
    );

    const ingredient = await SynthesisIngredient.create({
        synthesisId,
        itemId: mythrilOre.id,
    });

    await Item.destroy(whereId(fireCrystal.id));

    await expectSynthesisAndSubCraftsToBeDeleted(synthesisId, subCraftId);
    expect(await SynthesisIngredient.findByPk(ingredient.id)).toBeNull();
});

test('deleting an item used by a synthesis ingredient should delete the synthesis, its sub crafts, and ingredients', async () => {
    const [synthesisId, subCraftId] = await createSynthesisAndSubCraft(
        mythrilIngot.id
    );

    const ingredient = await SynthesisIngredient.create({
        synthesisId,
        itemId: mythrilOre.id,
    });

    await Item.destroy(whereId(mythrilOre.id));

    await expectSynthesisAndSubCraftsToBeDeleted(synthesisId, subCraftId);
    expect(await SynthesisIngredient.findByPk(ingredient.id)).toBeNull();
});
