const { createEncodeStream } = require('binary-data')

const EMPTY_BUFFER = Buffer.alloc(0)

module.exports = class StunAttribute {
  constructor(type) {
    this._type = type
    this._owner = null
  }

  get type() {
    return this._type
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

  setOwner() /* virtual */ {
    return false
  }

  write() {
    notImplemented()
  }

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
