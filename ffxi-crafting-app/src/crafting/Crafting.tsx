import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import { useSynthesis } from './use-synthesis';
import { Synthesis } from '../interfaces';
import { SynthesisCard } from './SynthesisCard';
import { NavigateButton } from './NavigateButton';

export const Crafting = () => {
    const [synthesis, setSynthesis] = useState<Synthesis[]>([]);

    const { getSynthesis } = useSynthesis();

    useEffect(() => {
        (async () => {
            const synthesis = await getSynthesis();
            setSynthesis(synthesis);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <NavigateButton
                startIcon={<AddIcon />}
                navigateTo={'/crafting/create'}
            >
                Add Synthesis
            </NavigateButton>
            <Grid container>
                {synthesis.map((synth) => (
                    <Grid key={synth.id} item xs={4}>
                        <SynthesisCard synthesis={synth} />
                    </Grid>
                ))}
            </Grid>
        </>
    );
};
