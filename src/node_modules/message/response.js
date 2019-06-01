'use strict';

const StunMessage = require('message/message');
const { attributeType } = require('lib/constants');

/**
 * Get a value of an attribute of the message.
 * @param {StunMessage} message
 * @param {number} type
 * @returns {*}
 */
function getAttribute(message, type) {
  const attribute = message.getAttribute(type);

  if (typeof attribute !== 'undefined') {
    return attribute.value;
  }
}

/**
 * Get a string attribute.
 * @param {StunMessage} message
 * @param {number} type
 * @returns {string}
 */
function getStringAttribute(message, type) {
  const attribute = getAttribute(message, type);

  if (Buffer.isBuffer(attribute)) {
    return attribute.toString();
  }
}

/**
 * @typedef {Object} AddressType
 * @property {string} address
 * @property {number} port
 * @property {string} family
 */

/**
 * @typedef {Object} ErrorType
 * @property {number} code
 * @property {string} reason
 */

/**
 * This class implements incoming STUN messages.
 */
module.exports = class StunResponse extends StunMessage {
  /**
   * Get MAPPED_ADDRESS attribute.
   * @returns {AddressType}
   */
  getAddress() {
    return getAttribute(this, attributeType.MAPPED_ADDRESS);
  }

  /**
   * Get XOR_MAPPED_ADDRESS attribute.
   * @returns {AddressType}
   */
  getXorAddress() {
    return getAttribute(this, attributeType.XOR_MAPPED_ADDRESS);
  }

  /**
   * Get ALTERNATE-SERVER attribute.
   * @returns {AddressType}
   */
  getAlternateServer() {
    return getAttribute(this, attributeType.ALTERNATE_SERVER);
  }

  /**
   * Get USERNAME attribute.
   * @returns {string}
   */
  getUsername() {
    return getStringAttribute(this, attributeType.USERNAME);
  }

  /**
   * Get ERROR_CODE attribute.
   * @returns {ErrorType}
   */
  getError() {
    return getAttribute(this, attributeType.ERROR_CODE);
  }

  /**
   * Get REALM attribute.
   * @returns {string}
   */
  getRealm() {
    return getStringAttribute(this, attributeType.REALM);
  }

  /**
   * Get NONCE attribute.
   * @returns {string}
   */
  getNonce() {
    return getStringAttribute(this, attributeType.NONCE);
  }

  /**
   * Get SOFTWARE attribute.
   * @returns {string}
   */
  getSoftware() {
    return getStringAttribute(this, attributeType.SOFTWARE);
  }

  /**
   * Get UNKNOWN_ATTRIBUTES attribute.
   * @returns {number[]}
   */
  getUnknownAttributes() {
    return getAttribute(this, attributeType.UNKNOWN_ATTRIBUTES);
  }

  /**
   * Get MESSAGE_INTEGRITY attribute.
   * @returns {Buffer}
   */
  getMessageIntegrity() {
    return getAttribute(this, attributeType.MESSAGE_INTEGRITY);
  }

  /**
   * Get FINGERPRINT attribute.
   * @returns {number}
   */
  getFingerprint() {
    const attribute = getAttribute(this, attributeType.FINGERPRINT);

    if (typeof attribute === 'number') {
      return attribute.value >>> 0;
    }
  }

  /**
   * Get PRIORITY attribute.
   * @returns {number}
   */
  getPriority() {
    const attribute = getAttribute(this, attributeType.PRIORITY);

    if (typeof attribute === 'number') {
      return attribute.value >> 0;
    }
  }

  /**
   * Get ICE_CONTROLLED attribute.
   * @returns {Buffer}
   */
  getIceControlled() {
    return getAttribute(this, attributeType.ICE_CONTROLLED);
  }

  /**
   * Get ICE_CONTROLLING attribute.
   * @returns {Buffer}
   */
  getIceControlling() {
    return getAttribute(this, attributeType.ICE_CONTROLLING);
  }
};
