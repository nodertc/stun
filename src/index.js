'use strict';

const StunRequest = require('message/request');
const StunResponse = require('message/response');
const StunServer = require('net/dgram-server');
const defaultConstants = require('lib/constants');
const { validateFingerprint, validateMessageIntegrity } = require('lib/validate');
const { StunError, StunMessageError, StunResponseError } = require('lib/errors');
const { request } = require('net/request');
const { createServer } = require('net/create-server');
const { createMessage, createTransaction } = require('lib/create-message');
const encode = require('message/encode');
const decode = require('message/decode');

const constants = {};

module.exports = {
  createMessage,
  createServer,
  createTransaction,
  request,
  validateFingerprint,
  validateMessageIntegrity,
  encode,
  decode,
  StunRequest,
  StunResponse,
  StunServer,
  StunError,
  StunMessageError,
  StunResponseError,
  constants,
};

// Export constants
Object.keys(defaultConstants.messageType).forEach(messageType => {
  constants[`STUN_${messageType}`] = defaultConstants.messageType[messageType];
});

Object.keys(defaultConstants.errorCode).forEach(errorCode => {
  constants[`STUN_CODE_${errorCode}`] = defaultConstants.errorCode[errorCode];
});

Object.keys(defaultConstants.errorReason).forEach(errorReason => {
  constants[`STUN_REASON_${errorReason}`] = defaultConstants.errorReason[errorReason];
});

Object.keys(defaultConstants.attributeType).forEach(attributeType => {
  constants[`STUN_ATTR_${attributeType}`] = defaultConstants.attributeType[attributeType];
});

Object.keys(defaultConstants.eventNames).forEach(eventName => {
  constants[`STUN_${eventName}`] = defaultConstants.eventNames[eventName];
});
