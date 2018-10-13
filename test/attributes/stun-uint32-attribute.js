'use strict';

const constants = require('lib/constants');
const StunUInt32Attribute = require('attributes/stun-uint32-attribute');

const type = constants.attributeType.FINGERPRINT;

test('encode', () => {
  const attr = new StunUInt32Attribute(type, 0x23456701);

  const expectedBuffer = Buffer.alloc(4);
  expectedBuffer.writeUInt32BE(0x23456701);

  expect(attr.toBuffer()).toEqual(expectedBuffer);
});

test('decode', () => {
  const expectedNumber = 0x23456701;
  const msg = Buffer.alloc(4);
  msg.writeUInt32BE(expectedNumber);

  const attr = StunUInt32Attribute.from(type, msg);

  expect(attr.value).toBe(expectedNumber);
});
