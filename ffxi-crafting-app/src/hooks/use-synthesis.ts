import { Craft } from '../enums';
import { Loading, Synthesis } from '../interfaces';
import { useGet } from './use-api';

const SYNTHESIS_URL = '/synthesis';

type GetSynthesisSearchParams = {
    crafts?: Craft[];
};

type UseGetSyntheses = Loading & {
    getSyntheses: (params?: GetSynthesisSearchParams) => Promise<Synthesis[]>;
};

export const useGetSyntheses = (): UseGetSyntheses => {
    const { loading, get } = useGet<Synthesis[]>(SYNTHESIS_URL, {
        failureMessage: 'Failed to load items',
    });
    return { loading, getSyntheses: get };
};
