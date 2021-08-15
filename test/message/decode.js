'use strict';

const StunResponse = require('message/response');
const decode = require('message/decode');
const { messageType } = require('lib/constants');

test('should decode', () => {
  const expectedDecodeArr = [];
  expectedDecodeArr.push(0);
  expectedDecodeArr.push(0x01); //  Type
  expectedDecodeArr.push(0);
  expectedDecodeArr.push(12); //    Length
  expectedDecodeArr.push(0x21);
  expectedDecodeArr.push(0x12);
  expectedDecodeArr.push(0xa4);
  expectedDecodeArr.push(0x42); //  Cookie
  expectedDecodeArr.push(0xd0);
  expectedDecodeArr.push(0x05);
  expectedDecodeArr.push(0x58);
  expectedDecodeArr.push(0x70);
  expectedDecodeArr.push(0x7b);
  expectedDecodeArr.push(0xb8);
  expectedDecodeArr.push(0xcc);
  expectedDecodeArr.push(0x6a);
  expectedDecodeArr.push(0x63);
  expectedDecodeArr.push(0x3a);
  expectedDecodeArr.push(0x9d);
  expectedDecodeArr.push(0xf7); //  Transaction
  expectedDecodeArr.push(0);
  expectedDecodeArr.push(0x20); //  XOR_MAPPED_ADDRESS
  expectedDecodeArr.push(0);
  expectedDecodeArr.push(8); //     Length
  expectedDecodeArr.push(0); //     Reserverd
  expectedDecodeArr.push(0x1); //   Family
  expectedDecodeArr.push(0xd9);
  expectedDecodeArr.push(0x36); //  Port
  expectedDecodeArr.push(0xe1);
  expectedDecodeArr.push(0xba);
  expectedDecodeArr.push(0xa5);
  expectedDecodeArr.push(0x61); //  Ip
  const packet = Buffer.from(expectedDecodeArr);

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
