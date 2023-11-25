import axios from 'axios';
import { useCallback, useState } from 'react';
import { type Synthesis } from '../interfaces';

interface SynthesisIngredientInput {
    itemId: string | number;
    quantity: number;
}

interface SynthesisInput {
    synthesis: Pick<Synthesis, 'yield' | 'craft' | 'craftLevel'> & {
        itemId: string | number;
        crystalItemId: string | number;
    };
    subCrafts: Omit<Synthesis['subCrafts'][0], 'id'>[];
    ingredients: SynthesisIngredientInput[];
}

interface UseSynthesis {
    getSyntheses: () => Promise<Synthesis[]>;
    getSynthesis: (id: string) => Promise<Synthesis>;
    createSynthesis: (input: SynthesisInput) => Promise<Synthesis>;
    updateSynthesis: (
        id: string | number,
        input: SynthesisInput
    ) => Promise<Synthesis>;
    loadingCreateSynthesis: boolean;
    loadingGetSynthesis: boolean;
}

const synthesisUrl = `${process.env.REACT_APP_API_URL}/synthesis`;

export const useSynthesis = (): UseSynthesis => {
    const [loadingCreateSynthesis, setLoadingCreateSynthesis] = useState(false);
    const [loadingGetSynthesis, setLoadingGetSynthesis] = useState(false);

    const getSyntheses = useCallback(async () => {
        const { data } = await axios.get(synthesisUrl);
        return data;
    }, []);

    const getSynthesis = useCallback(async (id: string) => {
        setLoadingGetSynthesis(true);
        const { data } = await axios.get(`${synthesisUrl}/${id}`);
        setLoadingGetSynthesis(false);
        return data;
    }, []);

    const createSynthesis = useCallback(async (input: SynthesisInput) => {
        setLoadingCreateSynthesis(true);
        const { data } = await axios.post(synthesisUrl, input);
        setLoadingCreateSynthesis(false);
        return data;
    }, []);

    const updateSynthesis = useCallback(
        async (id: string | number, input: SynthesisInput) => {
            setLoadingCreateSynthesis(true);
            const { data } = await axios.put(`${synthesisUrl}/${id}`, input);
            setLoadingCreateSynthesis(false);
            return data;
        },
        []
    );

    return {
        getSyntheses,
        getSynthesis,
        createSynthesis,
        updateSynthesis,
        loadingCreateSynthesis,
        loadingGetSynthesis,
    };
};
