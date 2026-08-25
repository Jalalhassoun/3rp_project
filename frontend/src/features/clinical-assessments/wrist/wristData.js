export function createWristAssessmentData(){return{
  inspection:{staticFindings:[],notes:''},
  palpation:{regions:{},notes:''},
  articular:{wrist:{movements:{},endFeel:'',accessoryMobility:{},notes:''},thumb:{movements:{},notes:''},fingers:{movements:{},notes:''}},
  muscular:{mmt:{},tendonFindings:[],grip:{},pinch:{key:{},tripod:{},tip:{}},notes:''},
  neurological:{sensory:{},motor:{},neurodynamic:{},notes:''},
  specialTests:{pathways:[],tests:{},thumbTests:{},fingerTests:{},notes:''},
  functional:{activities:{},handTests:{},workDemand:'',workPain:'',sportDemand:'',sportPain:'',notes:''},
  outcomeMeasure:{quickdash:'',prwe:'',psfs:[{activity:'',score:''},{activity:'',score:''},{activity:'',score:''}],notes:''},
  clinicalReasoning:{primaryHypothesis:'',differentialDiagnosis:[],supportingFindings:[],againstFindings:[],confirmationTests:[],interpretation:''},
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
export function mergeWristAssessmentData(saved={}){return mergeDefaults(createWristAssessmentData(),saved)}
