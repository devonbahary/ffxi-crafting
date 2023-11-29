import { FC } from 'react';
import { Item } from '../../interfaces';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const ItemAndQuantityTypography: FC<{
    item: Item;
    quantity: number;
    secondary?: boolean;
}> = ({ item, quantity, secondary = false }) => (
    <Box>
        <Typography
            display="inline-block"
            marginRight={1}
            color={secondary ? 'text.secondary' : 'inherit'}
        >
            {item.name}
        </Typography>
        <Typography
            display="inline-block"
            color="text.secondary"
            variant="body2"
        >
            {secondary ? `x${quantity}` : `(x${quantity})`}
        </Typography>
    </Box>
);
