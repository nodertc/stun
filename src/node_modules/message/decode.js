'use strict';

const binary = require('binary-data');
const StunResponse = require('message/response');
const { StunMessagePacket } = require('lib/protocol');
const attributes = require('lib/attributes');

const kMessageType = Symbol.for('kMessageType');
const kTransactionId = Symbol.for('kTransctionId');
const kCookie = Symbol.for('kCookie');
const kAttributes = Symbol.for('kAttributes');

module.exports = decode;

/**
 * Decode the Buffer into the StunResponse.
 * @param {Buffer} message
 * @returns {StunResponse}
 */
function decode(message) {
  const packet = binary.decode(message, StunMessagePacket);

  const response = new StunResponse();

  response[kMessageType] = packet.header.type;
  response[kTransactionId] = packet.header.transaction;
  response[kCookie] = packet.header.cookie;

  response[kAttributes] = packet.attributes.map(attribute => attributes.parse(attribute, response));

  return response;
}
