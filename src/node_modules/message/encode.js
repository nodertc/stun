'use strict';

const binary = require('binary-data');
const { StunMessagePacket, StunAttributePacket } = require('lib/protocol');

const kCookie = Symbol.for('kCookie');
const kAttributes = Symbol.for('kAttributes');

const {
  types: { array },
} = binary;

module.exports = encode;

/**
 * Encode the StunMessage to the Buffer.
 * @param {StunMessage} message
 * @returns {Buffer}
 */
function encode(message) {
  const ostream = binary.createEncode();
  const attrlist = message[kAttributes];

  const attributes = attrlist.map(attribute => ({
    type: attribute.type,
    value: attribute.toBuffer(),
  }));

  const packet = {
    header: {
      type: message.type,
      length: binary.encodingLength(attributes, array(StunAttributePacket, attributes.length)),
      cookie: message[kCookie],
      transaction: message.transactionId,
    },
    attributes,
  };

  binary.encode(packet, ostream, StunMessagePacket);
  return ostream.slice();
}
