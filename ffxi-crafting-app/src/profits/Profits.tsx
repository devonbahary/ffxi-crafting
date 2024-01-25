import React, { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import FilterNoneIcon from '@mui/icons-material/FilterNone';
import InsightsIcon from '@mui/icons-material/Insights';
import { useGetSynthesesByProfit } from '../hooks/use-synthesis';
import { Synthesis } from '../interfaces';
import { SynthesisCard } from '../common/synthesis/SynthesisCard';
import { ViewTitle } from '../ViewTitle';
import { GridLayout } from '../common/GridLayout';
import { ProfitChipHelpText } from '../common/ProfitChipHelpText';

export const DESCRIPTION =
    'View crafted items ranked by profitability and see the profit breakdown.';

const SUBTITLE = (
    <>
        {DESCRIPTION}
        <br />
        <br />
        <ProfitChipHelpText />
    </>
);

const getByProfitFilterText = (
    byUnitProfit: boolean,
    byStackProfit: boolean
): string => {
    if (byUnitProfit && byStackProfit) {
        return 'Rank by either unit or stack profit.';
    }

    if (byUnitProfit) {
        return 'Rank only by unit profit.';
    }

    return 'Rank only by stack profit.';
};

export const Profits = () => {
    const [syntheses, setSyntheses] = useState<Synthesis[]>([]);
    const { loading, getSynthesesByProfit } = useGetSynthesesByProfit();

    const [byUnitProfit, setByUnitProfit] = useLocalStorage(
        'Profits.byUnitProfit',
        true
    );
    const [byStackProfit, setByStackProfit] = useLocalStorage(
        'Profits.byStackProfit',
        true
    );

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
                title="Profits"
                subtitle={SUBTITLE}
            />
            <Typography variant="overline">Filters</Typography>
            <Box display="flex" gap={2} marginBottom={4} alignItems="center">
                <Button
                    startIcon={<FilterNoneIcon />}
                    onClick={onByUnitProfitChange}
                    variant={byUnitProfit ? 'contained' : 'outlined'}
                    sx={{
                        whiteSpace: 'nowrap',
                    }}
                >
                    By Unit Profit
                </Button>
                <Button
                    startIcon={<AutoAwesomeMotionIcon />}
                    onClick={onByStackProfitChange}
                    variant={byStackProfit ? 'contained' : 'outlined'}
                    sx={{
                        whiteSpace: 'nowrap',
                    }}
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
                <GridLayout
                    iterable={syntheses}
                    renderItem={(synthesis) => (
                        <SynthesisCard
                            synthesis={synthesis}
                            highlightProfit={
                                byUnitProfit && byStackProfit
                                    ? 'both'
                                    : byUnitProfit
                                    ? 'unit'
                                    : 'stack'
                            }
                        />
                    )}
                />
            )}
        </Box>
    );
};
