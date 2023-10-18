import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React, { FC, useEffect, useMemo, useState } from "react";
import { Craft, Crystal } from "../constants";
import { SelectButtonGroup } from "./SelectButtonGroup";
import { createSynthesis } from "../api";
import { Item, SynthesisRecipe } from "../types";
import Alert, { AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { Box } from "@mui/system";
import { ItemSearchInput } from "./ItemSearchInput";
import { AddSynthesisIngredientForm } from "./AddSynthesisIngredientForm";
import { Spacer } from "../Spacer";
import { AddSynthesisIngredient } from "./crafting.types";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import TextField from "@mui/material/TextField";

type AddSynthesisFormDialogProps = Pick<DialogProps, "open"> & {
  handleClose: () => void;
  onSynthesisCreated: (synthesisRecipe: SynthesisRecipe) => void;
};

let synthesisIngredientIndex = 0;

export const AddSynthesisFormDialog: FC<AddSynthesisFormDialogProps> = ({
  open,
  handleClose,
  onSynthesisCreated,
}) => {
  const [selectedCraft, setSelectedCraft] = useState<Craft>(Craft.Alchemy);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedCrystal, setSelectedCrystal] = useState<Crystal>(Crystal.Fire);
  const [level, setLevel] = useState(1);
  const [yieldd, setYield] = useState(1);
  const [isCreateInProgress, setIsCreateInProgress] = useState<boolean>(false);
  const [synthesisIngredients, setSynthesisIngredients] = useState<
    AddSynthesisIngredient[]
  >([]);

  const [snackbar, setSnackbar] = useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);

  const selectedMainSynthesisInformation =
    selectedCraft && selectedItem && selectedCrystal && yieldd && level;
  const areIngredientsFulfilled = synthesisIngredients.every(
    (ingredient) => ingredient.item_id && ingredient.quantity,
  );
  const canAddSynthesis =
    selectedMainSynthesisInformation &&
    synthesisIngredients.length > 0 &&
    areIngredientsFulfilled &&
    !isCreateInProgress;

  const onClickAddSynthesisIngredient = () => {
    setSynthesisIngredients([
      ...synthesisIngredients,
      { id: synthesisIngredientIndex++ },
    ]);
  };

  const onAddSynthesis = async () => {
    setIsCreateInProgress(true);

    try {
      const { id } = selectedItem;
      const synthesis = {
        item_id: id,
        level: level,
        craft: selectedCraft,
        crystal: selectedCrystal,
        yield: yieldd,
      };
      const createdSynthesis = await createSynthesis(
        synthesis,
        synthesisIngredients,
      );
      handleClose();
      onSynthesisCreated(createdSynthesis);
    } catch (err) {
      setSnackbar({ children: err.message, severity: "error" });
    }

    setIsCreateInProgress(false);
  };

  const handleCloseSnackbar = () => setSnackbar(null);

  useEffect(() => {
    if (!open) {
      setSelectedCraft(Craft.Alchemy);
      setSelectedItem(null);
      setSelectedCrystal(Crystal.Fire);
      setSynthesisIngredients([]);
      setYield(1);
      setLevel(1);
    }
  }, [open]);

  const onYieldChange = (event) => {
    const yieldd = parseInt(event.target.value);

    if (yieldd) {
      setYield(yieldd);
    }
  };

  const onLevelChange = (event) => {
    const level = parseInt(event.target.value);

    if (level) {
      setLevel(level);
    }
  };

  return (
    <Dialog open={open} onClose={() => handleClose()} maxWidth="xl">
      <DialogTitle>Add Synthesis</DialogTitle>
      <DialogContent>
        <SelectButtonGroup
          selectedOption={selectedCraft}
          onChange={(craft) => setSelectedCraft(craft as Craft)}
          options={Craft}
        />
        <Spacer />
        <SelectButtonGroup
          // @ts-ignore
          selectedOption={selectedCrystal}
          onChange={(crystal) => setSelectedCrystal(crystal as Crystal)}
          options={Crystal}
        />
        <Spacer />
        <Grid2 container>
          <Grid2
            xs={2}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <TextField
              type="number"
              label="Lv"
              onChange={onLevelChange}
              value={level}
            />
          </Grid2>
          <Grid2 xs={8}>
            <ItemSearchInput
              label="Item"
              onChange={(item) => setSelectedItem(item)}
            />
          </Grid2>
          <Grid2
            xs={2}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <TextField
              type="number"
              label="Yield"
              onChange={onYieldChange}
              value={yieldd}
            />
          </Grid2>
        </Grid2>
        <Spacer />
        {selectedMainSynthesisInformation && (
          <Box paddingLeft={4}>
            {synthesisIngredients.map((synthesisIngredient) => {
              const onChange = (ingredient) => {
                setSynthesisIngredients(
                  synthesisIngredients.map((ing) => {
                    if (ing.id === synthesisIngredient.id) {
                      return { ...ing, ...ingredient };
                    }
                    return ing;
                  }),
                );
              };

              const onDelete = () => {
                setSynthesisIngredients(
                  synthesisIngredients.filter(
                    (ing) => ing.id !== synthesisIngredient.id,
                  ),
                );
              };

              return (
                <AddSynthesisIngredientForm
                  key={synthesisIngredient.id}
                  onChange={onChange}
                  onDelete={onDelete}
                />
              );
            })}
            <Spacer />
            <Button
              color="primary"
              startIcon={<AddIcon />}
              onClick={onClickAddSynthesisIngredient}
              variant="contained"
            >
              Add Synthesis Ingredient
            </Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose()}>Cancel</Button>
        <Button onClick={() => onAddSynthesis()} disabled={!canAddSynthesis}>
          Add
        </Button>
      </DialogActions>
      {!!snackbar && (
        <Snackbar
          open
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          onClose={handleCloseSnackbar}
          autoHideDuration={6000}
        >
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}
    </Dialog>
  );
};
