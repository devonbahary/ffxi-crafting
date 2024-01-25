import React, { FC, ReactNode } from 'react';
import Box from '@mui/material/Box';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

type ViewTitleProps = {
    Icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
        muiName: string;
    };
    title: string;
    subtitle: ReactNode;
};

export const ViewTitle: FC<ViewTitleProps> = ({ Icon, title, subtitle }) => {
    const theme = useTheme();

    return (
        <Box marginBottom={4}>
            <Box display="flex" gap={2} marginBottom={2}>
                <Icon
                    fontSize="large"
                    sx={{ color: theme.palette.primary.dark }}
                />
                <Typography variant="h4" sx={{ letterSpacing: 2 }}>
                    {title}
                </Typography>
            </Box>
            <Typography variant="subtitle1" color="text.secondary">
                {subtitle}
            </Typography>
        </Box>
    );
};
