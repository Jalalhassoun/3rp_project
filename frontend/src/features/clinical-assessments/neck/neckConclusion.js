import {
  activities,
  cervicalSegments,
  dermatomes,
  dynamicFindings,
  functionalTasks,
  motorTests,
  movements,
  muscleLength,
  muscles,
  myelopathySymptoms,
  myotomes,
  palpationFindings,
  palpationGroups,
  pathways,
  radicularTests,
  reflexes,
  specialGroups,
  staticFindings,
  vascularSymptoms,
} from './neckConfig.js'

const text=(en,ar=en)=>({en:String(en),ar:String(ar)})
const hasValue=(value)=>value!==''&&value!==null&&value!==undefined
const labels=(items)=>new Map(items.map((item)=>[item.key,text(item.label,item.labelAr)]))

const valueLabels=new Map([
  ['arom',text('AROM','AROM')],['prom',text('PROM','PROM')],
  ['true',text('Yes','نعم')],['false',text('No','لا')],
  ['normal',text('Normal','طبيعي')],['abnormal',text('Abnormal','غير طبيعي')],
  ['positive',text('Positive','إيجابي')],['negative',text('Negative','سلبي')],['not_tested',text('Not Tested','لم يُختبر')],
  ['hypoesthesia',text('Hypoesthesia','نقص الحس')],['hyperesthesia',text('Hyperesthesia','فرط الحس')],['paresthesia',text('Paresthesia','تنميل')],['numbness',text('Numbness','خدر')],['dysesthesia',text('Dysesthesia','عسر الحس')],
  ['hypomobile',text('Hypomobile','ناقص الحركة')],['hypermobile',text('Hypermobile','مفرط الحركة')],
  ['stiffness',text('Stiffness','تيبس')],['pain',text('Pain','ألم')],['catching',text('Catching','تعليق')],['compensation',text('Compensation','تعويض')],
  ['firm',text('Firm','متماسك')],['hard',text('Hard','صلب')],['empty',text('Empty','فارغ')],['pain_limited',text('Pain-limited','محدود بالألم')],
  ['reduced',text('Reduced','منخفض')],['unable',text('Unable','غير قادر')],
  ['symmetrical',text('Symmetrical','متناظرة')],['hyporeflexia',text('Hyporeflexia','نقص المنعكسات')],['absent',text('Absent','غائب')],['hyperreflexia',text('Hyperreflexia','فرط المنعكسات')],
  ['none',text('None','لا يوجد')],['mild',text('Mild','خفيف')],['moderate',text('Moderate','متوسط')],['severe',text('Severe','شديد')],
  ['limited',text('Limited','محدود')],['painful',text('Painful','مؤلم')],
])

function displayValue(value,suffix=''){
  if(!hasValue(value))return text('—')
  const mapped=valueLabels.get(String(value))
  return mapped||text(`${value}${suffix}`)
}

function selectedRows(values,items){
  const itemLabels=labels(items)
  return (values||[]).filter((key)=>itemLabels.has(key)).map((key)=>[itemLabels.get(key)])
}

function keyValueRows(values,items){
  const itemLabels=labels(items)
  return Object.entries(values||{}).filter(([,value])=>hasValue(value)).map(([key,value])=>[
    itemLabels.get(key)||text(key),displayValue(value),
  ])
}

const listBlock=(label,labelAr,rows)=>({label:text(label,labelAr),columns:[text('Recorded finding','النتيجة المسجلة')],rows})
const valueBlock=(label,labelAr,rows)=>({label:text(label,labelAr),columns:[text('Item','البند'),text('Recorded value','القيمة المسجلة')],rows})
const tableBlock=(label,labelAr,columns,rows)=>({label:text(label,labelAr),columns,rows})
const section=(number,label,labelAr,blocks)=>({number,label:text(label,labelAr),blocks:blocks.filter((block)=>block.rows.length)})

function inspection(data){
  return section(1,'Inspection','الفحص البصري',[
    listBlock('Static','ثابت',selectedRows(data?.staticFindings,staticFindings)),
    listBlock('Dynamic','حركي',selectedRows(data?.dynamicFindings,dynamicFindings)),
  ])
}

function palpation(data){
  const findingLabels=labels(palpationFindings)
  const blocks=palpationGroups.map((group)=>{
    const itemLabels=labels(group.items)
    const rows=group.items.filter((item)=>data?.locations?.[item.key]).map((item)=>{
      const finding=data.locations[item.key]
      const findings=(finding.findings||[]).map((key)=>findingLabels.get(key)).filter(Boolean)
      return [itemLabels.get(item.key),displayValue(finding.tenderness),findings.length?text(findings.map((entry)=>entry.en).join(', '),findings.map((entry)=>entry.ar).join('، ')):text('—')]
    })
    return tableBlock(group.label,group.labelAr,[text('Structure','البنية'),text('Tenderness 0–3','شدة الإيلام 0–3'),text('Findings','النتائج')],rows)
  })
  return section(2,'Palpation','الجس',blocks)
}

function articular(data){
  const movementLabels=labels(movements)
  const abnormalSegmentalMobility=Object.fromEntries(Object.entries(data?.segmentalMobility||{}).filter(([,value])=>value&&value!=='normal'))
  const motionRows=movements.filter((item)=>{
    const row=data?.movements?.[item.key]
    return row&&['arom','prom','pain','limitation','limitationType'].some((key)=>hasValue(row[key]))
  }).map((item)=>{const row=data.movements[item.key];const type=row.limitation===true?row.limitationType:'';const indication=type==='arom'?text('Muscular problem','مشكلة عضلية'):type==='prom'?text('Articular problem','مشكلة مفصلية'):text('—');return [movementLabels.get(item.key),displayValue(row.arom,'°'),displayValue(row.prom,'°'),displayValue(row.pain),displayValue(row.limitation),displayValue(type),indication]})
  return section(3,'Cervical Articular Assessment','التقييم المفصلي للرقبة',[
    tableBlock('AROM / PROM','مدى الحركة الفعّال / السلبي',[text('Movement','الحركة'),text('AROM°'),text('PROM°'),text('Pain','الألم'),text('Limitation','المحدودية'),text('Limited range','نوع المدى المحدود'),text('Clinical indication','الدلالة السريرية')],motionRows),
    valueBlock('Segmental Mobility','الحركة القطعية',keyValueRows(abnormalSegmentalMobility,cervicalSegments)),
  ])
}

function muscular(data){
  const muscleLabels=labels(muscles)
  const mmtRows=muscles.filter((item)=>{const row=data?.mmt?.[item.key];return row&&(row.pain===true||['right','left'].some((side)=>hasValue(row[side])&&Number(row[side])<5))}).map((item)=>{const row=data.mmt[item.key];return [muscleLabels.get(item.key),displayValue(row.right,'/5'),displayValue(row.left,'/5'),displayValue(row.pain)]})
  return section(4,'Muscular Assessment','التقييم العضلي',[
    tableBlock('MMT','اختبار القوة العضلية',[text('Muscle / Action','العضلة / الحركة'),text('Right','يمين'),text('Left','يسار'),text('Pain','الألم')],mmtRows),
    listBlock('Muscle Length','طول العضلات',selectedRows(data?.muscleLength,muscleLength)),
  ])
}

function neurological(data){
  const dermatomeLabels=labels(dermatomes)
  const abnormalSensory=(value)=>value===true||(typeof value==='string'&&value!==''&&value!=='normal')
  const sensoryFindingItems=Array.from(valueLabels.entries()).filter(([key])=>['hypoesthesia','hyperesthesia','paresthesia','numbness','dysesthesia'].includes(key)).map(([key,value])=>({key,label:value.en,labelAr:value.ar}))
  const sensoryFindingLabels=labels(sensoryFindingItems)
  const sensoryRows=dermatomes.filter((item)=>{const row=data?.sensory?.[item.key];return row&&(abnormalSensory(row.right)||abnormalSensory(row.left)||row.findings?.length)}).map((item)=>{const row=data.sensory[item.key];const findings=(row.findings||[]).map((key)=>sensoryFindingLabels.get(key)).filter(Boolean);return [dermatomeLabels.get(item.key),displayValue(row.right),displayValue(row.left),findings.length?text(findings.map((entry)=>entry.en).join(', '),findings.map((entry)=>entry.ar).join('، ')):text('—')]})
  const myotomeLabels=labels(myotomes)
  const myotomeRows=myotomes.filter((item)=>{const row=data?.myotomes?.[item.key];return row&&['right','left'].some((side)=>hasValue(row[side])&&Number(row[side])<5)}).map((item)=>{const row=data.myotomes[item.key];return [myotomeLabels.get(item.key),displayValue(row.right,'/5'),displayValue(row.left,'/5')]})
  const reflexLabels=labels(reflexes)
  const reflexRows=reflexes.filter((item)=>{const row=data?.reflexes?.[item.key];const comparisons=Array.isArray(row?.comparison)?row.comparison:row?.comparison?[row.comparison]:[];return row&&((hasValue(row.right)&&row.right!=='2+')||(hasValue(row.left)&&row.left!=='2+')||comparisons.some((comparison)=>comparison!=='symmetrical'))}).map((item)=>{const row=data.reflexes[item.key];const comparisons=Array.isArray(row.comparison)?row.comparison:row.comparison?[row.comparison]:[];const comparisonValues=comparisons.map((comparison)=>displayValue(comparison));return [reflexLabels.get(item.key),displayValue(row.right),displayValue(row.left),comparisonValues.length?text(comparisonValues.map((entry)=>entry.en).join(', '),comparisonValues.map((entry)=>entry.ar).join('، ')):text('—')]})
  return section(5,'Neurological Screen','الفحص العصبي',[
    tableBlock('Sensory / Dermatomes','الحس / القطاعات الجلدية',[text('Level / Main area','المستوى / المنطقة'),text('Right','يمين'),text('Left','يسار'),text('Findings','النتائج')],sensoryRows),
    listBlock('Legacy Sensory Findings','النتائج الحسية السابقة',selectedRows(data?.sensoryFindings,sensoryFindingItems)),
    tableBlock('Myotomes','القطاعات العضلية',[text('Root / Movement','الجذر / الحركة'),text('Right /5','يمين /5'),text('Left /5','يسار /5')],myotomeRows),
    tableBlock('Reflexes','المنعكسات',[text('Reflex','المنعكس'),text('Right','يمين'),text('Left','يسار'),text('Comparison','المقارنة')],reflexRows),
    valueBlock('Legacy Reflex Comparison','مقارنة المنعكسات السابقة',hasValue(data?.reflexComparison)&&data.reflexComparison!=='symmetrical'?[[text('Comparison','المقارنة'),displayValue(data.reflexComparison)]]:[]),
  ])
}

function radicular(data){
  const testLabels=labels(radicularTests)
  const rows=radicularTests.filter((item)=>{const row=data?.tests?.[item.key];return row&&Object.values(row).some(hasValue)}).map((item)=>{const row=data.tests[item.key];return [testLabels.get(item.key),displayValue(row.result),displayValue(row.familiarSymptoms),displayValue(row.sensitizerChange),displayValue(row.sideDifference)]})
  return section(6,'Neurodynamic / Radicular Tests','اختبارات الجذور العصبية والديناميكا العصبية',[
    tableBlock('Recorded Tests','الاختبارات المسجلة',[text('Test','الاختبار'),text('Result','النتيجة'),text('Familiar symptoms','الأعراض المألوفة'),text('Sensitizer change','تغير التحسيس'),text('Side difference','الفرق بين الجانبين')],rows),
  ])
}

function umn(data){
  const tests=[
    {key:'hoffmann',label:'Hoffmann',labelAr:'هوفمان'},{key:'babinski',label:'Babinski',labelAr:'بابنسكي'},{key:'clonus',label:'Clonus',labelAr:'الرمع'},
    {key:'gait',label:'Gait assessment',labelAr:'تقييم المشي'},{key:'balance',label:'Balance',labelAr:'التوازن'},{key:'hand_dexterity',label:'Hand dexterity',labelAr:'مهارة اليد'},
  ]
  return section(7,'Upper Motor Neuron Screen','فحص العصبون الحركي العلوي',[
    valueBlock('Recorded Signs','العلامات المسجلة',keyValueRows(data?.tests,tests)),
    listBlock('Myelopathy Symptoms','أعراض اعتلال النخاع',selectedRows(data?.myelopathySymptoms,myelopathySymptoms)),
  ])
}

function vascular(data){
  return section(8,'Vertebrobasilar / Vascular Screen','فحص الدوران الفقري القاعدي والأوعية',[
    listBlock('Selected Symptoms','الأعراض المحددة',selectedRows(data?.symptoms,vascularSymptoms)),
  ])
}

function functional(data){
  return section(9,'Functional Assessment','التقييم الوظيفي',[
    valueBlock('Daily Activities','الأنشطة اليومية',keyValueRows(data?.activities,activities)),
    valueBlock('Functional Cervical Tasks','المهام الوظيفية للرقبة',keyValueRows(data?.tasks,functionalTasks)),
  ])
}

function motorControl(data){
  return section(10,'Functional / Motor Control Tests','اختبارات الوظيفة والتحكم الحركي',[
    valueBlock('Recorded Tests','الاختبارات المسجلة',keyValueRows(data?.tests,motorTests)),
  ])
}

function specialTests(data){
  const blocks=[]
  blocks.push(listBlock('Presentation / Findings','العرض / النتائج',selectedRows(data?.pathways,pathways)))
  for(const group of Object.values(specialGroups)){
    const groupLabels=labels(group.tests)
    const rows=group.tests.filter((item)=>hasValue(data?.tests?.[item.key])).map((item)=>[groupLabels.get(item.key),displayValue(data.tests[item.key])])
    blocks.push(valueBlock(group.label,group.labelAr,rows))
  }
  return section(11,'Special Tests','الاختبارات الخاصة',blocks)
}

export function buildNeckConclusion(data={}){
  return [
    inspection(data.inspection),palpation(data.palpation),articular(data.articular),muscular(data.muscular),neurological(data.neurological),
    radicular(data.radicular),umn(data.umnScreen),vascular(data.vascularScreen),functional(data.functional),motorControl(data.motorControl),specialTests(data.specialTests),
  ]
}
