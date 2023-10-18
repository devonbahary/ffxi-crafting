import React, { useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";
import { formatDistance, isAfter, subHours } from "date-fns";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import ClearIcon from "@mui/icons-material/Clear";
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColumns,
  GridRowParams,
  MuiEvent,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
} from "@mui/x-data-grid";
import { getItems, createItem, updateItem, deleteItem } from "./api";
import { Category, PriceType, StackSize } from "./constants";
import Alert, { AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { getUnitPrice } from "./utilities";
import {
  POSITIVE_NEGATIVE_CLASS_NAMES,
  POSITIVE_NEGATIVE_STYLING,
} from "./styles";
import TextField from "@mui/material/TextField";
import { Autocomplete, IconButton, InputAdornment } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { AppContainer } from "./AppContainer";

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
  onSearchTextChange: (search: string) => void;
  onCategoryChange: (category: Category | null) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel, onSearchTextChange, onCategoryChange } =
    props;

  const [searchText, setSearchText] = useState("");

  const onSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const onClearSearchText = () => {
    setSearchText("");
  };

  const onAddItem = () => {
    const id = "randomId";
    setRows((oldRows) => [
      {
        id,
        name: "",
        price: 0,
        price_type: PriceType.Single,
        stack_size: StackSize.One,
        isNew: true,
      },
      ...oldRows,
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  const debouncedOnSearchTextChange = useMemo(
    () => debounce(onSearchTextChange, 300),
    []
  );

  useEffect(() => {
    debouncedOnSearchTextChange(searchText);
  }, [searchText]);

  return (
    <GridToolbarContainer>
      <Grid2 container width="100%">
        <Grid2 container xs={8} spacing={2}>
          <Grid2 xs={9}>
            <TextField
              label="Search for an item"
              onChange={onSearchChange}
              value={searchText}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={onClearSearchText}
                      disabled={!searchText}
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
          </Grid2>
          <Grid2 xs={3}>
            <Autocomplete
              options={Object.values(Category)}
              onInputChange={(event, category) =>
                onCategoryChange(category ? (category as Category) : null)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category"
                  InputProps={{
                    ...params.InputProps,
                    type: "search",
                  }}
                />
              )}
            />
          </Grid2>
        </Grid2>
        <Grid2 xs={4} display="flex" justifyContent="right" alignItems="center">
          <Button
            color="primary"
            startIcon={<AddIcon />}
            onClick={onAddItem}
            variant="contained"
          >
            Add Item
          </Button>
        </Grid2>
      </Grid2>
    </GridToolbarContainer>
  );
}

const getTimeAgo = (date: string) => {
  if (!date) return null;
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
};

export const AuctionHouse = () => {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [isDeletingItem, setIsDeletingItem] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category | null>(null);

  const [snackbar, setSnackbar] = useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);

  const handleCloseSnackbar = () => setSnackbar(null);

  const loadRows = async () => {
    try {
      const items = await getItems({ name, category });
      setRows(items);
    } catch (error) {
      setSnackbar({ children: error.message, severity: "error" });
    }
  };

  const handleRowEditStart = (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => async () => {
    if (isDeletingItem) return;

    setIsDeletingItem(true);

    try {
      await deleteItem(id);
      setRows(rows.filter((row) => row.id !== id));
      setSnackbar({ children: "Deleted item", severity: "success" });
    } catch (err) {
      setSnackbar({ children: err.message, severity: "error" });
    }

    setIsDeletingItem(false);
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
    return new Promise(async (res, rej) => {
      try {
        const { id, isNew, ...item } = newRow;
        if (isNew) {
          const createdItem = await createItem(item);
          setSnackbar({ children: "Created item", severity: "success" });
          setRows([...rows.filter((r) => r.id !== id), createdItem]);
          res(createdItem);
        } else {
          const updatedItem = await updateItem(newRow);
          setSnackbar({ children: "Updated item", severity: "success" });
          res(updatedItem);
        }
      } catch (err) {
        rej(err);
      }
    });
  };

  const onProcessRowUpdateError = (error) => {
    setSnackbar({ children: error.message, severity: "error" });
  };

  const columns: GridColumns = [
    {
      field: "category",
      headerName: "Category",
      type: "singleSelect",
      editable: true,
      flex: 1,
      valueOptions: Object.values(Category).sort(),
    },
    { field: "name", headerName: "Item", editable: true, flex: 1 },
    {
      field: "stack_size",
      headerName: "Stack Size",
      type: "singleSelect",
      editable: true,
      valueOptions: Object.values(StackSize).filter((p: string) => parseInt(p)),
    },
    { field: "price", headerName: "Price", type: "number", editable: true },
    {
      field: "price_type",
      headerName: "Price Type",
      type: "singleSelect",
      editable: true,
      valueOptions: Object.values(PriceType),
    },
    {
      field: "unit_price",
      headerName: "Unit Price",
      type: "number",
      valueGetter: (params) => getUnitPrice(params.row),
    },
    {
      field: "updated_on",
      headerName: "Last Updated",
      type: "string",
      flex: 1,
      valueGetter: (params) => params.row.updated_on,
      valueFormatter: (params) => getTimeAgo(params.value),
      cellClassName: (params) => {
        const sixHoursAgo = subHours(new Date(), 6);
        return isAfter(new Date(params.row.updated_on), sixHoursAgo)
          ? POSITIVE_NEGATIVE_CLASS_NAMES.POS
          : POSITIVE_NEGATIVE_CLASS_NAMES.NEG;
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
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

  useEffect(() => {
    loadRows();
  }, [name, category]);

  return (
    <AppContainer>
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
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
          onRowEditStart={handleRowEditStart}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={onProcessRowUpdateError}
          components={{
            Toolbar: EditToolbar,
          }}
          componentsProps={{
            toolbar: {
              setRows,
              setRowModesModel,
              onSearchTextChange: (search) => setName(search),
              onCategoryChange: (category) => setCategory(category),
            },
          }}
          experimentalFeatures={{ newEditingApi: true }}
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
    </AppContainer>
  );
};
