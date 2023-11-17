import axios from 'axios';
import { Item } from '../interfaces';

interface UseItems {
    getItems: () => Promise<Item[]>;
    createItem: (item: Item) => Promise<Item>;
    updateItem: (item: Item) => Promise<void>;
    deleteItem: (id: string | number) => Promise<void>;
}

const itemsUrl = `${process.env.REACT_APP_API_URL}/items`;

export const useItems = (): UseItems => {
    const getItems = async () => {
        const { data } = await axios.get(itemsUrl);
        return data;
    };

    const createItem = async (item: Item) => {
        const { data } = await axios.post(itemsUrl, item);
        return data;
    };

    const updateItem = async (item: Item) => {
        const { data } = await axios.put(`${itemsUrl}/${item.id}`, item);
        return data;
    };

    const deleteItem = async (id: string | number) => {
        const { data } = await axios.delete(`${itemsUrl}/${id}`);
        return data;
    };

    return {
        getItems,
        createItem,
        updateItem,
        deleteItem,
    };
};
