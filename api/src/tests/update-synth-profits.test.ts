import { Item, type Synthesis, SynthesisIngredient } from '../models';
import {
    type SynthesisIngredientWithItem,
    getUnitProfit,
    getStackProfit,
    type CalcProfitInput,
} from '../models/update-synth-profits-hooks';
import { sequelize } from '../sequelize';
import {
    clearTables,
    createRandomItem,
    createSynthesisAndRelatedRecords,
} from './utilities';

const getSynthesisIngredientWithItem = async (
    id: number
): Promise<SynthesisIngredientWithItem> => {
    return (await SynthesisIngredient.findByPk(id, {
        include: [
            {
                model: Item,
                as: 'item',
            },
        ],
    })) as SynthesisIngredientWithItem;
};

const getUnitAndStackProfits = (
    input: CalcProfitInput
): {
    unitProfit: number;
    stackProfit: number | null;
} => {
    return {
        unitProfit: getUnitProfit(input),
        stackProfit: getStackProfit(input),
    };
};

const expectProfits = async (
    synthesis: Synthesis,
    unitProfit: number,
    stackProfit: number | null
): Promise<void> => {
    await synthesis.reload(); // refresh changes from afterUpdate hook

    expect(synthesis.unitProfit).toBe(unitProfit);
    expect(synthesis.stackProfit).toBe(stackProfit);
};

describe('update synth profits', () => {
    beforeAll(async () => {
        await clearTables();
    });

    test('associating synthesis ingredients to a synthesis should automatically update its unit_profit and stack_profit', async () => {
        const { synthesis, product, crystal, synthesisIngredient } =
            await createSynthesisAndRelatedRecords();

        const ingredientWithItemA = await getSynthesisIngredientWithItem(
            synthesisIngredient.id
        );

        const { unitProfit, stackProfit } = getUnitAndStackProfits({
            yield: synthesis.yield,
            product,
            crystal,
            ingredients: [ingredientWithItemA],
        });

        await expectProfits(synthesis, unitProfit, stackProfit);

        const item = await createRandomItem({
            stackPrice: 1000,
        });

        const newIngredient = await SynthesisIngredient.create({
            itemId: item.id,
            synthesisId: synthesis.id,
            quantity: 2,
        });

        const ingredientWithItemB = await getSynthesisIngredientWithItem(
            newIngredient.id
        );

        const {
            unitProfit: unitProfitAfterNewIngredient,
            stackProfit: stackProfitAfterNewIngredient,
        } = getUnitAndStackProfits({
            yield: synthesis.yield,
            product,
            crystal,
            ingredients: [ingredientWithItemA, ingredientWithItemB],
        });

        expect(unitProfit).not.toBe(unitProfitAfterNewIngredient);
        expect(stackProfit).not.toBe(stackProfitAfterNewIngredient);

        await expectProfits(
            synthesis,
            unitProfitAfterNewIngredient,
            stackProfitAfterNewIngredient
        );
    });

    test('updating a synthesis product price should automatically update its unit_profit and stack_profit', async () => {
        const { synthesis, product, crystal, synthesisIngredient } =
            await createSynthesisAndRelatedRecords();

        await product.update({
            stackPrice: (product.stackPrice ?? 0) + 500,
        });

        const ingredientWithItem = await getSynthesisIngredientWithItem(
            synthesisIngredient.id
        );

        const { unitProfit, stackProfit } = getUnitAndStackProfits({
            yield: synthesis.yield,
            product,
            crystal,
            ingredients: [ingredientWithItem],
        });

        await expectProfits(synthesis, unitProfit, stackProfit);
    });

    test('updating a synthesis crystal price should automatically update its unit_profit and stack_profit', async () => {
        const { synthesis, product, crystal, synthesisIngredient } =
            await createSynthesisAndRelatedRecords();

        await crystal.update({
            stackPrice: (crystal.stackPrice ?? 0) + 1000,
        });

        const ingredientWithItem = await getSynthesisIngredientWithItem(
            synthesisIngredient.id
        );

        const { unitProfit, stackProfit } = getUnitAndStackProfits({
            yield: synthesis.yield,
            product,
            crystal,
            ingredients: [ingredientWithItem],
        });

        await expectProfits(synthesis, unitProfit, stackProfit);
    });

    test('updating a synthesis yield should automatically update its unit_profit and stack_profit', async () => {
        const { synthesis, product, crystal, synthesisIngredient } =
            await createSynthesisAndRelatedRecords();

        await synthesis.update({
            yield: synthesis.yield + 1,
        });

        const ingredientWithItem = await getSynthesisIngredientWithItem(
            synthesisIngredient.id
        );

        const { unitProfit, stackProfit } = getUnitAndStackProfits({
            yield: synthesis.yield,
            product,
            crystal,
            ingredients: [ingredientWithItem],
        });

        await expectProfits(synthesis, unitProfit, stackProfit);
    });

    test('updating a synthesis ingredient price should automatically update the synthesis unit_profit and stack_profit', async () => {
        const { synthesis, product, crystal, synthesisIngredient, ingredient } =
            await createSynthesisAndRelatedRecords();

        await ingredient.update({
            stackPrice: (ingredient.stackPrice ?? 0) + 2000,
        });

        const ingredientWithItem = await getSynthesisIngredientWithItem(
            synthesisIngredient.id
        );

        const { unitProfit, stackProfit } = getUnitAndStackProfits({
            yield: synthesis.yield,
            product,
            crystal,
            ingredients: [ingredientWithItem],
        });

        await expectProfits(synthesis, unitProfit, stackProfit);
    });

    test('updating a synthesis ingredient quantity should automatically update the synthesis unit_profit and stack_profit', async () => {
        const { synthesis, product, crystal, synthesisIngredient } =
            await createSynthesisAndRelatedRecords();

        await synthesisIngredient.update({
            quantity: synthesisIngredient.quantity + 2,
        });

        const ingredientWithItem = await getSynthesisIngredientWithItem(
            synthesisIngredient.id
        );

        const { unitProfit, stackProfit } = getUnitAndStackProfits({
            yield: synthesis.yield,
            product,
            crystal,
            ingredients: [ingredientWithItem],
        });

        await expectProfits(synthesis, unitProfit, stackProfit);
    });

    test('a synthesis with product of stack_size 1 should have a null stack_profit', async () => {
        const { synthesis } = await createSynthesisAndRelatedRecords({
            stackSize: 1,
        });

        await synthesis.reload(); // might have to reload after create then to catch new values after hooks

        expect(synthesis.stackProfit).toBe(null);
    });

    afterAll(async () => {
        await sequelize.close();
    });
});
