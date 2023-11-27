import { type WhereOptions } from 'sequelize';
import { sequelize } from '../sequelize';
import {
    Item,
    Synthesis,
    SynthesisIngredient,
    SynthesisSubCraft,
} from '../models';
import { clearTables, createSynthesisAndRelatedRecords } from './utlitites';

const whereId = (id: number): { where: WhereOptions } => ({ where: { id } });

describe('deletion behavior', () => {
    beforeAll(async () => {
        await clearTables();
    });

    afterAll(async () => {
        await sequelize.close();
    });

    test('deleting a synthesis should delete its related sub crafts and ingredients', async () => {
        const { synthesis, subCraft, synthesisIngredient } =
            await createSynthesisAndRelatedRecords();

        await Synthesis.destroy(whereId(synthesis.id));

        expect(await Synthesis.findByPk(synthesis.id)).toBeNull();
        expect(await SynthesisSubCraft.findByPk(subCraft.id)).toBeNull();
        expect(
            await SynthesisIngredient.findByPk(synthesisIngredient.id)
        ).toBeNull();
    });

    test('deleting a synthesis sub craft should not delete its synthesis', async () => {
        const { synthesis, subCraft, synthesisIngredient } =
            await createSynthesisAndRelatedRecords();

        await SynthesisSubCraft.destroy(whereId(subCraft.id));

        expect(await Synthesis.findByPk(synthesis.id)).toBeTruthy();
        expect(await SynthesisSubCraft.findByPk(subCraft.id)).toBeNull();
        expect(
            await SynthesisIngredient.findByPk(synthesisIngredient.id)
        ).toBeTruthy();
    });

    test('deleting a synthesis ingredient should not delete its synthesis', async () => {
        const { synthesis, subCraft, synthesisIngredient } =
            await createSynthesisAndRelatedRecords();

        await SynthesisIngredient.destroy(whereId(synthesisIngredient.id));

        expect(await Synthesis.findByPk(synthesis.id)).toBeTruthy();
        expect(await SynthesisSubCraft.findByPk(subCraft.id)).toBeTruthy();
        expect(
            await SynthesisIngredient.findByPk(synthesisIngredient.id)
        ).toBeNull();
    });

    test('deleting an item that is the product of synthesis should delete the synthesis, its sub crafts, and ingredients', async () => {
        const { synthesis, product, subCraft, synthesisIngredient } =
            await createSynthesisAndRelatedRecords();

        await Item.destroy(whereId(product.id));

        expect(await Synthesis.findByPk(synthesis.id)).toBeNull();
        expect(await SynthesisSubCraft.findByPk(subCraft.id)).toBeNull();
        expect(
            await SynthesisIngredient.findByPk(synthesisIngredient.id)
        ).toBeNull();
    });

    test('deleting a crystal used by a synthesis should delete the synthesis, its sub crafts, and ingredients', async () => {
        const { synthesis, crystal, subCraft, synthesisIngredient } =
            await createSynthesisAndRelatedRecords();

        await Item.destroy(whereId(crystal.id));

        expect(await Synthesis.findByPk(synthesis.id)).toBeNull();
        expect(await SynthesisSubCraft.findByPk(subCraft.id)).toBeNull();
        expect(
            await SynthesisIngredient.findByPk(synthesisIngredient.id)
        ).toBeNull();
    });

    test('deleting an item used by a synthesis ingredient should delete the synthesis, its sub crafts, and ingredients', async () => {
        const { synthesis, subCraft, synthesisIngredient, ingredient } =
            await createSynthesisAndRelatedRecords();

        await Item.destroy(whereId(ingredient.id));

        expect(await Synthesis.findByPk(synthesis.id)).toBeNull();
        expect(await SynthesisSubCraft.findByPk(subCraft.id)).toBeNull();
        expect(
            await SynthesisIngredient.findByPk(synthesisIngredient.id)
        ).toBeNull();
    });
});
