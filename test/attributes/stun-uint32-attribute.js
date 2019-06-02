'use strict';

const constants = require('lib/constants');
const StunUInt32Attribute = require('attributes/stun-uint32-attribute');

const type = constants.attributeType.FINGERPRINT;

test('encode', () => {
  const attribute = new StunUInt32Attribute(type, 0x23456701);

  const expectedBuffer = Buffer.alloc(4);
  expectedBuffer.writeUInt32BE(0x23456701);

  expect(attribute.toBuffer()).toEqual(expectedBuffer);
});

test('decode', () => {
  const expectedNumber = 0x23456701;
  const message = Buffer.alloc(4);
  message.writeUInt32BE(expectedNumber);

  const attribute = StunUInt32Attribute.from(type, message);

  expect(attribute.value).toBe(expectedNumber);
});
