import React, { useEffect, useState } from "react";
import { formatDistance } from "date-fns";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
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
import { getItems, createItem, updateItem } from "./api";
import { PriceType, StackSize } from "./constants";
import Alert, { AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

type Item = {
  id: number;
  name: string;
  price: number;
  price_type: string;
  stack_size: number;
  updated_on: string;
};

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = "randomId";
    setRows((oldRows) => [
      ...oldRows,
      {
        id,
        name: "",
        price: 0,
        price_type: PriceType.Single,
        stack_size: StackSize.One,
        isNew: true,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add Item
      </Button>
    </GridToolbarContainer>
  );
}

const getUnitPrice = (item: Item): number => {
  if (item.price_type === PriceType.Single) {
    return item.price;
  }

  if (item.price_type === PriceType.Stack) {
    return Math.round(item.price / item.stack_size);
  }

  throw new Error(`do not recognize item.price_type ${item.price_type}`);
};

const getTimeAgo = (date: string) => {
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
};

export const AuctionHouse = () => {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const [snackbar, setSnackbar] = useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);

  const handleCloseSnackbar = () => setSnackbar(null);

  const loadRows = async () => {
    const items = await getItems();
    console.log(items);
    setRows(items);
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

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
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
      width: 200,
      valueGetter: (params) => getTimeAgo(params.row.updated_on),
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
  }, []);

  return (
    <Box
      sx={{
        height: 500,
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
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
          toolbar: { setRows, setRowModesModel },
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
  );
};
