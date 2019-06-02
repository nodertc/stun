'use strict';

const {
  types: { uint8, uint16be, uint32be, buffer, array, reserved },
} = require('binary-data');

// This file contains schemas of a STUN messages
// for encoding / decoding.

// Schema of a STUN attribute.
const StunAttributePacket = {
  type: uint16be,
  value: buffer(uint16be),
  padding: reserved(uint8, ({ current }) => 4 - (current.value.length % 4 || 4)),
};

// Schema of a STUN message header.
const StunHeaderProto = {
  type: uint16be,
  length: uint16be,
  cookie: uint32be,
  transaction: buffer(12),
};

// Schema of a full STUN message
// with header and attributes.
const StunMessagePacket = {
  header: StunHeaderProto,
  attributes: array(StunAttributePacket, ({ current }) => current.header.length, 'bytes'),
};

module.exports = {
  StunHeaderProto,
  StunMessagePacket,
  StunAttributePacket,
};
