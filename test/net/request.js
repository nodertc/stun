'use strict';

const { request } = require('net/request');
const StunResponse = require('message/response');
const { createMessage } = require('lib/create-message');
const { messageType } = require('lib/constants');
const StunServer = require('net/dgram-server');
const { createServer } = require('net/create-server');

test('should work', done => {
  expect.assertions(2);

  request('stun://stun.l.google.com:19302', (err, res) => {
    expect(err).toBe(null);
    expect(res).toBeInstanceOf(StunResponse);

    done();
  });
});

test('url normalization should work', done => {
  expect.assertions(2);

  request('stun.l.google.com:19302', (err, res) => {
    expect(err).toBe(null);
    expect(res).toBeInstanceOf(StunResponse);

    done();
  });
});

test('should use provided STUN server', done => {
  expect.assertions(1);

  const socket = {
    on: jest.fn(),
    once: jest.fn(),
    removeListener: jest.fn(),
  };
  const server = new StunServer(socket);
  server.send = jest.fn();

  request('stun.l.google.com:19302', { server, retries: 0 }, () => {
    expect(server.send).toBeCalledTimes(1);
    done();
  });
});

test('should use provided message', done => {
  expect.assertions(2);

  const server = createServer({ type: 'udp4' });
  const req = createMessage(messageType.BINDING_REQUEST);

  const options = {
    server,
    retries: 0,
    message: req,
  };

  request('stun.l.google.com:19302', options, (err, res) => {
    expect(err).toBe(null);
    expect(res.transactonId).toEqual(req.transactonId);

    done();
  });
});
