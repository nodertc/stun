const crypto = require('crypto')
const dgram = require('dgram')
const StunMessage = require('./lib/message')
const StunServer = require('./lib/server')
const defaultConstants = require('./lib/constants')
const { validateFingerprint, validateMessageIntegrity } = require('./lib/validate')

const constants = {}

module.exports = {
  createMessage,
  createServer,
  validateFingerprint,
  validateMessageIntegrity,
  StunMessage,
  StunServer,
  constants
}

/**
 * Creates a new STUN message.
 *
 * @param {number} type - message type (see constants).
 * @param {Buffer} [transaction] - message `transaction` field, random by default.
 * @return {StunMessage}
 */
function createMessage(type, transaction) {
  const msg = new StunMessage()

  msg.setType(type)

  if (!transaction) {
    transaction = crypto.randomBytes(defaultConstants.kStunTransactionIdLength)
  }

  msg.setTransactionID(transaction)

  return msg
}

/**
 * Creates a new STUN server.
 *
 * @param {dgram.Socket} [socket] - optional udp socket.
 * @return {StunServer}
 */
function createServer(socket) {
  let isExternalSocket = true

  if (socket === undefined) {
    socket = dgram.createSocket('udp4')
    isExternalSocket = false
  }

  const server = new StunServer(socket)

  if (!isExternalSocket) {
    server.once('close', () => socket.close())
  }

  return server
}

// Export constants
Object.keys(defaultConstants.messageType).forEach(messageType => {
  constants['STUN_' + messageType] = defaultConstants.messageType[messageType]
})

Object.keys(defaultConstants.errorCode).forEach(errorCode => {
  constants['STUN_CODE_' + errorCode] = defaultConstants.errorCode[errorCode]
})

Object.keys(defaultConstants.errorReason).forEach(errorReason => {
  constants['STUN_REASON_' + errorReason] = defaultConstants.errorReason[errorReason]
})

Object.keys(defaultConstants.attributeType).forEach(attrType => {
  constants['STUN_ATTR_' + attrType] = defaultConstants.attributeType[attrType]
})
