import React, {
    FC,
    ReactNode,
    createContext,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { AlertProps } from '@mui/material/Alert';

interface Notification {
    msg: string;
    severity: AlertProps['severity'];
}

interface NotificationsInterface {
    notifications: Notification[];
    notifySuccess: (message: string) => void;
    notifyError: (message: string) => void;
    shift: () => void;
}

export const NotificationsContext = createContext<NotificationsInterface>(
    null as unknown as NotificationsInterface
);

const NOTIFICATION_EXPIRE_MS = 3000;

export const NotificationsProvider: FC<{ children?: ReactNode }> = ({
    children,
}) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const pushNotification = useCallback((notification: Notification) => {
        setNotifications((prevState) => [...prevState, notification]);
    }, []);

    const notifySuccess = useCallback(
        (msg: string) => {
            pushNotification({
                msg,
                severity: 'success',
            });
        },
        [pushNotification]
    );

    const notifyError = useCallback(
        (msg: string) => {
            pushNotification({
                msg,
                severity: 'error',
            });
        },
        [pushNotification]
    );

    const shift = useCallback(() => {
        setNotifications((prevState) => {
            return prevState.slice(1);
        });
    }, []);

    useEffect(() => {
        if (notifications.length && !timeoutRef.current) {
            timeoutRef.current = setTimeout(() => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                shift();
                timeoutRef.current = null;
            }, NOTIFICATION_EXPIRE_MS);
        }
    }, [notifications.length, shift]);

    const value: NotificationsInterface = {
        notifications,
        notifySuccess,
        notifyError,
        shift,
    };

    return (
        <NotificationsContext.Provider value={value}>
            {children}
        </NotificationsContext.Provider>
    );
};
