import { Craft } from '../enums';
import { Loading, Synthesis } from '../interfaces';
import { useDelete, useGet, useGetId, usePost, usePut } from './use-api';

const SYNTHESIS_URL = '/synthesis';

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

type GetSynthesisSearchParams = {
    crafts?: Craft[];
};

type UseGetSyntheses = Loading & {
    getSyntheses: (params?: GetSynthesisSearchParams) => Promise<Synthesis[]>;
};

type UseGetSynthesis = Loading & {
    getSynthesis: (id: string | number) => Promise<Synthesis>;
};

type UseCreateSynthesis = Loading & {
    createSynthesis: (input: SynthesisInput) => Promise<Synthesis>;
};

type UseUpdateSynthesis = Loading & {
    updateSynthesis: (
        id: string | number,
        input: SynthesisInput
    ) => Promise<Synthesis>;
};

type UseDeleteSynthesis = Loading & {
    deleteSynthesis: (id: string | number) => Promise<void>;
};

export const useGetSyntheses = (): UseGetSyntheses => {
    const { loading, get } = useGet<Synthesis[]>(SYNTHESIS_URL, {
        failureMessage: 'Failed to load items',
    });

    return { loading, getSyntheses: get };
};

export const useGetSynthesis = (): UseGetSynthesis => {
    const { loading, getId } = useGetId<Synthesis>(SYNTHESIS_URL, {
        failureMessage: 'Failed to load item',
    });

    return { loading, getSynthesis: getId };
};

export const useCreateSynthesis = (): UseCreateSynthesis => {
    const { loading, post } = usePost<Synthesis, SynthesisInput>(
        SYNTHESIS_URL,
        {
            successMessage: 'Created synthesis',
            failureMessage: 'Failed to create synthesis',
        }
    );

    return { loading, createSynthesis: post };
};

export const useUpdateSynthesis = (): UseUpdateSynthesis => {
    const { loading, put } = usePut<Synthesis, SynthesisInput>(SYNTHESIS_URL, {
        successMessage: 'Updated synthesis',
        failureMessage: 'Failed to update synthesis',
    });

    return {
        loading,
        updateSynthesis: put,
    };
};

export const useDeleteSynthesis = (): UseDeleteSynthesis => {
    const { loading, delete: deleteFn } = useDelete(SYNTHESIS_URL, {
        successMessage: 'Deleted synthesis',
        failureMessage: 'Failed to delete synthesis',
    });

    return {
        loading,
        deleteSynthesis: deleteFn,
    };
};
