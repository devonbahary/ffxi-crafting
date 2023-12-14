import React, { FC, useContext, useMemo } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { ViewTitle } from '../ViewTitle';
import {
    ShoppingCartContext,
    ShoppingCartSynthesis,
} from './ShoppingCartProvider';
import { ItemAndQuantityTypography } from '../common/synthesis/ItemAndQuantityTypography';
import { Item } from '../interfaces';
import { ShoppingCartSyntheses } from './ShoppingCartSyntheses';
import { ShoppingCartSummary } from './ShoppingCartSummary';

const SUBTITLE = <>This is the Shopping Cart page</>;

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

export const ShoppingCart = () => {
    const { shoppingCartSyntheses, length } = useContext(ShoppingCartContext);

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
                <Card>
                    <CardContent>
                        <ShoppingCartSummary />
                    </CardContent>
                </Card>
            </Box>
            <Typography variant="overline">Syntheses</Typography>
            <ShoppingCartSyntheses />
            {length ? (
                <IngredientList shoppingCartSyntheses={shoppingCartSyntheses} />
            ) : null}
        </>
    );
};
