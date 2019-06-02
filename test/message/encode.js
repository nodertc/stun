'use strict';

const encode = require('message/encode');
const { messageType, attributeType } = require('lib/constants');
const StunRequest = require('message/request');
const StunResponse = require('message/response');
const attributes = require('lib/attributes');

test('should encode request', () => {
  const message = new StunRequest();

  message.setType(messageType.BINDING_REQUEST);
  message.setTransactionId(Buffer.from('d00558707bb8cc6a633a9df7', 'hex'));
  message.addAttribute(attributeType.XOR_MAPPED_ADDRESS, '192.168.1.35', 63524);

  const expectedBuffer = Buffer.from([
    0,
    0x01 /* Type */,
    0,
    12 /* Length */,
    0x21,
    0x12,
    0xa4,
    0x42 /* Cookie */,
    0xd0,
    0x05,
    0x58,
    0x70,
    0x7b,
    0xb8,
    0xcc,
    0x6a,
    0x63,
    0x3a,
    0x9d,
    0xf7 /* Transaction */,

    0,
    0x20 /* XOR_MAPPED_ADDRESS */,
    0,
    8 /* Length */,
    0 /* Reserved */,
    0x1 /* Family */,
    0xd9,
    0x36 /* Port */,
    0xe1,
    0xba,
    0xa5,
    0x61 /* Ip */,
  ]);

  expect(encode(message)).toEqual(expectedBuffer);
});

test('should encode response', () => {
  const message = new StunResponse();

  const kMessageType = Symbol.for('kMessageType');
  const kTransactionId = Symbol.for('kTransctionId');
  const kAttributes = Symbol.for('kAttributes');

  message[kMessageType] = messageType.BINDING_REQUEST;
  message[kTransactionId] = Buffer.from('d00558707bb8cc6a633a9df7', 'hex');

  const attribute = attributes.create(attributeType.XOR_MAPPED_ADDRESS, '192.168.1.35', 63524);
  attribute.setOwner(message);

  message[kAttributes].push(attribute);

  const expectedBuffer = Buffer.from([
    0,
    0x01 /* Type */,
    0,
    12 /* Length */,
    0x21,
    0x12,
    0xa4,
    0x42 /* Cookie */,
    0xd0,
    0x05,
    0x58,
    0x70,
    0x7b,
    0xb8,
    0xcc,
    0x6a,
    0x63,
    0x3a,
    0x9d,
    0xf7 /* Transaction */,

    0,
    0x20 /* XOR_MAPPED_ADDRESS */,
    0,
    8 /* Length */,
    0 /* Reserved */,
    0x1 /* Family */,
    0xd9,
    0x36 /* Port */,
    0xe1,
    0xba,
    0xa5,
    0x61 /* Ip */,
  ]);

  expect(encode(message)).toEqual(expectedBuffer);
});
