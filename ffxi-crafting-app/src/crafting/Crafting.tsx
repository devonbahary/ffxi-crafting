import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import { useSynthesis } from './use-synthesis';
import { Synthesis } from '../interfaces';
import { SynthesisCard } from './SynthesisCard';
import { NavigateButton } from './NavigateButton';

export const Crafting = () => {
    const [syntheses, setSyntheses] = useState<Synthesis[]>([]);

    const { getSyntheses } = useSynthesis();

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
            <Grid container>
                {syntheses.map((synth) => (
                    <Grid key={synth.id} item xs={4}>
                        <SynthesisCard synthesis={synth} />
                    </Grid>
                ))}
            </Grid>
        </>
    );
};
