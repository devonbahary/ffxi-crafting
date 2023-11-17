import { AlertProps } from '@mui/material/Alert';
import { useState } from 'react';

interface AlertMessage {
    msg: string;
    severity: AlertProps['severity'];
}

interface UseAlertMessages {
    alertMessages: AlertMessage[];
    pushAlertMessage: (alertMessage: AlertMessage) => void;
    shiftAlertMessages: () => void;
}

export const useAlertMessages = (): UseAlertMessages => {
    const [alertMessages, setAlertMessages] = useState<AlertMessage[]>([]);

    const pushAlertMessage = (alertMessage: AlertMessage) => {
        setAlertMessages((prevState) => [...prevState, alertMessage]);
    };

    const shiftAlertMessages = () => {
        setAlertMessages((prevState) => prevState.slice(1));
    };

    return {
        alertMessages,
        pushAlertMessage,
        shiftAlertMessages,
    };
};
