'use strict';

const Emitter = require('events');
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

test('should listen', () => {
  const sock = socket();
  sock.bind = jest.fn();

  const server = new Server(sock);
  server.once = jest.fn();

  server.listen(123);
  expect(sock.bind).toBeCalledWith(123, undefined);

  server.listen(123, 'localhost');
  expect(sock.bind).toBeCalledWith(123, 'localhost');

  const cb = jest.fn();
  server.listen(123, 'localhost', cb);
  expect(sock.bind).toBeCalledWith(123, 'localhost');
  expect(server.once).lastCalledWith('listening', cb);
});

test('should call callbacks for `listening`', () => {
  const sock = socket();
  sock.bind = jest.fn();

  const server = new Server(sock);

  const cb = jest.fn();
  server.listen(123, 'localhost', cb);

  server.emit('listening');
  expect(cb).toBeCalledTimes(1);
});

test('should emit `listening` event', () => {
  const sock = new Emitter();
  const server = new Server(sock);
  server.emit = jest.fn();

  sock.emit('listening');
  expect(server.emit).toBeCalledWith('listening');

  sock.emit('listening');
  expect(server.emit).toBeCalledTimes(1);
});
