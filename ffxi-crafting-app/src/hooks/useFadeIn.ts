import React, { MutableRefObject, useRef } from 'react';
import { useIntersectionObserver } from 'usehooks-ts';

type UseFadeInOutput<T extends HTMLElement> = {
    ref: MutableRefObject<T | null>;
    fadeIn: boolean;
};

export const useFadeIn = <T extends HTMLElement>(): UseFadeInOutput<T> => {
    const ref = useRef<T | null>(null);
    const entry = useIntersectionObserver(ref, {});

    return {
        ref,
        fadeIn: !!entry?.isIntersecting,
    };
};
