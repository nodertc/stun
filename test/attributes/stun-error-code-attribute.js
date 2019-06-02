'use strict';

const StunErrorCodeAttribute = require('attributes/stun-error-code-attribute');
const constants = require('lib/constants');

const type = constants.attributeType.ERROR_CODE;
const code = constants.errorCode.TRY_ALTERNATE;
const reason = constants.errorReason.TRY_ALTERNATE;

test('encode', () => {
  const attribute = new StunErrorCodeAttribute(type, code, reason);

  const header = Buffer.from([0, 0, 3, code % 100]);

  const expectedBuffer = Buffer.concat([header, Buffer.from(reason)]);

  expect(attribute.errorClass).toBe(3);
  expect(attribute.code).toBe(code);
  expect(attribute.reason).toBe(reason);
  expect(attribute.value).toEqual({
    code,
    reason,
  });
  expect(attribute.toBuffer()).toEqual(expectedBuffer);
});

test('decode', () => {
  const header = Buffer.from([0, 0, 3, code % 100]);

  const message = Buffer.concat([header, Buffer.from(reason)]);
  const attribute = StunErrorCodeAttribute.from(type, message);

  expect(attribute.errorClass).toBe(3);
  expect(attribute.code).toBe(code);
  expect(attribute.reason).toBe(reason);
  expect(attribute.value).toEqual({
    code,
    reason,
  });
});
