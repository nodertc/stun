const Emitter = require('events')
const isStun = require('is-stun')
const StunMessage = require('./message')
const constants = require('./constants')

const EVENT_BINDING_REQUEST = 'bindingRequest'
const EVENT_BINDING_INDICATION = 'bindingIndication'
const EVENT_BINDING_RESPONSE = 'bindingResponse'
const EVENT_BINDING_ERROR_RESPONSE = 'bindingError'

const isStunRequest = 0
const isStunIndication = 0x010
const isStunSuccessResponse = 0x100
const isStunErrorResponse = 0x110

module.exports = class StunServer extends Emitter {
  constructor(socket) {
    super()

    this._socket = socket
    this._handleMessage = this.handleMessage.bind(this)
    this._handleClose = () => this.close()

    this._closed = false

    socket.on('message', this._handleMessage)
    socket.once('close', this._handleClose)
  }

  process(msg, rinfo) {
    const stunMsg = StunMessage.from(msg)

    switch (stunMsg.type & constants.kStunTypeMask) {
      case isStunRequest:
        this.emit(EVENT_BINDING_REQUEST, stunMsg, rinfo)
        break
      case isStunIndication:
        this.emit(EVENT_BINDING_INDICATION, stunMsg, rinfo)
        break
      case isStunSuccessResponse:
        this.emit(EVENT_BINDING_RESPONSE, stunMsg, rinfo)
        break
      case isStunErrorResponse:
        this.emit(EVENT_BINDING_ERROR_RESPONSE, stunMsg, rinfo)
        break
      default:
        break
    }
  }

  /**
   * @private
   * @param {buffer} msg
   * @param {object} rinfo
   */
  handleMessage(msg, rinfo) {
    if (!isStun(msg)) {
      return
    }

    this.process(msg, rinfo)
  }

  send(stunMsg, rinfo, cb) {
    if (this._closed) {
      return false
    }

    if (!(stunMsg instanceof StunMessage)) {
      return false
    }

    this._socket.send(stunMsg.toBuffer(), rinfo.port, rinfo.address, cb)
    return true
  }

  close() {
    if (this._closed) {
      return
    }

    this._closed = true
    this._socket = null

    this.removeListener('message', this._handleMessage)
    this.removeListener('close', this._handleClose)

    this.emit('close')
  }
}
