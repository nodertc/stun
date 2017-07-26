const StunUInt16ListAttribute = require('lib/attr/stun-uint16list-attribute')
const constants = require('lib/constants')

const type = constants.attributeType.UNKNOWN_ATTRIBUTES

test('encode', () => {
  const attr = new StunUInt16ListAttribute(type)

  attr.addType(1)
  attr.addType(2)
  attr.addType(3)

  const expectedBuffer = Buffer.from([
    0, 0x1,
    0, 0x2,
    0, 0x3
  ])

  expect(attr.toBuffer()).toEqual(expectedBuffer)
})

test('decode', () => {
  const packet = Buffer.from([
    0, 0x1,
    0, 0x2,
    0, 0x3
  ])

  const attr = StunUInt16ListAttribute.from(type, packet)

  expect(attr.value).toEqual([1, 2, 3])
})

test('encode # constructor', () => {
  const attr = new StunUInt16ListAttribute(type, [1, 2, 3])

  const expectedBuffer = Buffer.from([
    0, 0x1,
    0, 0x2,
    0, 0x3
  ])

  expect(attr.toBuffer()).toEqual(expectedBuffer)
})
