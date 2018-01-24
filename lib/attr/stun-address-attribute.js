const net = require('net')
const assert = require('assert')
const {
  encode,
  decode,
  types: { uint8, uint16be, buffer, reserved }
} = require('binary-data')
const ip = require('ip')
const constants = require('../constants')
const StunAttribute = require('./stun-attribute')

const STUN_ADDRESS_4 = 1
const STUN_ADDRESS_6 = 2

const FAMILY_4 = 'IPv4'
const FAMILY_6 = 'IPv6'

const AddressPacket = {
  $reserved: reserved(uint8, 1),
  family: uint8,
  port: uint16be,
  address: buffer(({ node }) => (node.family === STUN_ADDRESS_4 ? 4 : 16))
}

const kPort = Symbol('kPort')
const kAddress = Symbol('kAddress')
const kFamily = Symbol('kFamily')

module.exports = class StunAddressAttribute extends StunAttribute {
  constructor(type, address, port) {
    super(type)

    this[kPort] = 0
    this[kAddress] = null
    this[kFamily] = null

    this.setPort(port)
    this.setAddress(address)
  }

  /**
   * Create `StunAddressAttribute` instance from buffer.
   * @param {number} type
   * @param {Buffer} message
   */
  static from(type, message) {
    let { address, port } = StunAddressAttribute._read(message)

    address = ip.toString(address)

    assert(isPort(port))
    assert(net.isIP(address))

    return new StunAddressAttribute(type, address, port)
  }

  /**
   * @param {Buffer} message
   * @private
   */
  static _read(message) {
    return decode(message, AddressPacket)
  }

  get valueType() {
    return constants.attributeValueType.ADDRESS
  }

  get value() {
    return {
      port: this[kPort],
      family: this[kFamily],
      address: this[kAddress]
    }
  }

  setPort(port) {
    if (isPort(port)) {
      this[kPort] = port
      return true
    }

    return false
  }

  setAddress(address) {
    if (net.isIP(address)) {
      this[kAddress] = address
      this[kFamily] = net.isIPv4(address) ? FAMILY_4 : FAMILY_6

      return true
    }

    return false
  }

  /**
   * @private
   */
  _valueWrite() {
    return this.value
  }

  /**
   * @param {EncodeStream} encodeStream
   */
  write(encodeStream) {
    const packet = this._valueWrite()

    packet.family = packet.family === FAMILY_4 ? STUN_ADDRESS_4 : STUN_ADDRESS_6
    packet.address = ip.toBuffer(packet.address)

    encode(packet, encodeStream, AddressPacket)
    return true
  }
}

function isPort(port) {
  return Number.isInteger(port) && (port > 0 && port < 2 << 15)
}
