'use strict';

const encode = require('message/encode');
const { messageType, attributeType } = require('lib/constants');
const StunRequest = require('message/request');
const StunResponse = require('message/response');
const attributes = require('lib/attributes');

const expectedEncodeArr = [];
expectedEncodeArr.push(0);
expectedEncodeArr.push(0x01); //  Type
expectedEncodeArr.push(0);
expectedEncodeArr.push(12); //    Length
expectedEncodeArr.push(0x21);
expectedEncodeArr.push(0x12);
expectedEncodeArr.push(0xa4);
expectedEncodeArr.push(0x42); //  Cookie
expectedEncodeArr.push(0xd0);
expectedEncodeArr.push(0x05);
expectedEncodeArr.push(0x58);
expectedEncodeArr.push(0x70);
expectedEncodeArr.push(0x7b);
expectedEncodeArr.push(0xb8);
expectedEncodeArr.push(0xcc);
expectedEncodeArr.push(0x6a);
expectedEncodeArr.push(0x63);
expectedEncodeArr.push(0x3a);
expectedEncodeArr.push(0x9d);
expectedEncodeArr.push(0xf7); //  Transaction
expectedEncodeArr.push(0);
expectedEncodeArr.push(0x20); //  XOR_MAPPED_ADDRESS
expectedEncodeArr.push(0);
expectedEncodeArr.push(8); //     Length
expectedEncodeArr.push(0); //     Reserverd
expectedEncodeArr.push(0x1); //   Family
expectedEncodeArr.push(0xd9);
expectedEncodeArr.push(0x36); //  Port
expectedEncodeArr.push(0xe1);
expectedEncodeArr.push(0xba);
expectedEncodeArr.push(0xa5);
expectedEncodeArr.push(0x61); //  Ip

test('should encode request', () => {
  const message = new StunRequest();

  message.setType(messageType.BINDING_REQUEST);
  message.setTransactionId(Buffer.from('d00558707bb8cc6a633a9df7', 'hex'));
  message.addAttribute(attributeType.XOR_MAPPED_ADDRESS, '192.168.1.35', 63524);

  const expectedBuffer = Buffer.from(expectedEncodeArr);

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

  const expectedBuffer = Buffer.from(expectedEncodeArr);

  expect(encode(message)).toEqual(expectedBuffer);
});
