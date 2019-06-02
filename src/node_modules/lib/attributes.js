'use strict';

// This file implements utility functions for working with atributes.

const StunAddressAttribute = require('attributes/stun-address-attribute');
const StunXorAddressAttribute = require('attributes/stun-xor-address-attribute');
const StunUInt32Attribute = require('attributes/stun-uint32-attribute');
const StunByteStringAttribute = require('attributes/stun-bytestring-attribute');
const StunErrorCodeAttribute = require('attributes/stun-error-code-attribute');
const StunUInt16ListAttribute = require('attributes/stun-uint16list-attribute');
const StunUnknownAttribute = require('attributes/stun-unknown-attribute');
const StunUInt16Attribute = require('attributes/stun-uint16-attribute');
const { attributeType, attributeValueType } = require('lib/constants');

module.exports = {
  create,
  parse,
  getValueType,
};

/**
 * @param {number} attributeType_ Attribute type.
 * @returns {number} Type of an attribute's value.
 * @private
 */
function getValueType(attributeType_) {
  switch (attributeType_) {
    case attributeType.MAPPED_ADDRESS:
    case attributeType.ALTERNATE_SERVER:
    case attributeType.RESPONSE_ORIGIN:
    case attributeType.OTHER_ADDRESS:
      return attributeValueType.ADDRESS;

    case attributeType.XOR_MAPPED_ADDRESS:
    case attributeType.XOR_PEER_ADDRESS:
    case attributeType.XOR_RELAYED_ADDRESS:
      return attributeValueType.XOR_ADDRESS;

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
    case attributeType.PADDING:
      return attributeValueType.BYTE_STRING;

    case attributeType.ERROR_CODE:
      return attributeValueType.ERROR_CODE;

    case attributeType.UNKNOWN_ATTRIBUTES:
      return attributeValueType.UINT16_LIST;

    case attributeType.FINGERPRINT:
    case attributeType.RETRANSMIT_COUNT:
    case attributeType.PRIORITY:
    case attributeType.NETWORK_INFO:
    case attributeType.NOMINATION:
    case attributeType.CHANNEL_NUMBER:
    case attributeType.LIFETIME:
    case attributeType.REQUESTED_TRANSPORT:
    case attributeType.CHANGE_REQUEST:
      return attributeValueType.UINT32;

    case attributeType.USE_CANDIDATE:
    case attributeType.ICE_CONTROLLED:
    case attributeType.ICE_CONTROLLING:
      return attributeValueType.BYTE_STRING;

    case attributeType.RESPONSE_PORT:
      return attributeValueType.UINT16;

    default:
      return attributeValueType.UNKNOWN;
  }
}

/**
 * Create attribute.
 * @param {number} type Attribute type.
 * @param {any[]} arguments_ Values.
 * @returns {StunAttribute}
 */
function create(type, ...arguments_) {
  switch (getValueType(type)) {
    case attributeValueType.ADDRESS:
      return new StunAddressAttribute(type, ...arguments_);

    case attributeValueType.XOR_ADDRESS:
      return new StunXorAddressAttribute(type, ...arguments_);

    case attributeValueType.UINT32:
      return new StunUInt32Attribute(type, ...arguments_);

    case attributeValueType.BYTE_STRING:
      return new StunByteStringAttribute(type, ...arguments_);

    case attributeValueType.ERROR_CODE:
      return new StunErrorCodeAttribute(type, ...arguments_);

    case attributeValueType.UINT16_LIST:
      return new StunUInt16ListAttribute(type, ...arguments_);

    case attributeValueType.UINT16:
      return new StunUInt16Attribute(type, ...arguments_);

    default:
      break;
  }

  throw new Error(`Unsupported attribute type "${type}".`);
}

/**
 * Create attribute from arrived data.
 * @param {Object} attributePacket
 * @param {StunMessage} owner
 * @returns {StunAttribute}
 */
function parse(attributePacket, owner) {
  const { type, value } = attributePacket;

  switch (getValueType(type)) {
    case attributeValueType.ADDRESS:
      return StunAddressAttribute.from(type, value, owner);

    case attributeValueType.XOR_ADDRESS:
      return StunXorAddressAttribute.from(type, value, owner);

    case attributeValueType.UINT32:
      return StunUInt32Attribute.from(type, value, owner);

    case attributeValueType.BYTE_STRING:
      return StunByteStringAttribute.from(type, value, owner);

    case attributeValueType.ERROR_CODE:
      return StunErrorCodeAttribute.from(type, value, owner);

    case attributeValueType.UINT16_LIST:
      return StunUInt16ListAttribute.from(type, value, owner);

    case attributeValueType.UINT16:
      return StunUInt16Attribute.from(type, value, owner);

    default:
      break;
  }

  return StunUnknownAttribute.from(type, value, owner);
}
