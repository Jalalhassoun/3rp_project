import { primaryPainAreaOptions } from '../../pages/medical/painAreaOptions.js'

const regionKey = { cervical_spine: 'cervical', lumbar_spine: 'lumbar' }
const chartRegionKey = { cervical_spine: 'neck', lumbar_spine: 'lower_back', wrist: 'wrist_hand', ankle: 'ankle_foot' }
const regionDisplay = { cervical_spine: ['Neck / Cervical Spine', 'الرقبة / العمود الفقري العنقي'], lumbar_spine: ['Lumbar Spine / Lower Back', 'العمود الفقري القطني / أسفل الظهر'] }

export const bodyRegions = primaryPainAreaOptions.map(([sourceKey,label,labelAr]) => ({
  key: regionKey[sourceKey] || sourceKey,
  sourceKey,
  chartKey: chartRegionKey[sourceKey] || sourceKey,
  label: regionDisplay[sourceKey]?.[0] || label,
  labelAr: regionDisplay[sourceKey]?.[1] || labelAr,
  available: ['shoulder','elbow','hip','knee','ankle','cervical_spine','lumbar_spine','wrist'].includes(sourceKey),
}))

export const assessmentRegistry = {
  shoulder: {
    bodyRegion: 'shoulder',
    assessmentType: 'shoulder_quick_assessment',
    schemaVersion: 1,
    label: 'Shoulder Clinical Assessment',
    labelAr: 'التقييم السريري للكتف',
    route(patientId, assessmentId) {
      return `/physiotherapist/patients/${patientId}/assessments/${assessmentId}`
    },
  },
  elbow: {
    bodyRegion: 'elbow',
    assessmentType: 'elbow_quick_assessment',
    schemaVersion: 1,
    label: 'Elbow Clinical Assessment',
    labelAr: 'التقييم السريري للمرفق',
    route(patientId, assessmentId) {
      return `/physiotherapist/patients/${patientId}/assessments/elbow/${assessmentId}`
    },
  },
  cervical: {
    bodyRegion: 'cervical',
    assessmentType: 'cervical_quick_assessment',
    schemaVersion: 1,
    label: 'Neck / Cervical Spine Assessment',
    labelAr: 'تقييم الرقبة / العمود الفقري العنقي',
    route(patientId, assessmentId) {
      return `/physiotherapist/patients/${patientId}/assessments/cervical/${assessmentId}`
    },
  },
  lumbar: {
    bodyRegion: 'lumbar',
    assessmentType: 'lumbar_quick_assessment',
    schemaVersion: 1,
    label: 'Lumbar Spine Assessment',
    labelAr: 'تقييم العمود الفقري القطني',
    route(patientId, assessmentId) {
      return `/physiotherapist/patients/${patientId}/assessments/lumbar/${assessmentId}`
    },
  },
  wrist: {
    bodyRegion: 'wrist',
    assessmentType: 'wrist_quick_assessment',
    schemaVersion: 1,
    label: 'Wrist Clinical Assessment',
    labelAr: 'Wrist Clinical Assessment',
    route(patientId, assessmentId) {
      return `/physiotherapist/patients/${patientId}/assessments/wrist/${assessmentId}`
    },
  },
  hip: {
    bodyRegion: 'hip',
    assessmentType: 'hip_pelvis_quick_assessment',
    schemaVersion: 1,
    label: 'Hip / Pelvis Clinical Assessment',
    labelAr: 'Hip / Pelvis Clinical Assessment',
    route(patientId, assessmentId) {
      return `/physiotherapist/patients/${patientId}/assessments/hip/${assessmentId}`
    },
  },
  knee: {
    bodyRegion: 'knee',
    assessmentType: 'knee_thigh_quick_assessment',
    schemaVersion: 1,
    label: 'Knee / Thigh Clinical Assessment',
    labelAr: 'Knee / Thigh Clinical Assessment',
    route(patientId, assessmentId) {
      return `/physiotherapist/patients/${patientId}/assessments/knee/${assessmentId}`
    },
  },
  ankle: {
    bodyRegion: 'ankle',
    assessmentType: 'ankle_foot_toes_quick_assessment',
    schemaVersion: 1,
    label: 'Ankle / Foot / Toes Clinical Assessment',
    labelAr: 'Ankle / Foot / Toes Clinical Assessment',
    route(patientId, assessmentId) {
      return `/physiotherapist/patients/${patientId}/assessments/ankle/${assessmentId}`
    },
  },
}

export function assessmentDefinition(bodyRegion) {
  return assessmentRegistry[bodyRegion] || null
}
