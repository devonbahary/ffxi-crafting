import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import { Synthesis } from '../interfaces';
import { SynthesisCard } from './SynthesisCard';
import { NavigateButton } from './NavigateButton';
import { MultiChipSelect } from '../inputs/ChipSelect';
import { CRAFT_OPTIONS } from '../inputs/input-options';
import { Craft } from '../enums';
import { useGetSyntheses } from '../hooks/use-synthesis';

export const Crafting = () => {
    const [syntheses, setSyntheses] = useState<Synthesis[]>([]);
    const [craftSet, setCraftSet] = useState<Set<Craft>>(new Set());

    const { loading: loadingGetSyntheses, getSyntheses } = useGetSyntheses();

    const handleDelete = (id: number | string) => {
        setSyntheses((prev) => prev.filter((synth) => synth.id !== id));
    };

    useEffect(() => {
        (async () => {
            const syntheses = await getSyntheses({
                crafts: Array.from(craftSet),
            });
            setSyntheses(syntheses);
        })();
    }, [craftSet, getSyntheses]);

    return (
        <>
            <NavigateButton
                startIcon={<AddIcon />}
                navigateTo={'/synthesis/create'}
            >
                Add Synthesis
            </NavigateButton>
            <Box marginBottom={2}>
                <MultiChipSelect
                    options={CRAFT_OPTIONS}
                    onChange={(crafts: Set<Craft>) => {
                        setCraftSet(crafts);
                    }}
                    value={craftSet}
                />
            </Box>
            {loadingGetSyntheses ? (
                <CircularProgress />
            ) : (
                <Grid container spacing={2}>
                    {syntheses.map((synth) => (
                        <Grid key={synth.id} item xs={4}>
                            <SynthesisCard
                                synthesis={synth}
                                onDelete={() => handleDelete(synth.id)}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
        </>
    );
};
