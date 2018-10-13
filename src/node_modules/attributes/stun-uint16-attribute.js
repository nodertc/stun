'use strict';

const {
  encode,
  types: { uint16be },
} = require('binary-data');
const constants = require('lib/constants');
const StunAttribute = require('attributes/stun-attribute');

const MAX_UINT16 = 0xffff;

const kValue = Symbol('kValue');

/**
 * This class implements STUN attribute for uint16 numbers.
 */
module.exports = class StunUInt16Attribute extends StunAttribute {
  /**
   * @class StunUInt16Attribute
   * @param {number} type Attribute type.
   * @param {number} value
   */
  constructor(type, value) {
    super(type);

    this[kValue] = 0;
    this.setValue(value);
  }

  /**
   * Create `StunAddressAttribute` instance from the buffer.
   * @param {number} type
   * @param {Buffer} message
   * @returns {StunAddressAttribute}
   */
  static from(type, message) {
    return new StunUInt16Attribute(type, message.readUInt16BE(0));
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
    return constants.attributeValueType.UINT16;
  }

  /**
   * Set attribute value.
   * @param {number} value
   * @returns {bool}
   */
  setValue(value) {
    if (Number.isSafeInteger(value) && value >= 0 && value <= MAX_UINT16) {
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
    encode(this.value, encodeStream, uint16be);
    return true;
  }
};
