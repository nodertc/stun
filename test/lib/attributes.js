'use strict';

const { attributeType, messageType, attributeValueType } = require('lib/constants');
const { createMessage } = require('lib/create-message');

function createTestMessage() {
  const message = createMessage();

  message.setType(messageType.BINDING_REQUEST);
  message.setTransactionID(Buffer.from('d00558707bb8cc6a633a9df7', 'hex'));

  return message;
}

// RFC5766

test('support CHANNEL_NUMBER attribute', () => {
  const message = createTestMessage();
  const attribute = message.addAttribute(attributeType.CHANNEL_NUMBER, 1);

  expect(attribute.valueType).toEqual(attributeValueType.UINT32);
});

test('support LIFETIME attribute', () => {
  const message = createTestMessage();
  const attribute = message.addAttribute(attributeType.LIFETIME, 1);

  expect(attribute.valueType).toEqual(attributeValueType.UINT32);
});

test('support XOR_PEER_ADDRESS attribute', () => {
  const message = createTestMessage();
  const attribute = message.addAttribute(attributeType.XOR_PEER_ADDRESS, '127.0.0.1', 1234);

  expect(attribute.valueType).toEqual(attributeValueType.XOR_ADDRESS);
});

test('support DATA attribute', () => {
  const message = createTestMessage();
  const attribute = message.addAttribute(attributeType.DATA, 'abcd');

  expect(attribute.valueType).toEqual(attributeValueType.BYTE_STRING);
});

test('support XOR_RELAYED_ADDRESS attribute', () => {
  const message = createTestMessage();
  const attribute = message.addAttribute(attributeType.XOR_RELAYED_ADDRESS, '127.0.0.1', 1234);

  expect(attribute.valueType).toEqual(attributeValueType.XOR_ADDRESS);
});

test('support EVEN_PORT attribute', () => {
  const message = createTestMessage();
  const attribute = message.addAttribute(attributeType.EVEN_PORT, 'abcd');

  expect(attribute.valueType).toEqual(attributeValueType.BYTE_STRING);
});

test('support REQUESTED_TRANSPORT attribute', () => {
  const message = createTestMessage();
  const attribute = message.addAttribute(attributeType.REQUESTED_TRANSPORT, 1);

  expect(attribute.valueType).toEqual(attributeValueType.UINT32);
});

test('support DONT_FRAGMENT attribute', () => {
  const message = createTestMessage();
  const attribute = message.addAttribute(attributeType.DONT_FRAGMENT);

  expect(attribute.valueType).toEqual(attributeValueType.BYTE_STRING);
});

test('support RESERVATION_TOKEN attribute', () => {
  const message = createTestMessage();
  const attribute = message.addAttribute(attributeType.RESERVATION_TOKEN);

  expect(attribute.valueType).toEqual(attributeValueType.BYTE_STRING);
});

// RFC5780

test('support CHANGE_REQUEST attribute', () => {
  const message = createTestMessage();
  const attribute = message.addAttribute(attributeType.CHANGE_REQUEST);

  expect(attribute.valueType).toEqual(attributeValueType.UINT32);
});

test('support PADDING attribute', () => {
  const message = createTestMessage();
  const attribute = message.addAttribute(attributeType.PADDING);

  expect(attribute.valueType).toEqual(attributeValueType.BYTE_STRING);
});

test('support RESPONSE_PORT attribute', () => {
  const message = createTestMessage();
  const attribute = message.addAttribute(attributeType.RESPONSE_PORT);

  expect(attribute.valueType).toEqual(attributeValueType.UINT16);
});

test('support RESPONSE_ORIGIN attribute', () => {
  const message = createTestMessage();
  const attribute = message.addAttribute(attributeType.RESPONSE_ORIGIN, '127.0.0.1', 1234);

  expect(attribute.valueType).toEqual(attributeValueType.ADDRESS);
});

test('support OTHER_ADDRESS attribute', () => {
  const message = createTestMessage();
  const attribute = message.addAttribute(attributeType.OTHER_ADDRESS, '127.0.0.1', 1234);

  expect(attribute.valueType).toEqual(attributeValueType.ADDRESS);
});
