import React, { FC, ReactNode, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useBoolean } from 'usehooks-ts';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import { NAVIGABLE_ROUTE_ITEMS } from './routes';
import { ShoppingCartContext } from './shopping-cart/ShoppingCartProvider';
import { ShoppingCartSummary } from './shopping-cart/ShoppingCartSummary';
import { ShoppingCartSyntheses } from './shopping-cart/ShoppingCartSyntheses';
import Stack from '@mui/material/Stack';

type NavigationProps = {
    children: ReactNode;
};

const APP_BAR_HEIGHT = 64;

const ShoppingCartSummaryHeader = styled(ShoppingCartSummary)(({ theme }) => ({
    background: theme.palette.background.default,
    position: 'relative',
    padding: theme.spacing(2),
    '& .MuiBox-root': {
        position: 'absolute',
        right: theme.spacing(2),
    },
}));

export const Navigation: FC<NavigationProps> = ({ children }) => {
    const {
        value: drawerOpen,
        setTrue: openDrawer,
        setFalse: closeDrawer,
    } = useBoolean(false);

    const navigate = useNavigate();

    const location = useLocation();

    const theme = useTheme();

    const { length } = useContext(ShoppingCartContext);

    useEffect(() => {
        if (length) openDrawer();
        else closeDrawer();
    }, [length, openDrawer, closeDrawer]);

    return (
        <Box>
            <AppBar sx={{ height: APP_BAR_HEIGHT }}>
                <Toolbar>
                    <Box display="flex" gap={2} alignItems="center">
                        <Button onClick={() => navigate('/')}>
                            <Typography
                                variant="h6"
                                color="text.primary"
                                sx={{ textTransform: 'none' }}
                            >
                                FFXI Crafting
                            </Typography>
                        </Button>
                        <Divider orientation="vertical" flexItem />
                        <Stack
                            divider={
                                <Divider orientation="vertical" flexItem />
                            }
                            direction="row"
                            gap={1}
                        >
                            {NAVIGABLE_ROUTE_ITEMS.map((routeItem) => {
                                const { path, navigable } = routeItem;

                                const isNavigatedTo =
                                    location.pathname.includes(path);

                                const color = isNavigatedTo
                                    ? theme.palette.primary.main
                                    : 'inherit';

                                return (
                                    <Button
                                        key={path}
                                        startIcon={navigable.icon}
                                        onClick={() => navigate(path)}
                                        sx={{ color }}
                                    >
                                        {navigable.name}
                                    </Button>
                                );
                            })}
                        </Stack>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box
                position="fixed"
                top={APP_BAR_HEIGHT}
                left={0}
                right={0}
                bottom={0}
            >
                <Box
                    component="main"
                    padding={2}
                    width={drawerOpen ? '80%' : '100%'}
                    height="100%"
                    sx={{
                        transition: 'width 0.25s ease-out',
                        overflowY: 'scroll',
                    }}
                    position="absolute"
                >
                    {children}
                </Box>
                <Box
                    component={Paper}
                    position="absolute"
                    width="20%"
                    height="100%"
                    display="inline-block"
                    left={drawerOpen ? '80%' : '100%'}
                    top={0}
                    bottom={0}
                    sx={{
                        transition: 'left 0.25s ease-out',
                        overflowY: 'scroll',
                    }}
                    borderLeft={`1px solid ${theme.palette.divider}`}
                >
                    <ShoppingCartSummaryHeader />
                    <ShoppingCartSyntheses />
                </Box>
            </Box>
        </Box>
    );
};
