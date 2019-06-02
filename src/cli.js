#!/usr/bin/env node

'use strict';

const dgram = require('dgram');
const meow = require('meow');
const stun = require('.');
const { version } = require('../package.json');

const cli = meow(
  `
  Usage:
    $ stun [-p <port>]

  Options:
    --port, -p      Specified a port on which the STUN server are bound
                    Default port is 3478 defined in RFC5389.
`,
  {
    flags: {
      port: {
        type: 'string',
        alias: 'p',
        default: '3478',
      },
    },
  }
);

/**
 * Check if argument is valid port.
 * @param {number} port
 * @returns {boolean}
 */
const isLegalPort = port => Number.isInteger(port) && port > 0 && port <= 0xffff;

const cliPort = Number(cli.flags.port);

const socket = dgram.createSocket('udp4');
const server = stun.createServer(socket);

const { STUN_BINDING_RESPONSE, STUN_EVENT_BINDING_REQUEST } = stun.constants;
const userAgent = `node/${process.version} stun/v${version}`;

server.on(STUN_EVENT_BINDING_REQUEST, (request, rinfo) => {
  const message = stun.createMessage(STUN_BINDING_RESPONSE);

  message.addXorAddress(rinfo.address, rinfo.port);
  message.addSoftware(userAgent);

  server.send(message, rinfo.port, rinfo.address);
});

server.on('error', error => {
  process.stderr.write(error.message);

  if (error instanceof stun.StunError) {
    const { address, port } = error.sender;

    process.stderr.write(` received from ${address}:${port}`);
  }

  process.stderr.write('\n');
});

socket.bind(isLegalPort(cliPort) ? cliPort : 3478, () => {
  const { address, port } = socket.address();

  process.stdout.write(`stun server started at ${address}:${port}\n`);
});
