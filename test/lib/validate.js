'use strict';

const { validateFingerprint, validateMessageIntegrity } = require('lib/validate');
const constants = require('lib/constants');
const decode = require('message/decode');
const { createMessage } = require('lib/create-message');

const { SOFTWARE } = constants.attributeType;
const { BINDING_RESPONSE } = constants.messageType;

test('validate fingerprint', () => {
  const packet = Buffer.from(
    '0101002c2112a442644d4f37326c71514d4f4a51' +
      '002000080001cc03e1baa56100080014a8fbde3bdc5ff7ab1e8' +
      '52a8c2cc6ef651cb74889802800042748c3bb',
    'hex'
  );

  const message = decode(packet);

  expect(validateFingerprint(message)).toBe(true);
});

test('`validateFingerprint` should support uint32 value', () => {
  const message = createMessage();

  message.setType(BINDING_RESPONSE);
  message.addAttribute(SOFTWARE, '123456789');
  message.addFingerprint();

  expect(validateFingerprint(message)).toBe(true);
});

test('validate MESSAGE INTEGRITY', () => {
  const packet = Buffer.from(
    '010100242112a4426f576f544a34445674305276' +
      '002000080001db91e1baa56600080014e161f72ee' +
      '71ed9f6accaef828ec42f19a809045a',
    'hex'
  );

  const message = decode(packet);
  const password = '6Gzr+PH5Krjg0VqBa81nE7n6';

  expect(validateMessageIntegrity(message, password)).toBe(true);
});

test('validate MESSAGE INTEGRITY + FINGERPRINT', () => {
  const password = '6Gzr+PH5Krjg0VqBa81nE7n6';
  const message = createMessage();

  message.setType(BINDING_RESPONSE);
  message.addAttribute(SOFTWARE, '123456789');
  message.addMessageIntegrity(password);
  message.addFingerprint();

  expect(validateMessageIntegrity(message, password)).toBe(true);
  expect(validateFingerprint(message)).toBe(true);
});
