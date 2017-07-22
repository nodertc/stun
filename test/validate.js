const { validateFingerprint, validateMessageIntegrity } = require('lib/validate')
const StunMessage = require('lib/message')

test('validate fingerprint', () => {
  const packet = Buffer.from(
    '0101002c2112a442644d4f37326c71514d4f4a51' +
    '002000080001cc03e1baa56100080014a8fbde3bdc5ff7ab1e8' +
    '52a8c2cc6ef651cb74889802800042748c3bb', 'hex'
  )

  const msg = StunMessage.from(packet)

  expect(validateFingerprint(msg)).toBe(true)
})

test('validate MESSAGE INTEGRITY', () => {
  const packet = Buffer.from(
    '010100242112a4426f576f544a34445674305276' +
    '002000080001db91e1baa56600080014e161f72ee' +
    '71ed9f6accaef828ec42f19a809045a', 'hex'
  )

  const msg = StunMessage.from(packet)
  const password = '6Gzr+PH5Krjg0VqBa81nE7n6'

  expect(validateMessageIntegrity(msg, password)).toBe(true)
})
