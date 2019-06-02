'use strict';

const constants = require('lib/constants');

const { kStunTransactionIdLength } = constants;

const kMessageType = Symbol.for('kMessageType');
const kTransactionId = Symbol.for('kTransctionId');
const kCookie = Symbol.for('kCookie');
const kAttributes = Symbol.for('kAttributes');

const EMPTY_TRANSACTION_ID = Buffer.alloc(kStunTransactionIdLength, 0);

/**
 * Base class for a STUN message.
 */
module.exports = class StunMessage {
  /**
   * @class StunMessage
   */
  constructor() {
    this[kMessageType] = 0;
    this[kTransactionId] = EMPTY_TRANSACTION_ID;
    this[kCookie] = constants.kStunMagicCookie;
    this[kAttributes] = [];
  }

  /**
   * Get the type of the message.
   * @returns {number}
   */
  get type() {
    return this[kMessageType];
  }

  /**
   * Get transaction id field.
   * @returns {Buffer}
   */
  get transactionId() {
    return this[kTransactionId];
  }

  /**
   * Returns true if the message confirms to RFC3489 rather than RFC5389.
   * @returns {boolean} The result of an operation.
   */
  isLegacy() {
    return this[kCookie] !== constants.kStunMagicCookie;
  }

  /**
   * Get the number of an attributes in the message.
   * @returns {number} The number of an attributes in the message.
   */
  get count() {
    /** @type {StunAttribute[]} */
    const attribute = this[kAttributes];

    return attribute.length;
  }

  /**
   * Return a STUN attribute by it type or undefined.
   * @param {number} type - Attribute type.
   * @returns {StunAttribute|undefined} Instance of StunAttribute or undefined attribute doesn't exist.
   */
  getAttribute(type) {
    /** @type {StunAttribute[]} */
    const attributes = this[kAttributes];

    return attributes.find(attribute => attribute.type === type);
  }

  /**
   * Check if attribute exist.
   * @param {number} type
   * @returns {boolean}
   */
  hasAttribute(type) {
    return this.getAttribute(type) !== undefined;
  }

  /**
   * Iterator over attributes.
   */
  *[Symbol.iterator]() {
    for (const attribute of this[kAttributes]) {
      yield attribute;
    }
  }
};
