import axios, { AxiosResponse } from 'axios';
import { useCallback, useContext, useState } from 'react';
import { NotificationsContext } from '../notifications/NotificationsProvider';
import { Loading } from '../interfaces';

type UseApiOptions = {
    successMessage?: string;
    failureMessage?: string;
};

type UseGet<Data, QueryParams> = Loading & {
    get: (params?: QueryParams) => Promise<Data>;
};

type UseGetId<Data, QueryParams> = Loading & {
    getId: (id: number | string, params?: QueryParams) => Promise<Data>;
};

type UsePost<Data, Input> = Loading & {
    post: (input: Input) => Promise<Data>;
};

type UsePut<Data, Input> = Loading & {
    put: (id: number | string, input: Input) => Promise<Data>;
};

type UseDelete = Loading & {
    delete: (id: number | string) => Promise<void>;
};

const BASE_URL = process.env.REACT_APP_API_URL || '';

const toQueryParams = (params: {}): string => {
    const queryParams = Object.entries(params).reduce<string[]>(
        (acc, [key, val]) => {
            if (Array.isArray(val)) {
                return [...acc, ...val.map((val) => `${key}=${val}`)];
            } else if (val !== undefined) {
                return [...acc, `${key}=${val}`];
            }

            return acc;
        },
        []
    );

    return queryParams ? `?${queryParams.join('&')}` : '';
};

const useApiCallback = (
    apiRequest: (...args: any[]) => Promise<AxiosResponse>,
    options: UseApiOptions = {}
): Loading & {
    withLoadingAndNotifications: (...args: any) => Promise<any>;
} => {
    const [loading, setLoading] = useState(false);

    const { successMessage, failureMessage } = options;
    const { notifySuccess, notifyError } = useContext(NotificationsContext);

    const withLoadingAndNotifications = useCallback(
        async (...args: any) => {
            setLoading(true);

            try {
                const { data } = await apiRequest(...args);

                if (successMessage) {
                    notifySuccess(successMessage);
                }

                setLoading(false);

                return data;
            } catch (err: any) {
                const msg = failureMessage || 'Failure';

                if (err.response?.data) {
                    const data = err.response.data as any;

                    if (data.errors) {
                        for (const error of data.errors) {
                            notifyError(`${msg}: ${error.msg}`);
                        }
                    } else if (data.error) {
                        notifyError(`${msg}: ${data.error}`);
                    }
                } else if (err.message) {
                    notifyError(`${msg}: ${err.message}`);
                }

                setLoading(false);

                throw err;
            }
        },
        [apiRequest, notifySuccess, notifyError, successMessage, failureMessage]
    );

    return {
        loading,
        withLoadingAndNotifications,
    };
};

export const useGet = <Data, QueryParams = {}>(
    route: string,
    options: UseApiOptions = {}
): UseGet<Data, QueryParams> => {
    const get = useCallback(
        async (params?: QueryParams) => {
            const url =
                BASE_URL + route + (params ? toQueryParams(params) : '');
            return axios.get(url);
        },
        [route]
    );

    const { loading, withLoadingAndNotifications } = useApiCallback(
        get,
        options
    );

    return {
        loading,
        get: withLoadingAndNotifications,
    };
};

export const useGetId = <Data, QueryParams = {}>(
    route: string,
    options: UseApiOptions = {}
): UseGetId<Data, QueryParams> => {
    const getId = useCallback(
        async (id: number | string) => {
            const url = BASE_URL + route + `/${id}`;
            return axios.get(url);
        },
        [route]
    );

    const { loading, withLoadingAndNotifications } = useApiCallback(
        getId,
        options
    );

    return {
        loading,
        getId: withLoadingAndNotifications,
    };
};

export const usePost = <Data, Input>(
    route: string,
    options: UseApiOptions = {}
): UsePost<Data, Input> => {
    const post = useCallback(
        async (input: Input) => {
            const url = BASE_URL + route;
            return axios.post(url, input);
        },
        [route]
    );

    const { loading, withLoadingAndNotifications } = useApiCallback(
        post,
        options
    );

    return {
        loading,
        post: withLoadingAndNotifications,
    };
};

export const usePut = <Data, Input>(
    route: string,
    options: UseApiOptions = {}
): UsePut<Data, Input> => {
    const put = useCallback(
        async (id: string | number, input: Input) => {
            const url = BASE_URL + route + `/${id}`;
            return axios.put(url, input);
        },
        [route]
    );

    const { loading, withLoadingAndNotifications } = useApiCallback(
        put,
        options
    );

    return {
        loading,
        put: withLoadingAndNotifications,
    };
};

export const useDelete = (
    route: string,
    options: UseApiOptions = {}
): UseDelete => {
    const deleteFn = useCallback(
        async (id: string | number) => {
            const url = BASE_URL + route + `/${id}`;
            return axios.delete(url);
        },
        [route]
    );

    const { loading, withLoadingAndNotifications } = useApiCallback(
        deleteFn,
        options
    );

    return {
        loading,
        delete: withLoadingAndNotifications,
    };
};
