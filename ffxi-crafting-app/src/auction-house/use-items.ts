import axios from 'axios';
import { useCallback, useState } from 'react';
import { Item } from '../interfaces';
import { Category } from '../enums';

export type GetItemsSearchParams = {
    name?: string;
    excludeCategory?: Category;
    categories?: Category[];
};

interface UseItems {
    getItems: (params: GetItemsSearchParams) => Promise<Item[]>;
    loadingGetItems: boolean;
    createItem: (item: Item) => Promise<Item>;
    updateItem: (item: Item) => Promise<void>;
    deleteItem: (id: string | number) => Promise<void>;
}

const itemsUrl = `${process.env.REACT_APP_API_URL}/items`;

const getGetItemsQueryParams = (params: GetItemsSearchParams): string => {
    const queryParams = Object.entries(params).reduce<string[]>(
        (acc, [key, val]) => {
            if (Array.isArray(val)) {
                return [...acc, ...val.map((val) => `${key}=${val}`)];
            } else {
                return [...acc, `${key}=${val}`];
            }
        },
        []
    );

    return queryParams ? `?${queryParams.join('&')}` : '';
};

export const useItems = (): UseItems => {
    const [loadingGetItems, setLoadingGetItems] = useState(false);

    const getItems = useCallback(async (params: GetItemsSearchParams) => {
        const url = itemsUrl + getGetItemsQueryParams(params);

        setLoadingGetItems(true);
        const { data } = await axios.get(url);
        setLoadingGetItems(false);

        return data;
    }, []);

    const createItem = useCallback(async (item: Item) => {
        const { data } = await axios.post(itemsUrl, item);
        return data;
    }, []);

    const updateItem = useCallback(async (item: Item) => {
        const { data } = await axios.put(`${itemsUrl}/${item.id}`, item);
        return data;
    }, []);

    const deleteItem = useCallback(async (id: string | number) => {
        const { data } = await axios.delete(`${itemsUrl}/${id}`);
        return data;
    }, []);

    return {
        getItems,
        loadingGetItems,
        createItem,
        updateItem,
        deleteItem,
    };
};
