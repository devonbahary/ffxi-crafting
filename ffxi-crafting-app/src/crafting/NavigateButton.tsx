import React, { FC } from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import { To, useNavigate } from 'react-router';

type NavigateButtonProps = Pick<ButtonProps, 'children' | 'startIcon'> & {
    navigateTo: number | To;
};

export const NavigateButton: FC<NavigateButtonProps> = ({
    children,
    startIcon,
    navigateTo,
}) => {
    const navigate = useNavigate();

    return (
        <Button
            startIcon={startIcon}
            variant="outlined"
            // @ts-ignore
            onClick={() => navigate(navigateTo)}
            sx={{ marginBottom: 2 }}
        >
            {children}
        </Button>
    );
};
