# create-typed-event

[![npm version](https://img.shields.io/npm/v/@misaka17535/create-typed-event.svg)](https://www.npmjs.com/package/@misaka17535/create-typed-event)

English | [中文](https://github.com/Misaka-0x447f/createTypedEvent/wiki/%E4%B8%AD%E6%96%87-README)

A modern eventManager, bridging vanilla-js and reactive frameworks, with types to prevent errors.  
Proven and well-tested in private projects.

## Compared to others
- rxjs
  - Its Objective: requires you to create an Observable/Subject object.
  - Way much larger package size and more complex API.
- mitt
  - Requires you to write event name just like node.js does: `emitter.on('xxx'...`
  - Does not return an unsub method.
  - Does not support getting current value.
- valtio
  - A good solution, but powered by Proxy, which is not really efficient and not working with complex object.
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
