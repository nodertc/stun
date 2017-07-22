const net = require('net')
const assert = require('assert')
const {
  createDecodeStream,
  encode,
  decode,
  types: { uint8, uint16be, buffer, reserved }
} = require('binary-data')
const ipaddr = require('ipaddr.js')
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

module.exports = class StunAddressAttribute extends StunAttribute {
  constructor(type, address, port) {
    super(type)

    this._port = 0
    this._address = null
    this._family = null

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

    address = ipaddr.fromByteArray(address).toString()

    assert(isPort(port))
    assert(net.isIP(address))

    return new StunAddressAttribute(type, address, port)
  }

  /**
   * @param {Buffer} message
   * @private
   */
  static _read(message) {
    const readStream = createDecodeStream(message)

    return decode(readStream, AddressPacket)
  }

  get valueType() {
    return constants.attributeValueType.ADDRESS
  }

  get value() {
    return {
      port: this._port,
      family: this._family,
      address: this._address
    }
  }

  setPort(port) {
    if (isPort(port)) {
      this._port = port
      return true
    }

    return false
  }

  setAddress(address) {
    if (net.isIP(address)) {
      this._address = address
      this._family = net.isIPv4(address) ? FAMILY_4 : FAMILY_6

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
    packet.address = Buffer.from(ipaddr.parse(packet.address).toByteArray())

    encode(packet, encodeStream, AddressPacket)
    return true
  }
}

function isPort(port) {
  return Number.isInteger(port) && (port > 0 && port < 2 << 15)
}
