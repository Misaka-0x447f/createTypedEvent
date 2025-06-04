/**
 * @author 447f@misaka.org
 * A modern eventManager, typed to prevent errors.
 * 更现代的事件管理器，同时具备内建 payload 类型机制以减少错误和帮助自动填充。
 * @example
 * type Payload = {ready: boolean}
 * const networkStateChange = createTypedEvent<Payload>()
 * const handler = (payload: Payload) => console.log(payload)
 * networkStateChange.sub(handler)
 * networkStateChange.dispatch({ready: true})
 * networkStateChange.unsub(handler)
 * @example
 * const misakaStateChange = createTypedEvent<{selfDestructionInProgress: boolean}>()
 * const unsub = createTypedEvent.sub(console.log) // returns unsub function without define handler outside.
 * unsub()
 * @example
 * export const eventBus = {
 *   alice: createTypedEvent(),
 *   bob: createTypedEvent<{isE2eEncryption: boolean}>()
 * }
 * eventBus.bob.dispatch({isE2eEncryption: true})
 *
 * @member sub      Subscribe to event. Returns an unsub method that does not require original callback.
 * @member unsub    Unsubscribe to event. No original callback required.
 * @member dispatch Simply dispatch payload to every subscriber.
 * @member once     Only subscribe once.
 * @member value    Get the latest value.
 *
 * @param dispatchLastValueOnSubscribe If true, dispatch last value to new subscriber.
 *
 * @member sub     订阅事件。返回一个取消订阅方法，以便在不需要原始回调函数的情况下取消订阅。
 * @member unsub   取消订阅事件。可以不要原始回调函数。
 * @member dispatch 仅将 payload 分发给每个订阅者。
 * @member once    仅订阅一次。
 * @member value   获取最新的值。
 */

type cb<T> = (payload: T) => void;

export const createTypedEvent = <T = void>({
                                               dispatchLastValueOnSubscribe = false,
                                               initialValue,
                                           }: {
    dispatchLastValueOnSubscribe?: boolean;
    initialValue?: T;
} = {}) => {
    const history: T[] = initialValue ? [initialValue] : [];
    const cbs: Array<cb<T>> = [];
    const instance = {
        sub: (cb: cb<T>) => {
            cbs.push(cb);
            if (dispatchLastValueOnSubscribe && history.length > 0) cb(history[0]);
            return () => instance.unsub(cb);
        },
        unsub: (cb: cb<T>) => {
            const index = cbs.indexOf(cb);
            if (index === -1) return;
            cbs.splice(index, 1);
        },
        dispatch: (payload: T) => {
            // history update must go before callbacks,
            // to ensure callbacks can get the latest value
            history[0] = payload;
            cbs.map(v => v(payload));
        },
        once: (cb: cb<T>) => {
            instance.sub((arg: T) => {
                cb(arg);
                instance.unsub(cb);
            });
            return () => instance.unsub(cb);
        },
        get value() {
            return history[0];
        },
        set value(_) {
            throw new Error('createTypedEvent.value is read-only.');
        },
    };
    return instance;
};


export type TypedEvent<T = void> = ReturnType<typeof createTypedEvent<T>>;
