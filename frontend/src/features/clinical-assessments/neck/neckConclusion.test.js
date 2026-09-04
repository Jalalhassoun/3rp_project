import assert from 'node:assert/strict'
import test from 'node:test'
import { buildNeckConclusion } from './neckConclusion.js'

test('builds all eleven pre-reasoning headings with empty states available to the view',()=>{
  const sections=buildNeckConclusion({})
  assert.deepEqual(sections.map((section)=>section.number),[1,2,3,4,5,6,7,8,9,10,11])
  assert.deepEqual(sections.map((section)=>section.label.en),[
    'Inspection','Palpation','Cervical Articular Assessment','Muscular Assessment','Neurological Screen',
    'Neurodynamic / Radicular Tests','Upper Motor Neuron Screen','Vertebrobasilar / Vascular Screen',
    'Functional Assessment','Functional / Motor Control Tests','Special Tests',
  ])
  assert.equal(sections.every((section)=>section.blocks.length===0),true)
})

test('includes only recorded rows in structured and checklist summaries',()=>{
  const sections=buildNeckConclusion({
    inspection:{staticFindings:['forward_head'],dynamicFindings:[]},
    articular:{movements:{flexion:{arom:45,prom:'',pain:true,limitation:true,limitationType:'arom'}},segmentalMobility:{c5_c6:'hypomobile'}},
    muscular:{mmt:{cervical_flexors:{right:4,left:5,pain:false}},muscleLength:[]},
    neurological:{sensory:{c6:{right:true,left:false}},sensoryFindings:['paresthesia'],myotomes:{c6_wrist_extension:{right:4,left:5}},reflexes:{biceps_c5_6:{right:'1+',left:'2+'}},reflexComparison:'hyporeflexia'},
  })
  assert.equal(sections[0].blocks[0].rows.length,1)
  assert.equal(sections[2].blocks[0].rows.length,1)
  assert.equal(sections[2].blocks[0].rows[0][1].en,'45°')
  assert.equal(sections[2].blocks[0].rows[0][5].en,'AROM')
  assert.equal(sections[2].blocks[0].rows[0][6].en,'Muscular problem')
  assert.equal(sections[3].blocks[0].rows.length,1)
  assert.equal(sections[4].blocks[0].rows.length,1)
})

test('groups recorded special tests under the five configured clusters',()=>{
  const sections=buildNeckConclusion({specialTests:{
    pathways:['radicular','headache','thoracic_outlet'],
    tests:{spurling:'positive',hoffmann:'negative',cervical_flexion_rotation:'positive',upper_cervical_palpation:'abnormal',roos_east:'negative'},
  }})
  const special=sections[10]
  assert.deepEqual(special.blocks.map((block)=>block.label.en),[
    'Presentation / Findings','Cervical Radiculopathy Cluster','Cervical Myelopathy Screen','Upper Cervical Dysfunction','Cervicogenic Headache','First Rib / Thoracic Outlet Suspicion',
  ])
})

test('omits normal MMT results and includes only weakness or pain',()=>{
  const muscular=buildNeckConclusion({muscular:{mmt:{
    cervical_flexors:{right:5,left:5,pain:false},
    cervical_extensors:{right:4,left:5,pain:false},
    rotators:{right:5,left:5,pain:true},
  },muscleLength:[]}})[3]
  assert.deepEqual(muscular.blocks[0].rows.map((row)=>row[0].en),['Cervical extensors','Rotators'])
})

test('omits normal dermatomes and includes only abnormal sides',()=>{
  const neurological=buildNeckConclusion({neurological:{sensory:{
    c2:{right:false,left:false},
    c6:{right:true,left:false},
    c7:{right:'normal',left:'normal'},
  },sensoryFindings:[],myotomes:{},reflexes:{}}})[4]
  assert.deepEqual(neurological.blocks[0].rows.map((row)=>row[0].en),['C6 — Thumb'])
})

test('omits normal myotomes and includes only weakness',()=>{
  const neurological=buildNeckConclusion({neurological:{sensory:{},sensoryFindings:[],myotomes:{
    c4_shoulder_elevation:{right:5,left:5},
    c6_wrist_extension:{right:4,left:5},
  },reflexes:{}}})[4]
  const myotomesBlock=neurological.blocks.find((block)=>block.label.en==='Myotomes')
  assert.deepEqual(myotomesBlock.rows.map((row)=>row[0].en),['C6 — Wrist extension'])
})

test('includes hyperesthesia in abnormal sensory findings',()=>{
  const neurological=buildNeckConclusion({neurological:{sensory:{c6:{right:true,left:false,findings:['hyperesthesia']}},sensoryFindings:[],myotomes:{},reflexes:{}}})[4]
  assert.equal(neurological.blocks[0].rows[0][3].en,'Hyperesthesia')
})

test('omits normal reflexes and includes abnormal reflex comparison inside its row',()=>{
  const neurological=buildNeckConclusion({neurological:{sensory:{},sensoryFindings:[],myotomes:{},reflexes:{
    biceps_c5_6:{right:'2+',left:'2+',comparison:'symmetrical'},
    triceps_c7:{right:'3+',left:'2+',comparison:['hyporeflexia','hyperreflexia']},
  }}})[4]
  const reflexBlock=neurological.blocks.find((block)=>block.label.en==='Reflexes')
  assert.equal(reflexBlock.rows.length,1)
  assert.equal(reflexBlock.rows[0][0].en,'Triceps C7')
  assert.equal(reflexBlock.rows[0][3].en,'Hyporeflexia, Hyperreflexia')
})

test('omits normal segmental mobility and includes only abnormal segments',()=>{
  const articular=buildNeckConclusion({articular:{movements:{},segmentalMobility:{
    c0_c1:'normal',
    c5_c6:'hypomobile',
    c6_c7:'hypermobile',
  }}})[2]
  const mobilityBlock=articular.blocks.find((block)=>block.label.en==='Segmental Mobility')
  assert.deepEqual(mobilityBlock.rows.map((row)=>row[0].en),['C5–C6','C6–C7'])
})
