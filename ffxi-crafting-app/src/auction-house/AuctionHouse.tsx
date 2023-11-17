import React, { useEffect, useState } from 'react';
import {
    DataGrid,
    DataGridProps,
    GridActionsCellItem,
    GridColDef,
    GridRowModes,
    GridRowModesModel,
    GridRowParams,
    GridToolbarContainer,
} from '@mui/x-data-grid';
import { randomId } from '@mui/x-data-grid-generator';
import { AxiosError } from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { useItems } from './use-items';
import { Item } from '../interfaces';
import { Alert, Button, Snackbar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useAlertMessages } from './use-alert-messages';
import { CATEGORY_OPTIONS } from './categories';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

const large: Pick<GridColDef, 'flex'> = { flex: 2 };
const small: Pick<GridColDef, 'flex'> = { flex: 1 };
const editable: Pick<GridColDef, 'editable'> = { editable: true };

const isNewRow = (row: any): boolean => typeof row.id === 'string';

export const AuctionHouse = () => {
    const [items, setItems] = useState<Partial<Item>[]>([]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [editMode, setEditMode] = useState<DataGridProps['editMode']>('cell');
    const [pendingDeleteId, setPendingDeleteId] = useState<
        string | number | null
    >(null);

    const { alertMessages, pushAlertMessage, shiftAlertMessages } =
        useAlertMessages();

    const { getItems, createItem, updateItem, deleteItem } = useItems();

    const handleAddItem = () => {
        const id = randomId();

        setItems((prevItems) => [{ id }, ...prevItems]);

        setRowModesModel((prevModel) => ({
            ...prevModel,
            [id]: {
                mode: GridRowModes.Edit,
                fieldToFocus: 'name',
            },
        }));

        setEditMode('row');
    };

    const onProcessRowError: DataGridProps['onProcessRowUpdateError'] = (
        error: AxiosError
    ) => {
        if (error.response?.data) {
            const data = error.response.data as any;
            if (data.errors) {
                for (const error of data.errors) {
                    pushAlertMessage({
                        msg: `Failure: ${error.msg}`,
                        severity: 'error',
                    });
                }
            } else if (error.message) {
                pushAlertMessage({
                    msg: `Failure: ${error.message}`,
                    severity: 'error',
                });
            }
        }
    };

    const processRowUpdate: DataGridProps['processRowUpdate'] = async (
        updatedRow
    ) => {
        if (isNewRow(updatedRow)) {
            const oldId = updatedRow.id;

            const { id, ...newItem } = updatedRow;
            const createdItem = await createItem(newItem);

            pushAlertMessage({
                msg: 'Successfully created item',
                severity: 'success',
            });

            updatedRow.id = createdItem.id;

            setItems((prevItems) =>
                prevItems.filter((item) => item.id !== oldId)
            );
            return createdItem;
        } else {
            const updatedItem = await updateItem(updatedRow);

            pushAlertMessage({
                msg: 'Successfully updated item',
                severity: 'success',
            });

            return updatedItem;
        }
    };

    const handleDelete = async () => {
        if (pendingDeleteId === null) return;

        try {
            await deleteItem(pendingDeleteId);
            pushAlertMessage({
                msg: `Successfully deleted item`,
                severity: 'success',
            });
            setItems((prevItems) =>
                prevItems.filter((item) => item.id !== pendingDeleteId)
            );
        } catch (err: any) {
            pushAlertMessage({
                msg: `Failure: ${err.message}`,
                severity: 'error',
            });
        }
    };

    const handleSnackbarClose = () => {
        shiftAlertMessages();
    };

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', ...large, ...editable },
        {
            field: 'category',
            headerName: 'Category',
            type: 'singleSelect',
            valueOptions: CATEGORY_OPTIONS,
            ...large,
            ...editable,
        },
        {
            field: 'unitPrice',
            headerName: 'Unit Price',
            ...small,
            ...editable,
        },
        {
            field: 'stackPrice',
            headerName: 'Stack Price',
            ...small,
            ...editable,
        },
        {
            field: 'stackSize',
            headerName: 'Stack Size',
            ...small,
            ...editable,
        },
        {
            field: 'updatedAt',
            headerName: 'Last Updated',
            ...large,
            valueGetter: ({ value }) => {
                const date = new Date(value);
                return `${formatDistanceToNow(date)} ago`;
            },
        },
        {
            field: 'actions',
            type: 'actions',
            getActions: (params: GridRowParams) => [
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    onClick={() => setPendingDeleteId(params.id)}
                    label="Delete"
                />,
            ],
        },
    ];

    useEffect(() => {
        (async () => {
            const items = await getItems();
            setItems(items);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <DataGrid
                editMode={editMode}
                rows={items}
                columns={columns}
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={onProcessRowError}
                rowModesModel={rowModesModel}
                onRowModesModelChange={setRowModesModel}
                slots={{
                    toolbar: () => (
                        <GridToolbarContainer>
                            <Button
                                startIcon={<AddIcon />}
                                onClick={handleAddItem}
                            >
                                Add Item
                            </Button>
                        </GridToolbarContainer>
                    ),
                }}
            />
            <DeleteConfirmationModal
                pendingDeleteItem={items.find((i) => i.id === pendingDeleteId)}
                onClose={() => setPendingDeleteId(null)}
                onConfirm={() => handleDelete()}
            />
            <Snackbar
                open={alertMessages.length > 0}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
            >
                {alertMessages.length ? (
                    <Alert
                        severity={alertMessages[0].severity}
                        onClose={handleSnackbarClose}
                    >
                        {alertMessages[0].msg}
                    </Alert>
                ) : undefined}
            </Snackbar>
        </>
    );
};
