'use strict';

const Emitter = require('events');
const isStun = require('is-stun');
const StunRequest = require('message/request');
const decode = require('message/decode');
const constants = require('lib/constants');
const { StunMessageError, StunResponseError } = require('lib/errors');

const {
  eventNames: {
    EVENT_BINDING_RESPONSE,
    EVENT_BINDING_INDICATION,
    EVENT_BINDING_REQUEST,
    EVENT_BINDING_ERROR_RESPONSE,
  },
} = constants;

const isStunRequest = 0;
const isStunIndication = 0x010;
const isStunSuccessResponse = 0x100;
const isStunErrorResponse = 0x110;

const kSocket = Symbol('kSocket');
const kHandleMessage = Symbol('kHandleMessage');
const kHandleClose = Symbol('kHandleClose');
const kHandleListening = Symbol('kHandleListening');
const kClosed = Symbol('kClosed');
const kOnMessage = Symbol('kOnMessage');

// This class imlplements a STUN server.
module.exports = class StunServer extends Emitter {
  /**
   * @class StunServer
   * @param {dgram.Socket} socket
   */
  constructor(socket) {
    super();

    this[kSocket] = socket;
    this[kHandleMessage] = this[kOnMessage].bind(this);
    this[kHandleClose] = this.close.bind(this);
    this[kHandleListening] = () => this.emit('listening');

    socket.on('message', this[kHandleMessage]);
    socket.once('close', this[kHandleClose]);
    socket.once('listening', this[kHandleListening]);
  }

  /**
   * @private
   * @returns {boolean}
   */
  get [kClosed]() {
    return this[kSocket] === null;
  }

  /**
   * Handles arrived a STUN message.
   * @param {Buffer} message
   * @param {Object} rinfo
   */
  process(message, rinfo) {
    let stunMessage;

    try {
      stunMessage = decode(message);
    } catch (_) {
      this.emit('error', new StunMessageError(message, rinfo));
      return;
    }

    // eslint-disable-next-line no-bitwise
    switch (stunMessage.type & constants.kStunTypeMask) {
      case isStunRequest:
        this.emit(EVENT_BINDING_REQUEST, stunMessage, rinfo);
        break;
      case isStunIndication:
        this.emit(EVENT_BINDING_INDICATION, stunMessage, rinfo);
        break;
      case isStunSuccessResponse:
        this.emit(EVENT_BINDING_RESPONSE, stunMessage, rinfo);
        break;
      case isStunErrorResponse:
        this.emit(EVENT_BINDING_ERROR_RESPONSE, stunMessage, rinfo);
        this.emit('error', new StunResponseError(stunMessage, rinfo));
        break;
      default:
        break;
    }
  }

  /**
   * @private
   * @param {Buffer} message
   * @param {Object} rinfo
   */
  [kOnMessage](message, rinfo) {
    if (!isStun(message)) {
      return;
    }

    this.process(message, rinfo);
  }

  /**
   * Start listening on `port` and `address` of specified.
   * @param {number} port
   * @param {string} [address]
   * @param {Function} [callback]
   */
  listen(port, address, callback) {
    if (typeof address === 'function') {
      callback = address; // eslint-disable-line no-param-reassign
      address = undefined; // eslint-disable-line no-param-reassign
    }

    if (typeof callback === 'function') {
      this.once('listening', callback);
    }

    this[kSocket].bind(port, address);
  }

  /**
   * Sends the StunMessage message.
   *
   * @param {StunRequest} request
   * @param {number} port Remote port.
   * @param {string} address Remote address.
   * @param {Function} [callback]
   * @returns {bool}
   */
  send(request, port, address, callback) {
    if (this[kClosed]) {
      return false;
    }

    if (!(request instanceof StunRequest)) {
      return false;
    }

    this[kSocket].send(request.toBuffer(), port, address, callback);
    return true;
  }

  /**
   * Close a STUN server.
   */
  close() {
    if (this[kClosed]) {
      return;
    }

    this[kSocket].removeListener('message', this[kHandleMessage]);
    this[kSocket].removeListener('close', this[kHandleClose]);
    this[kSocket].removeListener('listening', this[kHandleListening]);

    this[kSocket] = null;
    this.emit('close');
  }
};
