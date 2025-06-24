# create-typed-event

[![npm version](https://img.shields.io/npm/v/@misaka17535/create-typed-event.svg)](https://www.npmjs.com/package/@misaka17535/create-typed-event)

[中文](https://github.com/Misaka-0x447f/createTypedEvent/wiki/%E4%B8%AD%E6%96%87-README) | English

### **Typed, Autocomplete, One call unsubscribe, React is Optional. **  
A simple eventManager, with built-in react support.  
Proven and well-tested in private projects.

......And seriously, what's so bad about fly-wiring?

Project history on gist: https://gist.github.com/Misaka-0x447f/0c37018ae7bd944cbff54d27b6d4fd9f

## Compares

|                  | typed | easy to use | perf    | autocomplete | one call unsub | no React | latestValue |
|--------------------|------------|---------|-------|------|--------|------------|----------|
| create-typed-event | ✅          | ✅       | ✅     | ✅    | ✅      | ✅          | ✅        |
| redux              | *️⃣ 1      | ❌       | *️⃣ 5 | ✅    | ✅      | ✅          | ✅        |
| mitt               | *️⃣ 2      | ✅       | ✅     | ❌    | ❌      | ✅          | ❌        |
| jotai              | ✅          | *️⃣ 3   | ✅     | ✅    | ✅      | ❌          | *️⃣ 8    |
| valtio             | ✅          | *️⃣ 4   | *️⃣ 6 | ✅    | ✅      | ✅          | ✅        |
| rxjs               | ✅          | ❌       | *️⃣ 7 | ✅    | ✅      | ✅          | ✅        |

*1: Reducer required  
*2: All key shares same type  
*3: Two step create, atom & store  
*4: Proxy based, which means just like vue 3, has it's trace limitation.   
*5: Heavy slice  
*6: v8 may not play well with proxy  
*7: Really heavy even with rxjs subject  
*8: Need to use default store  

## Detailed compares
- redux
  - Toooooooooooo complex. To emit a state you have to create a new reducer, with a new store, a string store name...
- mitt / nodejs `EventEmitter`
  - Requires you to write event name just like node.js `EventEmitter`: `emitter.on('xxx'...`, which is not friendly to autocomplete. And why not put key in payload?
  - Does not return an unsub method.
  - Does not support getting current value.
- jotai
  - To create a equivalent, you have to create an atom, then a store. And it requires user to create store every time user needs to subscribe.
  - Does not support getting current value outside react context. See [jotai issue](https://github.com/pmndrs/jotai/discussions/2208)
- valtio
  - A good solution, but powered by Proxy, which is not really efficient and not working with complex object.
- rxjs
  - Its Objective: requires you to create an Observable/Subject object, with the "new" statement we hate.
  - Way much larger package size and more complex API.
- so many others
  - Almost every library I know requires you to write event name on subscription, and cannot auto-complete.
  - So I trust the solution I made can be unique and useful.

## Examples

Traditional unsubscribe:

```typescript
import { createTypedEvent } from '@misaka17535/create-typed-event'

type Payload = { ready: boolean }
const networkStateChange = createTypedEvent<Payload>()

const handler = (payload: Payload) => console.log(payload)
networkStateChange.sub(handler)
networkStateChange.dispatch({ready: true})
networkStateChange.unsub(handler)
```
`>>> { ready: true }`

Simplified unsubscribe:

```typescript
import { createTypedEvent } from '@misaka17535/create-typed-event'

const misakaStateChange = createTypedEvent<{ selfDestructionInProgress: boolean }>()
const unsub = misakaStateChange.sub((payload) => console.log(payload)) // returns unsub function without defining handler outside
misakaStateChange.dispatch({selfDestructionInProgress: true})
unsub()
```
`>>> { selfDestructionInProgress: true }`

Create an "event bus":

```typescript
import { createTypedEvent } from '@misaka17535/create-typed-event'

export const eventBus = {
    alice: createTypedEvent(),
    bob: createTypedEvent<{ isE2eEncryption: boolean }>()
}
eventBus.bob.dispatch({isE2eEncryption: true})
```

Supports react hook:

```typescript
import { createTypedEventMemorized } from '@misaka17535/create-typed-event/react'
const marketPriceUpdateEvent = createTypedEventMemorized<number>();

import { useTypedEventValue } from '@misaka17535/create-typed-event/react'
const [marketPrice, setMarketPrice, marketPriceRef] = useTypedEventValue(marketPriceUpdateEvent);
```

## API

#### `import { createTypedEvent, type TypedEvent } from '@misaka17535/create-typed-event'`

- `type TypedEvent<Payload>`
  - The type that "createTypedEvent" returns.

- `createTypedEvent<Payload>(dispatchLastValueOnSubscribe?: boolean): TypedEvent<Payload>`
  Create a new event unit.  
  - Parameter
    - `dispatchLastValueOnSubscribe`
      optional, default to `false`.  
      If `dispatchLastValueOnSubscribe` is true, it will dispatch the last value to new subscribers.
  - Returns an object with the following:
    - `sub(callback: (payload: Payload) => void): () => void`  
      Subscribe to event. Returns an unsub method that does not require original callback.
    - `unsub(callback: (payload: Payload) => void): void`
      Unsubscribe from event with the original callback.
    - `dispatch(payload: Payload): void`  
      Dispatch an event with the given payload.
    - `once(callback: (payload: Payload) => void): () => void`  
      Subscribe to event, but only once. Returns an unsub method that does not require original callback.
    - `get value(): Payload | undefined`  
      A [getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) to get the current value of the event.

---

#### `import { useTypedEvent, createTypedEventMemorized } from '@misaka17535/create-typed-event/react'`
  - `useTypedEvent(event: TypedEvent): HybridState`
    Use typed event as a React state.
    - Returns a tuple of:
      - `value: Payload | undefined`  
        The current value of the event.
      - `setValue: (payload: Payload) => void`  
        A function to set the value of the event.
      - `ref: React.MutableRefObject<Payload | undefined>`  
        A `ref` that holds the current value of the event, useful for accessing the latest value in effects or callbacks.
  - `createTypedEventMemorized<Payload>(dispatchLastValueOnSubscribe?: boolean)`
    Create `TypedEvent` within react component. Parameters and returns are the same as `createTypedEvent`.
