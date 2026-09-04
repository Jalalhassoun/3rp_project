import { useState } from 'react'
import { BooleanChoice, DualLabel, MultiCheck, NumberField } from '../../components/AssessmentControls.jsx'
import { muscleLength, muscles } from '../neckConfig.js'

function isAbnormalMmt(value={}){
  return value.pain===true||['right','left'].some((side)=>value[side]!==''&&value[side]!==null&&value[side]!==undefined&&Number(value[side])<5)
}

function MmtCard({item,value,onChange}){
  const hasRecordedValue=['right','left','pain'].some((key)=>value[key]!==''&&value[key]!==null&&value[key]!==undefined)
  const [expanded,setExpanded]=useState(hasRecordedValue)
  const abnormal=isAbnormalMmt(value)
  function update(field,next){onChange({...value,[field]:next})}

  return <article className="mmt-card"><DualLabel as="h4" label={item.label} labelAr={item.labelAr}/><button aria-expanded={expanded} className={`mmt-status-button ${abnormal?'is-abnormal':'is-normal'}`} type="button" onClick={()=>setExpanded((current)=>!current)}><DualLabel label={abnormal?'Abnormal':'Normal'} labelAr={abnormal?'غير طبيعي':'طبيعي'}/></button>{expanded&&<><div><NumberField label="Right" labelAr="يمين" min="0" max="5" suffix="/5" value={value.right} onChange={(next)=>update('right',next)}/><NumberField label="Left" labelAr="يسار" min="0" max="5" suffix="/5" value={value.left} onChange={(next)=>update('left',next)}/></div><BooleanChoice label="Pain" labelAr="ألم" value={value.pain} onChange={(next)=>update('pain',next)}/></>}</article>
}

export function MuscularSection({value,onChange}){
  function mmt(key){return value.mmt[key]||{right:'',left:'',pain:null}}
  function updateMmt(key,next){onChange({...value,mmt:{...value.mmt,[key]:next}})}
  return <div className="assessment-section__body"><section className="clinical-subsection"><DualLabel as="h3" label="Manual Muscle Testing — MMT 0–5" labelAr="اختبار القوة العضلية اليدوي — 0 إلى 5"/><div className="mmt-grid">{muscles.map((item)=><MmtCard item={item} key={item.key} value={mmt(item.key)} onChange={(next)=>updateMmt(item.key,next)}/>)}</div></section><MultiCheck label="Muscle Length" labelAr="طول العضلات" options={muscleLength} value={value.muscleLength} onChange={(next)=>onChange({...value,muscleLength:next})}/></div>
}
