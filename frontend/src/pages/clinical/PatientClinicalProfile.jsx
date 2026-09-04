import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api.js'
import { formatUtcDate } from '../../i18n/formatters.js'
import DashboardLayout from '../dashboards/DashboardLayout.jsx'
import { assessmentDefinition, bodyRegions } from '../../features/clinical-assessments/assessmentRegistry.js'
import { DualLabel } from '../../features/clinical-assessments/components/AssessmentControls.jsx'
import { assignedBodyRegions, selectedMedicalRegions } from './patientAssessmentRegions.js'
import { initialAssessments, sessionReassessmentOptions, unlinkedReassessments } from './sessionReassessments.js'
import '../../features/clinical-assessments/clinicalAssessments.css'

const tabs = ['overview','medical','assessments','sessions','recovery','documents']

function fullName(profile) { return [profile?.first_name,profile?.last_name].filter(Boolean).join(' ') }
function initials(profile) { return `${profile?.first_name?.[0]||''}${profile?.last_name?.[0]||''}`.toUpperCase() }
function age(profile, medical) {
  const supplied=medical?.personal_data?.age
  if(supplied!==undefined&&supplied!=='')return supplied
  const raw=profile?.date_of_birth||medical?.personal_data?.date_of_birth
  if(!raw)return '—'
  const birth=new Date(`${raw}T00:00:00Z`);const now=new Date();let years=now.getUTCFullYear()-birth.getUTCFullYear();if(now.getUTCMonth()<birth.getUTCMonth()||(now.getUTCMonth()===birth.getUTCMonth()&&now.getUTCDate()<birth.getUTCDate()))years-=1;return years
}
function signed(value) { return value===null||value===undefined?'—':`${value>0?'+':''}${value}%` }
function assessmentName(assessment) {
  const names={shoulder:{label:'Shoulder',labelAr:'الكتف'},elbow:{label:'Elbow',labelAr:'المرفق'},cervical:{label:'Neck / Cervical Spine',labelAr:'الرقبة / العمود الفقري العنقي'},lumbar:{label:'Lumbar Spine',labelAr:'العمود الفقري القطني'},wrist:{label:'Wrist',labelAr:'Wrist'}}
  const name=names[assessment.body_region]||{label:assessment.body_region,labelAr:assessment.body_region}
  return {
    label: assessment.parent_assessment_id?`${name.label} Reassessment`:`${name.label} Assessment`,
    labelAr: assessment.parent_assessment_id?`إعادة تقييم ${name.labelAr}`:`تقييم ${name.labelAr}`,
    region: name.label,
  }
}

export default function PatientClinicalProfile() {
  const {patientId}=useParams()
  const navigate=useNavigate()
  const {t,i18n}=useTranslation('clinical')
  const language=i18n.resolvedLanguage||'en'
  const [data,setData]=useState(null)
  const [tab,setTab]=useState('overview')
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState('')
  const [actionBusy,setActionBusy]=useState(false)

  const load=useCallback(async()=>{setLoading(true);setError('');try{const response=await api.get(`/physiotherapist/patients/${patientId}/clinical-profile`);setData(response.data.data)}catch{setError(t('profile.loadError'))}finally{setLoading(false)}},[patientId,t])
  useEffect(()=>{void load()},[load])

  const timeline=useMemo(()=>{
    if(!data)return[]
    const completedNumbers=new Map(data.appointments.filter((item)=>item.status==='completed').sort((left,right)=>new Date(left.starts_at)-new Date(right.starts_at)).map((item,index)=>[item.id,index+1]))
    const appointmentEvents=data.appointments.map((item)=>({id:`appointment-${item.id}`,date:item.starts_at,type:'appointment',status:item.status,title:item.status==='completed'?`Session #${completedNumbers.get(item.id)}`:'Appointment',subtitle:item.treatment_type}))
    const assessmentEvents=initialAssessments(data.assessments).map((item)=>{const name=assessmentName(item);return{id:`assessment-${item.id}`,date:item.assessment_date,type:'assessment',status:item.status,title:`Initial ${name.region} Assessment`,subtitle:item.affected_side?`${item.affected_side} ${item.body_region}`:name.region}})
    return [...appointmentEvents,...assessmentEvents].sort((left,right)=>new Date(left.date)-new Date(right.date))
  },[data])

  async function startAssessment(regionKey){setActionBusy(true);setError('');try{const definition=assessmentDefinition(regionKey);const response=await api.post(`/physiotherapist/patients/${patientId}/assessments`,{body_region:definition.bodyRegion,assessment_type:definition.assessmentType});navigate(definition.route(patientId,response.data.data.id))}catch{setError(t('profile.startError'));setActionBusy(false)}}
  async function reassess(assessmentId,regionKey,appointmentId){setActionBusy(true);setError('');try{const response=await api.post(`/physiotherapist/patients/${patientId}/assessments/${assessmentId}/reassess`,{appointment_id:appointmentId});navigate(assessmentDefinition(regionKey).route(patientId,response.data.data.id))}catch{setError(t('profile.reassessmentError'));setActionBusy(false)}}

  const medicalPath=`/medical-records/patient/${patientId}`
  const assessments=data?.assessments||[]
  const selectedRegions=selectedMedicalRegions(data?.medical_record)

  return <DashboardLayout role={t('profile.role')} title={t('profile.title')} subtitle={t('profile.subtitle')}>
    <main className="clinical-profile-shell">
      <Link className="text-button" to="/physiotherapist/dashboard">← {t('profile.back')}</Link>
      {loading&&<div className="panel clinical-profile-loading" role="status" aria-label={t('profile.loading')}><span/><span/><span/></div>}
      {!loading&&error&&!data&&<section className="panel clinical-error" role="alert"><p>{error}</p><button className="button" type="button" onClick={()=>void load()}>{t('profile.retry')}</button></section>}
      {data&&<>
        <header className="panel clinical-patient-header">
          <div className="clinical-patient-avatar" aria-hidden="true">{initials(data.patient)}</div>
          <div className="clinical-patient-identity"><p className="eyebrow">{t('profile.title')}</p><h2>{fullName(data.patient)}</h2><span>{t('profile.patientId')}: {data.patient.medical_record_number||data.patient.id.slice(0,8).toUpperCase()}</span></div>
          <dl className="clinical-patient-facts"><div><dt>{t('profile.age')}</dt><dd>{age(data.patient,data.medical_record)}</dd></div><div><dt>{t('profile.sex')}</dt><dd>{data.patient.gender||data.medical_record?.personal_data?.sex||'—'}</dd></div><div><dt>{t('profile.phone')}</dt><dd dir="ltr">{data.patient.phone||'—'}</dd></div><div><dt>{t('profile.therapist')}</dt><dd>{fullName(data.primary_therapist?.profiles)||'—'}</dd></div></dl>
          <span className={`clinical-treatment-status ${data.patient.is_active?'is-active':''}`}>{data.patient.is_active?t('profile.active'):t('profile.inactive')}</span>
        </header>

        <section className="clinical-summary-grid" aria-label="Clinical summary"><article className="panel"><span>{t('profile.completed')}</span><strong>{data.appointment_counts.completed}</strong></article><article className="panel"><span>{t('profile.upcoming')}</span><strong>{data.appointment_counts.upcoming}</strong></article><article className="panel"><span>{t('profile.cancelled')}</span><strong>{data.appointment_counts.cancelled}</strong></article><article className="panel clinical-next-summary"><span>{t('profile.next')}</span>{data.next_appointment?<><strong>{formatUtcDate(data.next_appointment.starts_at,language,{month:'short',day:'numeric',year:'numeric'})}</strong><small>{formatUtcDate(data.next_appointment.starts_at,language,{hour:'numeric',minute:'2-digit'})}</small></>:<strong>{t('profile.noNext')}</strong>}</article></section>

        <nav className="clinical-profile-tabs" aria-label={t('profile.title')}>{tabs.map((key)=><button key={key} type="button" className={tab===key?'is-active':''} aria-selected={tab===key} onClick={()=>setTab(key)}>{t(`profile.tabs.${key}`)}</button>)}</nav>

        {error&&<div className="clinical-save-message clinical-save-message--error" role="alert">{error}</div>}
        {tab==='overview'&&<div className="clinical-profile-grid"><RecoverySummary evaluation={data.latest_evaluation} t={t}/><section className="panel treatment-timeline"><DualLabel as="h2" label="Treatment Journey" labelAr="رحلة العلاج"/>{timeline.length?<ol>{timeline.map((event)=><li key={event.id} className={event.status==='completed'?'is-complete':''}><time>{formatUtcDate(event.date,language,{month:'short',day:'numeric'})}</time><div><strong>{event.title}</strong><span>{event.subtitle} · {event.status}</span></div></li>)}</ol>:<p>{t('profile.noEvents')}</p>}</section></div>}
        {tab==='medical'&&<section className="panel clinical-link-panel"><DualLabel as="h2" label="Medical Record" labelAr="الملف الطبي"/><p>{data.medical_record?`${data.medical_record.completion_percent}% · ${data.medical_record.completion_status}`:t('profile.noMedical')}</p><Link className="button" to={medicalPath}>{t('profile.openMedical')}</Link></section>}
        {tab==='documents'&&<section className="panel clinical-link-panel"><DualLabel as="h2" label="Medical Documents" labelAr="المستندات الطبية"/><strong>{data.document_count}</strong><Link className="button" to={medicalPath}>{t('profile.openDocuments')}</Link></section>}
        {tab==='assessments'&&<AssessmentsTab patientId={patientId} assessments={assessments} selectedRegions={selectedRegions} busy={actionBusy} onStart={startAssessment} t={t} language={language}/>}
        {tab==='sessions'&&<SessionsTab patientId={patientId} appointments={data.appointments} assessments={assessments} busy={actionBusy} onReassess={reassess} t={t} language={language}/>}
        {tab==='recovery'&&<RecoverySummary evaluation={data.latest_evaluation} t={t} expanded/>}
      </>}
    </main>
  </DashboardLayout>
}

function RecoverySummary({evaluation,t,expanded=false}){
  return <section className={`panel doctor-recovery-summary ${expanded?'doctor-recovery-summary--expanded':''}`}><DualLabel as="h2" label="Recovery Journey" labelAr="رحلة التعافي"/>{evaluation?<div className="doctor-recovery-metrics"><article><span>{t('profile.performance')}</span><strong>{evaluation.session_performance_score} / 10</strong></article><article><span>{t('profile.pain')}</span><strong>{evaluation.pain_improvement_percent}%</strong></article><article><span>{t('profile.progress')}</span><strong>{signed(evaluation.progress_vs_previous_percent)}</strong></article><article><span>{t('profile.remaining')}</span><strong>{evaluation.estimated_sessions_remaining}</strong></article></div>:<p>{t('profile.recoveryEmpty')}</p>}{evaluation?.progress_note&&expanded&&<blockquote>{evaluation.progress_note}</blockquote>}</section>
}

function AssessmentsTab({patientId,assessments,selectedRegions,busy,onStart,t,language}){
  const initial=initialAssessments(assessments)
  const visibleAssessments=initial.filter((assessment)=>assessment.body_region==='shoulder'||selectedRegions.has(assessment.body_region))
  const assignedRegions=assignedBodyRegions(selectedRegions,bodyRegions)
  return <div className="clinical-assessments-tab"><section className="panel"><DualLabel as="h2" label="Clinical Assessments" labelAr="التقييمات السريرية"/><p>{t('profile.affectedRegion')}</p>{assignedRegions.length?<div className="body-region-registry">{assignedRegions.map((region)=>{const draft=initial.find((item)=>item.body_region===region.key&&item.status==='draft');const latest=initial.find((item)=>item.body_region===region.key&&item.status==='completed');const enabled=region.available;return <article key={region.key} className={`${enabled?'is-available':''} is-suggested`}><DualLabel as="h3" label={region.label} labelAr={region.labelAr}/><span>{enabled?t('profile.available'):t('profile.comingSoon')}</span>{enabled&&latest&&<small>{t('profile.lastAssessment',{date:formatUtcDate(latest.assessment_date,language,{month:'short',day:'numeric',year:'numeric'})})}</small>}{enabled&&<div>{draft?<Link className="button" to={assessmentDefinition(region.key).route(patientId,draft.id)}>{t('profile.continue')}</Link>:latest?<Link className="button" to={assessmentDefinition(region.key).route(patientId,latest.id)}>{t('profile.view')}</Link>:<button className="button" type="button" disabled={busy} onClick={()=>onStart(region.key)}>{t('profile.startRegion',{region:language==='ar'?region.labelAr:region.label})}</button>}</div>}</article>})}</div>:<div className="clinical-empty-inline">{t('profile.regionNotSelected')}</div>}</section><section className="panel assessment-history"><DualLabel as="h2" label="Assessment History" labelAr="سجل التقييمات"/>{visibleAssessments.length?<div>{visibleAssessments.map((assessment)=>{const name=assessmentName(assessment);return <article key={assessment.id}><div><DualLabel as="h3" label={name.label} labelAr={name.labelAr}/><span>{formatUtcDate(assessment.assessment_date,language,{month:'short',day:'numeric',year:'numeric'})} · {assessment.affected_side||'—'}</span></div><span className={`assessment-history__status assessment-history__status--${assessment.status}`}>{assessment.status==='draft'?t('profile.draft'):t('profile.completedStatus')}</span><div><Link className="text-button" to={assessmentDefinition(assessment.body_region).route(patientId,assessment.id)}>{assessment.status==='draft'?t('profile.continue'):t('profile.view')}</Link></div></article>})}</div>:<div className="clinical-empty-inline">{t('profile.noAssessment')}</div>}</section></div>
}

function SessionsTab({patientId,appointments,assessments,busy,onReassess,t,language}){
  const legacy=unlinkedReassessments(assessments)
  const regionLabel=(key)=>{const region=bodyRegions.find((item)=>item.key===key);return language==='ar'?(region?.labelAr||key):(region?.label||key)}
  return <section className="panel clinical-sessions"><DualLabel as="h2" label="Treatment Sessions" labelAr="الجلسات العلاجية"/>{appointments.length?<div>{appointments.map((appointment)=>{const options=sessionReassessmentOptions(assessments,appointment);return <article key={appointment.id}><time>{formatUtcDate(appointment.starts_at,language,{month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'})}</time><div><strong>{appointment.treatment_type}</strong><span>{appointment.status}</span>{options.length>0&&<div className="session-reassessments">{options.map((option)=><div key={option.bodyRegion}><strong>{regionLabel(option.bodyRegion)}</strong>{option.assessment?<Link className="text-button" to={assessmentDefinition(option.bodyRegion).route(patientId,option.assessment.id)}>{option.assessment.status==='draft'?t('profile.continueReassessment'):t('profile.viewReassessment')}</Link>:<button className="text-button" type="button" disabled={busy} onClick={()=>onReassess(option.parent.id,option.bodyRegion,appointment.id)}>{t('profile.startReassessment')}</button>}</div>)}</div>}</div></article>})}</div>:<p>{t('profile.sessionsEmpty')}</p>}{legacy.length>0&&<div className="legacy-reassessments"><h3>{t('profile.legacyReassessments')}</h3>{legacy.map((assessment)=><Link key={assessment.id} className="text-button" to={assessmentDefinition(assessment.body_region).route(patientId,assessment.id)}>{regionLabel(assessment.body_region)} · {t('profile.viewReassessment')}</Link>)}</div>}</section>
}
