import { Category, Craft, StackSize } from './enums';

interface Record {
    id: string | number;
}

export interface Item extends Record {
    name: string;
    category: Category;
    unitPrice: number;
    stackPrice: number;
    stackSize: StackSize;
    updatedAt: string;
}

interface Crafting {
    craft: Craft;
    craftLevel: number;
}

export interface SubCraft extends Record, Crafting {}

export interface Synthesis extends Record, Crafting {
    product: Item;
    yield: number;
    subCrafts: SubCraft[];
    crystal: Item;
    updatedAt: string;
    ingredients: SynthesisIngredient[];
}

export interface SynthesisIngredient extends Record {
    item: Item;
    quantity: number;
}

export interface Loading {
    loading: boolean;
}
