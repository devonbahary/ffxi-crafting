import React, { FC, useContext } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { ShoppingCartContext } from './ShoppingCartProvider';

export const ShoppingCartSummary: FC = (props) => {
    const { length, totalProfit } = useContext(ShoppingCartContext);

    const theme = useTheme();

    const shoppingCartColor = length ? 'text.primary' : 'text.secondary';

    const profitColor =
        totalProfit > 0
            ? theme.palette.success.main
            : totalProfit < 0
            ? theme.palette.error.main
            : theme.palette.text.secondary;

    return (
        <Stack direction={'row'} gap={2} {...props}>
            <ShoppingCartIcon sx={{ color: shoppingCartColor }} />
            <Typography color={shoppingCartColor}>{length}</Typography>
            <Box display="flex" alignItems="center">
                <AttachMoneyIcon sx={{ color: profitColor }} />
                <Typography display="inline-block" color={profitColor}>
                    {totalProfit > 0 ? '+' : ''}
                    {totalProfit}
                </Typography>
            </Box>
        </Stack>
    );
};
