const { createEncodeStream } = require('binary-data')

const EMPTY_BUFFER = Buffer.alloc(0)

const kAttributeType = Symbol('kAttributeType')

// This class implemenys an abstract STUN attribute.
module.exports = class StunAttribute {
  constructor(type) {
    this[kAttributeType] = type
  }

  get type() {
    return this[kAttributeType]
  }

  get value() {
    notImplemented()
  }

  get valueType() {
    return -1
  }

  setValue() /* virtual */ {
    return false
  }

  /**
   * @private
   */
  setOwner() /* virtual */ {
    return false
  }

  /**
   * @private
   */
  write() {
    notImplemented()
  }

  /**
   * @private
   */
  toBuffer() {
    const encodeStream = createEncodeStream()

    if (this.write(encodeStream)) {
      return encodeStream.slice()
    }

    return EMPTY_BUFFER
  }
}

function notImplemented() {
  throw new Error('Not implemented')
}
