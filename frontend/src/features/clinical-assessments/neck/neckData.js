import { cervicalSegments } from './neckConfig.js'

const defaultSegmentalMobility=()=>Object.fromEntries(cervicalSegments.map((segment)=>[segment.key,'normal']))

export function createNeckAssessmentData(){return{
  inspection:{staticFindings:[],dynamicFindings:[],notes:''},
  palpation:{locations:{},notes:''},
  articular:{movements:{},segmentalMobility:defaultSegmentalMobility(),notes:''},
  muscular:{mmt:{},muscleLength:[],notes:''},
  neurological:{sensory:{},sensoryFindings:[],myotomes:{},reflexes:{},reflexComparison:'',notes:''},
  radicular:{tests:{},notes:''},
  umnScreen:{tests:{},myelopathySymptoms:[],notes:''},
  vascularScreen:{indicated:null,symptoms:[],notes:''},
  functional:{activities:{},tasks:{},notes:''},
  motorControl:{tests:{},notes:''},
  specialTests:{pathways:[],showFull:false,tests:{},notes:''},
  outcomeMeasure:{ndi:'',psfs:[{activity:'',score:''},{activity:'',score:''},{activity:'',score:''}],notes:''},
  clinicalReasoning:{mainHypothesis:'',differentialDiagnosis:[],supportingFindings:[],againstFindings:[],testsNeeded:[],interpretation:''},
}}

function mergeDefaults(defaults,saved){
  if(Array.isArray(defaults))return Array.isArray(saved)?saved:defaults
  if(!defaults||typeof defaults!=='object')return saved===undefined?defaults:saved
  const source=saved&&typeof saved==='object'&&!Array.isArray(saved)?saved:{}
  return Object.fromEntries(Object.entries({...defaults,...source}).map(([key,value])=>[
    key,
    key in defaults?mergeDefaults(defaults[key],source[key]):value,
  ]))
}

export function mergeNeckAssessmentData(saved={}){return mergeDefaults(createNeckAssessmentData(),saved)}

function hasAbnormalSensorySide(finding={}){
  return ['right','left'].some((side)=>finding[side]===true||(typeof finding[side]==='string'&&finding[side]!==''&&finding[side]!=='normal'))
}

function hasRecordedSensoryFinding(finding={}){
  return Boolean(finding.findings?.length)||['right','left'].some((side)=>typeof finding[side]==='string'&&finding[side]!==''&&finding[side]!=='normal')
}

export function hasIncompleteSensoryFindings(data){
  const legacyFindings=data?.neurological?.sensoryFindings||[]
  return Object.values(data?.neurological?.sensory||{}).some((finding)=>hasAbnormalSensorySide(finding)&&!hasRecordedSensoryFinding(finding)&&legacyFindings.length===0)
}

export function hasIncompleteReflexComparisons(data){
  return Object.values(data?.neurological?.reflexes||{}).some((finding)=>{
    const abnormalSide=['right','left'].some((side)=>finding?.[side]!==''&&finding?.[side]!==null&&finding?.[side]!==undefined&&finding[side]!=='2+')
    const comparisons=Array.isArray(finding?.comparison)?finding.comparison:finding?.comparison?[finding.comparison]:[]
    return abnormalSide&&comparisons.length!==1
  })
}

export function hasNeurologicalConcern(data){
  const sensory=Boolean(data?.neurological?.sensoryFindings?.length)||Object.values(data?.neurological?.sensory||{}).some((finding)=>Boolean(finding?.findings?.length)||['right','left'].some((side)=>finding?.[side]&&finding[side]!=='normal'))
  const myotomes=Object.values(data?.neurological?.myotomes||{}).some((finding)=>['right','left'].some((side)=>finding?.[side]!==''&&finding?.[side]!==undefined&&Number(finding[side])<5))
  const reflexes=Object.values(data?.neurological?.reflexes||{}).some((finding)=>{const comparisons=Array.isArray(finding?.comparison)?finding.comparison:finding?.comparison?[finding.comparison]:[];return comparisons.some((comparison)=>comparison!=='symmetrical')||['right','left'].some((side)=>finding?.[side]&&finding[side]!=='2+')})
  const radicular=Object.values(data?.radicular?.tests||{}).some((finding)=>finding?.result==='positive'||finding?.familiarSymptoms||finding?.sensitizerChange)
  const umn=Object.values(data?.umnScreen?.tests||{}).some((result)=>result==='positive'||result==='abnormal')
  const specialSafety=['spurling','ultt1','hoffmann','babinski','clonus','gait_balance','hand_dexterity'].some((key)=>['positive','abnormal'].includes(data?.specialTests?.tests?.[key]))
  return sensory||myotomes||reflexes||radicular||umn||specialSafety||Boolean(data?.umnScreen?.myelopathySymptoms?.length)
}

export function hasVascularConcern(data){return Boolean(data?.vascularScreen?.symptoms?.length)}
