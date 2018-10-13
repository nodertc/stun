'use strict';

const { createEncodeStream } = require('binary-data');

const EMPTY_BUFFER = Buffer.alloc(0);

const kAttributeType = Symbol('kAttributeType');

/**
 * This class implements an abstract STUN attribute.
 */
module.exports = class StunAttribute {
  /**
   * @class StunAttribute
   * @param {number} type Attribute type.
   */
  constructor(type) {
    this[kAttributeType] = type;
  }

  /**
   * Get attribute type.
   * @returns {number}
   */
  get type() {
    return this[kAttributeType];
  }

  /**
   * Get attribute value.
   */
  get value() {
    throw new Error('Not implemented');
  }

  /**
   * Get type of an attribute value.
   * @returns {number}
   */
  get valueType() {
    return -1;
  }

  /**
   * Set attribute value.
   * @returns {bool}
   */
  setValue() {
    return false;
  }

  /**
   * @private
   * @returns {bool}
   */
  setOwner() /* virtual */ {
    return false;
  }

  /**
   * @private
   */
  write() {
    throw new Error('Not implemented');
  }

  /**
   * Converts attribute to the buffer.
   * @private
   * @returns {Buffer}
   */
  toBuffer() {
    const encodeStream = createEncodeStream();

    if (this.write(encodeStream)) {
      return encodeStream.slice();
    }

    return EMPTY_BUFFER;
  }
};
