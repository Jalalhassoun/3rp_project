import assert from 'node:assert/strict'
import test from 'node:test'
import { movementStandardRanges, neckWorkflowSteps } from './neckConfig.js'
import { createNeckAssessmentData, hasIncompleteReflexComparisons, hasIncompleteSensoryFindings } from './neckData.js'

test('assessment and reassessment always render the complete cervical workflow',()=>{
  assert.deepEqual(neckWorkflowSteps.map((step)=>step.key),[
    'inspection',
    'palpation',
    'articular',
    'muscular',
    'neurological',
    'radicular',
    'umnScreen',
    'vascularScreen',
    'functional',
    'motorControl',
    'specialTests',
    'clinicalReasoning',
  ])
  assert.equal(neckWorkflowSteps.some((step)=>step.key==='outcomeMeasure'),false)
})

test('provides the requested standard cervical movement ranges',()=>{
  assert.deepEqual(movementStandardRanges,{
    flexion:'45–90',
    extension:'50–70',
    rotation_right:'70–90',
    rotation_left:'70–90',
    lateral_flexion_right:'20–45',
    lateral_flexion_left:'20–45',
  })
})

test('cervical articular assessment excludes movement quality and end feel',()=>{
  const articular=createNeckAssessmentData().articular
  assert.equal(Object.hasOwn(articular,'movementQuality'),false)
  assert.equal(Object.hasOwn(articular,'endFeel'),false)
})

test('cervical muscular assessment excludes deep neck flexor and muscle control fields',()=>{
  const muscular=createNeckAssessmentData().muscular
  assert.equal(Object.hasOwn(muscular,'deepNeckFlexor'),false)
  assert.equal(Object.hasOwn(muscular,'muscleControl'),false)
})

test('defaults every cervical segment to normal mobility',()=>{
  const segmentalMobility=createNeckAssessmentData().articular.segmentalMobility
  assert.equal(Object.keys(segmentalMobility).length,8)
  assert.ok(Object.values(segmentalMobility).every((value)=>value==='normal'))
})

test('detects marked dermatomes without an abnormal sensory finding',()=>{
  assert.equal(hasIncompleteSensoryFindings({neurological:{sensory:{c6:{right:true,left:false,findings:[]}},sensoryFindings:[]}}),true)
  assert.equal(hasIncompleteSensoryFindings({neurological:{sensory:{c6:{right:true,left:false,findings:['paresthesia']}},sensoryFindings:[]}}),false)
  assert.equal(hasIncompleteSensoryFindings({neurological:{sensory:{c6:{}},sensoryFindings:[]}}),false)
})

test('requires exactly one comparison for an abnormal reflex',()=>{
  assert.equal(hasIncompleteReflexComparisons({neurological:{reflexes:{biceps_c5_6:{right:'3+',left:'2+',comparison:''}}}}),true)
  assert.equal(hasIncompleteReflexComparisons({neurological:{reflexes:{biceps_c5_6:{right:'3+',left:'2+',comparison:'hyperreflexia'}}}}),false)
  assert.equal(hasIncompleteReflexComparisons({neurological:{reflexes:{biceps_c5_6:{right:'3+',left:'2+',comparison:['hyporeflexia','hyperreflexia']}}}}),true)
  assert.equal(hasIncompleteReflexComparisons({neurological:{reflexes:{biceps_c5_6:{right:'2+',left:'2+',comparison:''}}}}),false)
})
