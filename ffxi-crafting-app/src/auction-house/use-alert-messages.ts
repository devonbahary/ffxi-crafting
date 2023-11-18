import { AlertProps } from '@mui/material/Alert';
import { useState } from 'react';

interface AlertMessage {
    msg: string;
    severity: AlertProps['severity'];
}

interface UseAlertMessages {
    alertMessages: AlertMessage[];
    pushSuccessMessage: (message: string) => void;
    pushErrorMessage: (message: string) => void;
    shiftAlertMessages: () => void;
}

export const useAlertMessages = (): UseAlertMessages => {
    const [alertMessages, setAlertMessages] = useState<AlertMessage[]>([]);

    const pushAlertMessage = (alertMessage: AlertMessage) => {
        setAlertMessages((prevState) => [...prevState, alertMessage]);
    };

    const pushSuccessMessage = (msg: string) => {
        pushAlertMessage({
            msg,
            severity: 'success',
        });
    };

    const pushErrorMessage = (msg: string) => {
        pushAlertMessage({
            msg,
            severity: 'error',
        });
    };

    const shiftAlertMessages = () => {
        setAlertMessages((prevState) => prevState.slice(1));
    };

    return {
        alertMessages,
        pushSuccessMessage,
        pushErrorMessage,
        shiftAlertMessages,
    };
};
