import axios from 'axios';
import { type Synthesis } from '../interfaces';

interface UseSynthesis {
    getSynthesis: () => Promise<Synthesis[]>;
}

const synthesisUrl = `${process.env.REACT_APP_API_URL}/synthesis`;

export const useSynthesis = (): UseSynthesis => {
    const getSynthesis = async () => {
        const { data } = await axios.get(synthesisUrl);
        return data;
    };

    return {
        getSynthesis,
    };
};
