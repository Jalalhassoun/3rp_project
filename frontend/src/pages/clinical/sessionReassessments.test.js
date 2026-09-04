import assert from 'node:assert/strict'
import test from 'node:test'
import { initialAssessments, sessionReassessmentOptions, unlinkedReassessments } from './sessionReassessments.js'

const initial = { id: 'initial-1', body_region: 'cervical', status: 'completed', assessment_date: '2026-08-01', parent_assessment_id: null }
const linked = { id: 'reassessment-1', body_region: 'cervical', status: 'draft', assessment_date: '2026-08-20', parent_assessment_id: initial.id, appointment_id: 'session-1' }

test('the Assessments tab receives initial assessments only', () => {
  assert.deepEqual(initialAssessments([linked, initial]), [initial])
})

test('a confirmed session exposes its linked reassessment instead of a new entry point', () => {
  const options = sessionReassessmentOptions([initial, linked], { id: 'session-1', status: 'confirmed' })
  assert.equal(options.length, 1)
  assert.equal(options[0].assessment.id, linked.id)
})

test('a completed session can start reassessments from every completed body region', () => {
  const shoulder = { ...initial, id: 'initial-2', body_region: 'shoulder' }
  const options = sessionReassessmentOptions([initial, shoulder], { id: 'session-2', status: 'completed' })
  assert.deepEqual(options.map((option) => option.bodyRegion).sort(), ['cervical', 'shoulder'])
  assert.ok(options.every((option) => option.assessment === null && option.parent))
})

test('pending and cancelled appointments do not expose reassessment actions', () => {
  assert.deepEqual(sessionReassessmentOptions([initial], { id: 'session-2', status: 'pending' }), [])
  assert.deepEqual(sessionReassessmentOptions([initial], { id: 'session-2', status: 'cancelled' }), [])
})

test('legacy unlinked reassessments remain discoverable in Sessions', () => {
  const legacy = { ...linked, id: 'legacy', appointment_id: null }
  assert.deepEqual(unlinkedReassessments([initial, linked, legacy]), [legacy])
})
