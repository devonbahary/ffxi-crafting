import React, { FC } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

type SelectButtonGroupProps<T> = {
  selectedOption: keyof T;
  onChange: (option: keyof T) => void;
  options: T;
};

export const SelectButtonGroup = <T extends unknown>({
  selectedOption,
  onChange,
  options,
}: SelectButtonGroupProps<T>) => {
  return (
    <ButtonGroup>
      {Object.values(options).map((option) => {
        return (
          <Button
            key={option}
            onClick={() => onChange(option)}
            variant={option === selectedOption ? "contained" : "outlined"}
          >
            {option}
          </Button>
        );
      })}
    </ButtonGroup>
  );
};
