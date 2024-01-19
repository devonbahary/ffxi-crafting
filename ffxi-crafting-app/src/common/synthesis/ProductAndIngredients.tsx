import React, { FC } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import { ItemAndQuantityTypography } from './ItemAndQuantityTypography';
import { Synthesis } from '../../interfaces';
import { getRepeatsToStack } from './utility';

type ProductAndIngredientsProps = {
    synthesis: Synthesis;
    asStack: boolean;
    expanded: boolean;
};

export const ProductAndIngredients: FC<ProductAndIngredientsProps> = ({
    synthesis,
    asStack,
    expanded,
}) => {
    const repeatsToStack = getRepeatsToStack(synthesis);

    return (
        <>
            <ItemAndQuantityTypography
                item={synthesis.product}
                quantity={asStack ? parseInt(synthesis.product.stackSize) : 1}
            />
            <Collapse in={expanded}>
                <Box paddingLeft={1}>
                    <ItemAndQuantityTypography
                        item={synthesis.crystal}
                        quantity={asStack ? repeatsToStack : 1}
                        secondary
                    />
                    {synthesis.ingredients.map((ingredient) => {
                        const quantity = asStack
                            ? repeatsToStack * ingredient.quantity
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
            </Collapse>
        </>
    );
};
