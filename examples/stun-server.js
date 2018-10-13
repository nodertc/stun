'use strict';

const dgram = require('dgram');
const stun = require('..');

const socket = dgram.createSocket('udp4');
const server = stun.createServer(socket);

const {
  STUN_BINDING_RESPONSE,
  STUN_ATTR_XOR_MAPPED_ADDRESS,
  STUN_ATTR_SOFTWARE,
} = stun.constants;
const userAgent = `node/${process.version} stun/v1.0.0`;

server.on('bindingRequest', (req, rinfo) => {
  const msg = stun.createMessage(STUN_BINDING_RESPONSE);

  msg.addAttribute(STUN_ATTR_XOR_MAPPED_ADDRESS, rinfo.address, rinfo.port);
  msg.addAttribute(STUN_ATTR_SOFTWARE, userAgent);

  server.send(msg, rinfo.port, rinfo.address);
});

socket.bind(19302, () => {
  console.log('[stun] server started');
});
