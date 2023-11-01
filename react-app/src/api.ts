import axios from 'axios';
import { SynthesisRecipe } from './types';

export const getItems = async ({
    name,
    category,
}: { name?: string; category?: string } = {}) => {
    const {
        data: { items },
    } = await axios.get('/items', { params: { name, category } });
    return items;
};

export const getCrystals = async () => {
    const {
        data: { crystals },
    } = await axios.get('/items/crystals');
    return crystals;
};

export const getSynthesis = async (craft): Promise<SynthesisRecipe[]> => {
    const {
        data: { synthesis },
    } = await axios.get('/synthesis', { params: { craft } });
    return synthesis;
};

export const createItem = async (item) => {
    try {
        const {
            data: { createdItem },
        } = await axios.post('/items', { item });
        return createdItem;
    } catch (err) {
        const {
            response: {
                data: { error },
            },
        } = err;
        throw new Error(error);
    }
};

export const createSynthesis = async (
    synthesis,
    synthesisIngredients
): Promise<SynthesisRecipe> => {
    try {
        const {
            data: { createdSynthesis },
        } = await axios.post('/synthesis', { synthesis, synthesisIngredients });
        return createdSynthesis;
    } catch (err) {
        const {
            response: {
                data: { error },
            },
        } = err;
        throw new Error(error);
    }
};

export const updateItem = async (item) => {
    try {
        const {
            data: { updatedItem },
        } = await axios.put(`/items/${item.id}`, { item });
        return updatedItem;
    } catch (err) {
        const {
            response: {
                data: { error },
            },
        } = err;
        throw new Error(error);
    }
};

export const deleteItem = async (id) => {
    try {
        await axios.delete(`/items/${id}`);
    } catch (err) {
        const {
            response: {
                data: { error },
            },
        } = err;
        throw new Error(error);
    }
};

export const deleteSynthesis = async (id) => {
    try {
        await axios.delete(`/synthesis/${id}`);
    } catch (err) {
        const {
            response: {
                data: { error },
            },
        } = err;
        throw new Error(error);
    }
};
