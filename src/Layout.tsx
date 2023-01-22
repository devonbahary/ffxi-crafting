import * as React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Container from "@mui/material/Container";
import { Navigation } from "./Navigation.tsx";

export const Layout = ({ children }) => (
  <Grid container>
    <Grid xs={2}>
      <Navigation />
    </Grid>
    <Grid xs={10}>
      <Container>{children}</Container>
    </Grid>
  </Grid>
);
