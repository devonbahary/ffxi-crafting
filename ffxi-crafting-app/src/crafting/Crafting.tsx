import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import CarpenterIcon from '@mui/icons-material/Carpenter';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Synthesis } from '../interfaces';
import { SynthesisCard } from '../common/synthesis/SynthesisCard';
import { NavigateButton } from './NavigateButton';
import { MultiChipSelect } from '../common/inputs/ChipSelect';
import { CRAFT_OPTIONS } from '../common/inputs/input-options';
import { Craft } from '../enums';
import { useDeleteSynthesis, useGetSyntheses } from '../hooks/use-synthesis';
import { ViewTitle } from '../ViewTitle';
import { DeleteConfirmationModal } from '../common/DeleteConfirmationModal';
import { DebouncedSearchInput } from '../auction-house/DebouncedSearchInput';
import { GridLayout } from '../common/GridLayout';
import { ProfitChipHelpText } from '../common/ProfitChipHelpText';

export const DESCRIPTION =
    'Manage the available crafted items (called Syntheses) and their ingredients.';

const SUBTITLE = (
    <>
        {DESCRIPTION}
        <br />
        <br />
        Expand a Synthesis card to view its ingredients, profit breakdown, and
        use <EditIcon fontSize="small" /> and <DeleteIcon fontSize="small" /> to
        edit.
        <br />
        <br />
        <ProfitChipHelpText />
    </>
);

export const Crafting = () => {
    const [syntheses, setSyntheses] = useState<Synthesis[]>([]);
    const [craftSet, setCraftSet] = useState<Set<Craft>>(new Set());
    const [pendingDeleteSynthesis, setPendingDeleteSynthesis] =
        useState<Synthesis | null>(null);

    const [searchText, setSearchText] = useState('');

    const { loading: loadingDeleteSynthesis, deleteSynthesis } =
        useDeleteSynthesis();

    const { loading: loadingGetSyntheses, getSyntheses } = useGetSyntheses();

    const handleDelete = async () => {
        if (!pendingDeleteSynthesis) return;
        try {
            await deleteSynthesis(pendingDeleteSynthesis.id);
            setSyntheses((prev) =>
                prev.filter((synth) => synth.id !== pendingDeleteSynthesis.id)
            );
            setPendingDeleteSynthesis(null);
        } catch (err) {}
    };

    const handleCloseDeleteModal = () => {
        if (!loadingDeleteSynthesis) setPendingDeleteSynthesis(null);
    };

    useEffect(() => {
        (async () => {
            try {
                const syntheses = await getSyntheses({
                    productName: searchText.length ? searchText : undefined,
                    crafts: Array.from(craftSet),
                });
                setSyntheses(syntheses);
            } catch (err) {}
        })();
    }, [craftSet, getSyntheses, searchText]);

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
            <Box marginBottom={2}>
                <DebouncedSearchInput onChange={setSearchText} />
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
                <GridLayout
                    iterable={syntheses}
                    renderItem={(synthesis) => (
                        <SynthesisCard
                            synthesis={synthesis}
                            onDelete={() =>
                                setPendingDeleteSynthesis(synthesis)
                            }
                            includeCardActions
                        />
                    )}
                />
            )}
            <DeleteConfirmationModal
                onClose={handleCloseDeleteModal}
                onConfirm={() => handleDelete()}
                loading={loadingDeleteSynthesis}
                pendingDeleteItem={pendingDeleteSynthesis?.product}
            />
        </>
    );
};
