'use strict';

const StunAddressAttribute = require('attributes/stun-address-attribute');
const constants = require('lib/constants');

const type = constants.attributeType.MAPPED_ADDRESS;
const expectedAdressAttributeArr = [];
expectedAdressAttributeArr.push(0); //   Reserved
expectedAdressAttributeArr.push(0x1); // Family
expectedAdressAttributeArr.push(0xf8);
expectedAdressAttributeArr.push(0x24); // Port
expectedAdressAttributeArr.push(0xc0);
expectedAdressAttributeArr.push(0xa8);
expectedAdressAttributeArr.push(1);
expectedAdressAttributeArr.push(2); //     IP

test('encode', () => {
  const attribute = new StunAddressAttribute(type, '192.168.1.2', 63524);

  const buf = attribute.toBuffer();
  const expectedBuffer = Buffer.from(expectedAdressAttributeArr);

  expect(buf).toEqual(expectedBuffer);
});

test('decode', () => {
  const packet = Buffer.from(expectedAdressAttributeArr);

  const { value } = StunAddressAttribute.from(type, packet);

  const expectedPort = 63524;
  const expectedAddress = '192.168.1.2';

  expect(value.port).toBe(expectedPort);
  expect(value.address).toBe(expectedAddress);
  expect(value.family).toBe('IPv4');
});
