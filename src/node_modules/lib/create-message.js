'use strict';

const crypto = require('crypto');
const defaultConstants = require('lib/constants');
const StunRequest = require('message/request');

module.exports = {
  createTransaction,
  createMessage,
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
 * @returns {StunRequest} StunRequest instance.
 */
function createMessage(type, transaction) {
  const message = new StunRequest();

  message.setType(type);
  message.setTransactionId(transaction || createTransaction());

  return message;
}
