// This file contains definition of StunMessage classes.

const crypto = require('crypto')
const {
  createEncodeStream,
  createDecodeStream,
  encode,
  decode,
  encodingLength,
  types: { array }
} = require('binary-data')
const { crc32 } = require('crc')
const constants = require('./constants')
const { StunMessagePacket, StunAttributePacket } = require('./protocol')
const StunAddressAttribute = require('./attr/stun-address-attribute')
const StunXorAddressAttribute = require('./attr/stun-xor-address-attribute')
const StunUInt32Attribute = require('./attr/stun-uint32-attribute')
const StunByteStringAttribute = require('./attr/stun-bytestring-attribute')
const StunErrorCodeAttribute = require('./attr/stun-error-code-attribute')
const StunUInt16ListAttribute = require('./attr/stun-uint16list-attribute')
const StunUnknownAttribute = require('./attr/stun-unknown-attribute')

const { attributeType, attributeValueType } = constants
const EMPTY_TRANSACTION_ID = Buffer.alloc(12, 0)

const EMPTY_BUFFER = Buffer.alloc(0)
const EMPTY_MESSAGE_INTEGRITY = Buffer.alloc(20, 0)

class StunMessage {
  constructor() {
    this._type = 0
    this._transactionId = EMPTY_TRANSACTION_ID
    this._attrs = []
    this._cookie = constants.kStunMagicCookie
  }

  get type() {
    return this._type
  }

  get transactionId() {
    return this._transactionId
  }

  /**
   * Get count of an attributes.
   *
   * @return {number}
   */
  get count() {
    return this._attrs.length
  }

  setType(type) {
    this._type = Number(type)
  }

  setTransactionID(transactionId) {
    if (!isValidTransactionId(transactionId)) {
      return false
    }

    this._transactionId = transactionId
    return true
  }

  static from(message) {
    const rstream = createDecodeStream(message)
    const packet = decode(rstream, StunMessagePacket)

    const stunMsg = new StunMessage()

    stunMsg.setType(packet.header.type)
    stunMsg.setTransactionID(packet.header.transaction)

    this._cookie = packet.header.cookie

    stunMsg._attrs = packet.attributes.map(attrPacket =>
      parseAttribute(attrPacket, stunMsg)
    )

    return stunMsg
  }

  // Returns true if the message confirms to RFC3489 rather than RFC5389.
  isLegacy() {
    return this._cookie !== constants.kStunMagicCookie
  }

  /**
   * @param {number} type attribute type
   * @param {*} value value of an attribute
   */
  addAttribute(type, ...args) {
    const attr = createAttribute(type, ...args)

    attr.setOwner(this)
    this._attrs.push(attr)

    return attr
  }

  /**
   * @param {number} type
   */
  getAttribute(type) {
    return this._attrs.find(attr => attr.type === type)
  }

  /**
   * @param {number} type
   */
  removeAttribute(type) {
    const index = this._attrs.findIndex(attr => attr.type === type)

    if (index === -1) {
      return false
    }

    switch (index) {
      case 0:
        this._attrs.shift()
        break
      case this._attrs.length - 1:
        this._attrs.pop()
        break
      default:
        this._attrs.splice(index, 1)
        break
    }

    return true
  }

  // Adds a MESSAGE-INTEGRITY attribute that is valid for the current message.
  addMessageIntegrity(key) {
    if (!key) {
      return false
    }

    const attrIntegrity = this.addAttribute(attributeType.MESSAGE_INTEGRITY, EMPTY_MESSAGE_INTEGRITY)

    const integrityLength = 4 + EMPTY_MESSAGE_INTEGRITY.length
    const msg = this.toBuffer()

    if (msg.length === 0) {
      return false
    }

    const hmac = crypto.createHmac('sha1', key)
    hmac.update(msg.slice(0, -integrityLength))

    return attrIntegrity.setValue(hmac.digest())
  }

  // Adds a FINGERPRINT attribute that is valid for the current message.
  addFingerprint() {
    const attrFingerprint = this.addAttribute(attributeType.FINGERPRINT, 0)

    const fingerprintLength = 8
    const msg = this.toBuffer()

    if (msg.length === 0) {
      return false
    }

    const crc32buf = msg.slice(0, -fingerprintLength)
    return attrFingerprint.setValue((crc32(crc32buf) ^ constants.kStunFingerprintXorValue) >>> 0)
  }

  write(encodeStream) {
    const attributes = this._attrs.map(attr => ({
      type: attr.type,
      value: attr.toBuffer()
    }))

    const packet = {
      header: {
        type: this.type,
        length: encodingLength(attributes, array(StunAttributePacket, attributes.length)),
        cookie: this._cookie,
        transaction: this.transactionId
      },
      attributes
    }

    encode(packet, encodeStream, StunMessagePacket)
    return true
  }

  toBuffer() {
    const encodeStream = createEncodeStream()

    if (this.write(encodeStream)) {
      return encodeStream.slice()
    }

    return EMPTY_BUFFER
  }
}

/**
 * Iterator over attributes.
 */
StunMessage.prototype[Symbol.iterator] = function * () {
  for (const attribute of this._attrs) {
    yield attribute
  }
}

/**
 * @param {number} type
 * @private
 */
function getAttributeValueType(attrType) {
  switch (attrType) {
    case attributeType.MAPPED_ADDRESS:
    case attributeType.ALTERNATE_SERVER:
      return attributeValueType.ADDRESS

    case attributeType.XOR_MAPPED_ADDRESS:
    case attributeType.XOR_PEER_ADDRESS:
    case attributeType.XOR_RELAYED_ADDRESS:
      return attributeValueType.XOR_ADDRESS

    case attributeType.USERNAME:
    case attributeType.MESSAGE_INTEGRITY:
    case attributeType.REALM:
    case attributeType.NONCE:
    case attributeType.SOFTWARE:
    case attributeType.ORIGIN:
    case attributeType.DATA:
    case attributeType.EVEN_PORT:
    case attributeType.RESERVATION_TOKEN:
    case attributeType.DONT_FRAGMENT:
      return attributeValueType.BYTE_STRING

    case attributeType.ERROR_CODE:
      return attributeValueType.ERROR_CODE

    case attributeType.UNKNOWN_ATTRIBUTES:
      return attributeValueType.UINT16_LIST

    case attributeType.FINGERPRINT:
    case attributeType.RETRANSMIT_COUNT:
    case attributeType.PRIORITY:
    case attributeType.NETWORK_INFO:
    case attributeType.NOMINATION:
    case attributeType.CHANNEL_NUMBER:
    case attributeType.LIFETIME:
    case attributeType.REQUESTED_TRANSPORT:
      return attributeValueType.UINT32

    case attributeType.USE_CANDIDATE:
    case attributeType.ICE_CONTROLLED:
    case attributeType.ICE_CONTROLLING:
      return attributeValueType.BYTE_STRING

    default:
      return attributeValueType.UNKNOWN
  }
}

function createAttribute(type, ...args) {
  switch (getAttributeValueType(type)) {
    case attributeValueType.ADDRESS:
      return new StunAddressAttribute(type, ...args)

    case attributeValueType.XOR_ADDRESS:
      return new StunXorAddressAttribute(type, ...args)

    case attributeValueType.UINT32:
      return new StunUInt32Attribute(type, ...args)

    case attributeValueType.BYTE_STRING:
      return new StunByteStringAttribute(type, ...args)

    case attributeValueType.ERROR_CODE:
      return new StunErrorCodeAttribute(type, ...args)

    case attributeValueType.UINT16_LIST:
      return new StunUInt16ListAttribute(type, ...args)

    default:
      break
  }

  throw new Error(`Unsupported attribute type "${type}".`)
}

function parseAttribute(attributePacket, owner) {
  const { type, value } = attributePacket

  switch (getAttributeValueType(type)) {
    case attributeValueType.ADDRESS:
      return StunAddressAttribute.from(type, value, owner)

    case attributeValueType.XOR_ADDRESS:
      return StunXorAddressAttribute.from(type, value, owner)

    case attributeValueType.UINT32:
      return StunUInt32Attribute.from(type, value, owner)

    case attributeValueType.BYTE_STRING:
      return StunByteStringAttribute.from(type, value, owner)

    case attributeValueType.ERROR_CODE:
      return StunErrorCodeAttribute.from(type, value, owner)

    case attributeValueType.UINT16_LIST:
      return StunUInt16ListAttribute.from(type, value, owner)

    default:
      break
  }

  return StunUnknownAttribute.from(type, value, owner)
}

/**
 * @param {Buffer} transactionId
 * @return {bool}
 */
function isValidTransactionId(transactionId) {
  return (
    Buffer.isBuffer(transactionId) &&
    (transactionId.length === constants.kStunTransactionIdLength ||
      transactionId.length === constants.kStunLegacyTransactionIdLength)
  )
}

module.exports = StunMessage
