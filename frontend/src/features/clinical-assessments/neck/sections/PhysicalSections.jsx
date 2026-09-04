import { useState } from 'react'
import { BooleanChoice, ChoiceButtons, DualLabel, FindingCard, MultiCheck, NumberField } from '../../components/AssessmentControls.jsx'
import { cervicalSegments, dynamicFindings, movements, movementStandardRanges, palpationFindings, palpationGroups, staticFindings } from '../neckConfig.js'

const tenderness=['0','1','2','3'].map((key)=>({key,label:key,labelAr:key}))
const mobilityOptions=[{key:'hypomobile',label:'Hypomobile',labelAr:'ناقص الحركة'},{key:'normal',label:'Normal',labelAr:'طبيعي'},{key:'hypermobile',label:'Hypermobile',labelAr:'مفرط الحركة'}]
const limitationTypeOptions=[{key:'arom',label:'AROM — Muscular problem',labelAr:'AROM — مشكلة عضلية'},{key:'prom',label:'PROM — Articular problem',labelAr:'PROM — مشكلة مفصلية'}]

function SegmentalMobilityChoice({segment,value='normal',onChange}){
  const [expanded,setExpanded]=useState(false)
  const current=mobilityOptions.find((option)=>option.key===value)||mobilityOptions[1]
  const visibleOptions=expanded?mobilityOptions:[current]

  function select(next){
    if(!expanded){setExpanded(true);return}
    onChange(next)
    setExpanded(false)
  }

  return <fieldset className="clinical-choice segmental-mobility-choice"><legend><DualLabel label={segment.label} labelAr={segment.labelAr}/></legend><div>{visibleOptions.map((option)=><button aria-expanded={expanded} className={option.key===current.key?`is-selected ${current.key==='normal'?'':'is-abnormal'}`:''} key={option.key} type="button" onClick={()=>select(option.key)}><DualLabel label={option.label} labelAr={option.labelAr}/></button>)}</div></fieldset>
}

export function InspectionSection({value,onChange}){
  return <div className="assessment-section__body"><MultiCheck label="Static" labelAr="ثابت" options={staticFindings} value={value.staticFindings} onChange={(staticFindingsValue)=>onChange({...value,staticFindings:staticFindingsValue})}/><MultiCheck label="Dynamic" labelAr="حركي" options={dynamicFindings} value={value.dynamicFindings} onChange={(dynamicFindingsValue)=>onChange({...value,dynamicFindings:dynamicFindingsValue})}/></div>
}

export function PalpationSection({value,onChange}){
  function toggle(key,active){const locations={...value.locations};if(active)locations[key]={tenderness:'',findings:[]};else delete locations[key];onChange({...value,locations})}
  function update(key,field,next){onChange({...value,locations:{...value.locations,[key]:{...value.locations[key],[field]:next}}})}
  return <div className="assessment-section__body">{palpationGroups.map((group)=><section className="clinical-subsection" key={group.label}><DualLabel as="h3" label={group.label} labelAr={group.labelAr}/><div className="clinical-finding-grid">{group.items.map((item)=>{const finding=value.locations[item.key];return <FindingCard item={item} key={item.key} active={Boolean(finding)} onToggle={(active)=>toggle(item.key,active)}>{finding&&<div className="clinical-finding-controls"><ChoiceButtons label="Tenderness 0–3" labelAr="شدة الإيلام 0–3" options={tenderness} value={String(finding.tenderness??'')} onChange={(next)=>update(item.key,'tenderness',next===''?'':Number(next))}/><MultiCheck label="Findings" labelAr="النتائج" options={palpationFindings} value={finding.findings} onChange={(findings)=>update(item.key,'findings',findings)}/></div>}</FindingCard>})}</div></section>)}</div>
}

export function ArticularSection({value,onChange}){
  function finding(key){return value.movements[key]||{arom:'',prom:'',pain:null,limitation:null,limitationType:''}}
  function update(key,field,next){const updated={...finding(key),[field]:next};if(field==='limitation'&&next!==true)delete updated.limitationType;onChange({...value,movements:{...value.movements,[key]:updated}})}
  return <div className="assessment-section__body"><section className="clinical-subsection"><DualLabel as="h3" label="Cervical AROM / PROM" labelAr="مدى الحركة العنقية الفعّال / السلبي"/><div className="rom-grid">{movements.map((movement)=>{const current=finding(movement.key);return <article className="rom-card" key={movement.key}><DualLabel as="h4" label={movement.label} labelAr={movement.labelAr}/><div className="rom-card__standard"><DualLabel label="Standard range" labelAr="المدى الطبيعي"/><strong dir="ltr">{movementStandardRanges[movement.key]}°</strong></div><div className="rom-card__numbers"><NumberField label="AROM" labelAr="المدى الفعّال" min="0" max="180" suffix="°" value={current.arom} onChange={(next)=>update(movement.key,'arom',next)}/><NumberField label="PROM" labelAr="المدى السلبي" min="0" max="180" suffix="°" value={current.prom} onChange={(next)=>update(movement.key,'prom',next)}/></div><div className="rom-card__flags"><BooleanChoice label="Pain" labelAr="ألم" value={current.pain} onChange={(next)=>update(movement.key,'pain',next)}/><BooleanChoice label="Limitation" labelAr="محدودية" value={current.limitation} onChange={(next)=>update(movement.key,'limitation',next)}/>{current.limitation===true&&<ChoiceButtons label="Limited range" labelAr="نوع المدى المحدود" options={limitationTypeOptions} value={current.limitationType||''} allowClear={false} onChange={(next)=>update(movement.key,'limitationType',next)}/>}</div></article>})}</div></section><section className="clinical-subsection"><DualLabel as="h3" label="Segmental Mobility" labelAr="الحركة القطعية"/><div className="segmental-mobility-grid">{cervicalSegments.map((segment)=><SegmentalMobilityChoice key={segment.key} segment={segment} value={value.segmentalMobility[segment.key]||'normal'} onChange={(next)=>onChange({...value,segmentalMobility:{...value.segmentalMobility,[segment.key]:next}})}/>)}</div></section></div>
}
