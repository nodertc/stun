'use strict';

// This file contains various constants of the STUN protocol, as specified
// in RFC 5389, and its descendants.

const { createMessageType } = require('lib/util');

// These are the classes for STUN message types defined in RFC 5389.
const classType = {
  REQUEST: 0b00,
  INDICATION: 0b01,
  RESPONSE: 0b10,
  ERROR: 0b11,
};

const methods = {
  BINDING: 0x0001,

  // RFC5766-defined methods.
  ALLOCATE: 0x003,
  REFRESH: 0x004,
  SEND: 0x006,
  DATA: 0x007,
  CREATE_PERMISSION: 0x008,
  CHANNEL_BIND: 0x009,
};

// These are the types of STUN messages defined in RFC 5389.
const messageType = {
  BINDING_REQUEST: createMessageType(methods.BINDING, classType.REQUEST),
  BINDING_INDICATION: createMessageType(methods.BINDING, classType.INDICATION),
  BINDING_RESPONSE: createMessageType(methods.BINDING, classType.RESPONSE),
  BINDING_ERROR_RESPONSE: createMessageType(methods.BINDING, classType.ERROR),

  // RFC5766-defined types.
  ALLOCATE_REQUEST: createMessageType(methods.ALLOCATE, classType.REQUEST),
  ALLOCATE_RESPONSE: createMessageType(methods.ALLOCATE, classType.RESPONSE),
  ALLOCATE_ERROR_RESPONSE: createMessageType(methods.ALLOCATE, classType.ERROR),
  REFRESH_REQUEST: createMessageType(methods.REFRESH, classType.REQUEST),
  REFRESH_RESPONSE: createMessageType(methods.REFRESH, classType.RESPONSE),
  REFRESH_ERROR_RESPONSE: createMessageType(methods.REFRESH, classType.ERROR),
  SEND_INDICATION: createMessageType(methods.SEND, classType.INDICATION),
  DATA_INDICATION: createMessageType(methods.DATA, classType.INDICATION),
  CREATE_PERMISSION_REQUEST: createMessageType(methods.CREATE_PERMISSION, classType.REQUEST),
  CREATE_PERMISSION_RESPONSE: createMessageType(methods.CREATE_PERMISSION, classType.RESPONSE),
  CREATE_PERMISSION_ERROR_RESPONSE: createMessageType(methods.CREATE_PERMISSION, classType.ERROR),
  CHANNEL_BIND_REQUEST: createMessageType(methods.CHANNEL_BIND, classType.REQUEST),
  CHANNEL_BIND_RESPONSE: createMessageType(methods.CHANNEL_BIND, classType.RESPONSE),
  CHANNEL_BIND_ERROR_RESPONSE: createMessageType(methods.CHANNEL_BIND, classType.ERROR),
};

// These are the types of STUN error codes defined in RFC 5389.
const errorCode = {
  TRY_ALTERNATE: 300,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  UNKNOWN_ATTRIBUTE: 420,
  STALE_CREDENTIALS: 430, // GICE only
  STALE_NONCE: 438,
  SERVER_ERROR: 500,
  GLOBAL_FAILURE: 600,

  // RFC 5245-defined errors.
  ROLE_CONFLICT: 487,

  // RFC 5766-defined errors.
  FORBIDDEN: 403,
  ALLOCATION_MISMATCH: 437,
  WRONG_CREDENTIALS: 441,
  UNSUPPORTED_PROTOCOL: 442,
  ALLOCATION_QUOTA: 486,
  INSUFFICIENT_CAPACITY: 508,
};

const errorNameReducer = (map, key) => map.set(errorCode[key], key);
const errorNames = Object.keys(errorCode).reduce(errorNameReducer, new Map());

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
  ROLE_CONFLICT: 'Role Conflict',

  // RFC 5766-defined errors.
  FORBIDDEN: 'Forbidden',
  ALLOCATION_MISMATCH: 'Allocation Mismatch',
  WRONG_CREDENTIALS: 'Wrong Credentials',
  UNSUPPORTED_PROTOCOL: 'Unsupported Transport Protocol',
  ALLOCATION_QUOTA: 'Allocation Quota Reached',
  INSUFFICIENT_CAPACITY: 'Insufficient Capacity',
};

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
  UNKNOWN_ATTRIBUTES: 0x000a,
  REALM: 0x0014,
  NONCE: 0x0015,
  XOR_MAPPED_ADDRESS: 0x0020,

  // Optional
  SOFTWARE: 0x8022,
  ALTERNATE_SERVER: 0x8023,
  FINGERPRINT: 0x8028,
  ORIGIN: 0x802f,

  // Google
  RETRANSMIT_COUNT: 0xff00,

  // RFC 5245 ICE STUN attributes.

  // Required
  PRIORITY: 0x0024,
  USE_CANDIDATE: 0x0025,

  // Optional
  ICE_CONTROLLED: 0x8029,
  ICE_CONTROLLING: 0x802a,

  // Google
  NOMINATION: 0xc001,
  NETWORK_INFO: 0xc057,

  // RFC5766 TURN attributes
  CHANNEL_NUMBER: 0x000c,
  LIFETIME: 0x000d,
  XOR_PEER_ADDRESS: 0x0012,
  DATA: 0x0013,
  XOR_RELAYED_ADDRESS: 0x0016,
  EVEN_PORT: 0x0018,
  REQUESTED_TRANSPORT: 0x0019,
  DONT_FRAGMENT: 0x001a,
  RESERVATION_TOKEN: 0x0022,

  // RFC5780-defined attributes.
  CHANGE_REQUEST: 0x0003,
  PADDING: 0x0026,
  RESPONSE_PORT: 0x0027,
  RESPONSE_ORIGIN: 0x802b,
  OTHER_ADDRESS: 0x802c,
};

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
  UINT16_LIST: 6,
  UINT16: 7,
};

const eventNames = {
  EVENT_BINDING_REQUEST: 'bindingRequest',
  EVENT_BINDING_INDICATION: 'bindingIndication',
  EVENT_BINDING_RESPONSE: 'bindingResponse',
  EVENT_BINDING_ERROR_RESPONSE: 'bindingError',
};

const kStunFingerprintXorValue = 0x5354554e;

// Following values correspond to RFC5389.
const kStunTransactionIdLength = 12;
const kStunMagicCookie = 0x2112a442;
const kStunMagicCookieBuffer = Buffer.from('2112A442', 'hex');

// Following value corresponds to an earlier version of STUN from
// RFC3489.
const kStunLegacyTransactionIdLength = 16;

// STUN Message Integrity HMAC length.
const kStunMessageIntegritySize = 20;

// The mask used to determine whether a STUN message is a request/response etc.
const kStunTypeMask = 0x0110;

const kStunAttributeHeaderLength = 4;
const kStunFingerprintLength = 8;
const kStunMessageIntegrityLength = kStunAttributeHeaderLength + kStunMessageIntegritySize;

module.exports = {
  errorCode,
  errorReason,
  /** @type {Map<string, number>} */
  errorNames,

  classType,
  methods,
  messageType,
  attributeType,

  attributeValueType,

  eventNames,

  kStunFingerprintXorValue,
  kStunTransactionIdLength,
  kStunMagicCookie,
  kStunMagicCookieBuffer,
  kStunLegacyTransactionIdLength,
  kStunMessageIntegritySize,
  kStunTypeMask,

  kStunAttributeHeaderLength,
  kStunFingerprintLength,
  kStunMessageIntegrityLength,
};
