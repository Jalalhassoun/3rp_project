export function createHipAssessmentData(){return {
  inspection:{findings:[],notes:''}, gait:{findings:[],pain:'',notes:''}, palpation:{regions:{},notes:''},
  articular:{movements:{},endFeel:'',movementQuality:'',accessoryMobility:{},notes:''}, mensuration:{rightLegLength:'',leftLegLength:'',difference:'',rightThigh:'',leftThigh:'',rightCalf:'',leftCalf:'',notes:''},
  muscular:{mmt:{},muscleLength:{},pelvicControl:{},notes:''}, neurological:{sensory:{},myotomes:{},reflexes:{},neurodynamic:{},notes:''},
  specialTests:{pathways:[],tests:{},notes:''}, functional:{activities:{},movements:{},walkDistance:'',walkPain:'',runDistance:'',runPain:'',sportDemand:'',sportPain:'',notes:''},
  outcomeMeasure:{hoos:'',lefs:'',psfs:[{activity:'',score:''},{activity:'',score:''},{activity:'',score:''}],notes:''}, redFlags:{findings:[],notes:''},
  clinicalReasoning:{primaryHypothesis:'',differentialDiagnosis:[],supportingFindings:[],againstFindings:[],confirmationTests:[],interpretation:''},
}}
function mergeDefaults(defaults,saved){if(Array.isArray(defaults))return Array.isArray(saved)?saved:defaults;if(!defaults||typeof defaults!=='object')return saved===undefined?defaults:saved;const source=saved&&typeof saved==='object'&&!Array.isArray(saved)?saved:{};return Object.fromEntries(Object.entries({...defaults,...source}).map(([key,value])=>[key,key in defaults?mergeDefaults(defaults[key],source[key]):value]))}
export function mergeHipAssessmentData(saved={}){return mergeDefaults(createHipAssessmentData(),saved)}
