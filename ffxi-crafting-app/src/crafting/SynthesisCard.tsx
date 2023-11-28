import React, { FC, MouseEvent, useState } from 'react';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import CardActions from '@mui/material/CardActions';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { SvgIconProps } from '@mui/material/SvgIcon';
import Typography, { TypographyProps } from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Item, Synthesis, SynthesisIngredient } from '../interfaces';
import { useDeleteSynthesis } from '../hooks/use-synthesis';
import { StackSize } from '../enums';

type SynthesisCardProps = {
    synthesis: Synthesis;
    onDelete?: () => void;
    includeCardActions?: boolean;
};

const GAIN_COLOR: TypographyProps['color'] = 'success.main';
const LOSS_COLOR: TypographyProps['color'] = 'error.light';
const SECONDARY_COLOR: TypographyProps['color'] = 'text.secondary';

const getStackUnitPrice = (item: Item): number => {
    return item.stackPrice / parseInt(item.stackSize);
};

const getStackUnitPriceText = (item: Item): string => {
    return `(${item.stackPrice} / ${item.stackSize})`;
};

const getIngredientQuantityCost = (ingredient: SynthesisIngredient): number => {
    return (
        (ingredient.item.stackPrice / parseInt(ingredient.item.stackSize)) *
        ingredient.quantity
    );
};

const formatGil = (val: number): number => Math.round(val);

const ItemAndQuantityTypography: FC<{
    item: Item;
    quantity: number;
    secondary?: boolean;
}> = ({ item, quantity, secondary = false }) => (
    <Box>
        <Typography
            display="inline-block"
            marginRight={1}
            color={secondary ? SECONDARY_COLOR : 'inherit'}
        >
            {item.name}
        </Typography>
        <Typography
            display="inline-block"
            color={SECONDARY_COLOR}
            variant="body2"
        >
            {secondary ? `x${quantity}` : `(x${quantity})`}
        </Typography>
    </Box>
);

const SynthesisInfo: FC<{ synthesis: Synthesis }> = ({ synthesis }) => {
    const { product, crystal, craft, craftLevel, subCrafts } = synthesis;

    return (
        <>
            <ItemAndQuantityTypography
                item={product}
                quantity={synthesis.yield}
            />
            <Box paddingLeft={1}>
                <Typography color={SECONDARY_COLOR}>{crystal.name}</Typography>
                <Box paddingLeft={1}>
                    <Typography display="inline-block">
                        {craft} {craftLevel}
                    </Typography>
                    {subCrafts.map((subCraft) => (
                        <Typography
                            key={subCraft.id}
                            display="inline-block"
                            color={SECONDARY_COLOR}
                        >
                            &nbsp;• {subCraft.craft} {subCraft.craftLevel}
                        </Typography>
                    ))}
                </Box>
            </Box>
        </>
    );
};

const SynthesisMonetaryBreakdown: FC<{
    synthesis: Synthesis;
    sellAsStack?: boolean;
}> = ({ synthesis, sellAsStack = false }) => {
    const { product, crystal } = synthesis;

    const repeatsToGetToStack =
        parseInt(synthesis.product.stackSize) / synthesis.yield;

    const crystalCost = sellAsStack
        ? repeatsToGetToStack * getStackUnitPrice(crystal)
        : getStackUnitPrice(crystal) / synthesis.yield;

    const profit = sellAsStack ? synthesis.stackProfit : synthesis.unitProfit;

    return (
        <>
            <Typography color={SECONDARY_COLOR} variant="subtitle2">
                {sellAsStack ? 'Stack Price' : 'Unit Price'}
            </Typography>
            <Grid container paddingLeft={1}>
                {/* Left-side column */}
                <Grid item flex={2}>
                    {/* Product */}
                    <ItemAndQuantityTypography
                        item={product}
                        quantity={sellAsStack ? parseInt(product.stackSize) : 1}
                    />
                    <Box paddingLeft={1}>
                        {/* Crystal */}
                        <ItemAndQuantityTypography
                            item={crystal}
                            quantity={sellAsStack ? repeatsToGetToStack : 1}
                            secondary
                        />
                        {/* Ingredients */}
                        {synthesis.ingredients.map((ingredient) => {
                            const quantity = sellAsStack
                                ? repeatsToGetToStack * ingredient.quantity
                                : ingredient.quantity;

                            return (
                                <ItemAndQuantityTypography
                                    key={ingredient.id}
                                    item={ingredient.item}
                                    quantity={quantity}
                                    secondary
                                />
                            );
                        })}
                    </Box>
                </Grid>
                {/* Right-side column */}
                <Grid item flex={1} textAlign="right">
                    {/* Product */}
                    <Typography color={GAIN_COLOR}>
                        +
                        {formatGil(
                            sellAsStack ? product.stackPrice : product.unitPrice
                        )}
                    </Typography>
                    {/* Crystal */}
                    <Box>
                        <Typography
                            display="inline-block"
                            color={SECONDARY_COLOR}
                            variant="body2"
                        >
                            {getStackUnitPriceText(crystal)}
                            {sellAsStack
                                ? ` x${repeatsToGetToStack}`
                                : synthesis.yield > 1
                                ? ` / ${synthesis.yield}`
                                : null}
                        </Typography>
                        &nbsp;
                        <Typography display="inline-block" color={LOSS_COLOR}>
                            -{formatGil(crystalCost)}
                        </Typography>
                    </Box>
                    {/* Ingredients */}
                    {synthesis.ingredients.map((ingredient) => {
                        const quantityToGetToProductStack =
                            repeatsToGetToStack * ingredient.quantity;
                        const costToProductStack =
                            quantityToGetToProductStack *
                            getStackUnitPrice(ingredient.item);

                        const unitPriceText = getStackUnitPriceText(
                            ingredient.item
                        );
                        const quantityToTargetSizeText =
                            sellAsStack && quantityToGetToProductStack > 1
                                ? ` x${quantityToGetToProductStack}`
                                : ingredient.quantity > 1
                                ? ` x${ingredient.quantity}`
                                : null;
                        const costText = `-${formatGil(
                            sellAsStack
                                ? costToProductStack
                                : getIngredientQuantityCost(ingredient) /
                                      synthesis.yield
                        )}`;

                        return (
                            <Box key={ingredient.id}>
                                <Typography
                                    display="inline-block"
                                    color={SECONDARY_COLOR}
                                    variant="body2"
                                >
                                    {unitPriceText}
                                    {quantityToTargetSizeText}
                                    {!sellAsStack && synthesis.yield > 1
                                        ? ` / ${synthesis.yield}`
                                        : null}
                                </Typography>
                                &nbsp;
                                <Typography
                                    display="inline-block"
                                    color={LOSS_COLOR}
                                >
                                    {costText}
                                </Typography>
                            </Box>
                        );
                    })}
                    {/* Profit */}
                    <Divider />
                    <Typography color={profit > 0 ? GAIN_COLOR : LOSS_COLOR}>
                        {profit >= 0 ? '+' : ''}
                        {formatGil(profit)}
                    </Typography>
                </Grid>
            </Grid>
        </>
    );
};

export const SynthesisCard: FC<SynthesisCardProps> = ({
    synthesis,
    onDelete,
    includeCardActions,
}) => {
    const [expanded, setExpanded] = useState(false);

    const navigate = useNavigate();

    const { loading: loadingDeleteSynthesis, deleteSynthesis } =
        useDeleteSynthesis();

    const handleEditSynthesis = (e: MouseEvent) => {
        e.stopPropagation();
        navigate(`/synthesis/edit/${synthesis.id}`);
    };

    const handleDeleteSynthesis = async (e: MouseEvent) => {
        e.stopPropagation();
        try {
            await deleteSynthesis(synthesis.id);
            if (onDelete) onDelete();
        } catch (err) {}
    };

    const { unitProfit, stackProfit } = synthesis;

    const unitProfitLabel =
        (unitProfit >= 0 ? '+' : '') + formatGil(unitProfit) + ' unit';
    const stackProfitLabel =
        (stackProfit >= 0 ? '+' : '') + formatGil(stackProfit) + ' stack';

    const actionIconProps: SvgIconProps = {
        color: 'disabled',
        sx: { ':hover': { color: 'inherit' } },
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
                <Grid container>
                    <Grid item flex={2}>
                        <SynthesisInfo synthesis={synthesis} />
                    </Grid>
                    <Grid item flex={1} position="relative">
                        <Stack
                            position="absolute"
                            right={0}
                            direction={'row'}
                            gap={1}
                        >
                            <Chip
                                label={unitProfitLabel}
                                color={unitProfit >= 0 ? 'success' : 'error'}
                                variant="outlined"
                            />
                            {isStackable && (
                                <Chip
                                    label={stackProfitLabel}
                                    color={
                                        stackProfit >= 0 ? 'success' : 'error'
                                    }
                                    variant="outlined"
                                />
                            )}
                        </Stack>
                    </Grid>
                </Grid>
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
                            <IconButton
                                onClick={handleEditSynthesis}
                                disabled={loadingDeleteSynthesis}
                            >
                                <EditIcon {...actionIconProps} />
                            </IconButton>
                            <IconButton
                                onClick={handleDeleteSynthesis}
                                disabled={loadingDeleteSynthesis}
                            >
                                {loadingDeleteSynthesis ? (
                                    <CircularProgress size={20} />
                                ) : (
                                    <DeleteIcon {...actionIconProps} />
                                )}
                            </IconButton>
                        </CardActions>
                    </>
                )}
            </Collapse>
        </Card>
    );
};
