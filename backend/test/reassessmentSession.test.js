import assert from 'node:assert/strict';
import test from 'node:test';
import { validateAppointment } from '../src/controllers/clinicalAssessmentController.js';

function requestWithAppointment(result) {
  return {
    auth: { user: { id: 'doctor-1' } },
    db: {
      from(table) {
        assert.equal(table, 'appointments');
        const query = {
          select() { return query; },
          eq() { return query; },
          maybeSingle() { return Promise.resolve(result); },
        };
        return query;
      },
    },
  };
}

test('a reassessment requires a treatment session', async () => {
  await assert.rejects(
    validateAppointment(requestWithAppointment(null), 'patient-1', null, { required: true }),
    (error) => error.statusCode === 400,
  );
});

test('a confirmed treatment session is valid for reassessment', async () => {
  const result = await validateAppointment(
    requestWithAppointment({ data: { id: 'session-1', status: 'confirmed' }, error: null }),
    'patient-1',
    'session-1',
    { required: true, statuses: ['confirmed', 'completed'] },
  );
  assert.equal(result, 'session-1');
});

test('a pending appointment cannot own a reassessment', async () => {
  await assert.rejects(
    validateAppointment(
      requestWithAppointment({ data: { id: 'session-1', status: 'pending' }, error: null }),
      'patient-1',
      'session-1',
      { required: true, statuses: ['confirmed', 'completed'] },
    ),
    (error) => error.statusCode === 409,
  );
});

test('a session belonging to another treatment relationship is rejected', async () => {
  await assert.rejects(
    validateAppointment(
      requestWithAppointment({ data: null, error: null }),
      'patient-1',
      'session-2',
      { required: true, statuses: ['confirmed', 'completed'] },
    ),
    (error) => error.statusCode === 400,
  );
});
