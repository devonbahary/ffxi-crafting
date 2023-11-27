import React, {
    FC,
    ReactElement,
    Ref,
    forwardRef,
    useEffect,
    useState,
} from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { TransitionProps } from '@mui/material/transitions';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Item } from '../interfaces';

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: ReactElement<any, any>;
    },
    ref: Ref<unknown>
) {
    return <Fade ref={ref} {...props} />;
});

type DeleteConfirmationModalProps = {
    pendingDeleteItem?: Partial<Item>;
    onClose: () => void;
    onConfirm: () => void;
    loadingDeleteItem: boolean;
};

export const DeleteConfirmationModal: FC<DeleteConfirmationModalProps> = ({
    pendingDeleteItem,
    onClose,
    onConfirm,
    loadingDeleteItem,
}) => {
    const [name, setName] = useState<string | undefined>();

    useEffect(() => {
        // persist name even after pendingDeleteItem nulls
        if (pendingDeleteItem?.name) setName(pendingDeleteItem.name);
    }, [pendingDeleteItem]);

    return (
        <Dialog
            open={Boolean(pendingDeleteItem)}
            TransitionComponent={Transition}
            keepMounted
            onClose={onClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    Delete {name}?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item flex={1} textAlign="center">
                        <IconButton
                            onClick={onClose}
                            disabled={loadingDeleteItem}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Grid>
                    <Grid item flex={1} textAlign="center">
                        {loadingDeleteItem ? (
                            <IconButton color="primary">
                                <CircularProgress size={20} />
                            </IconButton>
                        ) : (
                            <IconButton onClick={onConfirm} color="primary">
                                <CheckIcon />
                            </IconButton>
                        )}
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    );
};
