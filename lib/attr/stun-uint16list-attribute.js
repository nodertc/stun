const { encode, decode, createDecodeStream, types: { uint16be, array } } = require('binary-data')
const constants = require('../constants')
const StunAttribute = require('./stun-attribute')

const kAttributeTypes = Symbol('kAttributeTypes')

module.exports = class StunUInt16ListAttribute extends StunAttribute {
  constructor(type, values) {
    super(type)

    this[kAttributeTypes] = new Set(values)
  }

  static from(type, message) {
    const length = message.length / 2
    const schema = array(uint16be, length)

    const packet = new StunUInt16ListAttribute(type)
    const rstream = createDecodeStream(message)

    decode(rstream, schema).map(type => packet.addType(type))
    return packet
  }

  get length() {
    return this[kAttributeTypes].size
  }

  get value() {
    return [...this[kAttributeTypes]]
  }

  get valueType() {
    return constants.attributeValueType.UINT16_LIST
  }

  addType(type) {
    if (!Number.isSafeInteger(type)) {
      return false
    }

    this[kAttributeTypes].add(type)
    return true
  }

  write(encodeStream) {
    const schema = array(uint16be, this.length)

    if (this.length === 0) {
      return true
    }

    encode(this.value, encodeStream, schema)
    return true
  }
}
