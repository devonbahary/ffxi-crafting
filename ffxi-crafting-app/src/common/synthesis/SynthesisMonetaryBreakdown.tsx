import { FC } from 'react';
import { Item, Synthesis, SynthesisIngredient } from '../../interfaces';
import Typography, { TypographyProps } from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { ItemAndQuantityTypography } from './ItemAndQuantityTypography';
import Divider from '@mui/material/Divider';

const GAIN_COLOR: TypographyProps['color'] = 'success.main';
const LOSS_COLOR: TypographyProps['color'] = 'error.light';

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

export const SynthesisMonetaryBreakdown: FC<{
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
            <Typography color="text.secondary" variant="subtitle2">
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
                        +{sellAsStack ? product.stackPrice : product.unitPrice}
                    </Typography>
                    {/* Crystal */}
                    <Box>
                        <Typography
                            display="inline-block"
                            color="text.secondary"
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
                                    color="text.secondary"
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
