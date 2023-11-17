import { type ValidationChain, body } from 'express-validator';
import { Category } from './models/Item';

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

export const createItemNameValidator = (): ValidationChain =>
    body('name').trim().notEmpty().withMessage('Name is required');

export const createItemCategoryValidator = (): ValidationChain =>
    body('category')
        .notEmpty()
        .withMessage('Category is required')
        .custom(isCategory);

export const createItemStackSizeValidator = (): ValidationChain =>
    body('stackSize').optional().custom(isStackSize);
