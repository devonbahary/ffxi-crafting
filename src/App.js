import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2";
import CssBaseline from "@mui/material/CssBaseline";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Crafting } from "./crafting/Crafting.tsx";
import { Routes } from "./constants.ts";
import { Navigation } from "./Navigation.tsx";
import { AuctionHouse } from "./AuctionHouse";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
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
      <Grid container>
        <Grid xs={2}>
          <Navigation navigateTo={(route) => router.navigate(route)} />
        </Grid>
        <Grid xs={10}>
          <RouterProvider router={router} />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
