import { type WhereOptions } from 'sequelize';
import { Category, Item } from '../models/Item';
import { Synthesis } from '../models/Synthesis';
import { SynthesisIngredient } from '../models/SynthesisIngredient';
import { sequelize } from '../sequelize';

let fireCrystal: Item;
let mythrilIngot: Item;
let mythrilOre: Item;

const clearTables = async (): Promise<void> => {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    for (const table of ['synthesis_ingredients', 'synthesis', 'items']) {
        await sequelize.query(`TRUNCATE TABLE ${table}`);
    }
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
};

const whereId = (id: number): { where: WhereOptions } => ({ where: { id } });

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

test('deleting an item should delete the synthesis that uses it', async () => {
    const synthesis = await Synthesis.create({
        item_id: mythrilIngot.id,
        crystal_item_id: fireCrystal.id,
    });

    await Item.destroy(whereId(mythrilIngot.id));

    expect(await Synthesis.findOne(whereId(synthesis.id))).toBeNull();
});

test('deleting a synthesis ingredient should delete the synthesis', async () => {
    const synthesis = await Synthesis.create({
        item_id: mythrilIngot.id,
        crystal_item_id: fireCrystal.id,
    });

    const ingredient = await SynthesisIngredient.create({
        synthesis_id: synthesis.id,
        item_id: mythrilOre.id,
    });

    await SynthesisIngredient.destroy(whereId(ingredient.id));

    expect(await Synthesis.findOne(whereId(synthesis.id))).toBeNull();
});

test('deleting an item should delete the synthesis_ingredient that uses it and the synthesis that uses that ingredient', async () => {
    const synthesis = await Synthesis.create({
        item_id: mythrilIngot.id,
        crystal_item_id: fireCrystal.id,
    });

    const ingredient = await SynthesisIngredient.create({
        synthesis_id: synthesis.id,
        item_id: mythrilOre.id,
    });

    await Item.destroy(whereId(mythrilOre.id));

    expect(
        await SynthesisIngredient.findOne(whereId(ingredient.id))
    ).toBeNull();

    expect(await Synthesis.findOne(whereId(synthesis.id))).toBeNull();
});
