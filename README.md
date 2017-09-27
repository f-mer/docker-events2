# docker-events2
Listen to docker events

## Usage
```js
var events = require('docker-events')()

events.on('service:create', function onServiceCreate (event) {
  console.log('service created')
})
events.on('service:remove', function onServiceRemove (event) {
  console.log('service removed')
})
events.on('*', function onAny (event) {
  console.log('something happened')
})
```

## API
### `emitter = DockerEvents([opts])`
Returns an EventEmitter. Event names are composed out of event type
(container, service, ..) and action (create, update, remove, ..): `Type:Action`.

[api docs](https://docs.docker.com/engine/api/v1.31/#operation/SystemEvents)

### `emiterr.start([cb(err, stream)])`
Starts listening for events emitted by the docker engine.

### `emiterr.stop()`
Stops listening for events emitted by the docker engine.

### `emitter.on(eventName, listener(data))`
Listen to an event. If the event name is `*` all events are catched.

## Installation
```
npm i docker-events2
```
## License
[MIT](https://tldrlegal.com/license/mit-license)
