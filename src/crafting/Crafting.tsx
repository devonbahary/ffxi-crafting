import React, { useEffect } from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { Craft, PriceType, StackSize } from "../constants";
import Container from "@mui/material/Container";
import { getItems, createItem } from "../api";

export const Crafting = () => {
  const [selectedCraft, setSelectedCraft] = useState<Craft>(Craft.Alchemy);

  useEffect(() => {
    getItems();
  }, []);

  return (
    <Container>
      <ButtonGroup>
        {Object.values(Craft).map((craft) => {
          const variant = craft === selectedCraft ? "contained" : "outlined";
          const onClick = () => setSelectedCraft(craft);

          return (
            <Button key={craft} onClick={onClick} variant={variant}>
              {craft}
            </Button>
          );
        })}
      </ButtonGroup>
      <h1>Crafting</h1>
    </Container>
  );
};
