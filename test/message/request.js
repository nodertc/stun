'use strict';

const constants = require('lib/constants');
const StunAttribute = require('attributes/stun-attribute');
const StunRequest = require('message/request');

const { attributeValueType, attributeType, messageType, errorReason } = constants;

test('should add FINGERPRINT', () => {
  const expectedBuffer = Buffer.from(
    '0101002c2112a442644d4f37326c71514d4f4a51' +
      '002000080001cc03e1baa56100080014a8fbde3bdc5ff7ab1e8' +
      '52a8c2cc6ef651cb74889802800042748c3bb',
    'hex'
  );

  const message = new StunRequest();

  message.setType(messageType.BINDING_RESPONSE);
  message.setTransactionId(Buffer.from('644d4f37326c71514d4f4a51', 'hex'));

  const { XOR_MAPPED_ADDRESS, MESSAGE_INTEGRITY } = attributeType;

  message.addAttribute(XOR_MAPPED_ADDRESS, '192.168.1.35', 60689);
  message.addAttribute(
    MESSAGE_INTEGRITY,
    Buffer.from('a8fbde3bdc5ff7ab1e852a8c2cc6ef651cb74889', 'hex')
  );

  expect(message.addFingerprint()).toBe(true);
  expect(message.toBuffer()).toEqual(expectedBuffer);
});

test('add MESSAGE-INTEGRITY', () => {
  const expectedBuffer = Buffer.from(
    '010100242112a4426f576f544a34445674305276' +
      '002000080001db91e1baa56600080014e161f72ee' +
      '71ed9f6accaef828ec42f19a809045a',
    'hex'
  );

  const message = new StunRequest();

  message.setType(messageType.BINDING_RESPONSE);
  message.setTransactionId(Buffer.from('6f576f544a34445674305276', 'hex'));

  const { XOR_MAPPED_ADDRESS } = attributeType;
  message.addAttribute(XOR_MAPPED_ADDRESS, '192.168.1.36', 64131);

  const password = '6Gzr+PH5Krjg0VqBa81nE7n6';

  expect(message.addMessageIntegrity(password)).toBe(true);
  expect(message.toBuffer()).toEqual(expectedBuffer);
});

test('FINGERPRINT should be uint32', () => {
  const { SOFTWARE } = attributeType;
  const message = new StunRequest();

  message.setType(messageType.BINDING_RESPONSE);
  message.addAttribute(SOFTWARE, '123456789');

  expect(message.addFingerprint()).toBe(true);
});

test('iterator', () => {
  const { BINDING_RESPONSE } = messageType;
  const { SOFTWARE, XOR_MAPPED_ADDRESS, FINGERPRINT } = attributeType;
  const message = new StunRequest();

  message.setType(BINDING_RESPONSE);

  message.addAttribute(SOFTWARE, 'node/v8.9.3');
  message.addAttribute(XOR_MAPPED_ADDRESS, '192.168.1.35', 60689);
  message.addFingerprint();

  expect(message.count).toBe(3);

  let count = 0;
  for (const attribute of message) {
    count += 1;

    expect(attribute instanceof StunAttribute).toBe(true);

    switch (count) {
      case 1:
        expect(attribute.type).toBe(SOFTWARE);
        break;
      case 2:
        expect(attribute.type).toBe(XOR_MAPPED_ADDRESS);
        break;
      case 3:
        expect(attribute.type).toBe(FINGERPRINT);
        break;
      default:
        expect(count).toBe(3);
        break;
    }
  }
});

test('add address', () => {
  const message = new StunRequest();

  message.setType(messageType.BINDING_RESPONSE);
  message.addAddress('127.0.0.1', 1516);

  const attributes = Array.from(message); // eslint-disable-line unicorn/prefer-spread
  expect(attributes.length).toEqual(1);
  expect(attributes[0].valueType).toEqual(attributeValueType.ADDRESS);
  expect(attributes[0].value).toEqual({
    address: '127.0.0.1',
    port: 1516,
    family: 'IPv4',
  });
});

test('add xor address', () => {
  const message = new StunRequest();

  message.setType(messageType.BINDING_RESPONSE);
  message.addXorAddress('127.0.0.1', 1516);

  const attributes = Array.from(message); // eslint-disable-line unicorn/prefer-spread
  expect(attributes.length).toEqual(1);
  expect(attributes[0].valueType).toEqual(attributeValueType.XOR_ADDRESS);
  expect(attributes[0].value).toEqual({
    address: '127.0.0.1',
    port: 1516,
    family: 'IPv4',
  });
});

test('add alternate server  ', () => {
  const message = new StunRequest();

  message.setType(messageType.BINDING_RESPONSE);
  message.addAlternateServer('127.0.0.1', 1516);

  const attributes = Array.from(message); // eslint-disable-line unicorn/prefer-spread
  expect(attributes.length).toEqual(1);
  expect(attributes[0].type).toEqual(attributeType.ALTERNATE_SERVER);
  expect(attributes[0].value).toEqual({
    address: '127.0.0.1',
    port: 1516,
    family: 'IPv4',
  });
});

test('add username', () => {
  const message = new StunRequest();

  message.setType(messageType.BINDING_RESPONSE);
  message.addUsername('stun/1.2.3');

  const attributes = Array.from(message); // eslint-disable-line unicorn/prefer-spread
  expect(attributes.length).toEqual(1);
  expect(attributes[0].type).toEqual(attributeType.USERNAME);
});

test('add invalid  username', () => {
  const message = new StunRequest();

  message.setType(messageType.BINDING_RESPONSE);

  expect(() => message.addUsername('stun/1.2.3'.repeat(52))).toThrowError(
    /Username should be less than 513 bytes/i
  );

  expect(message.count).toEqual(0);
});

test('add software', () => {
  const message = new StunRequest();

  message.setType(messageType.BINDING_RESPONSE);
  message.addSoftware('stun/1.2.3');

  const attributes = Array.from(message); // eslint-disable-line unicorn/prefer-spread
  expect(attributes.length).toEqual(1);
  expect(attributes[0].type).toEqual(attributeType.SOFTWARE);
});

test('add realm', () => {
  const message = new StunRequest();

  message.setType(messageType.BINDING_RESPONSE);
  message.addRealm('stun/1.2.3');

  const attributes = Array.from(message); // eslint-disable-line unicorn/prefer-spread
  expect(attributes.length).toEqual(1);
  expect(attributes[0].type).toEqual(attributeType.REALM);
});

test('add nonce', () => {
  const message = new StunRequest();

  message.setType(messageType.BINDING_RESPONSE);
  message.addNonce('stun/1.2.3');

  const attributes = Array.from(message); // eslint-disable-line unicorn/prefer-spread
  expect(attributes.length).toEqual(1);
  expect(attributes[0].type).toEqual(attributeType.NONCE);
});

test('add invalid nonce', () => {
  const message = new StunRequest();

  message.setType(messageType.BINDING_RESPONSE);
  expect(() => message.addNonce('stun/1.2.3'.repeat(13))).toThrowError(/less than 128 characters/i);
  expect(message.count).toEqual(0);
});

describe('removeAttribute', () => {
  test('attr not found', () => {
    const message = new StunRequest();

    const attribute = message.removeAttribute(attributeType.MAPPED_ADDRESS);
    expect(attribute).toBeUndefined();
  });

  test('from start', () => {
    const message = new StunRequest();

    message.addAddress('127.0.0.1', 1234);
    message.addXorAddress('127.0.0.1', 1516);

    const removedAttribute = message.removeAttribute(attributeType.MAPPED_ADDRESS);
    expect(removedAttribute).not.toBeUndefined();
    expect(removedAttribute.type).toEqual(attributeType.MAPPED_ADDRESS);

    const attributes = Array.from(message); // eslint-disable-line unicorn/prefer-spread
    expect(attributes.length).toEqual(1);
    expect(attributes[0].valueType).toEqual(attributeValueType.XOR_ADDRESS);
  });

  test('from end', () => {
    const message = new StunRequest();

    message.addAddress('127.0.0.1', 1234);
    message.addXorAddress('127.0.0.1', 1516);

    const removedAttribute = message.removeAttribute(attributeType.XOR_MAPPED_ADDRESS);
    expect(removedAttribute).not.toBeUndefined();
    expect(removedAttribute.type).toEqual(attributeType.XOR_MAPPED_ADDRESS);

    const attributes = Array.from(message); // eslint-disable-line unicorn/prefer-spread
    expect(attributes.length).toEqual(1);
    expect(attributes[0].valueType).toEqual(attributeValueType.ADDRESS);
  });

  test('from the middle', () => {
    const message = new StunRequest();

    message.addSoftware('stun/1.2.3');
    message.addAddress('127.0.0.1', 1234);
    message.addXorAddress('127.0.0.1', 1516);

    const removedAttribute = message.removeAttribute(attributeType.MAPPED_ADDRESS);
    expect(removedAttribute).not.toBeUndefined();
    expect(removedAttribute.type).toEqual(attributeType.MAPPED_ADDRESS);

    const attributes = Array.from(message); // eslint-disable-line unicorn/prefer-spread
    expect(attributes.length).toEqual(2);
    expect(attributes[0].type).toEqual(attributeType.SOFTWARE);
    expect(attributes[1].type).toEqual(attributeType.XOR_MAPPED_ADDRESS);
  });
});

describe('add error', () => {
  test('should work', () => {
    const message = new StunRequest();

    message.setType(messageType.BINDING_ERROR_RESPONSE);
    message.addError(300, 'hello world');

    const attributes = Array.from(message); // eslint-disable-line unicorn/prefer-spread
    expect(attributes.length).toEqual(1);
    expect(attributes[0].type).toEqual(attributeType.ERROR_CODE);
    expect(attributes[0].reason).toEqual('hello world');
    expect(attributes[0].code).toEqual(300);
  });

  test('should be error type message', () => {
    const message = new StunRequest();

    message.setType(messageType.BINDING_RESPONSE);
    expect(() => message.addError(300, 'hello world')).toThrowError(
      'The attribute should be in ERROR_RESPONSE messages'
    );
  });

  test('invalid error code', () => {
    const message = new StunRequest();

    message.setType(messageType.BINDING_ERROR_RESPONSE);

    expect(() => message.addError(200)).toThrowError(/Error code should between 300 - 699/i);
    expect(() => message.addError(700)).toThrowError(/Error code should between 300 - 699/i);
  });

  test('should set default reason', () => {
    const message = new StunRequest();

    message.setType(messageType.BINDING_ERROR_RESPONSE);
    message.addError(300);

    const attributes = Array.from(message); // eslint-disable-line unicorn/prefer-spread
    expect(attributes.length).toEqual(1);
    expect(attributes[0].type).toEqual(attributeType.ERROR_CODE);
    expect(attributes[0].reason).toEqual(errorReason.TRY_ALTERNATE);
    expect(attributes[0].code).toEqual(300);
  });
});

test('add UNKNOWN-ATTRIBUTES', () => {
  const message = new StunRequest();

  message.setType(messageType.BINDING_ERROR_RESPONSE);
  message.addUnknownAttributes([1, 2, 3]);

  const attributes = Array.from(message); // eslint-disable-line unicorn/prefer-spread
  expect(attributes.length).toEqual(1);
  expect(attributes[0].type).toEqual(attributeType.UNKNOWN_ATTRIBUTES);
  expect(attributes[0].value).toEqual([1, 2, 3]);
});

test('add PRIORITY', () => {
  const message = new StunRequest();

  message.setType(messageType.BINDING_ERROR_RESPONSE);
  message.addPriority(123);

  const attributes = Array.from(message); // eslint-disable-line unicorn/prefer-spread
  expect(attributes.length).toEqual(1);
  expect(attributes[0].type).toEqual(attributeType.PRIORITY);
  expect(attributes[0].value).toEqual(123);

  expect(() => message.addPriority(1.23)).toThrow(/The argument should be 32-bit integer/i);
  expect(() => message.addPriority(Number.MAX_SAFE_INTEGER)).toThrow(
    /The argument should be 32-bit integer/i
  );
});

test('add USE-CANDIDATE', () => {
  const message = new StunRequest();

  message.addUseCandidate();

  const attributes = Array.from(message); // eslint-disable-line unicorn/prefer-spread
  expect(attributes.length).toEqual(1);
  expect(attributes[0].type).toEqual(attributeType.USE_CANDIDATE);
});

test('add ICE-CONTROLLED', () => {
  const message = new StunRequest();

  const tiebreaker = Buffer.allocUnsafe(8);
  const invalidTiebreaker = Buffer.allocUnsafe(4);

  message.setType(constants.messageType.BINDING_REQUEST);
  message.addIceControlled(tiebreaker);

  const attributes = Array.from(message); // eslint-disable-line unicorn/prefer-spread
  expect(attributes.length).toEqual(1);
  expect(attributes[0].type).toEqual(attributeType.ICE_CONTROLLED);
  expect(attributes[0].value).toEqual(tiebreaker);

  expect(() => message.addIceControlled(123)).toThrow(/shoud be a 64-bit unsigned integer/i);
  expect(() => message.addIceControlled(invalidTiebreaker)).toThrow(
    /shoud be a 64-bit unsigned integer/i
  );

  message.setType(constants.messageType.BINDING_ERROR_RESPONSE);
  expect(() => message.addIceControlled(tiebreaker)).toThrow(
    /should present in a Binding request/i
  );
});

test('add ICE-CONTROLLING', () => {
  const message = new StunRequest();

  const tiebreaker = Buffer.allocUnsafe(8);
  const invalidTiebreaker = Buffer.allocUnsafe(4);

  message.setType(constants.messageType.BINDING_REQUEST);
  message.addIceControlling(tiebreaker);

  const attributes = Array.from(message); // eslint-disable-line unicorn/prefer-spread
  expect(attributes.length).toEqual(1);
  expect(attributes[0].type).toEqual(attributeType.ICE_CONTROLLING);
  expect(attributes[0].value).toEqual(tiebreaker);

  expect(() => message.addIceControlling(123)).toThrow(/shoud be a 64-bit unsigned integer/i);
  expect(() => message.addIceControlling(invalidTiebreaker)).toThrow(
    /shoud be a 64-bit unsigned integer/i
  );

  message.setType(constants.messageType.BINDING_ERROR_RESPONSE);
  expect(() => message.addIceControlling(tiebreaker)).toThrow(
    /should present in a Binding request/i
  );
});
