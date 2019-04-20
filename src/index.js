'use strict';

const crypto = require('crypto');
const dgram = require('dgram');
const StunMessage = require('lib/message');
const StunServer = require('lib/server');
const defaultConstants = require('lib/constants');
const {
  validateFingerprint,
  validateMessageIntegrity,
} = require('lib/validate');
const {
  StunError,
  StunMessageError,
  StunResponseError,
} = require('lib/errors');

const constants = {};

module.exports = {
  createMessage,
  createServer,
  createTransaction,
  validateFingerprint,
  validateMessageIntegrity,
  StunMessage,
  StunServer,
  StunError,
  StunMessageError,
  StunResponseError,
  constants,
};

/**
 * Create transaction id for STUN message.
 * @returns {Buffer}
 */
function createTransaction() {
  return crypto.randomBytes(defaultConstants.kStunTransactionIdLength);
}

/**
 * Creates a new STUN message.
 * @param {number} type - Message type (see constants).
 * @param {Buffer} [transaction] - Message `transaction` field, random by default.
 * @returns {StunMessage} StunMessage instance.
 */
function createMessage(type, transaction) {
  const msg = new StunMessage();

  msg.setType(type);
  msg.setTransactionID(transaction || createTransaction());

  return msg;
}

/**
 * Creates a new STUN server.
 * @param {dgram.Socket} [socket] - Optional udp socket.
 * @returns {StunServer} StunServer instance.
 */
function createServer(socket) {
  let isExternalSocket = true;

  if (socket === undefined) {
    // eslint-disable-next-line no-param-reassign
    socket = dgram.createSocket('udp4');
    isExternalSocket = false;
  }

  const server = new StunServer(socket);

  if (!isExternalSocket) {
    socket.on('error', error => server.emit('error', error));
    server.once('close', () => socket.close());
  }

  return server;
}

// Export constants
Object.keys(defaultConstants.messageType).forEach(messageType => {
  constants[`STUN_${messageType}`] = defaultConstants.messageType[messageType];
});

Object.keys(defaultConstants.errorCode).forEach(errorCode => {
  constants[`STUN_CODE_${errorCode}`] = defaultConstants.errorCode[errorCode];
});

Object.keys(defaultConstants.errorReason).forEach(errorReason => {
  constants[`STUN_REASON_${errorReason}`] =
    defaultConstants.errorReason[errorReason];
});

Object.keys(defaultConstants.attributeType).forEach(attrType => {
  constants[`STUN_ATTR_${attrType}`] = defaultConstants.attributeType[attrType];
});

Object.keys(defaultConstants.eventNames).forEach(eventName => {
  constants[`STUN_${eventName}`] = defaultConstants.eventNames[eventName];
});
