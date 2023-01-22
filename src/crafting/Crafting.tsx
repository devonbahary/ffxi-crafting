import { useState } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { Craft } from "../constants";
import Container from "@mui/material/Container";
import React from "react";

export const Crafting = () => {
  const [selectedCraft, setSelectedCraft] = useState<Craft>(Craft.Alchemy);

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
