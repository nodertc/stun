const constants = require('lib/constants')
const StunMessage = require('lib/message')

test('encode', () => {
  const msg = new StunMessage()

  msg.setType(constants.messageType.BINDING_REQUEST)
  msg.setTransactionID(Buffer.from('d00558707bb8cc6a633a9df7', 'hex'))
  msg.addAttribute(constants.attributeType.XOR_MAPPED_ADDRESS, '192.168.1.35', 63524)

  const expectedBuffer = Buffer.from([
    0, 0x01,  /* Type */
    0, 12, /* Length */
    0x21, 0x12, 0xA4, 0x42, /* Cookie */
    0xD0, 0x05, 0x58, 0x70, 0x7B, 0xB8, 0xCC, 0x6A, 0x63, 0x3A, 0x9D, 0xF7, /* Transaction */

    0, 0x20, /* XOR_MAPPED_ADDRESS */
    0, 8, /* Length */
    0, /* Reserved */
    0x1, /* Family */
    0xD9, 0x36, /* Port */
    0xE1, 0xBA, 0xA5, 0x61 /* Ip */
  ])

  expect(msg.toBuffer()).toEqual(expectedBuffer)
})

test('decode', () => {
  const packet = Buffer.from([
    0, 0x01,  /* Type */
    0, 12, /* Length */
    0x21, 0x12, 0xA4, 0x42, /* Cookie */
    0xD0, 0x05, 0x58, 0x70, 0x7B, 0xB8, 0xCC, 0x6A, 0x63, 0x3A, 0x9D, 0xF7, /* Transaction */

    0, 0x20, /* XOR_MAPPED_ADDRESS */
    0, 8, /* Length */
    0, /* Reserved */
    0x1, /* Family */
    0xD9, 0x36, /* Port */
    0xE1, 0xBA, 0xA5, 0x61 /* Ip */
  ])

  const stunMsg = StunMessage.from(packet)

  expect(stunMsg.type).toBe(constants.messageType.BINDING_REQUEST)
  expect(stunMsg.transactionId).toEqual(Buffer.from('d00558707bb8cc6a633a9df7', 'hex'))
  expect(stunMsg._attrs.length).toBe(1)

  const xorAddress = stunMsg.getAttribute(constants.attributeType.XOR_MAPPED_ADDRESS)
  expect(xorAddress.type).toBe(constants.attributeType.XOR_MAPPED_ADDRESS)
  expect(xorAddress.value).toEqual({
    port: 63524,
    family: 'IPv4',
    address: '192.168.1.35'
  })
})

test('decode unknown attributes', () => {
  const packet = Buffer.from([
    0, 0x01,  /* Type */
    0, 12, /* Length */
    0x21, 0x12, 0xA4, 0x42, /* Cookie */
    0xD0, 0x05, 0x58, 0x70, 0x7B, 0xB8, 0xCC, 0x6A, 0x63, 0x3A, 0x9D, 0xF7, /* Transaction */

    0x88, 0x88, /* should be an unknown attribute */
    0, 8,
    0,
    0x1,
    0xD9, 0x36,
    0xE1, 0xBA, 0xA5, 0x61
  ])

  expect(() => StunMessage.from(packet)).not.toThrow()

  const stunMsg = StunMessage.from(packet)
  const attr = stunMsg.getAttribute(0x8888)

  expect(attr.valueType).toBe(constants.attributeValueType.UNKNOWN)
  expect(attr.value).toEqual(Buffer.from([
    0,
    0x1,
    0xD9, 0x36,
    0xE1, 0xBA, 0xA5, 0x61
  ]))
})

test('add FINGERPRINT', () => {
  const expectedBuffer = Buffer.from(
    '0101002c2112a442644d4f37326c71514d4f4a51' +
    '002000080001cc03e1baa56100080014a8fbde3bdc5ff7ab1e8' +
    '52a8c2cc6ef651cb74889802800042748c3bb', 'hex'
  )

  const msg = new StunMessage()

  msg.setType(constants.messageType.BINDING_RESPONSE)
  msg.setTransactionID(Buffer.from('644d4f37326c71514d4f4a51', 'hex'))

  const { XOR_MAPPED_ADDRESS, MESSAGE_INTEGRITY } = constants.attributeType

  msg.addAttribute(XOR_MAPPED_ADDRESS, '192.168.1.35', 60689)
  msg.addAttribute(MESSAGE_INTEGRITY, Buffer.from('a8fbde3bdc5ff7ab1e852a8c2cc6ef651cb74889', 'hex'))

  expect(msg.addFingerprint()).toBe(true)
  expect(msg.toBuffer()).toEqual(expectedBuffer)
})

test('add MESSAGE-INTEGRITY', () => {
  const expectedBuffer = Buffer.from(
    '010100242112a4426f576f544a34445674305276' +
    '002000080001db91e1baa56600080014e161f72ee' +
    '71ed9f6accaef828ec42f19a809045a', 'hex'
  )

  const msg = new StunMessage()

  msg.setType(constants.messageType.BINDING_RESPONSE)
  msg.setTransactionID(Buffer.from('6f576f544a34445674305276', 'hex'))

  const { XOR_MAPPED_ADDRESS } = constants.attributeType
  msg.addAttribute(XOR_MAPPED_ADDRESS, '192.168.1.36', 64131)

  const password = '6Gzr+PH5Krjg0VqBa81nE7n6'

  expect(msg.addMessageIntegrity(password)).toBe(true)
  expect(msg.toBuffer()).toEqual(expectedBuffer)
})

test('FINGERPRINT should be uint32', () => {
  const { SOFTWARE } = constants.attributeType
  const msg = new StunMessage()

  msg.setType(constants.messageType.BINDING_RESPONSE)
  msg.addAttribute(SOFTWARE, '123456789')

  expect(msg.addFingerprint()).toBe(true)
})
