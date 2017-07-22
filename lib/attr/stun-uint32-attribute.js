const { encode, types: { uint32be } } = require('binary-data')
const constants = require('../constants')
const StunAttribute = require('./stun-attribute')

const MAX_UINT32 = -1 >>> 0

module.exports = class StunUInt32Attribute extends StunAttribute {
  constructor(type, value) {
    super(type)

    this._bits = 0
    this.setValue(value)
  }

  static from(type, message) {
    return new StunUInt32Attribute(type, message.readUInt32BE(0))
  }

  get value() {
    return this._bits
  }

  get valueType() {
    return constants.attributeValueType.UINT32
  }

  setValue(value) {
    if (Number.isSafeInteger(value) && value >= 0 && value <= MAX_UINT32) {
      this._bits = value
      return true
    }

    return false
  }

  write(encodeStream) {
    encode(this.value, encodeStream, uint32be)
    return true
  }
}
