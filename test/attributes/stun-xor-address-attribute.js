'use strict';

const StunXorAddressAttribute = require('attributes/stun-xor-address-attribute');
const constants = require('lib/constants');

const type = constants.attributeType.XOR_MAPPED_ADDRESS;

test('encode ipv4', () => {
  const attribute = new StunXorAddressAttribute(type, '192.168.1.35', 63524);

  const owner = {
    transactionId: Buffer.from('d00558707bb8cc6a633a9df7', 'hex'),
  };

  attribute.setOwner(owner);

  expect(attribute.value).toEqual({
    address: '192.168.1.35',
    port: 63524,
    family: 'IPv4',
  });

  const expectedBuffer = Buffer.from('0001d936e1baa561', 'hex');
  expect(attribute.toBuffer()).toEqual(expectedBuffer);
});

test('encode ipv6', () => {
  const attribute = new StunXorAddressAttribute(type, 'fe80::1', 63524);

  const owner = {
    transactionId: Buffer.from('d00558707bb8cc6a633a9df7', 'hex'),
  };

  attribute.setOwner(owner);

  expect(attribute.value).toEqual({
    address: 'fe80::1',
    port: 63524,
    family: 'IPv6',
  });

  const address = Buffer.alloc(16);
  address[0] = 0xfe;
  address[1] = 0x80;
  address[15] = 1;

  const expectedBuffer = Buffer.from('0002d936df92a442d00558707bb8cc6a633a9df6', 'hex');
  expect(attribute.toBuffer()).toEqual(expectedBuffer);
});
