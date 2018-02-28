const constants = require('lib/constants')
const StunByteStringAttribute = require('attributes/stun-bytestring-attribute')

const type = constants.attributeType.USERNAME

test('encode', () => {
  const attr = new StunByteStringAttribute(type, '3Qpe:b63f4e96')
  const expectedBuffer = Buffer.from('335170653a6236336634653936', 'hex')

  expect(attr.toBuffer()).toEqual(expectedBuffer)
})

test('decode', () => {
  const msg = Buffer.from('3Qpe:b63f4e96')

  const attr = StunByteStringAttribute.from(type, msg)

  expect(attr.value).toEqual(msg)
})
