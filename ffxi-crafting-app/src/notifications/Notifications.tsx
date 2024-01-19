import React, { FC, useContext } from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { NotificationsContext } from './NotificationsProvider';

export const Notifications: FC = () => {
    const { notifications, shift } = useContext(NotificationsContext);

    return (
        <Snackbar open={notifications.length > 0} onClose={() => shift()}>
            {notifications.length ? (
                <Alert
                    severity={notifications[0].severity}
                    onClose={() => shift()}
                >
                    {notifications[0].msg}
                </Alert>
            ) : undefined}
        </Snackbar>
    );
};
