const StunXorAddressAttribute = require('lib/attr/stun-xor-address-attribute')
const constants = require('lib/constants')

const type = constants.attributeType.XOR_MAPPED_ADDRESS

test('encode', () => {
  const attr = new StunXorAddressAttribute(type, '192.168.1.35', 63524)

  const owner = {
    transactionId: Buffer.from('d00558707bb8cc6a633a9df7', 'hex')
  }

  attr.setOwner(owner)

  expect(attr.value).toEqual({
    address: '192.168.1.35',
    port: 63524,
    family: 'IPv4'
  })

  const expectedBuffer = Buffer.from('0001d936e1baa561', 'hex')
  expect(attr.toBuffer()).toEqual(expectedBuffer)
})
