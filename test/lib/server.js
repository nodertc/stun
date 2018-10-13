'use strict';

const Server = require('lib/server');

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
    new Error('Invalid message'),
    message
  );
});
