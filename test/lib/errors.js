'use strict';

const { StunMessageError, StunResponseError } = require('lib/errors');
const { messageType } = require('lib/constants');
const StunMessage = require('lib/message');

test('should use ERROR-CODE attribute for StunResponseError', () => {
  const message = new StunMessage();

  message.setType(messageType.BINDING_ERROR_RESPONSE);
  message.addError(300, 'hello world');

  const error = new StunResponseError(message, {});

  expect(error.message).toEqual('hello world');
  expect(error.code).toEqual(300);
  expect(error.packet).toBe(message);
  expect(error.name).toEqual('StunResponseError');
  expect(error.sender).toEqual({});
});

test('should use fallback if ERROR-CODE attribute missed', () => {
  const message = new StunMessage();

  message.setType(messageType.BINDING_ERROR_RESPONSE);

  const error = new StunResponseError(message, {});

  expect(error.message).toEqual('Unknown error');
  expect(error.code).toBeUndefined();
  expect(error.packet).toBe(message);
  expect(error.name).toEqual('StunResponseError');
  expect(error.sender).toEqual({});
});

test('StunMessageError', () => {
  const msg = Buffer.alloc(0);
  const error = new StunMessageError(msg, {});

  expect(error.message).toEqual('Invalid message');
  expect(error.packet).toBe(msg);
  expect(error.name).toEqual('StunMessageError');
  expect(error.sender).toEqual({});
});
