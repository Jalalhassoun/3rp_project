import assert from 'node:assert/strict'
import test from 'node:test'
import { assignedBodyRegions, selectedMedicalRegions } from './patientAssessmentRegions.js'

test('returns only the primary medical-record region', () => {
  const selected = selectedMedicalRegions({
    subjective_assessment: { primary_pain_location: 'cervical_spine' },
  })

  assert.deepEqual(assignedBodyRegions(selected).map((region) => region.key), ['cervical'])
})

test('returns every selected body-chart region without unrelated cards', () => {
  const selected = selectedMedicalRegions({
    subjective_assessment: {
      primary_pain_location: 'shoulder',
      pain_locations: ['left_elbow', 'right_wrist_hand', 'lower_back'],
    },
  })

  assert.deepEqual(
    assignedBodyRegions(selected).map((region) => region.key),
    ['elbow', 'lumbar', 'wrist', 'shoulder'],
  )
})

test('returns an empty list when the patient has no selected region', () => {
  const selected = selectedMedicalRegions({ subjective_assessment: {} })

  assert.deepEqual(assignedBodyRegions(selected), [])
})
