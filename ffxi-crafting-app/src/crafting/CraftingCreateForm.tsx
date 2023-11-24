import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { NavigateButton } from './NavigateButton';

export const CraftingCreateForm = () => {
    return (
        <>
            <NavigateButton startIcon={<ArrowBackIcon />} navigateTo={-1}>
                Back
            </NavigateButton>
        </>
    );
};
