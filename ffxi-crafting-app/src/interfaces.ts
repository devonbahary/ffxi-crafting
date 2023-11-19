import { Category, StackSize } from './auction-house/input-options';

export interface Item {
    id: string | number;
    name: string;
    category: Category;
    unitPrice: number;
    stackPrice: number;
    stackSize: StackSize;
    updatedAt: string;
}
