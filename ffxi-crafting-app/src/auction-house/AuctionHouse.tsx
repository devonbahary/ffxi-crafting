import React, { useEffect, useMemo, useState } from 'react';
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
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { CATEGORY_OPTIONS, STACK_SIZE_OPTIONS } from '../inputs/input-options';

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

    const {
        alertMessages,
        pushSuccessMessage,
        pushErrorMessage,
        shiftAlertMessages,
    } = useAlertMessages();

    const { getItems, createItem, updateItem, deleteItem } = useItems();

    const handleAddItem = () => {
        const id = randomId();

        const newItem = {
            id,
            category: '',
            stackSize: '',
        };

        setItems((prevItems) => [newItem as Item, ...prevItems]);

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
                    pushErrorMessage(`Failure: ${error.msg}`);
                }
            } else if (data.error) {
                pushErrorMessage(`Failure: ${data.error}`);
            } else if (error.message) {
                pushErrorMessage(`Failure: ${error.message}`);
            }
        }
    };

    const processRowUpdate: DataGridProps['processRowUpdate'] = async (
        updatedRow
    ) => {
        if (isNewRow(updatedRow)) {
            const oldId = updatedRow.id;

            // don't send client-given ID to server
            // const { id, ...newItem } = updatedRow;
            const createdItem = await createItem(updatedRow);

            pushSuccessMessage('Successfully created item');

            setItems((prevItems) =>
                prevItems.map((item) => {
                    if (item.id === oldId) {
                        // replace with database-given record
                        return createdItem;
                    }
                    return item;
                })
            );

            return createdItem;
        } else {
            const updatedItem = await updateItem(updatedRow);

            pushSuccessMessage('Successfully updated item');

            return updatedItem;
        }
    };

    const handleDelete = (params: GridRowParams) => {
        if (isNewRow(params.row)) {
            setItems((prevItems) =>
                prevItems.filter((item) => item.id !== params.id)
            );
        }
        setPendingDeleteId(params.id);
    };

    const deleteRow = async () => {
        if (pendingDeleteId === null) return;

        try {
            await deleteItem(pendingDeleteId);

            pushSuccessMessage(`Successfully deleted item`);

            setItems((prevItems) =>
                prevItems.filter((item) => item.id !== pendingDeleteId)
            );
        } catch (err: any) {
            pushErrorMessage(`Failure: ${err.message}`);
        }
    };

    const handleSnackbarClose = () => shiftAlertMessages();

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
            type: 'singleSelect',
            valueOptions: STACK_SIZE_OPTIONS,
            ...small,
            ...editable,
        },
        {
            field: 'updatedAt',
            headerName: 'Last Updated',
            ...large,
            valueGetter: ({ value }) => {
                if (!value) return '';
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
                    onClick={() => handleDelete(params)}
                    label="Delete"
                />,
            ],
        },
    ];

    const pendingDeleteItem = useMemo(() => {
        return items.find((i) => i.id === pendingDeleteId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pendingDeleteId]);

    useEffect(() => {
        (async () => {
            const items = await getItems({});
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
                pendingDeleteItem={pendingDeleteItem}
                onClose={() => setPendingDeleteId(null)}
                onConfirm={() => deleteRow()}
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
