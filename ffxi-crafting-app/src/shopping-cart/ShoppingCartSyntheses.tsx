import React, { FC, useContext } from 'react';
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
import { ShoppingCartContext } from './ShoppingCartProvider';
import { NumberInput } from '../common/inputs/NumberInput';
import { ItemAndQuantityTypography } from '../common/synthesis/ItemAndQuantityTypography';
import { ProfitChips } from '../common/synthesis/ProfitChips';
import { HighlightableIconButton } from '../common/HighlightableIconButton';

const MEDIA_BREAKPOINT = 500;

export const ShoppingCartSyntheses: FC = () => {
    const {
        clearCart,
        length,
        shoppingCartSyntheses,
        updateQuantity,
        removeFromCart,
    } = useContext(ShoppingCartContext);

    const theme = useTheme();

    const [ref, { width }] = useElementSize();

    return length ? (
        <>
            <Card>
                <CardContent>
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
                                        ref={ref}
                                    >
                                        <NumberInput
                                            onChange={(e) => {
                                                updateQuantity(
                                                    id,
                                                    parseInt(e.target.value)
                                                );
                                            }}
                                            label="qty."
                                            value={quantity}
                                            condensed
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
                                            {width > MEDIA_BREAKPOINT && (
                                                <ProfitChips
                                                    synthesis={synthesis}
                                                    highlightProfit="both"
                                                />
                                            )}

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
