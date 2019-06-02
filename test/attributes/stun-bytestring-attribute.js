'use strict';

const constants = require('lib/constants');
const StunByteStringAttribute = require('attributes/stun-bytestring-attribute');

const type = constants.attributeType.USERNAME;

test('encode', () => {
  const attribute = new StunByteStringAttribute(type, '3Qpe:b63f4e96');
  const expectedBuffer = Buffer.from('335170653a6236336634653936', 'hex');

  expect(attribute.toBuffer()).toEqual(expectedBuffer);
});

test('decode', () => {
  const message = Buffer.from('3Qpe:b63f4e96');

  const attribute = StunByteStringAttribute.from(type, message);

  expect(attribute.value).toEqual(message);
});
