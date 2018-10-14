'use strict';

const {
  encode,
  decode,
  types: { uint8, string, reserved },
} = require('binary-data');
const constants = require('lib/constants');
const StunAttribute = require('attributes/stun-attribute');

const kErrorCode = Symbol('kErrorCode');
const kErrorReason = Symbol('kErrorReason');

/**
 * This class implements STUN attribute for errors.
 */
module.exports = class StunErrorCodeAttribute extends StunAttribute {
  /**
   * @class {StunErrorCodeAttribute}
   * @param {number} type Attribute type.
   * @param {number} code Error code.
   * @param {string} reason
   */
  constructor(type, code, reason) {
    super(type);

    this[kErrorCode] = 0;
    this[kErrorReason] = '';

    if (Number.isInteger(code)) {
      this[kErrorCode] = code;
    }

    if (typeof reason === 'string' && reason.length < 128) {
      this[kErrorReason] = reason;
    }
  }

  /**
   * Create `StunErrorCodeAttribute` instance from the buffer.
   * @param {number} type
   * @param {Buffer} message
   * @returns {StunErrorCodeAttribute}
   */
  static from(type, message) {
    const schema = {
      reserved: reserved(uint8, 2),
      errorClass: uint8,
      code: uint8,
      reason: string(message.length - 4),
    };

    const { errorClass, code, reason } = decode(message, schema);

    return new StunErrorCodeAttribute(type, errorClass * (code + 100), reason);
  }

  /**
   * Get attribute value.
   */
  get value() {
    return {
      code: this.code,
      reason: this.reason,
    };
  }

  /**
   * Get error code.
   * @returns {number}
   */
  get code() {
    return this[kErrorCode];
  }

  /**
   * Get string representation of error.
   * @returns {string}
   */
  get reason() {
    return this[kErrorReason];
  }

  /**
   * Get class of an error.
   * @returns {number}
   */
  get errorClass() {
    return parseInt(this.code / 1e2, 10);
  }

  /**
   * Get type of an attribute value.
   * @returns {number}
   */
  get valueType() {
    return constants.attributeValueType.ERROR_CODE;
  }

  /**
   * @private
   * @param {EncodeStream} encodeStream
   * @returns {bool}
   */
  write(encodeStream) {
    const schema = {
      reserved: reserved(uint8, 2),
      errorClass: uint8,
      code: uint8,
      reason: string(Buffer.byteLength(this.reason), 'utf8'),
    };

    const packet = {
      errorClass: this.errorClass,
      code: this.code % 100,
      reason: this.reason,
    };

    encode(packet, encodeStream, schema);
    return true;
  }
};
