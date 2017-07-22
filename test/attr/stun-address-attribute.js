const StunAddressAttribute = require('lib/attr/stun-address-attribute')
const constants = require('lib/constants')

const type = constants.attributeType.MAPPED_ADDRESS

test('encode', () => {
  const attr = new StunAddressAttribute(type, '192.168.1.2', 63524)

  const buf = attr.toBuffer()
  const expectedBuffer = Buffer.from([
    0, /* reserved */
    0x1, /* family */
    0xF8, 0x24, /* port */
    0xC0, 0xA8, 1, 2 /* ip */
  ])

  expect(buf).toEqual(expectedBuffer)
})

test('decode', () => {
  const packet = Buffer.from([
    0, /* reserved */
    0x1, /* family */
    0xF8, 0x24, /* port */
    0xC0, 0xA8, 1, 2 /* ip */
  ])

  const attr = StunAddressAttribute.from(type, packet)
  const value = attr.value

  const expectedPort = 63524
  const expectedAddress = '192.168.1.2'

  expect(value.port).toBe(expectedPort)
  expect(value.address).toBe(expectedAddress)
  expect(value.family).toBe('IPv4')
})
