# Change Log
All notable changes to the "stun" package will be documented in this file.


### [3.0.0] - 2023-12-12

- BREAKING: require node.js 10
- dep(debug): bump to 4.3.4
- dep(ip): bump to 2.0.0
- dep(meow): bump to 10.1.5
- dep(turbo-crc32): bump to 1.0.1
- dep(universalify): bump to 2.0.1
- dep(eslint): bump to 7.32.0
- dep(jest): bump to 27.5.1
- dep(eslint): bump to 7.32.0


### [2.1.1] - 2023-12-11

- dep(parse-url): replace with native URL
- ci: replace Travis with GitHub Actions


### [2.1.0] - 2019-11-23

- `stun.request` supports promise interface.


### [2.0.0] - 2019-06-02

- Add `request()` method to simplify client-side requests. Follow the `STUN` specification.
- All STUN-related errors inherit `StunError`. See `StunMessageError` and `StunResponseError`.
- A big `StunMessage` class was replased by `StunRequest` and `StunResponse`. They are represent outgoing and incoming messages. The main difference is that you cannot change incoming message.
- Added simple CLI, use `npx stun` or `npx stun -p 3478`.
- Another incompatible API changes.
