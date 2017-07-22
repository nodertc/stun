const { encode, types: { buffer } } = require('binary-data')
const constants = require('../constants')
const StunAttribute = require('./stun-attribute')

module.exports = class StunByteStringAttribute extends StunAttribute {
  constructor(type, value, encoding = 'utf8') {
    super(type)

    this._value = null
    this.setValue(value, encoding)
  }

  static from(type, message) {
    return new StunByteStringAttribute(type, message)
  }

  get value() {
    return this._value
  }

  get valueType() {
    return constants.attributeValueType.BYTE_STRING
  }

  setValue(value, encoding = 'utf8') {
    if (Buffer.isBuffer(value)) {
      this._value = value
      return true
    } else if (typeof value === 'string') {
      this._value = Buffer.from(value, encoding)
      return true
    }

    return false
  }

  write(encodeStream) {
    if (!this.value) {
      return false
    }

    encode(this.value, encodeStream, buffer(this.value.length))
    return true
  }
}
