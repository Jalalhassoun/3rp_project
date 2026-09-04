export const reassessmentSessionStatuses = new Set(['confirmed', 'completed'])

function assessmentTimestamp(assessment) {
  return new Date(assessment.completed_at || assessment.assessment_date || assessment.updated_at || 0).getTime()
}

export function initialAssessments(assessments = []) {
  return assessments.filter((assessment) => !assessment.parent_assessment_id)
}

export function sessionReassessmentOptions(assessments = [], appointment) {
  if (!appointment || !reassessmentSessionStatuses.has(appointment.status)) return []

  const linkedByRegion = new Map()
  for (const assessment of assessments) {
    if (assessment.parent_assessment_id && assessment.appointment_id === appointment.id && !linkedByRegion.has(assessment.body_region)) {
      linkedByRegion.set(assessment.body_region, assessment)
    }
  }

  const latestCompletedByRegion = new Map()
  for (const assessment of [...assessments].sort((left, right) => assessmentTimestamp(right) - assessmentTimestamp(left))) {
    if (assessment.status === 'completed' && !latestCompletedByRegion.has(assessment.body_region)) {
      latestCompletedByRegion.set(assessment.body_region, assessment)
    }
  }

  const regions = new Set([...latestCompletedByRegion.keys(), ...linkedByRegion.keys()])
  return [...regions].map((bodyRegion) => ({
    bodyRegion,
    assessment: linkedByRegion.get(bodyRegion) || null,
    parent: latestCompletedByRegion.get(bodyRegion) || null,
  })).filter((option) => option.assessment || option.parent)
}

export function unlinkedReassessments(assessments = []) {
  return assessments.filter((assessment) => assessment.parent_assessment_id && !assessment.appointment_id)
}
