'use strict';

const stun = require('index');
const constants = require('lib/constants');

describe('should export', () => {
  const exportTable = [
    'createMessage',
    'createServer',
    'validateFingerprint',
    'validateMessageIntegrity',
    'StunMessage',
    'StunServer',
    'StunError',
    'StunMessageError',
    'StunResponseError',
    'constants',
  ];

  const exports = Object.keys(stun);

  for (const think of exportTable) {
    test(`should export ${think}`, () => {
      expect(exports[think]).toEqual(exportTable[think]);
    });
  }
});

describe('should export constants', () => {
  for (const messageType of Object.keys(constants.messageType)) {
    const type = `STUN_${messageType}`;

    test(`should export ${type}`, () => {
      expect(stun.constants[type]).toEqual(constants.messageType[messageType]);
    });
  }

  for (const errorCode of Object.keys(constants.errorCode)) {
    const code = `STUN_CODE_${errorCode}`;

    test(`should export ${code}`, () => {
      expect(stun.constants[code]).toEqual(constants.errorCode[errorCode]);
    });
  }

  for (const errorReason of Object.keys(constants.errorReason)) {
    const reason = `STUN_REASON_${errorReason}`;

    test(`should export ${reason}`, () => {
      expect(stun.constants[reason]).toEqual(constants.errorReason[errorReason]);
    });
  }

  for (const attributeType of Object.keys(constants.attributeType)) {
    const attribute = `STUN_ATTR_${attributeType}`;

    test(`should export ${attribute}`, () => {
      expect(stun.constants[attribute]).toEqual(constants.attributeType[attributeType]);
    });
  }

  for (const eventName of Object.keys(constants.eventNames)) {
    const event = `STUN_${eventName}`;

    test(`should export ${event}`, () => {
      expect(stun.constants[event]).toEqual(constants.eventNames[eventName]);
    });
  }
});
