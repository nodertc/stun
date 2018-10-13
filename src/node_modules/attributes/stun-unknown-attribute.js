'use strict';

const constants = require('lib/constants');
const StunByteStringAttribute = require('attributes/stun-bytestring-attribute');

/**
 * This class implements unknown STUN attribute.
 */
module.exports = class StunUnknownAttribute extends StunByteStringAttribute {
  /**
   * Create `StunUnknownAttribute` instance from buffer.
   * @param {number} type
   * @param {Buffer} message
   * @returns {StunUnknownAttribute}
   */
  static from(type, message) {
    return new StunUnknownAttribute(type, message);
  }

  /**
   * Get type of an attribute value.
   * @returns {number}
   */
  get valueType() {
    return constants.attributeValueType.UNKNOWN;
  }

  /**
   * @private
   * @returns {bool}
   */
  write() {
    return false;
  }
};
