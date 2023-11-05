import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
    Navigate,
    RouterProvider,
    createBrowserRouter,
} from 'react-router-dom';
import { navigationItems } from './routes';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const router = createBrowserRouter([
    ...navigationItems,
    // catch-all redirect route, not to be rendered in navigation menu
    {
        path: '*',
        element: <Navigate to="/home" replace />,
    },
]);

const App = () => (
    <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <RouterProvider router={router} />
    </ThemeProvider>
);

export default App;
