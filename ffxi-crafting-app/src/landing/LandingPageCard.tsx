import React, { FC } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { NavigableRouteItem } from '../routes';
import { useFadeIn } from '../hooks/useFadeIn';
import { useNavigate } from 'react-router';
import { FADE_IN_TIMEOUT } from '../common/constants';

type LandingPageCardProps = {
    routeItem: NavigableRouteItem;
};

export const LandingPageCard: FC<LandingPageCardProps> = ({ routeItem }) => {
    const { path, navigable } = routeItem;

    const navigate = useNavigate();

    const { ref, fadeIn } = useFadeIn<HTMLDivElement>();

    const theme = useTheme();

    const { name, icon, image, landingPageText } = navigable;

    return (
        <Fade in={fadeIn} timeout={FADE_IN_TIMEOUT}>
            <Grid item key={path} xs={12} sm={6} md={6} lg={6} xl={3}>
                <Card
                    ref={ref}
                    onClick={() => navigate(path)}
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        ':hover': {
                            boxShadow: theme.shadows[20],
                            transform: 'translate(0, -4px)',
                        },
                        transition: '0.2s ease-out',
                    }}
                >
                    <CardMedia
                        component="div"
                        sx={{
                            // 16:9
                            pt: '56.25%',
                            backgroundSize: 'contain',
                            backgroundColor: theme.palette.background.default,
                        }}
                        image={image}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                        <Box
                            display="flex"
                            gap={1}
                            color={theme.palette.primary.main}
                            pb={1}
                        >
                            {icon}
                            {name}
                        </Box>
                        <Typography>{landingPageText}</Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Fade>
    );
};
