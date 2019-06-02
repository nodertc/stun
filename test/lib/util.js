'use strict';

const { createMessageType } = require('lib/util');
const { classType, methods } = require('lib/constants');

test('createMessageType', () => {
  const BINDING_REQUEST = 0x0001;
  const BINDING_INDICATION = 0x0011;
  const BINDING_RESPONSE = 0x0101;
  const BINDING_ERROR_RESPONSE = 0x0111;

  // First 4 bits.
  expect(createMessageType(methods.BINDING, classType.REQUEST)).toBe(BINDING_REQUEST);
  expect(createMessageType(methods.BINDING, classType.INDICATION)).toBe(BINDING_INDICATION);
  expect(createMessageType(methods.BINDING, classType.RESPONSE)).toBe(BINDING_RESPONSE);
  expect(createMessageType(methods.BINDING, classType.ERROR)).toBe(BINDING_ERROR_RESPONSE);

  // Bits 4 - 6.
  expect(createMessageType(0b11111, classType.ERROR)).toBe(0b100111111);

  // Bits 7 - 11.
  expect(createMessageType(0x02ff, classType.ERROR)).toBe(0b101111111111);
});
