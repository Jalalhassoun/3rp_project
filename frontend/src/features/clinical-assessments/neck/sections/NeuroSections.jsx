import { useState } from 'react'
import { BooleanChoice, ChoiceButtons, DualLabel, MultiCheck, NumberField } from '../../components/AssessmentControls.jsx'
import { dermatomes, myelopathySymptoms, myotomes, radicularTests, reflexes, vascularSymptoms } from '../neckConfig.js'
import { hasNeurologicalConcern, hasVascularConcern } from '../neckData.js'

const sensoryOptions=[{key:'normal',label:'Normal',labelAr:'طبيعي'},{key:'hypoesthesia',label:'Hypoesthesia',labelAr:'نقص الحس'},{key:'hyperesthesia',label:'Hyperesthesia',labelAr:'فرط الحس'},{key:'paresthesia',label:'Paresthesia',labelAr:'تنميل'},{key:'numbness',label:'Numbness',labelAr:'خدر'},{key:'dysesthesia',label:'Dysesthesia',labelAr:'عسر الحس'}]
const reflexOptions=['0','1+','2+','3+','4+'].map((key)=>({key,label:key,labelAr:key}))
const comparisonOptions=[{key:'symmetrical',label:'Symmetrical',labelAr:'متناظرة'},{key:'hyporeflexia',label:'Hyporeflexia',labelAr:'نقص المنعكسات'},{key:'absent',label:'Absent',labelAr:'غائبة'},{key:'hyperreflexia',label:'Hyperreflexia',labelAr:'فرط المنعكسات'}]
const resultOptions=[{key:'positive',label:'Positive',labelAr:'إيجابي'},{key:'negative',label:'Negative',labelAr:'سلبي'},{key:'not_tested',label:'Not Tested',labelAr:'لم يُختبر'}]
const normalOptions=[{key:'normal',label:'Normal',labelAr:'طبيعي'},{key:'abnormal',label:'Abnormal',labelAr:'غير طبيعي'},{key:'not_tested',label:'Not Tested',labelAr:'لم يُختبر'}]

function ComparisonChecks({name,value,onChange}){
  return <fieldset className="clinical-fieldset reflex-card__comparison"><legend><DualLabel label="Comparison" labelAr="المقارنة"/></legend><div className="clinical-check-grid">{comparisonOptions.map((option)=><label className={`clinical-check-card ${value===option.key?'is-selected':''}`} key={option.key}><input type="radio" name={name} checked={value===option.key} onChange={()=>onChange(option.key)}/><DualLabel label={option.label} labelAr={option.labelAr}/></label>)}</div></fieldset>
}

function SafetyAlert({type='neurological',children}){return <div className={`clinical-safety-alert clinical-safety-alert--${type}`} role="alert"><strong>{type==='vascular'?'Potential neurological / vascular concern':'Abnormal neurological findings detected'}</strong><span dir="rtl" lang="ar">{type==='vascular'?'اشتباه عصبي / وعائي محتمل':'تم تسجيل نتائج عصبية غير طبيعية'}</span><p>{children}</p></div>}

function ReflexCard({item,value,onChange}){
  const comparison=Array.isArray(value.comparison)?value.comparison.length===1?value.comparison[0]:'':value.comparison||''
  const current={right:'2+',left:'2+',...value,comparison}
  const hasRecordedValue=['right','left'].some((key)=>value[key]!==''&&value[key]!==null&&value[key]!==undefined)||Boolean(comparison)
  const abnormalSides=current.right!=='2+'||current.left!=='2+'
  const missingComparison=abnormalSides&&!comparison
  const abnormal=abnormalSides||(comparison&&comparison!=='symmetrical')
  const [expanded,setExpanded]=useState(hasRecordedValue)
  function update(field,next){onChange({...current,[field]:next})}

  return <article className={`reflex-card ${missingComparison?'has-validation-error':''}`}><DualLabel as="h4" label={item.label} labelAr={item.labelAr}/><button aria-expanded={expanded} className={`mmt-status-button ${abnormal?'is-abnormal':'is-normal'}`} type="button" onClick={()=>setExpanded((open)=>!open)}><DualLabel label={abnormal?'Abnormal':'Normal'} labelAr={abnormal?'غير طبيعي':'طبيعي'}/></button>{expanded&&<div className="reflex-card__details"><div className="reflex-card__sides"><ChoiceButtons label="Right" labelAr="يمين" options={reflexOptions} value={current.right} allowClear={false} onChange={(next)=>update('right',next)}/><ChoiceButtons label="Left" labelAr="يسار" options={reflexOptions} value={current.left} allowClear={false} onChange={(next)=>update('left',next)}/></div><ComparisonChecks name={`reflex-comparison-${item.key}`} value={current.comparison} onChange={(next)=>update('comparison',next)}/>{missingComparison&&<div className="sensory-card__error" role="alert"><DualLabel label="Select one comparison finding." labelAr="اختر نتيجة مقارنة واحدة."/></div>}</div>}</article>
}

function isAbnormalSensory(value){return value===true||(typeof value==='string'&&value!==''&&value!=='normal')}

function SensoryCard({item,value,onChange}){
  const legacyFindings=['right','left'].map((side)=>value[side]).filter((finding)=>sensoryOptions.some((option)=>option.key===finding&&finding!=='normal'))
  const findings=[...new Set([...(value.findings||[]),...legacyFindings])]
  const hasAbnormalSide=['right','left'].some((side)=>isAbnormalSensory(value[side]))
  const missingFinding=hasAbnormalSide&&findings.length===0
  const abnormal=findings.length>0||hasAbnormalSide
  const [expanded,setExpanded]=useState(abnormal)
  function update(side,next){onChange({...value,[side]:next})}

  return <article className={`sensory-card ${expanded?'is-expanded':''} ${missingFinding?'has-validation-error':''}`}><header className="sensory-card__header"><DualLabel as="h4" label={item.label} labelAr={item.labelAr}/><button aria-expanded={expanded} className={`mmt-status-button ${abnormal?'is-abnormal':'is-normal'}`} type="button" onClick={()=>setExpanded((current)=>!current)}><DualLabel label={abnormal?'Abnormal':'Normal'} labelAr={abnormal?'غير طبيعي':'طبيعي'}/></button></header>{expanded&&<div className="sensory-card__details"><div className="sensory-card__sides">{[['right','Right','يمين'],['left','Left','يسار']].map(([side,label,labelAr])=><label className={`clinical-check-card ${isAbnormalSensory(value[side])?'is-selected':''}`} key={side}><input type="checkbox" checked={isAbnormalSensory(value[side])} onChange={(event)=>update(side,event.target.checked)}/><DualLabel label={label} labelAr={labelAr}/></label>)}</div><MultiCheck label="Abnormal Sensory Findings" labelAr="النتائج الحسية غير الطبيعية" options={sensoryOptions.filter((option)=>option.key!=='normal')} value={findings} onChange={(next)=>onChange({...value,findings:next})}/>{missingFinding&&<div className="sensory-card__error" role="alert"><DualLabel label="Select at least one abnormal sensory finding." labelAr="اختر نتيجة حسية غير طبيعية واحدة على الأقل."/></div>}</div>}</article>
}

function BilateralSensoryChecks({items,values,onChange}){
  function update(item,next){onChange({...values,[item]:next})}
  return <div className="bilateral-grid">{items.map((item)=><SensoryCard item={item} key={item.key} value={values[item.key]||{}} onChange={(next)=>update(item.key,next)}/>)}</div>
}

function MyotomeCard({item,value,onChange}){
  const hasRecordedValue=['right','left'].some((side)=>value[side]!==''&&value[side]!==null&&value[side]!==undefined)
  const abnormal=['right','left'].some((side)=>value[side]!==''&&value[side]!==null&&value[side]!==undefined&&Number(value[side])<5)
  const [expanded,setExpanded]=useState(hasRecordedValue)
  function update(side,next){onChange({...value,[side]:next})}

  return <article className="mmt-card"><DualLabel as="h4" label={item.label} labelAr={item.labelAr}/><button aria-expanded={expanded} className={`mmt-status-button ${abnormal?'is-abnormal':'is-normal'}`} type="button" onClick={()=>setExpanded((current)=>!current)}><DualLabel label={abnormal?'Abnormal':'Normal'} labelAr={abnormal?'غير طبيعي':'طبيعي'}/></button>{expanded&&<div><NumberField label="Right" labelAr="يمين" min="0" max="5" suffix="/5" value={value.right} onChange={(next)=>update('right',next)}/><NumberField label="Left" labelAr="يسار" min="0" max="5" suffix="/5" value={value.left} onChange={(next)=>update('left',next)}/></div>}</article>
}

export function NeurologicalSection({value,onChange,assessmentData}){
  function myotome(key){return value.myotomes[key]||{right:'',left:''}}
  function updateMyotome(key,next){onChange({...value,myotomes:{...value.myotomes,[key]:next}})}
  return <div className="assessment-section__body">{hasNeurologicalConcern(assessmentData)&&<SafetyAlert>Consider medical referral according to clinical protocol. This warning does not establish a diagnosis.</SafetyAlert>}<section className="clinical-subsection"><DualLabel as="h3" label="Sensory / Dermatomes C2–T1" labelAr="الحس / القطاعات الجلدية C2–T1"/><BilateralSensoryChecks items={dermatomes} values={value.sensory} onChange={(sensory)=>onChange({...value,sensory})}/></section><section className="clinical-subsection"><DualLabel as="h3" label="Myotomes — MMT /5" labelAr="القطاعات العضلية — القوة /5"/><div className="mmt-grid">{myotomes.map((item)=><MyotomeCard item={item} key={item.key} value={myotome(item.key)} onChange={(next)=>updateMyotome(item.key,next)}/>)}</div></section><section className="clinical-subsection"><DualLabel as="h3" label="Reflexes" labelAr="المنعكسات"/><div className="bilateral-grid">{reflexes.map((item)=><ReflexCard item={item} key={item.key} value={value.reflexes[item.key]||{}} onChange={(next)=>onChange({...value,reflexes:{...value.reflexes,[item.key]:next}})}/>)}</div></section></div>
}

export function RadicularSection({value,onChange,assessmentData}){
  function finding(key){return value.tests[key]||{result:'',familiarSymptoms:null,sensitizerChange:null,sideDifference:''}}
  function update(key,field,next){onChange({...value,tests:{...value.tests,[key]:{...finding(key),[field]:next}}})}
  return <div className="assessment-section__body">{hasNeurologicalConcern(assessmentData)&&<SafetyAlert>Review the neurological pattern and consider the appropriate referral or cervical radiculopathy pathway.</SafetyAlert>}<p className="clinical-guidance">Document test findings as evidence supporting or opposing a hypothesis. No result confirms a diagnosis automatically. / وثّق النتائج كأدلة داعمة أو غير داعمة للفرضية دون تشخيص آلي.</p><div className="special-test-grid">{radicularTests.map((test)=>{const current=finding(test.key);return <article key={test.key}><DualLabel as="h4" label={test.label} labelAr={test.labelAr}/><ChoiceButtons label="Result" labelAr="النتيجة" value={current.result} options={resultOptions} onChange={(next)=>update(test.key,'result',next)}/><BooleanChoice label="Familiar symptoms reproduced" labelAr="إعادة إنتاج الأعراض المألوفة" value={current.familiarSymptoms} onChange={(next)=>update(test.key,'familiarSymptoms',next)}/><BooleanChoice label="Changed by sensitizing manoeuvre" labelAr="تغيرت مع مناورة التحسيس" value={current.sensitizerChange} onChange={(next)=>update(test.key,'sensitizerChange',next)}/><label className="clinical-text-field"><DualLabel label="Side-to-side difference" labelAr="الفرق بين الجانبين"/><input value={current.sideDifference} onChange={(event)=>update(test.key,'sideDifference',event.target.value)}/></label></article>})}</div></div>
}

export function UmnSection({value,onChange,assessmentData}){
  const tests=[{key:'hoffmann',label:'Hoffmann',labelAr:'هوفمان',options:resultOptions},{key:'babinski',label:'Babinski',labelAr:'بابنسكي',options:resultOptions},{key:'clonus',label:'Clonus',labelAr:'الرمع',options:resultOptions},{key:'gait',label:'Gait assessment',labelAr:'تقييم المشي',options:normalOptions},{key:'balance',label:'Balance',labelAr:'التوازن',options:normalOptions},{key:'hand_dexterity',label:'Hand dexterity',labelAr:'مهارة اليد',options:normalOptions}]
  return <div className="assessment-section__body">{hasNeurologicalConcern(assessmentData)&&<SafetyAlert>Neurological warning — a medical referral pathway should be considered according to clinical protocol. One finding alone is not a diagnosis of myelopathy.</SafetyAlert>}<div className="special-test-grid">{tests.map((test)=><ChoiceButtons key={test.key} label={test.label} labelAr={test.labelAr} options={test.options} value={value.tests[test.key]||''} onChange={(next)=>onChange({...value,tests:{...value.tests,[test.key]:next}})}/>)}</div><MultiCheck label="Myelopathy Symptoms" labelAr="أعراض محتملة مرتبطة بالنخاع" options={myelopathySymptoms} value={value.myelopathySymptoms} onChange={(next)=>onChange({...value,myelopathySymptoms:next})}/></div>
}

export function VascularSection({value,onChange,assessmentData}){
  return <div className="assessment-section__body">{hasVascularConcern(assessmentData)&&<SafetyAlert type="vascular">Do not treat this as a routine musculoskeletal presentation. Clinical review or referral may be required according to protocol.</SafetyAlert>}<MultiCheck label="Vertebrobasilar / Vascular Symptoms" labelAr="أعراض الدوران الفقري القاعدي / الأوعية" options={vascularSymptoms} value={value.symptoms} onChange={(symptoms)=>onChange({...value,symptoms})}/><div className="clinical-guidance clinical-guidance--important">These findings are safety prompts only and must not be used as an automatic vascular diagnosis. / هذه النتائج مؤشرات سلامة فقط ولا تُستخدم كتشخيص وعائي آلي.</div></div>
}
