'use strict';

const {
  encode,
  types: { uint32be },
} = require('binary-data');
const constants = require('lib/constants');
const StunAttribute = require('attributes/stun-attribute');

const MAX_UINT32 = -1 >>> 0; // eslint-disable-line no-bitwise

const kValue = Symbol('kValue');

/**
 * This class implements STUN attribute for UInt32 numbers.
 */
module.exports = class StunUInt32Attribute extends StunAttribute {
  /**
   * @class StunUInt32Attribute
   * @param {number} type Attribute type.
   * @param {number} value
   */
  constructor(type, value) {
    super(type);

    this[kValue] = 0;
    this.setValue(value);
  }

  /**
   * Create `StunUInt32Attribute` instance from the buffer.
   * @param {number} type
   * @param {Buffer} message
   * @returns {StunUInt32Attribute}
   */
  static from(type, message) {
    return new StunUInt32Attribute(type, message.readUInt32BE(0));
  }

  /**
   * Get attribute value.
   */
  get value() {
    return this[kValue];
  }

  /**
   * Get type of an attribute value.
   * @returns {number}
   */
  get valueType() {
    return constants.attributeValueType.UINT32;
  }

  /**
   * Set attribute value.
   * @param {number} value
   * @returns {bool}
   */
  setValue(value) {
    if (Number.isSafeInteger(value) && value >= 0 && value <= MAX_UINT32) {
      this[kValue] = value;
      return true;
    }

    return false;
  }

  /**
   * @private
   * @param {EncodeStream} encodeStream
   * @returns {bool}
   */
  write(encodeStream) {
    encode(this.value, encodeStream, uint32be);
    return true;
  }
};
