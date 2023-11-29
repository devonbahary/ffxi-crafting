import React, { FC, MouseEvent, useState } from 'react';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import CardActions from '@mui/material/CardActions';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Synthesis } from '../../interfaces';
import { StackSize } from '../../enums';
import { SynthesisMonetaryBreakdown } from './SynthesisMonetaryBreakdown';
import { ItemAndQuantityTypography } from './ItemAndQuantityTypography';
import { ProfitChips } from './ProfitChips';
import { HighlightableIconButton } from '../HighlightableIconButton';

type SynthesisCardProps = {
    synthesis: Synthesis;
    onDelete?: () => void;
    includeCardActions?: boolean;
    highlightProfit?: 'unit' | 'stack' | 'both';
};

const SynthesisInfo: FC<{ synthesis: Synthesis }> = ({ synthesis }) => {
    const { product, crystal, craft, craftLevel, subCrafts } = synthesis;

    return (
        <>
            <ItemAndQuantityTypography
                item={product}
                quantity={synthesis.yield}
            />
            <Box paddingLeft={1}>
                <Typography color="text.secondary">{crystal.name}</Typography>
                <Box paddingLeft={1}>
                    <Typography display="inline-block">
                        {craft} {craftLevel}
                    </Typography>
                    {subCrafts.map((subCraft) => (
                        <Typography
                            key={subCraft.id}
                            display="inline-block"
                            color="text.secondary"
                        >
                            &nbsp;• {subCraft.craft} {subCraft.craftLevel}
                        </Typography>
                    ))}
                </Box>
            </Box>
        </>
    );
};

export const SynthesisCard: FC<SynthesisCardProps> = ({
    synthesis,
    onDelete,
    includeCardActions,
    highlightProfit = 'both',
}) => {
    const [expanded, setExpanded] = useState(false);

    const navigate = useNavigate();

    const handleEditSynthesis = (e: MouseEvent) => {
        e.stopPropagation();
        navigate(`/synthesis/edit/${synthesis.id}`);
    };

    const handleDeleteSynthesis = async (e: MouseEvent) => {
        e.stopPropagation();
        try {
            if (onDelete) onDelete();
        } catch (err) {}
    };

    const isStackable =
        parseInt(synthesis.product.stackSize) !== parseInt(StackSize.One);

    return (
        <Card
            variant="elevation"
            onClick={() => setExpanded(!expanded)}
            sx={{
                cursor: 'pointer',
                userSelect: 'none',
                ':hover': { boxShadow: 20 },
            }}
        >
            <CardContent>
                <Box position="relative">
                    <SynthesisInfo synthesis={synthesis} />
                    <Stack
                        position="absolute"
                        top={0}
                        right={0}
                        direction={'row'}
                        gap={1}
                    >
                        <ProfitChips
                            synthesis={synthesis}
                            highlightProfit={highlightProfit}
                        />
                    </Stack>
                </Box>
            </CardContent>
            <Collapse in={expanded}>
                <Divider />
                <CardContent>
                    <SynthesisMonetaryBreakdown synthesis={synthesis} />
                    {isStackable && (
                        <SynthesisMonetaryBreakdown
                            synthesis={synthesis}
                            sellAsStack
                        />
                    )}
                </CardContent>
                {includeCardActions && (
                    <>
                        <Divider />
                        <CardActions sx={{ justifyContent: 'flex-end' }}>
                            <HighlightableIconButton
                                onClick={handleEditSynthesis}
                                Icon={EditIcon}
                            />
                            <HighlightableIconButton
                                onClick={handleDeleteSynthesis}
                                Icon={DeleteIcon}
                            />
                        </CardActions>
                    </>
                )}
            </Collapse>
        </Card>
    );
};
