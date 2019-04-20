# stun

[![Build Status](https://travis-ci.org/nodertc/stun.svg?branch=master)](https://travis-ci.org/nodertc/stun)
[![npm](https://img.shields.io/npm/v/stun.svg)](https://npmjs.org/package/stun)
[![node](https://img.shields.io/node/v/stun.svg)](https://npmjs.org/package/stun)
[![license](https://img.shields.io/npm/l/stun.svg)](https://npmjs.org/package/stun)
[![downloads](https://img.shields.io/npm/dm/stun.svg)](https://npmjs.org/package/stun)
[![Coverage Status](https://coveralls.io/repos/github/nodertc/stun/badge.svg?branch=master)](https://coveralls.io/github/nodertc/stun?branch=master)
[![Gitter chat](https://badges.gitter.im/nodertc.png)](https://gitter.im/nodertc/community)

Session Traversal Utilities for NAT (STUN) server. Implements [RFC5389](https://tools.ietf.org/html/rfc5389) with partial support [RFC5766](https://tools.ietf.org/html/rfc5766), [RFC5245](https://tools.ietf.org/html/rfc5245), [RFC5780](https://tools.ietf.org/html/rfc5780).

### Support

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/purple_img.png)](https://www.buymeacoffee.com/reklatsmasters)

## Install

```
npm i stun
```

## Usage

```js
const stun = require('stun')

const {
  STUN_BINDING_REQUEST,
  STUN_ATTR_XOR_MAPPED_ADDRESS,
  STUN_EVENT_BINDING_RESPONSE,
} = stun.constants;

const server = stun.createServer()
const request = stun.createMessage(STUN_BINDING_REQUEST)

server.once(STUN_EVENT_BINDING_RESPONSE, stunMsg => {
  console.log('your ip:', stunMsg.getAttribute(STUN_ATTR_XOR_MAPPED_ADDRESS).value.address)

  server.close()
})

server.send(request, 19302, 'stun.l.google.com')
```

## CLI

```bash
$ npm i -g stun
$ stun # started on udp/0.0.0.0:19302
```

## API

* [`createMessage(type): StunMessage`](#create-message)
* [`createTransaction(): Buffer`](#create-transaction)
* [`createServer([socket: dgram.Socket]): StunServer`](#create-server)
* [`validateFingerprint(message: StunMessage): bool`](#validate-fingerprint)
* [`validateMessageIntegrity(message: StunMessage, key: string): bool`](#validate-message-integrity)
* [`class StunMessage`](#class-stun-message)
  * [`static from(message: Buffer): StunMessage`](#class-stun-message-static-from)
  * [`get type`](#class-stun-message-get-type)
  * [`get transactionId`](#class-stun-message-get-type)
  * [`setType(type)`](#class-stun-message-set-type)
  * [`setTransactionID(transaction: Buffer): bool`](#class-stun-message-set-transaction-id)
  * [`isLegacy(): bool`](#class-stun-message-is-legacy)
  * [`addAttribute(type, address: string, port: number)`](#class-stun-message-add-attribute-address)
  * [`addAttribute(type, value: String|Buffer[, encoding: string = 'utf8'])`](#class-stun-message-add-attribute-string)
  * [`addAttribute(type, value: number)`](#class-stun-message-add-attribute-number)
  * [`addAttribute(type, value: array<number>)`](#class-stun-message-add-attribute-array)
  * [`addAttribute(type, code: number, reason: string)`](#class-stun-message-add-attribute-error)
  * [`addAddress(ip: string, port: number): StunAddressAttribute`](#class-stun-message-add-address)
  * [`addAlternateServer(ip: string, port: number): StunAddressAttribute`](#class-stun-message-add-alternate-server)
  * [`addXorAddress(ip: string, port: number): StunXorAddressAttribute`](#class-stun-message-add-xor-address)
  * [`addUsername(username: string): StunByteStringAttribute`](#class-stun-message-add-username)
  * [`addRealm(realm: string): StunByteStringAttribute`](#class-stun-message-add-realm)
  * [`addNonce(nonce: string): StunByteStringAttribute`](#class-stun-message-add-nonce)
  * [`addSoftware(software: string): StunByteStringAttribute`](#class-stun-message-add-software)
  * [`addUnknownAttributes(attributes: number[]): StunUInt16ListAttribute`](#class-stun-message-add-unknown-attributes)
  * [`addError(code: number, reason: string): StunErrorCodeAttribute`](#class-stun-message-add-error)
  * [`addPriority(priority: number): StunUInt32Attribute`](#class-stun-message-add-priority)
  * [`addUseCandidate(): StunByteStringAttribute`](#class-stun-message-add-use-candidate)
  * [`addIceControlled(tiebreaker: Buffer): StunByteStringAttribute`](#class-stun-message-add-ice-controlled)
  * [`addIceControlling(tiebreaker: Buffer): StunByteStringAttribute`](#class-stun-message-add-ice-controlling)
  * [`getAttribute(type): StunAttribute`](#class-stun-message-get-attribute)
  * [`removeAttribute(type): bool`](#class-stun-message-remove-attribute)
  * [`get count: number`](#class-stun-message-get-count)
  * [`addMessageIntegrity(key: string)`](#class-stun-message-add-message-integrity)
  * [`addFingerprint()`](#class-stun-message-add-fingerprint)
  * [`toBuffer(): Buffer`](#class-stun-message-to-buffer)
* [`class StunServer`](#class-stun-server)
  * [`new StunServer(socket: dgram.Socket)`](#class-stun-server-new)
  * [`send(message: StunMessage, port: number, address: string[, cb: function])`](#class-stun-server-send)
  * [`close()`](#class-stun-server-close)
  * [`Event: bindingRequest`](#class-stun-server-event-binding-request)
  * [`Event: bindingIndication`](#class-stun-server-event-binding-indication)
  * [`Event: bindingResponse`](#class-stun-server-event-binding-response)
  * [`Event: bindingError`](#class-stun-server-event-binding-error)
  * [`Event: close`](#class-stun-server-event-close)
  * [`Event: error`](#class-stun-server-event-error)
* [`class StunAttribute`](#class-stun-attribute)
  * [`get type`](#class-stun-attribute-get-type)
  * [`get value`](#class-stun-attribute-get-value)
* [`constants: object`](#constants)
* [`class StunError`](#class-stun-error)
* [`class StunMessageError`](#class-stun-message-error)
* [`class StunResponseError`](#class-stun-response-error)

<a name="create-message" />

#### `createMessage(type): StunMessage`

Creates an `StunMessage` object of the specified `type` with random `transaction` field. The `type` argument is a number that should be a message type. See `constants` below.

<a name="create-transaction" />

#### `createTransaction(): Buffer`

Create transaction id for STUN message. Follow [RFC5389](https://tools.ietf.org/html/rfc5389).

<a name="create-server" />

#### `createServer(options: object): StunServer`

* `options.type: string`

The type of socket. Must be 'udp'. Required.

* `options.socket: dgram.Socket`

Creates a `StunServer` object of the specified type. The `type` argument should be 'udp' at the moment. An optional `socket` argument should be instance of `dgram.Socket`. If `socket` is not specifed, the `dgram.Socket` will be created with `udp4` type and will bound to the "all interfaces" address on a random port.

<a name="validate-fingerprint" />

#### `validateFingerprint(message: StunMessage): bool`

Check a `FINGERPRINT` attribute if it is specifed.

<a name="validate-message-integrity" />

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

<a name="class-stun-message" />

#### `class StunMessage`

The `StunMessage` class is an utility that encapsulates the `STUN` protocol.

Instances of the `StunMessage` class can be created using the `stun.createMessage()` function or the `StunMessage.from` method.

<a name="class-stun-message-static-from" />

* **static `from(message: Buffer): StunMessage`**

Creates a `StunMessage` object from a `message` Buffer.

<a name="class-stun-message-get-type" />

* **get `type`**
* **get `transactionId`**

Returns the `type` and `transactionId` fields from the current message.

<a name="class-stun-message-set-type" />

* **`setType(type)`**

Set the type of the message. The `type` argument is a number that should be a message type. See `constants` below.

<a name="class-stun-message-set-transaction-id" />

* **`setTransactionID(transaction: Buffer): bool`**

Set the transaction id of the message. The `transaction` argument should be a `Buffer` and have length 12 bytes.

<a name="class-stun-message-is-legacy" />

* **`isLegacy(): bool`**

Returns true if the message confirms to RFC3489 rather than RFC5389.

<a name="class-stun-message-add-attribute-address" />

* **`addAttribute(type, address: string, port: number)`**

Adds a `type` attribute to the current message. The `type` argument should be one of:
  * `STUN_ATTR_MAPPED_ADDRESS`
  * `STUN_ATTR_ALTERNATE_SERVER`
  * `STUN_ATTR_XOR_MAPPED_ADDRESS`
  * `STUN_ATTR_RESPONSE_ORIGIN`
  * `STUN_ATTR_OTHER_ADDRESS`
  * `STUN_ATTR_XOR_PEER_ADDRESS`
  * `STUN_ATTR_XOR_RELAYED_ADDRESS`.

```js
stunMsg.addAttribute(STUN_ATTR_XOR_MAPPED_ADDRESS, '8.8.8.8', 19302)
```

<a name="class-stun-message-add-attribute-string" />

* **`addAttribute(type, value: String|Buffer[, encoding: string = 'utf8'])`**

Adds a `type` attribute to the current message. The `type` argument should be one of:
  * `STUN_ATTR_USERNAME`
  * `STUN_ATTR_REALM`
  * `STUN_ATTR_NONCE`
  * `STUN_ATTR_SOFTWARE`
  * `STUN_ATTR_ORIGIN`
  * `STUN_ATTR_USE_CANDIDATE`
  * `STUN_ATTR_ICE_CONTROLLED`
  * `STUN_ATTR_ICE_CONTROLLING`
  * `STUN_ATTR_DATA`
  * `STUN_ATTR_EVEN_PORT`
  * `STUN_ATTR_RESERVATION_TOKEN`
  * `STUN_ATTR_DONT_FRAGMENT`
  * `STUN_ATTR_PADDING`.

```js
stunMsg.addAttribute(STUN_ATTR_SOFTWARE, 'node/8.2.0 stun/1.0.0')
```

<a name="class-stun-message-add-attribute-number" />

* **`addAttribute(type, value: number)`**

Adds a `type` attribute to the current message. The `type` argument should be one of:
  * `STUN_ATTR_RETRANSMIT_COUNT`
  * `STUN_ATTR_PRIORITY`
  * `STUN_ATTR_NETWORK_INFO`
  * `STUN_ATTR_NOMINATION`
  * `STUN_ATTR_CHANNEL_NUMBER`
  * `STUN_ATTR_LIFETIME`
  * `STUN_ATTR_REQUESTED_TRANSPORT`
  * `STUN_ATTR_CHANGE_REQUEST`
  * `STUN_ATTR_RESPONSE_PORT`.

```js
stunMsg.addAttribute(STUN_ATTR_PRIORITY, 123)
```

<a name="class-stun-message-add-attribute-array" />

* **`addAttribute(type, value: array<number>)`**

Adds a `type` attribute to the current message. The `type` argument should be `STUN_ATTR_UNKNOWN_ATTRIBUTES`.

```js
stunMsg.addAttribute(STUN_ATTR_UNKNOWN_ATTRIBUTES, [2, 3, 4])
```

<a name="class-stun-message-add-attribute-error" />

* **`addAttribute(type, code: number, reason: string)`**

Adds a `type` attribute to the current message. The `type` argument should be `STUN_ATTR_ERROR_CODE`.

```js
stunMsg.addAttribute(STUN_ATTR_ERROR_CODE, STUN_CODE_UNAUTHORIZED, STUN_REASON_UNAUTHORIZED)
```

<a name="class-stun-message-add-address" />

* **`addAddress(ip: string, port: number): StunAddressAttribute`**

Adds a `MAPPED-ADDRESS` attribute to the message.

See [RFC5389](https://tools.ietf.org/html/rfc5389#section-15.1)

<a name="class-stun-message-add-alternate-server" />

* **`addAlternateServer(ip: string, port: number): StunAddressAttribute`**

Adds a `ALTERNATE-SERVER` attribute to the message.

See [RFC5389](https://tools.ietf.org/html/rfc5389#section-15.11)

<a name="class-stun-message-add-xor-address" />

* **`addXorAddress(ip: string, port: number): StunXorAddressAttribute`**

Adds a `XOR-MAPPED-ADDRESS` attribute to the message.

See [RFC5389](https://tools.ietf.org/html/rfc5389#section-15.2)

<a name="class-stun-message-add-username" />

* **`addUsername(username: string): StunByteStringAttribute`**

Adds a `USERNAME` attribute to the message.

See [RFC5389](https://tools.ietf.org/html/rfc5389#section-15.3)

<a name="class-stun-message-add-realm" />

* **`addRealm(realm: string): StunByteStringAttribute`**

Adds a `REALM` attribute to the message.

See [RFC5389](https://tools.ietf.org/html/rfc5389#section-15.7)

<a name="class-stun-message-add-nonce" />

* **`addNonce(nonce: string): StunByteStringAttribute`**

Adds a `NONCE` attribute to the message.

See [RFC5389](https://tools.ietf.org/html/rfc5389#section-15.8)

<a name="class-stun-message-add-software" />

* **`addSoftware(software: string): StunByteStringAttribute`**

Adds a `SOFTWARE` attribute to the message.

See [RFC5389](https://tools.ietf.org/html/rfc5389#section-15.10)

<a name="class-stun-message-add-unknown-attributes" />

* **`addUnknownAttributes(attributes: number[]): StunUInt16ListAttribute`**

Adds a `UNKNOWN-ATTRIBUTES` attribute to the message.

See [RFC5389](https://tools.ietf.org/html/rfc5389#section-15.9)

<a name="class-stun-message-add-error" />

* **`addError(code: number, reason: string): StunErrorCodeAttribute`**

Adds a `ERROR-CODE` attribute to the message.

See [RFC5389](https://tools.ietf.org/html/rfc5389#section-15.6)

<a name="class-stun-message-add-priority" />

* **`addPriority(priority: number): StunUInt32Attribute`**

Adds a `PRIORITY` attribute to the message.

See [RFC8445](https://tools.ietf.org/html/rfc8445#section-16.1)

<a name="class-stun-message-add-use-candidate" />

* **`addUseCandidate(): StunByteStringAttribute`**

Adds a `USE-CANDIDATE` attribute to the message.

See [RFC8445](https://tools.ietf.org/html/rfc8445#section-16.1)

<a name="class-stun-message-add-ice-controlled" />

* **`addIceControlled(tiebreaker: Buffer): StunByteStringAttribute`**

Adds a `ICE-CONTROLLED` attribute to the message.

See [RFC8445](https://tools.ietf.org/html/rfc8445#section-16.1)

<a name="class-stun-message-add-ice-controlling" />

* **`addIceControlling(tiebreaker: Buffer): StunByteStringAttribute`**

Adds a `ICE-CONTROLLING` attribute to the message.

See [RFC8445](https://tools.ietf.org/html/rfc8445#section-16.1)

<a name="class-stun-message-get-attribute" />

* **`getAttribute(type): StunAttribute`**

Returns the `StunAttribute` attribute of the specified `type`. The `type` argument is a number that should be an attribute type. See `constants` below.

<a name="class-stun-message-remove-attribute" />

* **`removeAttribute(type): bool`**

Remove a `type` attribute from the current message. Returns true if an attribute was removed. The `type` argument is a number that should be an attribute type. See `constants` below.

<a name="class-stun-message-get-count" />

* **get `count: number`**

Returns the number of an attributes in the current message.

<a name="class-stun-message-add-message-integrity" />

* **`addMessageIntegrity(key: string)`**

Adds a `MESSAGE-INTEGRITY` attribute that is valid for the current message. The `key` is the HMAC key used to generate the cryptographic HMAC hash.

<a name="class-stun-message-add-fingerprint" />

* **`addFingerprint()`**

Adds a `FINGERPRINT` attribute that is valid for the current message.

<a name="class-stun-message-to-buffer" />

* **`toBuffer(): Buffer`**

Converts a `StunMessage` object to the buffer.

<a name="class-stun-server" />

#### `class StunServer`

The `StunServer` class is an EventEmitter that encapsulates a STUN server.

<a name="class-stun-server-new" />

* **`new StunServer(socket: dgram.Socket)`**

Creates a new `StunServer` object. The `socket` argument should be an instance of `dgram.Socket`. The incoming message is silently ignored when it is not a `stun` one.

<a name="class-stun-server-send" />

* **`send(message: StunMessage, port: number, address: string[, cb: function])`**

Sends the `StunMessage` message on the socket. The destination `port` and `address` must be specified. An optional `callback` function will be called when the message has been sent.

<a name="class-stun-server-close" />

* **`close()`**

Stops the processing of the incoming messages and emits `close` event.

<a name="class-stun-server-event-binding-request" />

* **Event: `bindingRequest`**

Emitted when the `STUN_BINDING_REQUEST` message is available on a socket.

<a name="class-stun-server-event-binding-indication" />

* **Event: `bindingIndication`**

Emitted when the `STUN_BINDING_INDICATION` message is available on a socket.

<a name="class-stun-server-event-binding-response" />

* **Event: `bindingResponse`**

Emitted when the `STUN_BINDING_RESPONSE` message is available on a socket.

<a name="class-stun-server-event-binding-error" />

* **Event: `bindingError`**

Emitted when the `STUN_BINDING_ERROR_RESPONSE` message is available on a socket.

<a name="class-stun-server-event-close" />

* **Event: `close`**

Emitted when the server closes.

<a name="class-stun-server-event-error" />

* **Event: `error`**

Emitted when the server got an invalid message.

<a name="class-stun-attribute" />

#### **`class StunAttribute`**

The `StunAttribute` class is an utility for adding an attributes to the `StunMessage` message.

<a name="class-stun-attribute-get-type" />

* **get `type`**

Returns the attribute type. See `constants` below.

<a name="class-stun-attribute-get-value" />

* **get `value`**

Returns the value of the attribute. It depends on the value type of the attribute.

```js
stunMsg.getAttribute(STUN_ATTR_USERNAME).value        // string
stunMsg.getAttribute(STUN_ATTR_PRIORITY).value        // number
stunMsg.getAttribute(STUN_ATTR_MAPPED_ADDRESS).value  // object
```

<a name="constants" />

#### **`constants: object`**

These are the types of STUN messages defined in [RFC5389](https://tools.ietf.org/html/rfc5389):

* `STUN_BINDING_REQUEST`
* `STUN_BINDING_INDICATION`
* `STUN_BINDING_RESPONSE`
* `STUN_BINDING_ERROR_RESPONSE`

These are the event names for STUN messages above:

* `STUN_EVENT_BINDING_REQUEST`
* `STUN_EVENT_BINDING_INDICATION`
* `STUN_EVENT_BINDING_RESPONSE`
* `STUN_EVENT_BINDING_ERROR_RESPONSE`

These are the types of STUN messages defined in [RFC5766](https://tools.ietf.org/html/rfc5766):

* `STUN_ALLOCATE_REQUEST`
* `STUN_ALLOCATE_RESPONSE`
* `STUN_ALLOCATE_ERROR_RESPONSE`
* `STUN_REFRESH_REQUEST`
* `STUN_REFRESH_RESPONSE`
* `STUN_REFRESH_ERROR_RESPONSE`
* `STUN_SEND_INDICATION`
* `STUN_DATA_INDICATION`
* `STUN_CREATE_PERMISSION_REQUEST`
* `STUN_CREATE_PERMISSION_RESPONSE`
* `STUN_CREATE_PERMISSION_ERROR_RESPONSE`
* `STUN_CHANNEL_BIND_REQUEST`
* `STUN_CHANNEL_BIND_RESPONSE`
* `STUN_CHANNEL_BIND_ERROR_RESPONSE`

Thsese are all known STUN attributes, defined in [RFC5389](https://tools.ietf.org/html/rfc5389) and elsewhere:

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
* `STUN_ATTR_CHANNEL_NUMBER`
* `STUN_ATTR_LIFETIME`
* `STUN_ATTR_XOR_PEER_ADDRESS`
* `STUN_ATTR_DATA`
* `STUN_ATTR_XOR_RELAYED_ADDRESS`
* `STUN_ATTR_EVEN_PORT`
* `STUN_ATTR_REQUESTED_TRANSPORT`
* `STUN_ATTR_DONT_FRAGMENT`
* `STUN_ATTR_RESERVATION_TOKEN`
* `STUN_ATTR_CHANGE_REQUEST`
* `STUN_ATTR_PADDING`
* `STUN_ATTR_RESPONSE_PORT`
* `STUN_ATTR_RESPONSE_ORIGIN`
* `STUN_ATTR_OTHER_ADDRESS`

These are the types of STUN error codes defined in [RFC5389](https://tools.ietf.org/html/rfc5389) and elsewhere:

* `STUN_CODE_TRY_ALTERNATE`
* `STUN_CODE_BAD_REQUEST`
* `STUN_CODE_UNAUTHORIZED`
* `STUN_CODE_UNKNOWN_ATTRIBUTE`
* `STUN_CODE_STALE_CREDENTIALS`
* `STUN_CODE_STALE_NONCE`
* `STUN_CODE_SERVER_ERROR`
* `STUN_CODE_GLOBAL_FAILURE`
* `STUN_CODE_ROLE_CONFLICT`
* `STUN_CODE_FORBIDDEN`
* `STUN_CODE_ALLOCATION_MISMATCH`
* `STUN_CODE_WRONG_CREDENTIALS`
* `STUN_CODE_UNSUPPORTED_PROTOCOL`
* `STUN_CODE_ALLOCATION_QUOTA`
* `STUN_CODE_INSUFFICIENT_CAPACITY`

These are the strings for the error codes above:

* `STUN_REASON_TRY_ALTERNATE`
* `STUN_REASON_BAD_REQUEST`
* `STUN_REASON_UNAUTHORIZED`
* `STUN_REASON_UNKNOWN_ATTRIBUTE`
* `STUN_REASON_STALE_CREDENTIALS`
* `STUN_REASON_STALE_NONCE`
* `STUN_REASON_SERVER_ERROR`
* `STUN_REASON_ROLE_CONFLICT`
* `STUN_REASON_FORBIDDEN`
* `STUN_REASON_ALLOCATION_MISMATCH`
* `STUN_REASON_WRONG_CREDENTIALS`
* `STUN_REASON_UNSUPPORTED_PROTOCOL`
* `STUN_REASON_ALLOCATION_QUOTA`
* `STUN_REASON_INSUFFICIENT_CAPACITY`

<a name="class-stun-error" />

#### **`class StunError`**

Base class for all generated errors.

* **get `packet: Buffer|StunMessage`**

Received data.

* **get `sender: object`**

For UDP, this is an `rinfo` attribute.

<a name="class-stun-message-error" />

#### **`class StunMessageError`**

The STUN server may receive invalid messages. This error class represent ones. Inherits from `StunError`.

* **get `packet: Buffer`**

See above.

<a name="class-stun-response-error" />

#### **`class StunResponseError`**

This class represent protocol level errors, for messages with class type `ERROR`. Inherits from `StunError`.

* **get `packet: StunMessage`**

See above.

## License

MIT, 2017-2019 (c) Dmitriy Tsvettsikh
