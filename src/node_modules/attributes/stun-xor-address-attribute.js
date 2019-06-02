'use strict';

const net = require('net');
const ip = require('ip');
const xor = require('buffer-xor');
const { pton4, pton6 } = require('ip2buf');
const constants = require('lib/constants');
const StunAddressAttribute = require('attributes/stun-address-attribute');

const kOwner = Symbol('kOwner');

/**
 * This class implements STUN attribute for XORed ip address and port.
 */
module.exports = class StunXorAddressAttribute extends StunAddressAttribute {
  /**
   * @class StunXorAddressAttribute
   * @param {number} type Attribute type.
   * @param {string} address IP address.
   * @param {number} port
   */
  constructor(type, address, port) {
    super(type, address, port);

    this[kOwner] = null;
  }

  /**
   * Create `StunAddressAttribute` instance from buffer.
   * @param {number} type
   * @param {Buffer} message
   * @param {StunMessage} owner
   * @returns {StunAddressAttribute}
   */
  static from(type, message, owner) {
    const packet = StunAddressAttribute.decode(message);

    const port = xorPort(packet.port);
    const address = xorIP(ip.toString(packet.address), owner);

    const attribute = new StunXorAddressAttribute(type, address, port);

    attribute.setOwner(owner);
    return attribute;
  }

  /**
   * Get type of an attribute value.
   * @returns {number}
   */
  get valueType() {
    return constants.attributeValueType.XOR_ADDRESS;
  }

  /**
   * @private
   * @param {StunMessage} owner
   */
  setOwner(owner) {
    this[kOwner] = owner;
  }

  /**
   * Return XORed values.
   * @returns {Object}
   * @private
   */
  writeValue() {
    const packet = this.value;

    packet.port = xorPort(packet.port);

    if (this[kOwner] !== null) {
      packet.address = xorIP(packet.address, this[kOwner]);
    }

    return packet;
  }
};

/**
 * Get XORed port.
 * @param {number} port
 * @returns {number}
 */
function xorPort(port) {
  // eslint-disable-next-line no-bitwise
  return port ^ (constants.kStunMagicCookie >> 16);
}

/**
 * @param {string} address
 * @param {StunMessage} owner
 * @returns {string}
 */
function xorIP(address, owner) {
  let xored = null;

  if (net.isIPv4(address)) {
    xored = xorIPv4(pton4(address));
  } else if (net.isIPv6(address)) {
    xored = xorIPv6(pton6(address), owner.transactionId);
  } else {
    throw new Error(`Invalid ip address: ${address}`);
  }

  return ip.toString(xored);
}

/**
 * @param {Buffer} address
 * @returns {Buffer}
 */
function xorIPv4(address) {
  return xor(address, constants.kStunMagicCookieBuffer);
}

/**
 * @param {Buffer} address
 * @param {Buffer} transactionId
 * @returns {Buffer}
 */
function xorIPv6(address, transactionId) {
  return xor(address, Buffer.concat([constants.kStunMagicCookieBuffer, transactionId]));
}
