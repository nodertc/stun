'use strict';

const crypto = require('crypto');
const crc32 = require('turbo-crc32/crc32');
const constants = require('lib/constants');
const encode = require('message/encode');

const { FINGERPRINT, MESSAGE_INTEGRITY } = constants.attributeType;
const { kStunFingerprintXorValue, kStunFingerprintLength, kStunMessageIntegrityLength } = constants;

module.exports = {
  validateFingerprint,
  validateMessageIntegrity,
};

const toUInt32 = x => x >>> 0; // eslint-disable-line no-bitwise

/**
 * Verifies that a given buffer is STUN by checking for a correct FINGERPRINT.
 * @param {StunMessage} message
 * @returns {bool}
 */
function validateFingerprint(message) {
  if (message.isLegacy()) {
    return false;
  }

  const fingerprintAttribute = message.getAttribute(FINGERPRINT);

  if (fingerprintAttribute === undefined) {
    return false;
  }

  const crc32buf = encode(message).slice(0, -kStunFingerprintLength);
  const currentCRC32 = fingerprintAttribute.value;

  // eslint-disable-next-line no-bitwise
  return toUInt32(crc32(crc32buf) ^ kStunFingerprintXorValue) === currentCRC32;
}

/**
 * Validates that a raw STUN message has a correct MESSAGE-INTEGRITY value.
 * @param {StunMessage} message
 * @param {string} password
 * @returns {bool}
 */
function validateMessageIntegrity(message, password) {
  let offsetEnd = 0;

  const fingerprintAttribute = message.getAttribute(FINGERPRINT);
  const messageIntegrityAttribute = message.getAttribute(MESSAGE_INTEGRITY);

  const isFingerprintExist = fingerprintAttribute !== undefined;

  // Calc offsets if FINGERPRINT attribute exist.
  if (isFingerprintExist) {
    offsetEnd += kStunFingerprintLength;
  }

  if (messageIntegrityAttribute === undefined) {
    return false;
  }

  offsetEnd += kStunMessageIntegrityLength;

  const buf = encode(message).slice(0, -offsetEnd);

  // Remove length of FINGERPRINT attribute from message size.
  if (isFingerprintExist) {
    const currentLength = buf.readUInt16BE(2);
    buf.writeUInt16BE(currentLength - kStunFingerprintLength, 2);
  }

  const hmac = crypto.createHmac('sha1', password);
  hmac.update(buf);

  return hmac.digest().equals(messageIntegrityAttribute.value);
}
