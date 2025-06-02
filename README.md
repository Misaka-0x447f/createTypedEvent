# createTypedEvent

A modern eventManager, bridging vanilla-js and reactive frameworks, with types to prevent errors.  
Proven and well-tested in private projects.  
更现代的事件管理器，打通原生 js 和响应式框架的桥梁，同时具备内建 payload 类型机制以减少错误和帮助自动填充。  
在内部项目中久经考验。  

## Examples

```typescript
type Payload = { ready: boolean }
const networkStateChange = createTypedEvent<Payload>()

const handler = (payload: Payload) => console.log(payload)
networkStateChange.sub(handler)
networkStateChange.dispatch({ready: true})
networkStateChange.unsub(handler)
```
`>>> { ready: true }`


```typescript
const misakaStateChange = createTypedEvent<{ selfDestructionInProgress: boolean }>()
const unsub = misakaStateChange.sub((payload) => console.log(payload)) // returns unsub function without defining handler outside
misakaStateChange.dispatch({selfDestructionInProgress: true})
unsub()
```
`>>> { selfDestructionInProgress: true }`


```typescript
export const eventBus = {
    alice: createTypedEvent(),
    bob: createTypedEvent<{ isE2eEncryption: boolean }>()
}
eventBus.bob.dispatch({isE2eEncryption: true})
```
`>>> { isE2eEncryption: true }`


## API

### Methods

- **sub**  
  Subscribe to event. Returns an unsub method that does not require original callback.  
  订阅事件。返回一个取消订阅方法，以便在不需要原始回调函数的情况下取消订阅。

- **unsub**  
  Unsubscribe to event. No parameters.  
  取消订阅事件。无需参数。

- **dispatch**  
  Simply dispatch payload to every subscriber.  
  将 payload 分发给每个订阅者。

- **once**  
  Only subscribe once.  
  仅订阅一次。

- **value**  
  Get the latest value. Useful when bridging to reactive frameworks.
  获取最新的值。这在将其用作响应式框架桥梁时很有用。

### Parameters

- **dispatchLastValueOnSubscribe**  
  If true, dispatch last value to new subscriber.  
  是否在初始订阅时分发上次的值。

## Release
To release, use release-it.
