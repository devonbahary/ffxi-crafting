import React, { FC, ReactNode, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import { styled, useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type ViewTitleProps = {
    Icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
        muiName: string;
    };
    title: string;
    subtitle: ReactNode;
};

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

export const ViewTitle: FC<ViewTitleProps> = ({ Icon, title, subtitle }) => {
    const [openSubtitle, setOpenSubtitle] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        const timeout = setTimeout(() => {
            setOpenSubtitle(true);
        }, 0);

        return () => {
            clearTimeout(timeout);
        };
    }, []);

    return (
        <Box marginBottom={2}>
            <Box display="flex" gap={2} marginBottom={2}>
                <Icon
                    fontSize="large"
                    sx={{ color: theme.palette.primary.dark }}
                />
                <Typography variant="h4" sx={{ letterSpacing: 2 }}>
                    {title}
                </Typography>
                <ExpandMore
                    expand={openSubtitle}
                    onClick={() => setOpenSubtitle(!openSubtitle)}
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            </Box>
            <Collapse in={openSubtitle} timeout={500}>
                <Typography variant="subtitle1" color="text.secondary">
                    {subtitle}
                </Typography>
            </Collapse>
        </Box>
    );
};
