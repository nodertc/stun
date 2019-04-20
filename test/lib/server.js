'use strict';

const Server = require('net/dgram-server');
const { StunMessageError, StunResponseError } = require('lib/errors');
const { messageType } = require('lib/constants');
const StunMessage = require('lib/message');

/**
 * Create fake udp socket.
 * @returns {Object}
 */
function socket() {
  return {
    on() {},
    once() {},
  };
}

test('do not throw exception on invalid message', () => {
  const server = new Server(socket());
  const message = Buffer.from([2, 0xff]);

  server.emit = jest.fn();

  server.process(message, {});

  expect(server.emit).lastCalledWith(
    'error',
    new StunMessageError(message, {})
  );
});

test('emit StunResponseError for an error messages', () => {
  const server = new Server(socket());
  server.emit = jest.fn();

  const message = new StunMessage();

  message.setType(messageType.BINDING_ERROR_RESPONSE);
  message.addError(300, 'hello world');

  server.process(message.toBuffer(), {});

  expect(server.emit).lastCalledWith(
    'error',
    new StunResponseError(message, {})
  );
});
