// This file contains various constants of the STUN protocol, as specified
// in RFC 5389, and its descendants.

// These are the types of STUN messages defined in RFC 5389.
const messageType = {
  BINDING_REQUEST: 0x0001,
  BINDING_INDICATION: 0x0011,
  BINDING_RESPONSE: 0x0101,
  BINDING_ERROR_RESPONSE: 0x0111
}

// These are the types of STUN error codes defined in RFC 5389.
const errorCode = {
  TRY_ALTERNATE: 300,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  UNKNOWN_ATTRIBUTE: 420,
  STALE_CREDENTIALS: 430,  // GICE only
  STALE_NONCE: 438,
  SERVER_ERROR: 500,
  GLOBAL_FAILURE: 600,

  // RFC 5245-defined errors.
  ROLE_CONFLICT: 487
}

// Strings for the error codes above.
const errorReason = {
  TRY_ALTERNATE: 'Try Alternate Server',
  BAD_REQUEST: 'Bad Request',
  UNAUTHORIZED: 'Unauthorized',
  UNKNOWN_ATTRIBUTE: 'Unknown Attribute',
  STALE_CREDENTIALS: 'Stale Credentials',
  STALE_NONCE: 'Stale Nonce',
  SERVER_ERROR: 'Server Error',

  // RFC 5245-defined errors.
  ROLE_CONFLICT: 'Role Conflict'
}

/**
 * These are all known STUN attributes, defined in RFC 5389 and elsewhere.
 *
 * @link https://tools.ietf.org/html/rfc5389#section-18.2
 */
const attributeType = {
  // Required
  MAPPED_ADDRESS: 0x0001,
  USERNAME: 0x0006,
  MESSAGE_INTEGRITY: 0x0008,
  ERROR_CODE: 0x0009,
  UNKNOWN_ATTRIBUTES: 0x000A,
  REALM: 0x0014,
  NONCE: 0x0015,
  XOR_MAPPED_ADDRESS: 0x0020,

  // Optional
  SOFTWARE: 0x8022,
  ALTERNATE_SERVER: 0x8023,
  FINGERPRINT: 0x8028,
  ORIGIN: 0x802F,

  // Google
  RETRANSMIT_COUNT: 0xFF00,

  // RFC 5245 ICE STUN attributes.

  // Required
  PRIORITY: 0x0024,
  USE_CANDIDATE: 0x0025,

  // Optional
  ICE_CONTROLLED: 0x8029,
  ICE_CONTROLLING: 0x802A,

  // Google
  NOMINATION: 0xC001,
  NETWORK_INFO: 0xC057
}

// These are the types of the values associated with the attributes above.
// This allows us to perform some basic validation when reading or adding
// attributes. Note that these values are for our own use, and not defined in
// RFC 5389.
const attributeValueType = {
  UNKNOWN: 0,
  ADDRESS: 1,
  XOR_ADDRESS: 2,
  UINT32: 3,
  BYTE_STRING: 4,
  ERROR_CODE: 5,
  UINT16_LIST: 6
}

const kStunFingerprintXorValue = 0x5354554E

// Following values correspond to RFC5389.
const kStunTransactionIdLength = 12
const kStunMagicCookie = 0x2112A442
const kStunMagicCookieBuffer = Buffer.from('2112A442', 'hex')

// Following value corresponds to an earlier version of STUN from
// RFC3489.
const kStunLegacyTransactionIdLength = 16

// STUN Message Integrity HMAC length.
const kStunMessageIntegritySize = 20

// The mask used to determine whether a STUN message is a request/response etc.
const kStunTypeMask = 0x0110

module.exports = {
  errorCode,
  errorReason,

  messageType,
  attributeType,

  attributeValueType,

  kStunFingerprintXorValue,
  kStunTransactionIdLength,
  kStunMagicCookie,
  kStunMagicCookieBuffer,
  kStunLegacyTransactionIdLength,
  kStunMessageIntegritySize,
  kStunTypeMask
}
