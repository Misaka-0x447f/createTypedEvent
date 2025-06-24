import {createTypedEvent, TypedEvent} from "./index";
import {Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState} from "react";

const isFunction = (obj: any): obj is (...args: any) => any => {
    return !!(obj && obj.constructor && obj.call && obj.apply);
};

// 临时直接嵌入 useHybridState 的实现，后续发包再改
export const useHybridState = <T>(initialValue?: T) => {
    const [state, setState] = useState(initialValue);
    const ref = useRef(initialValue);
    const set = useCallback((val: T) => {
        if (isFunction(val)) {
            ref.current = val(ref.current);
        } else {
            ref.current = val;
        }
        setState(val);
    }, []);
    const refBehindProxy = useMemo(
        () =>
            new Proxy(ref, {
                set: () => {
                    throw new Error(
                        "Do not change value of this ref, it's readonly. Instead, use the set method.",
                    );
                },
            }),
        [],
    );
    return [state, set, refBehindProxy] as [
        typeof state,
        Dispatch<SetStateAction<T>>,
        {
            readonly current: T;
        },
    ];
};

export const createTypedEventMemorized: typeof createTypedEvent = (...args) =>
    useMemo(() => createTypedEvent(...args), []);

/**
 * @description
 * 获取 TypedEvent 事件管线中的最新 value。例如：
 * @example
 * const [marketPrice, setMarketPrice, marketPriceRef] = useTypedEventValue(marketPriceUpdateEvent);
 */
export const useTypedEventValue = <T = void>(event: TypedEvent<T>) => {
    const [value, setValue, valueRef] = useHybridState<T>(event.value);
    useEffect(() => {
        return event.sub(setValue);
    }, []);
    return [value, event.dispatch, valueRef] as const;
};
