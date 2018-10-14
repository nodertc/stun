'use strict';

const dgram = require('dgram');
const stun = require('..');

const socket = dgram.createSocket('udp4');
const server = stun.createServer(socket);

const { STUN_BINDING_RESPONSE, STUN_EVENT_BINDING_REQUEST } = stun.constants;
const userAgent = `node/${process.version} stun/v1.0.0`;

server.on(STUN_EVENT_BINDING_REQUEST, (req, rinfo) => {
  const msg = stun.createMessage(STUN_BINDING_RESPONSE);

  msg.addXorAddress(rinfo.address, rinfo.port);
  msg.addSoftware(userAgent);

  server.send(msg, rinfo.port, rinfo.address);
});

socket.bind(19302, () => {
  console.log('[stun] server started');
});
