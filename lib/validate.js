const crypto = require('crypto')
const { crc32 } = require('crc')
const constants = require('./constants')

module.exports = {
  validateFingerprint,
  validateMessageIntegrity
}

/**
 * Verifies that a given buffer is STUN by checking for a correct FINGERPRINT.
 * @param {StunMessage} stunMessage
 */
function validateFingerprint(stunMessage) {
  if (stunMessage.isLegacy()) {
    return false
  }

  const fingerprintAttr = stunMessage.getAttribute(
    constants.attributeType.FINGERPRINT
  )

  if (fingerprintAttr === undefined) {
    return false
  }

  const fingerprintLength = 8

  const crc32buf = stunMessage.toBuffer().slice(0, -fingerprintLength)
  const currCRC32 = fingerprintAttr.value

  return ((crc32(crc32buf) ^ constants.kStunFingerprintXorValue) >>> 0) === currCRC32
}

/**
 * Validates that a raw STUN message has a correct MESSAGE-INTEGRITY value.
 * @param {StunMessage} stunMessage
 * @param {string} password
 */
function validateMessageIntegrity(stunMessage, password) {
  let offsetEnd = 0
  let fingerprintLength = 0

  const fingerprintAttr = stunMessage.getAttribute(
    constants.attributeType.FINGERPRINT
  )
  const msgIntegrityAttr = stunMessage.getAttribute(
    constants.attributeType.MESSAGE_INTEGRITY
  )

  // Calc offsets if FINGERPRINT attribute exist.
  if (fingerprintAttr !== undefined) {
    fingerprintLength = 4 + fingerprintAttr.value.length
    offsetEnd += fingerprintLength
  }

  if (msgIntegrityAttr === undefined) {
    return false
  }

  offsetEnd += 4 + msgIntegrityAttr.value.length

  const buf = stunMessage.toBuffer().slice(0, -offsetEnd)

  // Remove length of FINGERPRINT attribute from message size.
  if (fingerprintLength > 0) {
    const currentLength = buf.readUInt16BE(2)
    buf.writeUInt16BE(currentLength - fingerprintLength, 2)
  }

  const hmac = crypto.createHmac('sha1', password)
  hmac.update(buf)

  return hmac.digest().equals(msgIntegrityAttr.value)
}
