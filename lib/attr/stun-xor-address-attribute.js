const ipaddr = require('ipaddr.js')
const xor = require('buffer-xor')
const constants = require('../constants')
const StunAddressAttribute = require('./stun-address-attribute')

module.exports = class StunXorAddressAttribute extends StunAddressAttribute {
  static from(type, message, owner) {
    const packet = StunAddressAttribute._read(message)

    const port = xorPort(packet.port)
    const address = ip2str(xorAddress(packet.address, owner))

    const attr = new StunXorAddressAttribute(type, address, port)

    attr.setOwner(owner)
    return attr
  }

  get valueType() {
    return constants.attributeValueType.XOR_ADDRESS
  }

  setOwner(owner) {
    this._owner = owner
  }

  /**
   * Return XORed values
   */
  _valueWrite() {
    const packet = this.value

    packet.port = xorPort(packet.port)

    if (this._owner !== null) {
      const address = Buffer.from(ipaddr.parse(packet.address).toByteArray())

      packet.address = ip2str(xorAddress(address, this._owner))
    }

    return packet
  }
}

function xorPort(port) {
  return port ^ (constants.kStunMagicCookie >> 16)
}

function xorAddress(address, owner) {
  const addr = ipaddr.fromByteArray(address)

  switch (addr.kind()) {
    case 'ipv4':
      return xorIPv4Address(address)
    case 'ipv6':
      return xorIPv6Address(address, owner.transactionId)
    default:
      break
  }
}

/**
 * @param {buffer} address
 */
function xorIPv4Address(address) {
  return xor(address, constants.kStunMagicCookieBuffer)
}

/**
 * @param {buffer} address
 * @param {buffer} transactionId
 */
function xorIPv6Address(address, transactionId) {
  return xor(address, Buffer.concat(constants.kStunMagicCookieBuffer, transactionId))
}

function ip2str(address) {
  return ipaddr.fromByteArray(address).toString()
}
