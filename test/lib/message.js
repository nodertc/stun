'use strict';

const constants = require('lib/constants');
const StunMessage = require('lib/message');
const StunAttribute = require('attributes/stun-attribute');

const { attributeValueType, attributeType } = constants;

test('encode', () => {
  const msg = new StunMessage();

  msg.setType(constants.messageType.BINDING_REQUEST);
  msg.setTransactionID(Buffer.from('d00558707bb8cc6a633a9df7', 'hex'));
  msg.addAttribute(
    constants.attributeType.XOR_MAPPED_ADDRESS,
    '192.168.1.35',
    63524
  );

  const expectedBuffer = Buffer.from([
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

  expect(msg.toBuffer()).toEqual(expectedBuffer);
});

test('decode', () => {
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

  const stunMsg = StunMessage.from(packet);

  expect(stunMsg.type).toBe(constants.messageType.BINDING_REQUEST);
  expect(stunMsg.transactionId).toEqual(
    Buffer.from('d00558707bb8cc6a633a9df7', 'hex')
  );
  expect(stunMsg.count).toBe(1);

  const xorAddress = stunMsg.getAttribute(
    constants.attributeType.XOR_MAPPED_ADDRESS
  );
  expect(xorAddress.type).toBe(constants.attributeType.XOR_MAPPED_ADDRESS);
  expect(xorAddress.value).toEqual({
    port: 63524,
    family: 'IPv4',
    address: '192.168.1.35',
  });
});

test('decode unknown attributes', () => {
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

    0x88,
    0x88 /* Should be an unknown attribute. */,
    0,
    8,
    0,
    0x1,
    0xd9,
    0x36,
    0xe1,
    0xba,
    0xa5,
    0x61,
  ]);

  expect(() => StunMessage.from(packet)).not.toThrow();

  const stunMsg = StunMessage.from(packet);
  const attr = stunMsg.getAttribute(0x8888);

  expect(attr.valueType).toBe(constants.attributeValueType.UNKNOWN);
  expect(attr.value).toEqual(
    Buffer.from([0, 0x1, 0xd9, 0x36, 0xe1, 0xba, 0xa5, 0x61])
  );
});

test('add FINGERPRINT', () => {
  const expectedBuffer = Buffer.from(
    '0101002c2112a442644d4f37326c71514d4f4a51' +
      '002000080001cc03e1baa56100080014a8fbde3bdc5ff7ab1e8' +
      '52a8c2cc6ef651cb74889802800042748c3bb',
    'hex'
  );

  const msg = new StunMessage();

  msg.setType(constants.messageType.BINDING_RESPONSE);
  msg.setTransactionID(Buffer.from('644d4f37326c71514d4f4a51', 'hex'));

  const { XOR_MAPPED_ADDRESS, MESSAGE_INTEGRITY } = constants.attributeType;

  msg.addAttribute(XOR_MAPPED_ADDRESS, '192.168.1.35', 60689);
  msg.addAttribute(
    MESSAGE_INTEGRITY,
    Buffer.from('a8fbde3bdc5ff7ab1e852a8c2cc6ef651cb74889', 'hex')
  );

  expect(msg.addFingerprint()).toBe(true);
  expect(msg.toBuffer()).toEqual(expectedBuffer);
});

test('add MESSAGE-INTEGRITY', () => {
  const expectedBuffer = Buffer.from(
    '010100242112a4426f576f544a34445674305276' +
      '002000080001db91e1baa56600080014e161f72ee' +
      '71ed9f6accaef828ec42f19a809045a',
    'hex'
  );

  const msg = new StunMessage();

  msg.setType(constants.messageType.BINDING_RESPONSE);
  msg.setTransactionID(Buffer.from('6f576f544a34445674305276', 'hex'));

  const { XOR_MAPPED_ADDRESS } = constants.attributeType;
  msg.addAttribute(XOR_MAPPED_ADDRESS, '192.168.1.36', 64131);

  const password = '6Gzr+PH5Krjg0VqBa81nE7n6';

  expect(msg.addMessageIntegrity(password)).toBe(true);
  expect(msg.toBuffer()).toEqual(expectedBuffer);
});

test('FINGERPRINT should be uint32', () => {
  const { SOFTWARE } = constants.attributeType;
  const msg = new StunMessage();

  msg.setType(constants.messageType.BINDING_RESPONSE);
  msg.addAttribute(SOFTWARE, '123456789');

  expect(msg.addFingerprint()).toBe(true);
});

test('iterator', () => {
  const { BINDING_RESPONSE } = constants.messageType;
  const { SOFTWARE, XOR_MAPPED_ADDRESS, FINGERPRINT } = constants.attributeType;
  const message = new StunMessage();

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
  const message = new StunMessage();

  message.setType(constants.messageType.BINDING_RESPONSE);
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
  const message = new StunMessage();

  message.setType(constants.messageType.BINDING_RESPONSE);
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
  const message = new StunMessage();

  message.setType(constants.messageType.BINDING_RESPONSE);
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
  const message = new StunMessage();

  message.setType(constants.messageType.BINDING_RESPONSE);
  message.addUsername('stun/1.2.3');

  const attributes = Array.from(message); // eslint-disable-line unicorn/prefer-spread
  expect(attributes.length).toEqual(1);
  expect(attributes[0].type).toEqual(attributeType.USERNAME);
});

test('add invalid  username', () => {
  const message = new StunMessage();

  message.setType(constants.messageType.BINDING_RESPONSE);

  expect(() => message.addUsername('stun/1.2.3'.repeat(52))).toThrowError(
    /Username should be less than 513 bytes/i
  );

  expect(message.count).toEqual(0);
});

test('add software', () => {
  const message = new StunMessage();

  message.setType(constants.messageType.BINDING_RESPONSE);
  message.addSoftware('stun/1.2.3');

  const attributes = Array.from(message); // eslint-disable-line unicorn/prefer-spread
  expect(attributes.length).toEqual(1);
  expect(attributes[0].type).toEqual(attributeType.SOFTWARE);
});

test('add realm', () => {
  const message = new StunMessage();

  message.setType(constants.messageType.BINDING_RESPONSE);
  message.addRealm('stun/1.2.3');

  const attributes = Array.from(message); // eslint-disable-line unicorn/prefer-spread
  expect(attributes.length).toEqual(1);
  expect(attributes[0].type).toEqual(attributeType.REALM);
});

test('add nonce', () => {
  const message = new StunMessage();

  message.setType(constants.messageType.BINDING_RESPONSE);
  message.addNonce('stun/1.2.3');

  const attributes = Array.from(message); // eslint-disable-line unicorn/prefer-spread
  expect(attributes.length).toEqual(1);
  expect(attributes[0].type).toEqual(attributeType.NONCE);
});

test('add invalid nonce', () => {
  const message = new StunMessage();

  message.setType(constants.messageType.BINDING_RESPONSE);
  expect(() => message.addNonce('stun/1.2.3'.repeat(13))).toThrowError(
    /less than 128 characters/i
  );
  expect(message.count).toEqual(0);
});

describe('removeAttribute', () => {
  test('attr not found', () => {
    const message = new StunMessage();

    expect(message.removeAttribute(attributeType.MAPPED_ADDRESS)).toEqual(
      false
    );
  });

  test('from start', () => {
    const message = new StunMessage();

    message.addAddress('127.0.0.1', 1234);
    message.addXorAddress('127.0.0.1', 1516);

    expect(message.removeAttribute(attributeType.MAPPED_ADDRESS)).toEqual(true);

    const attributes = Array.from(message); // eslint-disable-line unicorn/prefer-spread
    expect(attributes.length).toEqual(1);
    expect(attributes[0].valueType).toEqual(attributeValueType.XOR_ADDRESS);
  });

  test('from end', () => {
    const message = new StunMessage();

    message.addAddress('127.0.0.1', 1234);
    message.addXorAddress('127.0.0.1', 1516);

    expect(message.removeAttribute(attributeType.XOR_MAPPED_ADDRESS)).toEqual(
      true
    );

    const attributes = Array.from(message); // eslint-disable-line unicorn/prefer-spread
    expect(attributes.length).toEqual(1);
    expect(attributes[0].valueType).toEqual(attributeValueType.ADDRESS);
  });

  test('from the middle', () => {
    const message = new StunMessage();

    message.addSoftware('stun/1.2.3');
    message.addAddress('127.0.0.1', 1234);
    message.addXorAddress('127.0.0.1', 1516);

    expect(message.removeAttribute(attributeType.MAPPED_ADDRESS)).toEqual(true);

    const attributes = Array.from(message); // eslint-disable-line unicorn/prefer-spread
    expect(attributes.length).toEqual(2);
    expect(attributes[0].type).toEqual(attributeType.SOFTWARE);
    expect(attributes[1].type).toEqual(attributeType.XOR_MAPPED_ADDRESS);
  });
});

describe('add error', () => {
  test('should work', () => {
    const message = new StunMessage();

    message.setType(constants.messageType.BINDING_ERROR_RESPONSE);
    message.addError(300, 'hello world');

    const attributes = Array.from(message); // eslint-disable-line unicorn/prefer-spread
    expect(attributes.length).toEqual(1);
    expect(attributes[0].type).toEqual(attributeType.ERROR_CODE);
    expect(attributes[0].reason).toEqual('hello world');
    expect(attributes[0].code).toEqual(300);
  });

  test('should be error type message', () => {
    const message = new StunMessage();

    message.setType(constants.messageType.BINDING_RESPONSE);
    expect(() => message.addError(300, 'hello world')).toThrowError(
      'The attribute should be in ERROR_RESPONSE messages'
    );
  });

  test('invalid error code', () => {
    const message = new StunMessage();

    message.setType(constants.messageType.BINDING_ERROR_RESPONSE);

    expect(() => message.addError(200)).toThrowError(
      /Error code should between 300 - 699/i
    );
    expect(() => message.addError(700)).toThrowError(
      /Error code should between 300 - 699/i
    );
  });

  test('should set default reason', () => {
    const message = new StunMessage();

    message.setType(constants.messageType.BINDING_ERROR_RESPONSE);
    message.addError(300);

    const attributes = Array.from(message); // eslint-disable-line unicorn/prefer-spread
    expect(attributes.length).toEqual(1);
    expect(attributes[0].type).toEqual(attributeType.ERROR_CODE);
    expect(attributes[0].reason).toEqual(constants.errorReason.TRY_ALTERNATE);
    expect(attributes[0].code).toEqual(300);
  });
});

test('add UNKNOWN-ATTRIBUTES', () => {
  const message = new StunMessage();

  message.setType(constants.messageType.BINDING_ERROR_RESPONSE);
  message.addUnknownAttributes([1, 2, 3]);

  const attributes = Array.from(message); // eslint-disable-line unicorn/prefer-spread
  expect(attributes.length).toEqual(1);
  expect(attributes[0].type).toEqual(attributeType.UNKNOWN_ATTRIBUTES);
  expect(attributes[0].value).toEqual([1, 2, 3]);
});
