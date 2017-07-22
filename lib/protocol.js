const { types: { uint8, uint16be, uint32be, buffer, array, reserved } } = require('binary-data')

const StunAttributePacket = {
  type: uint16be,
  value: buffer(uint16be),
  padding: reserved(uint8, ({ node }) => 4 - ((node.value.length % 4) || 4))
}

const StunHeaderProto = {
  type: uint16be,
  length: uint16be,
  cookie: uint32be,
  transaction: buffer(12)
}

const StunMessagePacket = {
  header: StunHeaderProto,
  attributes: array(StunAttributePacket, ({ node }) => node.header.length, 'bytes')
}

module.exports = {
  StunHeaderProto,
  StunMessagePacket,
  StunAttributePacket
}
