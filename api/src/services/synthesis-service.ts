import { type FindOptions, type InferAttributes } from 'sequelize';
import { type Craft } from '../enums';
import { Category, Item } from '../models/Item';
import { Synthesis } from '../models/Synthesis';
import { SynthesisIngredient } from '../models/SynthesisIngredient';
import { SynthesisSubCraft } from '../models/SynthesisSubCraft';
import { sequelize } from '../sequelize';

interface Crafting {
    craft: Craft;
    craftLevel: number;
}

interface SubCraft extends Crafting {
    id?: string;
}

interface SynthesisIngredientInput {
    itemId: number;
    quantity: number;
}

interface SynthesisInput {
    synthesis: Crafting & {
        yield: number;
        itemId: number;
        crystalItemId: number;
    };
    subCrafts: SubCraft[];
    ingredients: SynthesisIngredientInput[];
}

const SYNTHESIS_INCLUDE: FindOptions<InferAttributes<Synthesis>>['include'] = [
    {
        model: SynthesisSubCraft,
        as: 'subCrafts',
    },
    {
        model: Item,
        as: 'crystal',
    },
    {
        model: Item,
        as: 'product',
    },
    {
        model: SynthesisIngredient,
        as: 'ingredients',
        include: [
            {
                model: Item,
                as: 'item',
            },
        ],
    },
];

export const getSyntheses = async (
    limit?: number,
    offset?: number
): Promise<Synthesis[]> => {
    return await Synthesis.findAll({
        limit,
        offset,
        include: SYNTHESIS_INCLUDE,
    });
};

export const getSynthesis = async (id: string): Promise<Synthesis | null> => {
    return await Synthesis.findByPk(id, {
        include: SYNTHESIS_INCLUDE,
    });
};

const areAllCraftsUnique = (input: SynthesisInput): boolean => {
    const { craft: mainCraft } = input.synthesis;

    const craftSet = new Set<Craft>([mainCraft]);

    for (const subCraft of input.subCrafts) {
        if (craftSet.has(subCraft.craft)) {
            return false;
        }

        craftSet.add(subCraft.craft);
    }

    return true;
};

const areAllItemsUnique = (input: SynthesisInput): boolean => {
    const { synthesis, ingredients } = input;

    const itemIdSet = new Set<number>([synthesis.itemId]);

    for (const ingredient of ingredients) {
        if (itemIdSet.has(ingredient.itemId)) {
            return false;
        }

        itemIdSet.add(ingredient.itemId);
    }

    return true;
};

const isCrystal = async (itemId: number): Promise<boolean> => {
    const item = await Item.findByPk(itemId);
    return item?.category === Category.Crystals;
};

const validateInput = async (input: SynthesisInput): Promise<void> => {
    if (!areAllCraftsUnique(input)) {
        throw new Error('Main craft and sub crafts must all be unique');
    }

    if (!areAllItemsUnique(input)) {
        throw new Error(`Synthesis must include unique items`);
    }

    const { synthesis, ingredients } = input;
    if (await isCrystal(synthesis.itemId)) {
        throw new Error(
            `Synthesis product cannot be of category ${Category.Crystals} `
        );
    }

    if (!(await isCrystal(synthesis.crystalItemId))) {
        throw new Error(
            `Synthesis crystal must be of category ${Category.Crystals}`
        );
    }

    const areIngredientsCrystal = await Promise.all(
        ingredients.map(
            async (ingredient) => await isCrystal(ingredient.itemId)
        )
    );

    if (areIngredientsCrystal.some((isCrystal) => isCrystal)) {
        throw new Error(
            `Synthesis ingredients cannot be of category ${Category.Crystals}`
        );
    }
};

export const createSynthesis = async (
    input: SynthesisInput
): Promise<Synthesis> => {
    const {
        synthesis: {
            yield: synthYield,
            itemId,
            crystalItemId,
            craft,
            craftLevel,
        },
        subCrafts,
        ingredients,
    } = input;

    await validateInput(input);

    const transaction = await sequelize.transaction();

    try {
        const synthesis = await Synthesis.create(
            {
                itemId,
                yield: synthYield,
                crystalItemId,
                craft,
                craftLevel,
            },
            {
                transaction,
            }
        );

        await Promise.all(
            subCrafts.map(async (subCraft) => {
                const { craft, craftLevel } = subCraft;

                return await SynthesisSubCraft.create(
                    {
                        synthesisId: synthesis.id,
                        craft,
                        craftLevel,
                    },
                    {
                        transaction,
                    }
                );
            })
        );

        await Promise.all(
            ingredients.map(async (ingredient) => {
                return await SynthesisIngredient.create(
                    {
                        synthesisId: synthesis.id,
                        itemId: ingredient.itemId,
                        quantity: ingredient.quantity,
                    },
                    {
                        transaction,
                    }
                );
            })
        );

        await transaction.commit();

        return synthesis;
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
};

export const updateSynthesis = async (
    id: string,
    input: SynthesisInput
): Promise<Synthesis | null> => {
    const {
        synthesis: {
            yield: synthYield,
            itemId,
            crystalItemId,
            craft,
            craftLevel,
        },
        subCrafts,
        ingredients,
    } = input;

    await validateInput(input);

    const transaction = await sequelize.transaction();

    try {
        await Synthesis.update(
            {
                yield: synthYield,
                itemId,
                crystalItemId,
                craft,
                craftLevel,
            },
            {
                where: {
                    id,
                },
                transaction,
            }
        );

        // easier to recreate sub crafts than to identify which ones to delete and which to update
        await SynthesisSubCraft.destroy({
            where: {
                synthesisId: id,
            },
            transaction,
        });

        await Promise.all(
            subCrafts.map(
                async (subCraft) =>
                    await SynthesisSubCraft.create(
                        {
                            synthesisId: parseInt(id),
                            craft: subCraft.craft,
                            craftLevel: subCraft.craftLevel,
                        },
                        {
                            transaction,
                        }
                    )
            )
        );

        // easier to recreate ingredients than to identify which ones to delete and which to update
        await SynthesisIngredient.destroy({
            where: {
                synthesisId: id,
            },
            transaction,
        });

        await Promise.all(
            ingredients.map(
                async (ingredient) =>
                    await SynthesisIngredient.create(
                        {
                            synthesisId: parseInt(id),
                            itemId: ingredient.itemId,
                            quantity: ingredient.quantity,
                        },
                        {
                            transaction,
                        }
                    )
            )
        );

        await transaction.commit();

        return await Synthesis.findByPk(id);
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
};
