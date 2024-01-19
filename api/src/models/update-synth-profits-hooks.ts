import { type CreateOptions, type UpdateOptions } from 'sequelize';
import { Item, Synthesis, SynthesisIngredient } from '.';
import { Op } from 'sequelize';

export interface SynthesisIngredientWithItem extends SynthesisIngredient {
    item: Item;
}

export interface CalcProfitInput {
    yield: number;
    product: Item;
    crystal: Item;
    ingredients: SynthesisIngredientWithItem[];
}

const getItemUnitCost = (item: Item): number => {
    if (item.stackSize === 1) {
        return item.unitPrice;
    }

    if (typeof item.stackPrice !== 'number') {
        throw new Error(
            `unexpected stackPrice ${item.stackPrice} for item ${JSON.stringify(
                item.toJSON()
            )}`
        );
    }

    return item.stackPrice / item.stackSize;
};

const getIngredientsCost = (
    ingredients: SynthesisIngredientWithItem[]
): number => {
    return ingredients.reduce((acc, ingredient) => {
        const {
            item: { unitPrice, stackPrice, stackSize },
            quantity,
        } = ingredient;

        if (stackSize === 1) {
            const ingredientCost = unitPrice * quantity;
            return acc + ingredientCost;
        }

        if (typeof stackPrice !== 'number') {
            throw new Error(
                `unexpected stackPrice ${stackPrice} for item ${JSON.stringify(
                    ingredient.item.toJSON()
                )}`
            );
        }

        const ingredientCost = (stackPrice / stackSize) * quantity;
        return acc + ingredientCost;
    }, 0);
};

/*
    busines logic rules:
        - each synthesis uses only 1 crystal
    business logic assumption:
        - crystals and ingredients will always be bought by stack b/c that is most economic
        - it is also perhaps too burdensome to allow configuration on each synthesis_ingredient to use unit_ or stack_price
*/
export const getUnitProfit = (input: CalcProfitInput): number => {
    const { yield: synthYield, product, crystal, ingredients } = input;

    const revenue = product.unitPrice * synthYield;

    const crystalCost = getItemUnitCost(crystal);
    const ingredientsCost = getIngredientsCost(ingredients);

    return Math.round((revenue - crystalCost - ingredientsCost) / synthYield);
};

export const getStackProfit = (input: CalcProfitInput): number | null => {
    const { yield: synthYield, product, crystal, ingredients } = input;

    if (product.stackSize === 1) return null;

    if (typeof product.stackPrice !== 'number') {
        throw new Error(
            `unexpected stackPrice ${
                product.stackPrice
            } for item ${JSON.stringify(product.toJSON())}`
        );
    }

    const repeatsToGetToStack = product.stackSize / synthYield;

    const revenue = product.stackPrice;

    const crystalCost = getItemUnitCost(crystal);
    const ingredientsCost = getIngredientsCost(ingredients);

    return Math.round(
        revenue - repeatsToGetToStack * (crystalCost + ingredientsCost)
    );
};

export const updateSynthProfitsFromItem = async (
    item: Item,
    options: CreateOptions | UpdateOptions
): Promise<void> => {
    const syntheses = await Synthesis.findAll({
        where: {
            [Op.or]: [
                {
                    itemId: item.id,
                },
                {
                    crystalItemId: item.id,
                },
                {
                    '$ingredients.item_id$': item.id,
                },
            ],
        },
        include: [
            {
                model: SynthesisIngredient,
                as: 'ingredients',
            },
        ],
        transaction: options.transaction,
    });

    await Promise.all(
        syntheses.map(async (synth) => {
            await updateSynthProfitsFromSynth(synth, options);
        })
    );
};

export const updateSynthProfitsFromSynth = async (
    synth: Synthesis,
    { transaction }: CreateOptions | UpdateOptions
): Promise<void> => {
    const product = await Item.findByPk(synth.itemId, { transaction });
    const crystal = await Item.findByPk(synth.crystalItemId, { transaction });
    const ingredients = (await SynthesisIngredient.findAll({
        where: {
            synthesisId: synth.id,
        },
        include: [
            {
                model: Item,
                as: 'item',
            },
        ],
        transaction,
    })) as SynthesisIngredientWithItem[];

    if (product === null) {
        throw new Error(
            `could not find product for synth ${JSON.stringify(synth.toJSON())}`
        );
    }

    if (crystal === null) {
        throw new Error(
            `could not find crystal for synth ${JSON.stringify(synth.toJSON())}`
        );
    }

    const calcProfitInput = {
        yield: synth.yield,
        product,
        crystal,
        ingredients,
    };

    synth.unitProfit = getUnitProfit(calcProfitInput);
    synth.stackProfit = getStackProfit(calcProfitInput);

    if (!synth.isNewRecord) {
        await synth.save({
            transaction,
            hooks: false, // prevent infinite loop
        });
    }
};

export const updateSynthProfitsFromIngredient = async (
    ingredient: SynthesisIngredient,
    options: CreateOptions | UpdateOptions
): Promise<void> => {
    const synth = await Synthesis.findByPk(ingredient.synthesisId, {
        transaction: options.transaction,
    });

    if (synth === null) {
        throw new Error(
            `could not find synthesis for ingredient ${JSON.stringify(
                ingredient.toJSON()
            )}`
        );
    }

    await updateSynthProfitsFromSynth(synth, options);
};
