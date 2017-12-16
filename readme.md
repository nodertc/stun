# stun

[![Build Status](https://travis-ci.org/reklatsmasters/stun.svg?branch=master)](https://travis-ci.org/reklatsmasters/stun)
[![npm](https://img.shields.io/npm/v/stun.svg)](https://npmjs.org/package/stun)
[![node](https://img.shields.io/node/v/stun.svg)](https://npmjs.org/package/stun)
[![license](https://img.shields.io/npm/l/stun.svg)](https://npmjs.org/package/stun)
[![downloads](https://img.shields.io/npm/dm/stun.svg)](https://npmjs.org/package/stun)
[![Greenkeeper badge](https://badges.greenkeeper.io/reklatsmasters/stun.svg)](https://greenkeeper.io/)

Session Traversal Utilities for NAT (STUN) server. Implements [RFC5389](https://tools.ietf.org/html/rfc5389).

## Install

```
npm i stun
```

## Usage

```js
const stun = require('stun')

const { STUN_BINDING_REQUEST, STUN_ATTR_XOR_MAPPED_ADDRESS } = stun.constants

const server = stun.createServer()
const request = stun.createMessage(STUN_BINDING_REQUEST)

server.once('bindingResponse', stunMsg => {
  console.log('your ip:', stunMsg.getAttribute(STUN_ATTR_XOR_MAPPED_ADDRESS).value.address)

  server.close()
})

server.send(request, 19302, 'stun.l.google.com')
```

## API

#### `createMessage(type): StunMessage`

Creates an `StunMessage` object of the specified `type` with random `transaction` field. The `type` argument is a number that should be a message type. See `constants` below.

#### `createServer([socket: dgram.Socket]): StunServer`

Creates a `StunServer` object. An optional `socket` argument should be instance of `dgram.Socket`. If `socket` is not specifed, the `dgram.Socket` will be created with `udp4` type and will bound to the "all interfaces" address on a random port.

#### `validateFingerprint(message: StunMessage): bool`

Check a `FINGERPRINT` attribute if it is specifed.

#### `validateMessageIntegrity(message: StunMessage, key: string): bool`

Check a `MESSAGE_INTEGRITY` attribute if it is specifed.

```js
stunServer.on('bindingResponse', (stunMsg) => {
  if (!stun.validateFingerprint(stunMsg)) {
    // do stuff...
  }

  if (!stun.validateMessageIntegrity(stunMsg, icePassword)) {
    // do stuff...
  }
})
```

#### `class StunMessage`

The `StunMessage` class is an utility that encapsulates the `STUN` protocol.

Instances of the `StunMessage` class can be created using the `stun.createMessage()` function or the `StunMessage.from` method.

* **static `from(message: Buffer): StunMessage`**

Creates a `StunMessage` object from a `message` Buffer.

* **get `type`**
* **get `transactionId`**

Returns the `type` and `transactionId` fields from the current message.

* **`setType(type)`**

Set the type of the message. The `type` argument is a number that should be a message type. See `constants` below.

* **`setTransactionID(transaction: Buffer): bool`**

Set the transaction id of the message. The `transaction` argument should be a `Buffer` and have length 12 bytes.

* **`isLegacy(): bool`**

Returns true if the message confirms to RFC3489 rather than RFC5389.

* **`addAttribute(type, address: string, port: number)`**

Adds a `type` attribute to the current message. The `type` argument should be one of `STUN_ATTR_MAPPED_ADDRESS`, `STUN_ATTR_ALTERNATE_SERVER`, `STUN_ATTR_XOR_MAPPED_ADDRESS`.

```js
stunMsg.addAttribute(STUN_ATTR_XOR_MAPPED_ADDRESS, '8.8.8.8', 19302)
```

* **`addAttribute(type, value: String|Buffer[, encoding: string = 'utf8'])`**

Adds a `type` attribute to the current message. The `type` argument should be one of `STUN_ATTR_USERNAME`, `STUN_ATTR_REALM`, `STUN_ATTR_NONCE`, `STUN_ATTR_SOFTWARE`, `STUN_ATTR_ORIGIN`, `STUN_ATTR_USE_CANDIDATE`, `STUN_ATTR_ICE_CONTROLLED`, `STUN_ATTR_ICE_CONTROLLING`.

```js
stunMsg.addAttribute(STUN_ATTR_SOFTWARE, 'node/8.2.0 stun/1.0.0')
```

* **`addAttribute(type, value: number)`**

Adds a `type` attribute to the current message. The `type` argument should be one of `STUN_ATTR_RETRANSMIT_COUNT`, `STUN_ATTR_PRIORITY`, `STUN_ATTR_NETWORK_INFO`, `STUN_ATTR_NOMINATION`.

```js
stunMsg.addAttribute(STUN_ATTR_PRIORITY, 123)
```

* **`addAttribute(type, value: array<number>)`**

Adds a `type` attribute to the current message. The `type` argument should be `STUN_ATTR_UNKNOWN_ATTRIBUTES`.

```js
stunMsg.addAttribute(STUN_ATTR_UNKNOWN_ATTRIBUTES, [2, 3, 4])
```

* **`addAttribute(type, code: number, reason: string)`**

Adds a `type` attribute to the current message. The `type` argument should be `STUN_ATTR_ERROR_CODE`.

```js
stunMsg.addAttribute(STUN_ATTR_ERROR_CODE, STUN_CODE_UNAUTHORIZED, STUN_REASON_UNAUTHORIZED)
```

* **`getAttribute(type): StunAttribute`**

Returns the `StunAttribute` attribute of the specified `type`. The `type` argument is a number that should be an attribute type. See `constants` below.

* **`removeAttribute(type): bool`**

Remove a `type` attribute from the current message. Returns true if an attribute was removed. The `type` argument is a number that should be an attribute type. See `constants` below.

* **get `count: number`**

Returns the number of an attributes in the current message.

* **`addMessageIntegrity(key: string)`**

Adds a `MESSAGE-INTEGRITY` attribute that is valid for the current message. The `key` is the HMAC key used to generate the cryptographic HMAC hash.

* **`addFingerprint()`**

Adds a `FINGERPRINT` attribute that is valid for the current message.

* **`toBuffer(): Buffer`**

Converts a `StunMessage` object to the buffer.

#### `class StunServer`

The `StunServer` class is an EventEmitter that encapsulates a STUN server.

* **`new StunServer(socket: dgram.Socket)`**

Creates a new `StunServer` object. The `socket` argument should be an instance of `dgram.Socket`. The incoming message is silently ignored when it is not a `stun` one.

* **`send(message: StunMessage, port: number, address: string[, cb: function])`**

Sends the `StunMessage` message on the socket. The destination `port` and `address` must be specified. An optional `callback` function will be called when the message has been sent.

* **`close()`**

Stops the processing of the incoming messages and emits `close` event.

* **Event: `bindingRequest`**

Emitted when the `STUN_BINDING_REQUEST` message is available on a socket.

* **Event: `bindingIndication`**

Emitted when the `STUN_BINDING_INDICATION` message is available on a socket.

* **Event: `bindingResponse`**

Emitted when the `STUN_BINDING_RESPONSE` message is available on a socket.

* **Event: `bindingError`**

Emitted when the `STUN_BINDING_ERROR_RESPONSE` message is available on a socket.

* **Event: `close`**

Emitted when the server closes.

#### **`class StunAttribute`**

The `StunAttribute` class is an utility for adding an attributes to the `StunMessage` message.

* **get `type`**

Returns the attribute type. See `constants` below.

* **get `value`**

Returns the value of the attribute. It depends on the value type of the attribute.

```js
stunMsg.getAttribute(STUN_ATTR_USERNAME).value        // string
stunMsg.getAttribute(STUN_ATTR_PRIORITY).value        // number
stunMsg.getAttribute(STUN_ATTR_MAPPED_ADDRESS).value  // object
```

#### **`constants: object`**

These are the types of STUN messages defined in RFC 5389:

* `STUN_BINDING_REQUEST`
* `STUN_BINDING_INDICATION`
* `STUN_BINDING_RESPONSE`
* `STUN_BINDING_ERROR_RESPONSE`

Thsese are all known STUN attributes, defined in RFC 5389 and elsewhere:

* `STUN_ATTR_MAPPED_ADDRESS`
* `STUN_ATTR_USERNAME`
* `STUN_ATTR_MESSAGE_INTEGRITY`
* `STUN_ATTR_ERROR_CODE`
* `STUN_ATTR_UNKNOWN_ATTRIBUTES`
* `STUN_ATTR_REALM`
* `STUN_ATTR_NONCE`
* `STUN_ATTR_XOR_MAPPED_ADDRESS`
* `STUN_ATTR_SOFTWARE`
* `STUN_ATTR_ALTERNATE_SERVER`
* `STUN_ATTR_FINGERPRINT`
* `STUN_ATTR_ORIGIN`
* `STUN_ATTR_RETRANSMIT_COUNT`
* `STUN_ATTR_PRIORITY`
* `STUN_ATTR_USE_CANDIDATE`
* `STUN_ATTR_ICE_CONTROLLED`
* `STUN_ATTR_ICE_CONTROLLING`
* `STUN_ATTR_NOMINATION`
* `STUN_ATTR_NETWORK_INFO`

These are the types of STUN error codes defined in RFC 5389 and 5245:

* `STUN_CODE_TRY_ALTERNATE`
* `STUN_CODE_BAD_REQUEST`
* `STUN_CODE_UNAUTHORIZED`
* `STUN_CODE_UNKNOWN_ATTRIBUTE`
* `STUN_CODE_STALE_CREDENTIALS`
* `STUN_CODE_STALE_NONCE`
* `STUN_CODE_SERVER_ERROR`
* `STUN_CODE_GLOBAL_FAILURE`
* `STUN_CODE_ROLE_CONFLICT`

These are the strings for the error codes above:

* `STUN_REASON_TRY_ALTERNATE`
* `STUN_REASON_BAD_REQUEST`
* `STUN_REASON_UNAUTHORIZED`
* `STUN_REASON_UNKNOWN_ATTRIBUTE`
* `STUN_REASON_STALE_CREDENTIALS`
* `STUN_REASON_STALE_NONCE`
* `STUN_REASON_SERVER_ERROR`
* `STUN_REASON_ROLE_CONFLICT`

## License

MIT, 2017 (c) Dmitriy Tsvettsikh
