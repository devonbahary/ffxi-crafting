import React, { useEffect, useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import CarpenterIcon from '@mui/icons-material/Carpenter';
import FilterNoneIcon from '@mui/icons-material/FilterNone';
import InsightsIcon from '@mui/icons-material/Insights';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useGetSynthesesByProfit } from '../hooks/use-synthesis';
import { Synthesis } from '../interfaces';
import { SynthesisCard } from '../crafting/SynthesisCard';
import { Button } from '@mui/material';
import { ViewTitle } from '../ViewTitle';

const SUBTITLE = (
    <>
        You've logged into Final Fantasy XI and you want to make money, but you
        don't know which Syntheses to craft in order to maximize your time and
        profits.
        <br />
        <ul>
            <li>
                Add Items and manage their prices at the{' '}
                <StorefrontIcon fontSize="small" /> Auction House.
            </li>
            <li>
                Construct Syntheses from those Items in{' '}
                <CarpenterIcon fontSize="small" /> Crafting.
            </li>
            <li>
                Visit this <InsightsIcon fontSize="small" /> Insights view to
                get a ranked list of the most profitable Syntheses and make
                crafting a no-brainer!{' '}
            </li>
        </ul>
    </>
);

const getByProfitFilterText = (
    byUnitProfit: boolean,
    byStackProfit: boolean
): string => {
    if (byUnitProfit && byStackProfit) {
        return 'Rank Syntheses based on outright profitability, whether you need to spend time making a stack of an Item or not.';
    }

    if (byUnitProfit) {
        return 'Rank Syntheses based only on individual Items to maximize time savings.';
    }

    return 'Rank Syntheses based only on their profitability as a stack.';
};

export const InsightsDashboard = () => {
    const [syntheses, setSyntheses] = useState<Synthesis[]>([]);
    const { loading, getSynthesesByProfit } = useGetSynthesesByProfit();

    const [byUnitProfit, setByUnitProfit] = useState(true);
    const [byStackProfit, setByStackProfit] = useState(true);

    const onByUnitProfitChange = () => {
        const updatedByUnitProfit = !byUnitProfit;

        if (!updatedByUnitProfit && !byStackProfit) {
            setByStackProfit(true);
        }

        setByUnitProfit(updatedByUnitProfit);
    };

    const onByStackProfitChange = () => {
        const updatedByStackProfit = !byStackProfit;

        if (!updatedByStackProfit && !byUnitProfit) {
            setByUnitProfit(true);
        }

        setByStackProfit(updatedByStackProfit);
    };

    useEffect(() => {
        (async () => {
            try {
                const syntheses = await getSynthesesByProfit({
                    byStackProfit,
                    byUnitProfit,
                });
                setSyntheses(syntheses);
            } catch (err) {}
        })();
    }, [byStackProfit, byUnitProfit, getSynthesesByProfit]);

    return (
        <Box>
            <ViewTitle
                Icon={InsightsIcon}
                title="Insights"
                subtitle={SUBTITLE}
            />
            <Typography variant="overline">Filters</Typography>
            <Box display="flex" gap={2} marginBottom={4} alignItems="center">
                <Button
                    startIcon={<FilterNoneIcon />}
                    onClick={onByUnitProfitChange}
                    variant={byUnitProfit ? 'contained' : 'outlined'}
                >
                    By Unit Profit
                </Button>
                <Button
                    startIcon={<AutoAwesomeMotionIcon />}
                    onClick={onByStackProfitChange}
                    variant={byStackProfit ? 'contained' : 'outlined'}
                >
                    By Stack Profit
                </Button>
                <Typography variant="subtitle1" color="text.secondary">
                    {getByProfitFilterText(byUnitProfit, byStackProfit)}
                </Typography>
            </Box>
            {loading ? (
                <Backdrop open>
                    <CircularProgress />
                </Backdrop>
            ) : (
                <Grid container spacing={2}>
                    {syntheses.map((synth) => (
                        <Grid key={synth.id} item xs={4}>
                            <SynthesisCard
                                synthesis={synth}
                                highlightProfit={
                                    byUnitProfit && byStackProfit
                                        ? 'both'
                                        : byUnitProfit
                                        ? 'unit'
                                        : 'stack'
                                }
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};
