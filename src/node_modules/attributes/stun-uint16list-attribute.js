'use strict';

const {
  encode,
  decode,
  types: { uint16be, array },
} = require('binary-data');
const constants = require('lib/constants');
const StunAttribute = require('attributes/stun-attribute');

const kAttributeTypes = Symbol('kAttributeTypes');

module.exports = class StunUInt16ListAttribute extends StunAttribute {
  /**
   * @class StunUInt16ListAttribute
   * @param {number} type Attribute type.
   * @param {number[]} values
   */
  constructor(type, values) {
    super(type);

    this[kAttributeTypes] = new Set(values);
  }

  /**
   * Create `StunUInt16ListAttribute` instance from the buffer.
   * @param {number} type
   * @param {Buffer} message
   * @returns {StunUInt16ListAttribute}
   */
  static from(type, message) {
    const length = message.length / 2;
    const schema = array(uint16be, length);

    const packet = new StunUInt16ListAttribute(type);

    decode(message, schema).map(value => packet.addType(value));
    return packet;
  }

  /**
   * Get the number of values in the list.
   */
  get length() {
    return this[kAttributeTypes].size;
  }

  /**
   * Get attribute value.
   * @returns {number[]}
   */
  get value() {
    return [...this[kAttributeTypes]];
  }

  /**
   * Get type of an attribute value.
   * @returns {number}
   */
  get valueType() {
    return constants.attributeValueType.UINT16_LIST;
  }

  /**
   * @private
   * @param {number} type
   * @returns {bool}
   */
  addType(type) {
    if (!Number.isSafeInteger(type)) {
      return false;
    }

    this[kAttributeTypes].add(type);
    return true;
  }

  /**
   * @private
   * @param {EncodeStream} encodeStream
   * @returns {bool}
   */
  write(encodeStream) {
    const schema = array(uint16be, this.length);

    if (this.length === 0) {
      return true;
    }

    encode(this.value, encodeStream, schema);
    return true;
  }
};
