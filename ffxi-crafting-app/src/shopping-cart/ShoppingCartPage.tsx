import React, { FC, useContext, useMemo } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { ViewTitle } from '../ViewTitle';
import { NumberInput } from '../common/inputs/NumberInput';
import {
    AUCTION_HOUSE_ITEM_LIMIT,
    ShoppingCartContext,
    ShoppingCartInterface,
    ShoppingCartSynthesis,
} from './ShoppingCartProvider';
import { ItemAndQuantityTypography } from '../common/synthesis/ItemAndQuantityTypography';
import { HighlightableIconButton } from '../common/HighlightableIconButton';
import { ProfitChips } from '../common/synthesis/ProfitChips';
import { Item } from '../interfaces';

const SUBTITLE = <>This is the Shopping Cart page</>;

type ShoppingCartSummaryProps = {
    length: number;
    totalProfit: number;
};

const ShoppingCartSummary: FC<ShoppingCartSummaryProps> = ({
    length,
    totalProfit,
}) => {
    const theme = useTheme();

    const shoppingCartColor = length ? 'text.primary' : 'text.secondary';

    const profitColor =
        totalProfit > 0
            ? theme.palette.success.main
            : totalProfit < 0
            ? theme.palette.error.main
            : theme.palette.text.secondary;

    return (
        <Card>
            <CardContent>
                <Stack direction={'row'} gap={2}>
                    <ShoppingCartIcon sx={{ color: shoppingCartColor }} />
                    <Typography color={shoppingCartColor}>
                        {length} / {AUCTION_HOUSE_ITEM_LIMIT}
                    </Typography>
                    <Box display="flex" alignItems="center">
                        <AttachMoneyIcon sx={{ color: profitColor }} />
                        <Typography display="inline-block" color={profitColor}>
                            {totalProfit > 0 ? '+' : ''}
                            {totalProfit}
                        </Typography>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
};

type IngredientListProps = {
    shoppingCartSyntheses: ShoppingCartSynthesis[];
};

type IngredientQuantity = {
    item: Item;
    quantity: number;
};

const getIngredientList = (
    shoppingCartSyntheses: ShoppingCartSynthesis[]
): IngredientQuantity[] => {
    // get this map to easily retrieve item from itemId later
    const itemIdToItemMap = shoppingCartSyntheses.reduce(
        (acc, { synthesis }) => {
            return {
                ...acc,
                ...synthesis.ingredients.reduce(
                    (acc, { item }) => ({
                        ...acc,
                        // okay to overwrite keys in this way b/c their value Item will always be the same
                        [synthesis.crystal.id]: synthesis.crystal,
                        [item.id]: item,
                    }),
                    {}
                ),
            };
        },
        {} as Record<Item['id'], Item>
    );

    const itemIdToQuantityMap = shoppingCartSyntheses.reduce(
        (outerAcc, { synthesis, asStack, quantity: synthQuantity }) => {
            const { crystal } = synthesis;

            const existingCrystalQuantity = outerAcc[crystal.id] ?? 0;

            const synthRepeatsToGetToSynthQuantity = Math.ceil(
                (synthQuantity / synthesis.yield) *
                    (asStack ? parseInt(synthesis.product.stackSize) : 1)
            );

            return {
                ...outerAcc,
                [crystal.id]:
                    existingCrystalQuantity + synthRepeatsToGetToSynthQuantity,
                ...synthesis.ingredients.reduce(
                    (innerAcc, { item, quantity: ingredientQuantity }) => {
                        const existingQuantity =
                            (outerAcc[item.id] ?? 0) + (innerAcc[item.id] ?? 0);

                        return {
                            ...innerAcc,
                            [item.id]:
                                existingQuantity +
                                synthRepeatsToGetToSynthQuantity *
                                    ingredientQuantity,
                        };
                    },
                    {} as Record<Item['id'], number>
                ),
            };
        },
        {} as Record<Item['id'], number>
    );

    return Object.values(itemIdToItemMap).map((item: Item) => ({
        item,
        quantity: Math.ceil(itemIdToQuantityMap[item.id]),
    }));
};

const IngredientList: FC<IngredientListProps> = ({ shoppingCartSyntheses }) => {
    const ingredientList = useMemo(
        () => getIngredientList(shoppingCartSyntheses),
        [shoppingCartSyntheses]
    );

    return (
        <>
            <Typography variant="overline">Ingredient List</Typography>
            <Card>
                <CardContent>
                    <Stack divider={<Divider />} gap={2}>
                        {ingredientList.map(({ item, quantity }) => (
                            <Box key={item.id}>
                                <ItemAndQuantityTypography
                                    item={item}
                                    quantity={quantity}
                                />
                            </Box>
                        ))}
                    </Stack>
                </CardContent>
            </Card>
        </>
    );
};

type ShoppingCartSynthesesProps = Pick<
    ShoppingCartInterface,
    'length' | 'shoppingCartSyntheses' | 'updateQuantity' | 'removeFromCart'
>;

const ShoppingCartSyntheses: FC<ShoppingCartSynthesesProps> = ({
    length,
    shoppingCartSyntheses,
    updateQuantity,
    removeFromCart,
}) => {
    return (
        <>
            <Typography variant="overline">Syntheses</Typography>
            <Card>
                <CardContent>
                    {length ? (
                        <Stack divider={<Divider />} gap={2}>
                            {shoppingCartSyntheses.map(
                                ({ id, synthesis, quantity, asStack }) => {
                                    return (
                                        <Box
                                            key={id}
                                            sx={{
                                                position: 'relative',
                                                display: 'flex',
                                                gap: 2,
                                                alignItems: 'center',
                                            }}
                                        >
                                            <NumberInput
                                                onChange={(e) => {
                                                    updateQuantity(
                                                        id,
                                                        parseInt(e.target.value)
                                                    );
                                                }}
                                                value={quantity}
                                            />
                                            <ItemAndQuantityTypography
                                                item={synthesis.product}
                                                quantity={
                                                    asStack
                                                        ? parseInt(
                                                              synthesis.product
                                                                  .stackSize
                                                          )
                                                        : 1
                                                }
                                            />
                                            <Box
                                                display="flex"
                                                alignItems="center"
                                                position="absolute"
                                                right={0}
                                                gap={2}
                                            >
                                                <ProfitChips
                                                    synthesis={synthesis}
                                                    highlightProfit="both"
                                                />
                                                <HighlightableIconButton
                                                    onClick={() =>
                                                        removeFromCart(id)
                                                    }
                                                    Icon={DeleteIcon}
                                                />
                                            </Box>
                                        </Box>
                                    );
                                }
                            )}
                        </Stack>
                    ) : (
                        <Typography>Nothing in cart.</Typography>
                    )}
                </CardContent>
            </Card>
        </>
    );
};

export const ShoppingCartPage = () => {
    const {
        shoppingCartSyntheses,
        updateQuantity,
        length,
        removeFromCart,
        totalProfit,
        clearCart,
    } = useContext(ShoppingCartContext);

    const theme = useTheme();

    return (
        <>
            <ViewTitle
                title="Shopping Cart"
                Icon={ShoppingCartIcon}
                subtitle={SUBTITLE}
            />
            <Box
                position="relative"
                display="flex"
                flexDirection="row-reverse"
                marginBottom={2}
            >
                <ShoppingCartSummary
                    length={length}
                    totalProfit={totalProfit}
                />
            </Box>
            <ShoppingCartSyntheses
                shoppingCartSyntheses={shoppingCartSyntheses}
                length={length}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
            />
            <Box
                padding={`${theme.spacing(2)} 0`}
                display="flex"
                flexDirection="row-reverse"
            >
                <Button
                    onClick={() => clearCart()}
                    variant="outlined"
                    disabled={length === 0}
                >
                    Clear Cart
                </Button>
            </Box>
            {length ? (
                <IngredientList shoppingCartSyntheses={shoppingCartSyntheses} />
            ) : null}
        </>
    );
};
