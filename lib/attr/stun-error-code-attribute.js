const { encode, decode, createDecodeStream, types: { uint8, string, reserved } } = require('binary-data')
const constants = require('../constants')
const StunAttribute = require('./stun-attribute')

module.exports = class StunErrorCodeAttribute extends StunAttribute {
  constructor(type, code, reason) {
    super(type)

    this._code = 0
    this._reason = null

    if (Number.isInteger(code)) {
      this._code = code
    }

    if ((typeof reason === 'string') && reason.length < 128) {
      this._reason = reason
    }
  }

  static from(type, message) {
    const schema = {
      reserved: reserved(uint8, 2),
      errorClass: uint8,
      code: uint8,
      reason: string(message.length - 4)
    }

    const rstream = createDecodeStream(message)
    const { errorClass, code, reason } = decode(rstream, schema)

    return new StunErrorCodeAttribute(type, errorClass * (code + 100), reason)
  }

  get value() {
    return {
      code: this.code,
      reason: this.reason
    }
  }

  get code() {
    return this._code
  }

  get reason() {
    return this._reason
  }

  get errorClass() {
    return ~~(this.code / 1e2)
  }

  get valueType() {
    return constants.attributeValueType.ERROR_CODE
  }

  write(encodeStream) {
    const schema = {
      reserved: reserved(uint8, 2),
      errorClass: uint8,
      code: uint8,
      reason: string(Buffer.byteLength(this.reason), 'utf8')
    }

    const packet = {
      errorClass: this.errorClass,
      code: this.code % 100,
      reason: this.reason
    }

    encode(packet, encodeStream, schema)
    return true
  }
}
