'use strict';

const { attributeType } = require('lib/constants');
const StunUInt16Attribute = require('attributes/stun-uint16-attribute');

const type = attributeType.RESPONSE_PORT;

test('encode', () => {
  const attribute = new StunUInt16Attribute(type, 0x2345);

  const expectedBuffer = Buffer.alloc(2);
  expectedBuffer.writeUInt16BE(0x2345);

  expect(attribute.toBuffer()).toEqual(expectedBuffer);
});

test('decode', () => {
  const expectedNumber = 0x2345;
  const message = Buffer.alloc(2);
  message.writeUInt16BE(expectedNumber);

  const attribute = StunUInt16Attribute.from(type, message);

  expect(attribute.value).toBe(expectedNumber);
});
