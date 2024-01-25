import React from 'react';
import darkScrollbar from '@mui/material/darkScrollbar';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
    BrowserRouter,
    Navigate,
    Outlet,
    Route,
    Routes,
} from 'react-router-dom';
import { ROUTE_ITEMS } from './routes';
import { Navigation } from './Navigation';
import { Notifications } from './notifications/Notifications';
import { NotificationsProvider } from './notifications/NotificationsProvider';
import { ShoppingCartProvider } from './shopping-cart/ShoppingCartProvider';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                html: {
                    ...darkScrollbar(),
                    scrollbarWidth: 'thin',
                },
            },
        },
    },
});

const App = () => (
    <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <NotificationsProvider>
            <ShoppingCartProvider>
                <BrowserRouter>
                    <Routes>
                        <Route
                            element={
                                <Navigation>
                                    {' '}
                                    <Outlet />{' '}
                                </Navigation>
                            }
                        >
                            {ROUTE_ITEMS.map(({ path, element }) => (
                                <Route
                                    key={path}
                                    path={path}
                                    element={element}
                                />
                            ))}
                            {/* redirect to "/" path if no route matched */}
                            <Route
                                path="*"
                                element={<Navigate to="/" replace />}
                            />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </ShoppingCartProvider>
            <Notifications />
        </NotificationsProvider>
    </ThemeProvider>
);

export default App;
