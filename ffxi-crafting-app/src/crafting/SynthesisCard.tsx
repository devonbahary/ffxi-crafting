import React, { FC, useState } from 'react';
import Typography, { TypographyProps } from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { CardActions, IconButton, SvgIconProps } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Item, Synthesis, SynthesisIngredient } from '../interfaces';

type SynthesisCardProps = {
    synthesis: Synthesis;
};

const GAIN_COLOR: TypographyProps['color'] = 'success.main';
const LOSS_COLOR: TypographyProps['color'] = 'error.light';
const SECONDARY_COLOR: TypographyProps['color'] = 'text.secondary';

const getStackUnitPrice = (item: Item): number => {
    return item.stackPrice / parseInt(item.stackSize);
};

const getIngredientQuantityCost = (ingredient: SynthesisIngredient): number => {
    return (
        (ingredient.item.stackPrice / parseInt(ingredient.item.stackSize)) *
        ingredient.quantity
    );
};

const getSynthesisProfit = (
    synthesis: Synthesis,
    sellAsStack: boolean
): number => {
    const crystalCost = getStackUnitPrice(synthesis.crystal);

    const ingredientsCost = synthesis.ingredients.reduce((acc, ingredient) => {
        return acc + getIngredientQuantityCost(ingredient);
    }, 0);

    if (sellAsStack) {
        const repeatsToGetToStack =
            parseInt(synthesis.product.stackSize) / synthesis.yield;

        const costToStack =
            repeatsToGetToStack * (crystalCost + ingredientsCost);

        return synthesis.product.stackPrice - costToStack;
    }

    const revenue = synthesis.product.unitPrice * synthesis.yield;
    return revenue - crystalCost - ingredientsCost;
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

const SynthesisInfo: FC<{ synthesis: Synthesis; expanded: boolean }> = ({
    synthesis,
    expanded,
}) => {
    const { product, crystal, craft, craftLevel, subCrafts } = synthesis;

    return (
        <>
            <ItemAndQuantityTypography
                item={product}
                quantity={synthesis.yield}
            />
            <Box paddingLeft={1}>
                <Typography color={SECONDARY_COLOR}>{crystal.name}</Typography>
                <Collapse in={expanded}>
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
                </Collapse>
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
        : getStackUnitPrice(crystal);

    const profit = getSynthesisProfit(synthesis, sellAsStack);

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
                            quantity={
                                sellAsStack ? parseInt(crystal.stackSize) : 1
                            }
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
                            ({crystal.stackPrice} / {crystal.stackSize})
                            {sellAsStack ? ` x${repeatsToGetToStack}` : null}
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

                        const unitPriceText = `(${ingredient.item.stackPrice} / ${ingredient.item.stackSize})`;
                        const quantityToStackText =
                            sellAsStack && quantityToGetToProductStack > 1
                                ? ` x${quantityToGetToProductStack}`
                                : null;
                        const costText = `-${formatGil(
                            sellAsStack
                                ? costToProductStack
                                : getIngredientQuantityCost(ingredient)
                        )}`;

                        return (
                            <Box key={ingredient.id}>
                                <Typography
                                    display="inline-block"
                                    color={SECONDARY_COLOR}
                                    variant="body2"
                                >
                                    {unitPriceText}
                                    {quantityToStackText}
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

export const SynthesisCard: FC<SynthesisCardProps> = ({ synthesis }) => {
    const [expanded, setExpanded] = useState(false);

    const unitProfit = getSynthesisProfit(synthesis, false);
    const stackProfit = getSynthesisProfit(synthesis, true);

    const unitProfitLabel =
        (unitProfit >= 0 ? '+' : '') + formatGil(unitProfit) + ' unit';
    const stackProfitLabel =
        (stackProfit >= 0 ? '+' : '') + formatGil(stackProfit) + ' stack';

    const actionIconProps: SvgIconProps = {
        color: 'disabled',
        sx: { ':hover': { color: 'inherit' } },
    };

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
                        <SynthesisInfo
                            synthesis={synthesis}
                            expanded={expanded}
                        />
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
                            <Chip
                                label={stackProfitLabel}
                                color={stackProfit >= 0 ? 'success' : 'error'}
                                variant="outlined"
                            />
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
            <Collapse in={expanded}>
                <Divider />
                <CardContent>
                    <SynthesisMonetaryBreakdown synthesis={synthesis} />
                    <SynthesisMonetaryBreakdown
                        synthesis={synthesis}
                        sellAsStack
                    />
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <IconButton>
                        <EditIcon {...actionIconProps} />
                    </IconButton>
                    <IconButton>
                        <DeleteIcon {...actionIconProps} />
                    </IconButton>
                </CardActions>
            </Collapse>
        </Card>
    );
};
