import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { navigationItems } from './routes';
import { Navigation } from './Navigation';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const App = () => (
    <ThemeProvider theme={darkTheme}>
        <CssBaseline />
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
                </Route>
            </Routes>
        </BrowserRouter>
    </ThemeProvider>
);

export default App;
