import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Crafting } from './crafting/Crafting.tsx';
import { Routes } from './constants.ts';
import { AuctionHouse } from './AuctionHouse';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const router = createBrowserRouter([
    {
        path: `/${Routes.Auction}`,
        element: <AuctionHouse />,
    },
    {
        path: `/${Routes.Craft}`,
        element: <Crafting />,
    },
]);

function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
