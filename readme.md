# stun

Session Traversal Utilities for NAT (STUN) client / server. Implements [RFC5389](https://tools.ietf.org/html/rfc5389).

## Install

```
npm i stun
```

## Usage

```js
const stun = require('../')

const { STUN_BINDING_REQUEST, STUN_ATTR_XOR_MAPPED_ADDRESS } = stun.constants

const server = stun.createServer()
const request = stun.createMessage(STUN_BINDING_REQUEST)

const remoteServer = {
  port: 19302,
  address: 'stun.l.google.com'
}

server.once('bindingResponse', stunMsg => {
  console.log('your ip:', stunMsg.getAttribute(STUN_ATTR_XOR_MAPPED_ADDRESS).value.address)
  server.close()
})

server.send(request, remoteServer)
```

## API

## License

MIT, 2017 (c) Dmitriy Tsvettsikh
