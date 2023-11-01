import { Item } from './types';
import { PriceType } from './constants';

export const getUnitPrice = (item: Item): number => {
    if (item.price_type === PriceType.Single) {
        return item.price;
    }

    if (item.price_type === PriceType.Stack) {
        return Math.round(item.price / item.stack_size);
    }

    throw new Error(`do not recognize item.price_type ${item.price_type}`);
};
