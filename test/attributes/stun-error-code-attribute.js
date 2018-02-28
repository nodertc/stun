const StunErrorCodeAttribute = require('attributes/stun-error-code-attribute')
const constants = require('lib/constants')

const type = constants.attributeType.ERROR_CODE
const code = constants.errorCode.TRY_ALTERNATE
const reason = constants.errorReason.TRY_ALTERNATE

test('encode', () => {
  const attr = new StunErrorCodeAttribute(type, code, reason)

  const header = Buffer.from([
    0, 0, 3, code % 100
  ])

  const expectedBuffer = Buffer.concat([header, Buffer.from(reason)])

  expect(attr.errorClass).toBe(3)
  expect(attr.code).toBe(code)
  expect(attr.reason).toBe(reason)
  expect(attr.value).toEqual({
    code,
    reason
  })
  expect(attr.toBuffer()).toEqual(expectedBuffer)
})

test('decode', () => {
  const header = Buffer.from([
    0, 0, 3, code % 100
  ])

  const msg = Buffer.concat([header, Buffer.from(reason)])
  const attr = StunErrorCodeAttribute.from(type, msg)

  expect(attr.errorClass).toBe(3)
  expect(attr.code).toBe(code)
  expect(attr.reason).toBe(reason)
  expect(attr.value).toEqual({
    code,
    reason
  })
})
