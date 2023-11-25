import axios from 'axios';
import { useCallback, useState } from 'react';
import { type Synthesis } from '../interfaces';

interface CreateSynthesisIngredient {
    itemId: string | number;
    quantity: number;
}

interface CreateSynthesis {
    synthesis: Pick<Synthesis, 'yield' | 'craft' | 'craftLevel'> & {
        itemId: string | number;
        crystalItemId: string | number;
    };
    subCrafts: Omit<Synthesis['subCrafts'][0], 'id'>[];
    ingredients: CreateSynthesisIngredient[];
}

interface UseSynthesis {
    getSynthesis: () => Promise<Synthesis[]>;
    createSynthesis: (synthesis: CreateSynthesis) => Promise<Synthesis>;
    loadingCreateSynthesis: boolean;
}

const synthesisUrl = `${process.env.REACT_APP_API_URL}/synthesis`;

export const useSynthesis = (): UseSynthesis => {
    const [loadingCreateSynthesis, setLoadingCreateSynthesis] = useState(false);

    const getSynthesis = useCallback(async () => {
        const { data } = await axios.get(synthesisUrl);
        return data;
    }, []);

    const createSynthesis = useCallback(async (synthesis: CreateSynthesis) => {
        setLoadingCreateSynthesis(true);
        const { data } = await axios.post(synthesisUrl, synthesis);
        setLoadingCreateSynthesis(false);
        return data;
    }, []);

    return {
        getSynthesis,
        createSynthesis,
        loadingCreateSynthesis,
    };
};
