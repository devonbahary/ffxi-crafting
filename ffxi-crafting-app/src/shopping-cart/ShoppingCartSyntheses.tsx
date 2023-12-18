import React, { FC, useContext, useState } from 'react';
import { useElementSize } from 'usehooks-ts';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    ShoppingCartContext,
    ShoppingCartSynthesis as ShoppingCartSynthesisI,
} from './ShoppingCartProvider';
import { NumberInput } from '../common/inputs/NumberInput';
import { ProfitChips } from '../common/synthesis/ProfitChips';
import { HighlightableIconButton } from '../common/HighlightableIconButton';
import { ProductAndIngredients } from '../common/synthesis/ProductAndIngredients';

const MEDIA_BREAKPOINT = 500;

type ShoppingCartSynthesisProps = {
    shoppingCartSynthesis: ShoppingCartSynthesisI;
    onClick: () => void;
    expanded: boolean;
    variant: 'mini' | 'large';
};

const ShoppingCartSynthesis: FC<ShoppingCartSynthesisProps> = ({
    shoppingCartSynthesis: { id, synthesis, quantity, asStack },
    onClick,
    expanded,
    variant,
}) => {
    const { updateQuantity, removeFromCart } = useContext(ShoppingCartContext);

    return (
        <Box position="relative" display="flex" gap={2} alignItems="stretch">
            <Box display="flex" alignItems="center">
                <NumberInput
                    onChange={(e) => {
                        const qty = parseInt(e.target.value);
                        if (qty >= 0) {
                            updateQuantity(id, qty);
                        }
                    }}
                    label="qty."
                    value={quantity}
                    condensed
                />
            </Box>
            <Box
                onClick={variant === 'large' ? onClick : undefined}
                display="flex"
                flex={1}
                alignItems="center"
                sx={{
                    cursor: variant === 'large' ? 'pointer' : undefined,
                }}
            >
                <Stack>
                    <ProductAndIngredients
                        synthesis={synthesis}
                        asStack={asStack}
                        expanded={expanded}
                    />
                </Stack>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
                {variant === 'large' && (
                    <ProfitChips synthesis={synthesis} highlightProfit="both" />
                )}

                <HighlightableIconButton
                    onClick={() => removeFromCart(id)}
                    Icon={DeleteIcon}
                />
            </Box>
        </Box>
    );
};

export const ShoppingCartSyntheses: FC = () => {
    const { clearCart, length, shoppingCartSyntheses } =
        useContext(ShoppingCartContext);

    const [selectedId, setSelectedId] = useState<string | null>(null);

    const onSelect = (id: string) => {
        if (id === selectedId) {
            setSelectedId(null);
        } else {
            setSelectedId(id);
        }
    };

    const [ref, { width }] = useElementSize();

    const theme = useTheme();

    return length ? (
        <>
            <Card ref={ref}>
                <CardContent>
                    <Stack divider={<Divider />} gap={2}>
                        {shoppingCartSyntheses.map((scs) => (
                            <ShoppingCartSynthesis
                                key={scs.id}
                                shoppingCartSynthesis={scs}
                                expanded={selectedId === scs.id}
                                onClick={() => onSelect(scs.id)}
                                variant={
                                    width > MEDIA_BREAKPOINT ? 'large' : 'mini'
                                }
                            />
                        ))}
                    </Stack>
                </CardContent>
            </Card>
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
        </>
    ) : (
        <Card>
            <CardContent>
                <Typography>Nothing in cart.</Typography>
            </CardContent>
        </Card>
    );
};
