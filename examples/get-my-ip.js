'use strict';

const stun = require('..');

const options = { timeout: 250, retries: 2 };

stun.request('stun.l.google.com:19302', options, (error, response) => {
  if (error) {
    console.error(error);
  } else {
    const { address } = response.getXorAddress();
    console.log('your ip:', address);
  }
});
