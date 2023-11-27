import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
    BrowserRouter,
    Navigate,
    Outlet,
    Route,
    Routes,
} from 'react-router-dom';
import { navigationItems } from './routes';
import { Navigation } from './Navigation';
import { Notifications } from './notifications/Notifications';
import { NotificationsProvider } from './notifications/NotificationsProvider';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const App = () => (
    <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <NotificationsProvider>
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
                        {navigationItems.map((navItem) => (
                            <Route
                                key={navItem.path}
                                path={navItem.path}
                                element={navItem.element}
                            />
                        ))}
                        {/* redirect to "/" path if no route matched */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Routes>
            </BrowserRouter>
            <Notifications />
        </NotificationsProvider>
    </ThemeProvider>
);

export default App;
