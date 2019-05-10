'use strict';

const stun = require('..');

const { STUN_ATTR_XOR_MAPPED_ADDRESS } = stun.constants;
const options = { timeout: 250, retries: 2 };

stun.request('stun.l.google.com:19302', options, (err, res) => {
  if (err) {
    console.error(err);
  } else {
    const { address } = res.getAttribute(STUN_ATTR_XOR_MAPPED_ADDRESS).value;
    console.log('your ip:', address);
  }
});
