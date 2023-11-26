import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import { useSynthesis } from './use-synthesis';
import { Synthesis } from '../interfaces';
import { SynthesisCard } from './SynthesisCard';
import { NavigateButton } from './NavigateButton';
import { useGet } from '../use-api';
import { CircularProgress } from '@mui/material';

export const Crafting = () => {
    const [syntheses, setSyntheses] = useState<Synthesis[]>([]);

    const { loading: loadingSyntheses, get: getSyntheses } =
        useGet<Synthesis[]>('/synthesis');

    useEffect(() => {
        (async () => {
            const synthesis = await getSyntheses();
            setSyntheses(synthesis);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <NavigateButton
                startIcon={<AddIcon />}
                navigateTo={'/synthesis/create'}
            >
                Add Synthesis
            </NavigateButton>
            {loadingSyntheses ? (
                <CircularProgress />
            ) : (
                <Grid container spacing={2}>
                    {syntheses.map((synth) => (
                        <Grid key={synth.id} item xs={4}>
                            <SynthesisCard synthesis={synth} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </>
    );
};
