import { type ValidationChain, body } from 'express-validator';
import { Category, Craft } from './enums';

const STACK_SIZES = [1, 12, 99];

export const isStackSize = (val: string | number): boolean => {
    if (!STACK_SIZES.includes(typeof val === 'string' ? parseInt(val) : val)) {
        throw new Error(`stack size must be one of ${STACK_SIZES.join(',')}`);
    }

    return true;
};

export const isCategory = (val: string): boolean => {
    if (!Object.values(Category).includes(val as Category)) {
        throw new Error(`${val} is not in enum Category`);
    }

    return true;
};

export const isCraft = (val: string): boolean => {
    if (!Object.values(Craft).includes(val as Craft)) {
        throw new Error(`${val} is not in enum Craft`);
    }

    return true;
};

export const createItemNameValidator = (): ValidationChain =>
    body('name').trim().notEmpty().withMessage('Name is required');

export const createItemCategoryValidator = (): ValidationChain =>
    body('category')
        .notEmpty()
        .withMessage('Category is required')
        .custom(isCategory);

export const createItemStackSizeValidator = (): ValidationChain =>
    body('stackSize').optional().custom(isStackSize);

export const createSynthesisYieldValidator = (): ValidationChain =>
    body('synthesis.yield').notEmpty().isInt({
        min: 1,
    });

export const createSynthesisItemValidator = (): ValidationChain =>
    body('synthesis.itemId').notEmpty().isInt();

export const createSynthesisCrystalValidator = (): ValidationChain =>
    body('synthesis.crystalItemId').notEmpty().isInt();

export const createSynthesisCraftValidator = (): ValidationChain =>
    body('synthesis.craft').notEmpty().custom(isCraft);

export const createSynthesisCraftLevelValidator = (): ValidationChain =>
    body('synthesis.craftLevel').notEmpty().isInt({
        min: 1,
    });

export const createSynthesisSubCraftsValidators = (): ValidationChain[] => [
    body('subCrafts').isArray(),
    body('subCrafts.*').isObject(),
    body('subCrafts.*.craft').notEmpty().custom(isCraft),
    body('subCrafts.*.craftLevel').notEmpty().isInt({ min: 1 }),
];

export const createSynthesisIngredientsValidators = (): ValidationChain[] => [
    body('ingredients').isArray({
        min: 1,
    }),
    body('ingredients.*').isObject(),
    body('ingredients.*.itemId').notEmpty().isInt(),
    body('ingredients.*.quantity').notEmpty().isInt({
        min: 1,
    }),
];
