'use strict';

const { messageType } = require('lib/constants');

test('rfc5766 message types', () => {
  // These constants taken from webrtc source code at
  // https://chromium.googlesource.com/external/webrtc/+/master/p2p/base/stun.h

  expect(messageType.ALLOCATE_REQUEST).toEqual(0x0003);
  expect(messageType.ALLOCATE_RESPONSE).toEqual(0x0103);
  expect(messageType.ALLOCATE_ERROR_RESPONSE).toEqual(0x0113);
  expect(messageType.REFRESH_REQUEST).toEqual(0x0004);
  expect(messageType.REFRESH_RESPONSE).toEqual(0x0104);
  expect(messageType.REFRESH_ERROR_RESPONSE).toEqual(0x0114);
  expect(messageType.SEND_INDICATION).toEqual(0x0016);
  expect(messageType.DATA_INDICATION).toEqual(0x0017);
  expect(messageType.CREATE_PERMISSION_REQUEST).toEqual(0x0008);
  expect(messageType.CREATE_PERMISSION_RESPONSE).toEqual(0x0108);
  expect(messageType.CREATE_PERMISSION_ERROR_RESPONSE).toEqual(0x0118);
  expect(messageType.CHANNEL_BIND_REQUEST).toEqual(0x0009);
  expect(messageType.CHANNEL_BIND_RESPONSE).toEqual(0x0109);
  expect(messageType.CHANNEL_BIND_ERROR_RESPONSE).toEqual(0x0119);
});
