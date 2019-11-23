# Change Log
All notable changes to the "stun" package will be documented in this file.

## [2.1.0] - 2019-11-23

- `stun.request` supports promise interface.

## [2.0.0] - 2019-06-02

- Add `request()` method to simplify client-side requests. Follow the `STUN` specification.
- All STUN-related errors inherit `StunError`. See `StunMessageError` and `StunResponseError`.
- A big `StunMessage` class was replased by `StunRequest` and `StunResponse`. They are represent outgoing and incoming messages. The main difference is that you cannot change incoming message.
- Added simple CLI, use `npx stun` or `npx stun -p 3478`.
- Another incompatible API changes.
