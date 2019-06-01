'use strict';

const stun = require('..');

const options = { timeout: 250, retries: 2 };

stun.request('stun.l.google.com:19302', options, (err, res) => {
  if (err) {
    console.error(err);
  } else {
    const { address } = res.getXorAddress();
    console.log('your ip:', address);
  }
});
