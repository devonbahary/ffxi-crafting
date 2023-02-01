import React, { useEffect } from "react";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import { Craft, Crystal } from "../constants";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { deleteSynthesis, getCrystals, getSynthesis } from "../api";
import { AddSynthesisFormDialog } from "./AddSynthesisFormDialog";
import { SelectButtonGroup } from "./SelectButtonGroup";
import Alert, { AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { Spacer } from "../Spacer";
import { Box } from "@mui/material";
import { Item, SynthesisIngredient, SynthesisRecipe } from "../types";
import { DataGrid, GridActionsCellItem, GridColumns } from "@mui/x-data-grid";
import { getUnitPrice } from "../utilities";
import {
  POSITIVE_NEGATIVE_CLASS_NAMES,
  POSITIVE_NEGATIVE_STYLING,
} from "../styles";

const formatIngredient = (ingredient: SynthesisIngredient): string => {
  if (ingredient.quantity > 1)
    return `${ingredient.item.name} (x${ingredient.quantity})`;
  return ingredient.item.name;
};

const formatIngredients = (synthesisRecipe: SynthesisRecipe) => {
  return synthesisRecipe.ingredients.map(formatIngredient).join(", ");
};

const getCost = (
  synthesisRecipe: SynthesisRecipe,
  getCrystalCost: (crystal: Crystal) => number
) => {
  const crystalCost = getCrystalCost(synthesisRecipe.synthesis.crystal);
  return synthesisRecipe.ingredients.reduce((acc, ing) => {
    return acc + getUnitPrice(ing.item) * ing.quantity;
  }, crystalCost);
};

const getPrice = (synthesisRecipe: SynthesisRecipe) => {
  return (
    getUnitPrice(synthesisRecipe.synthesis.item) *
    synthesisRecipe.synthesis.yield
  );
};

const getNet = (
  synthesisRecipe: SynthesisRecipe,
  getCrystalCost: (crystal: Crystal) => number
) => {
  const price = getPrice(synthesisRecipe);
  const cost = getCost(synthesisRecipe, getCrystalCost);
  return price - cost;
};

export const Crafting = () => {
  const [selectedCraft, setSelectedCraft] = useState<Craft | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [crystalItemMap, setCrystalItemMap] = useState<
    Partial<Record<Crystal, Item>>
  >({});
  const [synthesisRecipes, setSynthesisRecipes] = useState<SynthesisRecipe[]>(
    []
  );
  const [isDeletingItem, setIsDeletingItem] = useState(false);

  const [snackbar, setSnackbar] = useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);

  const onCraftChange = (craft: Craft) => {
    setSelectedCraft(selectedCraft === craft ? null : craft);
  };

  const loadCrystals = async () => {
    const crystals = await getCrystals();

    const crystalMap = Object.values(Crystal).reduce((acc, crystal) => {
      const crystalItem = crystals.find(
        (item) => item.name.split(" ")[0] === crystal
      );
      if (!crystalItem) {
        setSnackbar({
          children: `no item found for ${crystal} Crystal`,
          severity: "error",
        });
      } else {
        acc[crystal] = crystalItem;
      }
      return acc;
    }, {});

    setCrystalItemMap(crystalMap);
  };

  const loadSynthesis = async () => {
    try {
      const synthesisRecipes = await getSynthesis(selectedCraft);
      setSynthesisRecipes(synthesisRecipes);
    } catch (error) {
      setSnackbar({ children: error.message, severity: "error" });
    }
  };

  useEffect(() => {
    loadSynthesis();
  }, [selectedCraft]);

  useEffect(() => {
    loadCrystals();
  }, []);

  const onAddItem = () => {
    setIsAddingItem(true);
  };

  const onSynthesisCreated = (synthesisRecipe) => {
    if (synthesisRecipe.synthesis.craft === selectedCraft || !selectedCraft) {
      setSynthesisRecipes([...synthesisRecipes, synthesisRecipe]);
    }
    setSnackbar({ children: "Created synthesis", severity: "success" });
  };

  const handleCloseSnackbar = () => setSnackbar(null);

  const handleDeleteClick = (id) => async () => {
    if (isDeletingItem) return;

    setIsDeletingItem(true);

    try {
      await deleteSynthesis(id);
      setSynthesisRecipes(
        synthesisRecipes.filter((recipe) => recipe.synthesis.id !== id)
      );
      setSnackbar({ children: "Deleted synthesis", severity: "success" });
    } catch (err) {
      setSnackbar({ children: err.message, severity: "error" });
    }

    setIsDeletingItem(false);
  };

  const getCrystalCost = (crystal: Crystal): number => {
    const crystalItem = crystalItemMap[crystal];
    return crystalItem ? getUnitPrice(crystalItem) : 0;
  };

  const getNetCostClassName = (params) => {
    const net = getNet(params.row, getCrystalCost);
    if (net > 0) return POSITIVE_NEGATIVE_CLASS_NAMES.POS;
    return POSITIVE_NEGATIVE_CLASS_NAMES.NEG;
  };

  const columns: GridColumns = [
    {
      field: "crystal",
      headerName: "Crystal",
      valueGetter: (params) => params.row.synthesis.crystal,
      flex: 1,
    },
    {
      field: "craft",
      headerName: "Craft",
      valueGetter: (params) => params.row.synthesis.craft,
      flex: 1,
    },
    {
      field: "level",
      valueGetter: (params) => params.row.synthesis.level,
      headerName: "Lv",
      flex: 0.3,
    },
    {
      field: "synthesis",
      headerName: "Synthesis",
      valueGetter: (params) => params.row.synthesis.item.name,
      cellClassName: getNetCostClassName,
      flex: 1,
    },
    {
      field: "synthesis.yield",
      headerName: "Yield",
      valueGetter: (params) => params.row.synthesis.yield,
      flex: 0.3,
    },
    {
      field: "ingredients",
      headerName: "Ingredients",
      valueGetter: (params) => formatIngredients(params.row),
      flex: 3,
    },
    {
      field: "cost",
      headerName: "Cost",
      valueGetter: (params) => getCost(params.row, getCrystalCost),
      flex: 0.5,
    },
    {
      field: "price",
      headerName: "Price",
      valueGetter: (params) => getPrice(params.row),
      flex: 0.5,
    },
    {
      field: "net",
      headerName: "Net",
      valueGetter: (params) => getNet(params.row, getCrystalCost),
      cellClassName: getNetCostClassName,
      flex: 0.5,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
        ...POSITIVE_NEGATIVE_STYLING,
      }}
    >
      <Spacer />
      <Button
        color="primary"
        startIcon={<AddIcon />}
        onClick={onAddItem}
        variant="contained"
      >
        Add Synthesis
      </Button>
      <Spacer />
      <AddSynthesisFormDialog
        open={isAddingItem}
        handleClose={() => setIsAddingItem(false)}
        onSynthesisCreated={onSynthesisCreated}
      />
      <SelectButtonGroup
        selectedOption={selectedCraft}
        onChange={(craft) => onCraftChange(craft as Craft)}
        options={Craft}
      />
      <DataGrid
        columns={columns}
        getRowId={(synthesisRecipe) => synthesisRecipe.synthesis.id}
        rows={synthesisRecipes}
      />
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
    </Box>
  );
};
