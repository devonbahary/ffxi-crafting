import * as React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { Craft } from "../constants.ts";
import Container from "@mui/material/Container";

export const Crafting = () => {
  return (
    <Container>
      <ButtonGroup>
        {Object.values(Craft).map((craft) => (
          <Button key={craft}>{craft}</Button>
        ))}
      </ButtonGroup>
      <h1>Crafting</h1>
    </Container>
  );
};
