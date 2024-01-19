import { Category, Craft, StackSize } from '../../enums';

export const CATEGORY_OPTIONS = Object.entries(Category)
    .map(([key, value]) => {
        const parts = value.split('.');
        return {
            value,
            label: parts[parts.length - 1],
        };
    })
    .sort((a, b) => (a.label > b.label ? 1 : -1));

export const STACK_SIZE_OPTIONS = Object.values(StackSize).map((val) => {
    return {
        value: parseInt(val),
        label: val,
    };
});

export const CRAFT_OPTIONS = Object.entries(Craft)
    .map(([key, value]) => {
        return {
            value,
            label: key,
        };
    })
    .sort((a, b) => (a.label > b.label ? 1 : -1));
