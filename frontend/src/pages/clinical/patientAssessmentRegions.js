import { bodyRegions } from '../../features/clinical-assessments/assessmentRegistry.js'

export function selectedMedicalRegions(medicalRecord, regions = bodyRegions) {
  const subjective = medicalRecord?.subjective_assessment || {}
  const chartRegions = Array.isArray(subjective.pain_locations) ? subjective.pain_locations : []

  return new Set(regions.filter((region) => (
    subjective.primary_pain_location === region.sourceKey
    || chartRegions.some((chartRegion) => (
      chartRegion === region.chartKey
      || String(chartRegion).endsWith(`_${region.chartKey}`)
    ))
  )).map((region) => region.key))
}

export function assignedBodyRegions(selectedRegions, regions = bodyRegions) {
  return regions.filter((region) => selectedRegions.has(region.key))
}
