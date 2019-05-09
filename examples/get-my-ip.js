'use strict';

const stun = require('..');

const {
  STUN_BINDING_REQUEST,
  STUN_ATTR_XOR_MAPPED_ADDRESS,
  STUN_EVENT_BINDING_RESPONSE,
} = stun.constants;

const server = stun.createServer({ type: 'udp4' });
const request = stun.createMessage(STUN_BINDING_REQUEST);

server.once(STUN_EVENT_BINDING_RESPONSE, stunMsg => {
  console.log(
    'your ip:',
    stunMsg.getAttribute(STUN_ATTR_XOR_MAPPED_ADDRESS).value.address
  );

  server.close();
});

server.send(request, 19302, 'stun.l.google.com');
