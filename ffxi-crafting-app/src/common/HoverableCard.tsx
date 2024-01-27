import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';

export const HoverableCard = styled(Card)(({ theme }) => ({
    cursor: 'pointer',
    ':hover': {
        boxShadow: theme.shadows[20],
        transform: 'translate(0, -4px)',
    },
    transition: '0.2s ease-out',
}));
