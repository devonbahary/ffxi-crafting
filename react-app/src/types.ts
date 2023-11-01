import { Craft, Crystal } from './constants';

export type Item = {
    id: number;
    name: string;
    price: number;
    price_type: string;
    stack_size: number;
    updated_on: string;
};

export type SynthesisIngredient = {
    id: number;
    item_id: number;
    quantity: number;
    item: Item;
};

export type SynthesisRecipe = {
    synthesis: {
        id: number;
        craft: Craft;
        level: number;
        crystal: Crystal;
        yield: number;
        item: Item;
    };
    ingredients: SynthesisIngredient[];
};
