'use strict';

const StunResponse = require('message/response');
const decode = require('message/decode');
const { messageType } = require('lib/constants');

test('should decode', () => {
  const packet = Buffer.from([
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

  const message = decode(packet);

  expect(message).toBeInstanceOf(StunResponse);
  expect(message.type).toBe(messageType.BINDING_REQUEST);
  expect(message.transactionId).toEqual(Buffer.from('d00558707bb8cc6a633a9df7', 'hex'));
  expect(message.count).toBe(1);

  const xorAddress = message.getXorAddress();
  expect(xorAddress).toEqual({
    port: 63524,
    family: 'IPv4',
    address: '192.168.1.35',
  });
});
