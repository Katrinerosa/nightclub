const { test } = require('node:test');
const assert = require('node:assert/strict');
const routes = require('./reservations.cjs');

function setup() {
  const data = { users: [{ id: 1 }, { id: 2 }], reservations: [] };
  const db = { get(key) { return {
    value: () => data[key],
    find: predicate => ({ value: () => data[key].find(predicate) }),
    push: item => ({ write: () => data[key].push(item) }),
    remove: predicate => ({ write: () => { data[key] = data[key].filter(item => !predicate(item)); } }),
  }; } };
  const handler = routes(db, { verify(token) { if (!['1', '2'].includes(token)) throw new Error(); return { sub: token }; } }, 'test');
  function request(method, path, user, body) {
    let result;
    const response = { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(value) { result = { status: this.statusCode, body: value }; return this; } };
    handler({ method, path, body, headers: { authorization: user ? `Bearer ${user}` : '' } }, response, () => { throw new Error('Unexpected fallthrough'); });
    return result;
  }
  return { request, data };
}
const booking = { table: '3', guests: '3', date: '2099-05-20T18:00:00.000Z', name: 'Test Guest', email: 'guest@example.test', phone: '12345678' };

test('create, list, cancel and rebook without modifying other users', () => {
  const { request } = setup();
  assert.deepEqual(request('GET', '/reservations', '1').body, []);
  const created = request('POST', '/reservations', '1', { ...booking, userId: 2 });
  assert.equal(created.status, 201);
  assert.equal(created.body.userId, 1);
  assert.equal(request('GET', '/reservations', '1').body.length, 1);
  assert.equal(request('GET', '/reservations', '2').body.length, 0);
  assert.equal(request('DELETE', `/reservations/${created.body.id}`, '2').status, 404);
  assert.equal(request('POST', '/reservations', '2', booking).status, 409);
  assert.equal(request('POST', '/reservations', '2', { ...booking, date: '2099-05-20T20:00:00.000Z' }).status, 409);
  assert.equal(request('POST', '/reservations', '2', { ...booking, date: '2099-05-21T18:00:00.000Z' }).status, 201);
  assert.equal(request('DELETE', `/reservations/${created.body.id}`, '1').status, 200);
  assert.equal(request('POST', '/reservations', '2', booking).status, 201);
});

test('reject unauthenticated requests, invalid fields and legacy double bookings', () => {
  const { request, data } = setup();
  assert.equal(request('GET', '/reservations').status, 401);
  assert.equal(request('GET', '/666/reservations').status, 401);
  for (const override of [{ guests: '7' }, { table: '16' }, { date: 'invalid' }, { date: '2000-01-01T20:00:00Z' }, { email: 'invalid' }]) {
    assert.equal(request('POST', '/reservations', '1', { ...booking, ...override }).status, 400);
  }
  data.reservations.push({ ...booking, id: 99 });
  assert.equal(request('POST', '/reservations', '1', booking).status, 409);
  assert.deepEqual(request('GET', '/reservations', '1').body, []);
});
