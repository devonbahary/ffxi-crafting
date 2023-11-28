import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import CarpenterIcon from '@mui/icons-material/Carpenter';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { Synthesis } from '../interfaces';
import { SynthesisCard } from './SynthesisCard';
import { NavigateButton } from './NavigateButton';
import { MultiChipSelect } from '../inputs/ChipSelect';
import { CRAFT_OPTIONS } from '../inputs/input-options';
import { Craft } from '../enums';
import { useGetSyntheses } from '../hooks/use-synthesis';
import { ViewTitle } from '../ViewTitle';
import { Typography } from '@mui/material';

const SUBTITLE = (
    <>
        Crafting is one of the most profitable ways to make money in FFXI.
        Crafting revolves around Synthesis, where different Items are combined
        to produce a potentially higher-value product Item.
        <br />
        <br />A Synthesis is composed of:
        <ul>
            <li>A crystal Item</li>
            <li>A list of Item ingredients, with varying quantities</li>
            <li>Some crafting skill level requirements</li>
            <li>A product Item, sometimes yielding multiple</li>
        </ul>
        The profitability of each Synthesis is based on the yielded amount of
        product Item, whether that Item sells better as a unit or a stack, and
        on the prices of its constituent Items as updated in the{' '}
        <StorefrontIcon fontSize="small" /> Auction House. As those Items are
        updated, the unit and stack profitability of each Synthesis will be
        automatically reflected.
    </>
);

export const Crafting = () => {
    const [syntheses, setSyntheses] = useState<Synthesis[]>([]);
    const [craftSet, setCraftSet] = useState<Set<Craft>>(new Set());

    const { loading: loadingGetSyntheses, getSyntheses } = useGetSyntheses();

    const handleDelete = (id: number | string) => {
        setSyntheses((prev) => prev.filter((synth) => synth.id !== id));
    };

    useEffect(() => {
        (async () => {
            try {
                const syntheses = await getSyntheses({
                    crafts: Array.from(craftSet),
                });
                setSyntheses(syntheses);
            } catch (err) {}
        })();
    }, [craftSet, getSyntheses]);

    return (
        <>
            <ViewTitle
                Icon={CarpenterIcon}
                title="Crafting"
                subtitle={SUBTITLE}
            />
            <Typography variant="overline">Filters</Typography>
            <Box marginBottom={4}>
                <MultiChipSelect
                    options={CRAFT_OPTIONS}
                    onChange={(crafts: Set<Craft>) => {
                        setCraftSet(crafts);
                    }}
                    value={craftSet}
                />
            </Box>
            <NavigateButton
                startIcon={<AddIcon />}
                navigateTo={'/synthesis/create'}
            >
                Add Synthesis
            </NavigateButton>
            {loadingGetSyntheses ? (
                <Backdrop open>
                    <CircularProgress />
                </Backdrop>
            ) : (
                <Grid container spacing={2}>
                    {syntheses.map((synth) => (
                        <Grid key={synth.id} item xs={4}>
                            <SynthesisCard
                                synthesis={synth}
                                onDelete={() => handleDelete(synth.id)}
                                includeCardActions
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
        </>
    );
};
