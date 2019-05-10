'use strict';

const dgram = require('dgram');
const StunServer = require('net/dgram-server');

module.exports = {
  createServer,
  createDgramServer,
};

/**
 * Creates a new STUN server.
 * @param {Object} options
 * @param {Object} options.type
 * @param {Object} [options.socket]
 * @returns {StunServer} StunServer instance.
 */
function createServer(options = {}) {
  switch (options.type) {
    case 'udp4':
    case 'udp6':
      return createDgramServer(options);
    default:
      break;
  }

  throw new Error('Invalid server type.');
}

/**
 * Creates dgram STUN server.
 * @param {Object} [options]
 * @param {Object} options.type - The type of UDP socket.
 * @param {dgram.Socket} [options.socket] - Optional udp socket.
 * @returns {StunServer}
 */
function createDgramServer(options = {}) {
  let isExternalSocket = false;
  let { socket } = options;

  if (socket instanceof dgram.Socket) {
    isExternalSocket = true;
  } else {
    socket = dgram.createSocket(options);
  }

  const server = new StunServer(socket);

  if (!isExternalSocket) {
    socket.on('error', error => server.emit('error', error));
    server.once('close', () => socket.close());
  }

  return server;
}
