import axios from 'axios';
import { useCallback, useState } from 'react';

const baseUrl = process.env.REACT_APP_API_URL;

const toQueryParams = (params: {}): string => {
    const queryParams = Object.entries(params).reduce<string[]>(
        (acc, [key, val]) => {
            if (Array.isArray(val)) {
                return [...acc, ...val.map((val) => `${key}=${val}`)];
            } else {
                return [...acc, `${key}=${val}`];
            }
        },
        []
    );

    return queryParams ? `?${queryParams.join('&')}` : '';
};

type Loading = {
    loading: boolean;
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

export const useGet = <Data, QueryParams = {}>(
    route: string
): UseGet<Data, QueryParams> => {
    const [loading, setLoading] = useState(false);

    const get = useCallback(
        async (params?: QueryParams) => {
            const url = baseUrl + route + (params ? toQueryParams(params) : '');

            setLoading(true);
            const { data } = await axios.get(url);
            setLoading(false);

            return data;
        },
        [route]
    );

    return {
        loading,
        get,
    };
};

export const useGetId = <Data, QueryParams = {}>(
    route: string
): UseGetId<Data, QueryParams> => {
    const [loading, setLoading] = useState(false);

    const getId = useCallback(
        async (id: number | string, params?: QueryParams) => {
            const url =
                baseUrl +
                route +
                `/${id}` +
                (params ? toQueryParams(params) : '');

            setLoading(true);
            const { data } = await axios.get(url);
            setLoading(false);

            return data;
        },
        [route]
    );

    return {
        loading,
        getId,
    };
};

export const usePost = <Data, Input>(route: string): UsePost<Data, Input> => {
    const [loading, setLoading] = useState(false);

    const post = useCallback(
        async (input: Input) => {
            const url = baseUrl + route;

            setLoading(true);
            const { data } = await axios.post(url, input);
            setLoading(false);

            return data;
        },
        [route]
    );

    return {
        loading,
        post,
    };
};

export const usePut = <Data, Input>(route: string): UsePut<Data, Input> => {
    const [loading, setLoading] = useState(false);

    const put = useCallback(
        async (id: string | number, input: Input) => {
            const url = baseUrl + route + `/${id}`;

            setLoading(true);
            const { data } = await axios.put(url, input);
            setLoading(false);

            return data;
        },
        [route]
    );

    return {
        loading,
        put,
    };
};

export const useDelete = (route: string): UseDelete => {
    const [loading, setLoading] = useState(false);

    const deleteFn = useCallback(
        async (id: string | number) => {
            const url = baseUrl + route + `/${id}`;

            setLoading(true);
            const { data } = await axios.delete(url);
            setLoading(false);

            return data;
        },
        [route]
    );

    return {
        loading,
        delete: deleteFn,
    };
};
