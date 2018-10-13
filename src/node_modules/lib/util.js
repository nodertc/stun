'use strict';

/* eslint-disable no-bitwise */

module.exports = {
  createMessageType,
};

/**
 * Format of STUN Message Type Field defined in RFC 5389.
 *
 * 0                 1
 * 2  3  4 5 6 7 8 9 0 1 2 3 4 5
 *
 * +--+--+-+-+-+-+-+-+-+-+-+-+-+-+
 * |M |M |M|M|M|C|M|M|M|C|M|M|M|M|
 * |11|10|9|8|7|1|6|5|4|0|3|2|1|0|
 * +--+--+-+-+-+-+-+-+-+-+-+-+-+-+
 */

/**
 * This function helps to create message
 * type from method and class.
 *
 * @private
 * @param {number} method - The method of the STUN message type.
 * @param {number} clas - The class of the STUN message type.
 * @returns {number}
 */
function createMessageType(method, clas) {
  if (!isNumber(method) || !isNumber(clas)) {
    throw new TypeError('Expected number.');
  }

  const firstBit = clas & 0b1;
  const secondBit = (clas & 0b10) >> 1;

  const part03 = method & 0b1111;
  const part46 = (method & 0b1110000) >> 4;
  const partLast = method >> 7;

  // Last 2 bits of message type should be 0.
  if (partLast > 0b11111) {
    throw new Error('Invalid method.');
  }

  let type = 0;

  type |= part03;
  type |= firstBit << 4;
  type |= part46 << 5;
  type |= secondBit << 8;
  type |= partLast << 9;

  return type;
}

/**
 * Check if value is number.
 * @param {any} m
 * @returns {bool}
 */
function isNumber(m) {
  return Number.isSafeInteger(m) && !Number.isNaN(m);
}
