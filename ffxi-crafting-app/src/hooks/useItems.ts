import { useCallback, useContext } from 'react';
import { Item, Loading } from '../interfaces';
import { useDelete, useGet, usePost, usePut } from './useApi';
import { Category } from '../enums';
import { ShoppingCartContext } from '../shopping-cart/ShoppingCartProvider';

export type GetItemsSearchParams = {
    name?: string;
    excludeCategory?: Category;
    categories?: Category[];
    limit?: number;
    offset?: number;
    sort?: string[];
};

type GetItemsResponse = {
    items: Item[];
    count: number;
};

type UseGetItems = Loading & {
    getItems: (params?: GetItemsSearchParams) => Promise<GetItemsResponse>;
};

type UseCreateItem = Loading & {
    createItem: (input: Item) => Promise<Item>;
};

type UseUpdateItem = Loading & {
    updateItem: (id: string | number, input: Item) => Promise<Item>;
};

type UseDeleteItem = Loading & {
    deleteItem: (id: string | number) => Promise<void>;
};

const ITEMS_URL = '/items';

export const useGetItems = (): UseGetItems => {
    const { loading, get } = useGet<GetItemsResponse>(ITEMS_URL, {
        failureMessage: 'Failed to load items',
    });

    return { loading, getItems: get };
};

export const useCreateItem = (): UseCreateItem => {
    const { loading, post } = usePost<Item, Item>(ITEMS_URL, {
        successMessage: 'Created item',
        failureMessage: 'Failed to create item',
    });

    return {
        loading,
        createItem: post,
    };
};

export const useUpdateItem = (): UseUpdateItem => {
    const { loading, put } = usePut<Item, Item>(ITEMS_URL, {
        successMessage: 'Updated item',
        failureMessage: 'Failed to update item',
    });

    const { refetchSyntheses } = useContext(ShoppingCartContext);

    const updateItem = useCallback(
        async (id: string | number, input: Item) => {
            const item = await put(id, input);
            refetchSyntheses(); // expect synthesis profits to update as a side effect of item update
            return item;
        },
        [refetchSyntheses, put]
    );

    return {
        loading,
        updateItem,
    };
};

export const useDeleteItem = (): UseDeleteItem => {
    const { loading, delete: deleteFn } = useDelete(ITEMS_URL, {
        successMessage: 'Deleted item',
        failureMessage: 'Failed to delete item',
    });

    return {
        loading,
        deleteItem: deleteFn,
    };
};
