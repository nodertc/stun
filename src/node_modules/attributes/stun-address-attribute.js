'use strict';

const net = require('net');
const assert = require('assert');
const {
  encode,
  decode,
  types: { uint8, uint16be, buffer, reserved },
} = require('binary-data');
const ip = require('ip');
const { pton4, pton6 } = require('ip2buf');
const constants = require('lib/constants');
const StunAttribute = require('attributes/stun-attribute');

const STUN_ADDRESS_4 = 1;
const STUN_ADDRESS_6 = 2;

const FAMILY_4 = 'IPv4';
const FAMILY_6 = 'IPv6';

const AddressPacket = {
  $reserved: reserved(uint8, 1),
  family: uint8,
  port: uint16be,
  address: buffer(({ node }) => (node.family === STUN_ADDRESS_4 ? 4 : 16)),
};

const kPort = Symbol('kPort');
const kAddress = Symbol('kAddress');
const kFamily = Symbol('kFamily');

/**
 * This class implements STUN attribute for ip/port pair.
 */
module.exports = class StunAddressAttribute extends StunAttribute {
  /**
   * @class StunAddressAttribute
   * @param {number} type Attribute type.
   * @param {string} address IP address.
   * @param {number} port
   */
  constructor(type, address, port) {
    super(type);

    this[kPort] = 0;
    this[kAddress] = null;
    this[kFamily] = null;

    this.setPort(port);
    this.setAddress(address);
  }

  /**
   * Create `StunAddressAttribute` instance from the buffer.
   * @param {number} type
   * @param {Buffer} message
   * @returns {StunAddressAttribute}
   */
  static from(type, message) {
    const { address, port } = StunAddressAttribute.decode(message);

    const ipaddr = ip.toString(address);

    assert(isPort(port));
    assert(net.isIP(ipaddr));

    return new StunAddressAttribute(type, ipaddr, port);
  }

  /**
   * Decode arrived attribute.
   * @param {Buffer} message
   * @returns {Object}
   * @private
   */
  static decode(message) {
    return decode(message, AddressPacket);
  }

  /**
   * Get type of an attribute value.
   * @returns {number}
   */
  get valueType() {
    return constants.attributeValueType.ADDRESS;
  }

  /**
   * Get attribute value.
   */
  get value() {
    return {
      port: this[kPort],
      family: this[kFamily],
      address: this[kAddress],
    };
  }

  /**
   * Set port.
   * @param {number} port
   * @returns {bool}
   */
  setPort(port) {
    if (isPort(port)) {
      this[kPort] = port;
      return true;
    }

    return false;
  }

  /**
   * Set ip address.
   * @param {string} address
   * @returns {bool}
   */
  setAddress(address) {
    if (net.isIP(address)) {
      this[kAddress] = address;
      this[kFamily] = net.isIPv4(address) ? FAMILY_4 : FAMILY_6;

      return true;
    }

    return false;
  }

  /**
   * @private
   * @returns {Object}
   */
  writeValue() {
    return this.value;
  }

  /**
   * @private
   * @param {EncodeStream} encodeStream
   * @returns {bool}
   */
  write(encodeStream) {
    const packet = this.writeValue();

    if (packet.family === FAMILY_4) {
      packet.family = STUN_ADDRESS_4;
      packet.address = pton4(packet.address);
    } else {
      packet.family = STUN_ADDRESS_6;
      packet.address = pton6(packet.address);
    }

    encode(packet, encodeStream, AddressPacket);
    return true;
  }
};

/**
 * Check if argument is valid port.
 * @param {any} port
 * @returns {bool}
 */
function isPort(port) {
  // eslint-disable-next-line no-bitwise
  return Number.isInteger(port) && (port > 0 && port < 2 << 15);
}
