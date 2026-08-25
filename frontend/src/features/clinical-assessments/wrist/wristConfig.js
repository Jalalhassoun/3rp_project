const item=(key,label,labelAr=label)=>({key,label,labelAr})

export const wristSteps=[
  item('inspection','Inspection'),
  item('palpation','Palpation'),
  item('articular','Articular Assessment'),
  item('muscular','Muscular / Tendon Assessment'),
  item('neurological','Neurological Assessment'),
  item('specialTests','Special Tests'),
  item('functional','Functional Assessment'),
  item('outcomeMeasure','Outcome Measures'),
  item('clinicalReasoning','Quick Clinical Reasoning'),
]

export const inspectionFindings=[
  item('posture','Posture'),item('swelling','Swelling / edema'),item('redness','Redness'),item('bruising','Bruising'),
  item('atrophy','Muscle atrophy'),item('deformity','Deformity'),item('scar','Scar'),item('protective_posture','Protective posture'),
  item('thenar_wasting','Thenar wasting'),item('hypothenar_wasting','Hypothenar wasting'),item('finger_posture','Finger posture changes'),
]

export const palpationGroups=[
  {label:'Bony / Joint',labelAr:'Bony / Joint',items:[item('distal_radius','Distal radius'),item('distal_ulna','Distal ulna'),item('scaphoid','Scaphoid'),item('lunate','Lunate'),item('pisiform','Pisiform'),item('tfcc','TFCC / ulnar fovea'),item('carpal_row','Carpal row')]},
  {label:'Tendon / Soft Tissue',labelAr:'Tendon / Soft Tissue',items:[item('fcr','FCR tendon'),item('fcu','FCU tendon'),item('ecrb_l','ECRB / ECRL'),item('ecu','ECU tendon'),item('apl_epb','APL / EPB'),item('flexor_tendons','Flexor tendons'),item('extensor_tendons','Extensor tendons'),item('carpal_tunnel','Carpal tunnel')]},
  {label:'Thumb / Fingers',labelAr:'Thumb / Fingers',items:[item('thumb_cmc','Thumb CMC'),item('thumb_mcp','Thumb MCP'),item('thumb_ip','Thumb IP'),item('mcp_joints','Finger MCP joints'),item('pip_joints','Finger PIP joints'),item('dip_joints','Finger DIP joints'),item('a1_pulley','A1 pulley / trigger point')]},
]

export const palpationFindings=[item('tenderness','Tenderness'),item('thickening','Thickening'),item('warmth','Warmth'),item('crepitus','Crepitus'),item('triggering','Triggering')]
export const wristMovements=[item('flexion','Flexion'),item('extension','Extension'),item('radial_deviation','Radial deviation'),item('ulnar_deviation','Ulnar deviation')]
export const thumbMovements=[item('cmc_flexion','CMC flexion'),item('cmc_extension','CMC extension'),item('abduction','Abduction'),item('opposition','Opposition')]
export const fingerMovements=[item('mcp_flexion','MCP flexion'),item('pip_flexion','PIP flexion'),item('dip_flexion','DIP flexion'),item('finger_extension','Finger extension')]
export const accessoryMobility=[item('radiocarpal','Radiocarpal'),item('midcarpal','Midcarpal'),item('distal_radioulnar','Distal radioulnar'),item('thumb_cmc','Thumb CMC'),item('mcp_glides','Finger MCP glides')]

export const muscles=[item('wrist_flexors','Wrist flexors'),item('wrist_extensors','Wrist extensors'),item('radial_deviators','Radial deviators'),item('ulnar_deviators','Ulnar deviators'),item('thumb_abductors','Thumb abductors'),item('thumb_opposition','Thumb opposition'),item('finger_flexors','Finger flexors'),item('finger_extensors','Finger extensors'),item('interossei','Interossei / lumbricals')]
export const tendonFindings=[item('tendinopathy','Tendinopathy'),item('pain_with_resistance','Pain with resistance'),item('crepitus','Crepitus'),item('triggering','Triggering / locking')]

export const sensoryZones=[item('median','Median nerve'),item('ulnar','Ulnar nerve'),item('radial','Radial nerve')]
export const motorNerves=[
  {key:'median',label:'Median nerve',labelAr:'Median nerve',checks:[item('thumb_opposition','Thumb opposition'),item('pinch','Pinch strength'),item('sensory','Palmar sensory screen')]},
  {key:'ulnar',label:'Ulnar nerve',labelAr:'Ulnar nerve',checks:[item('finger_abduction','Finger abduction'),item('froment_pattern','Adductor pollicis / Froment pattern'),item('sensory','Little finger sensory screen')]},
  {key:'radial',label:'Radial nerve',labelAr:'Radial nerve',checks:[item('wrist_extension','Wrist extension'),item('finger_extension','Finger extension'),item('dorsal_sensory','Dorsal sensory screen')]},
]
export const neurodynamicTests=[item('ultt1_median','ULTT1 Median'),item('ultt2b_radial','ULTT2b Radial'),item('ultt3_ulnar','ULTT3 Ulnar')]

export const wristPathways=[item('carpal_tunnel','Carpal Tunnel'),item('de_quervain','De Quervain'),item('tfcc','TFCC / ulnar-sided wrist pain'),item('scaphoid_radial','Scaphoid / radial-sided wrist'),item('tendinopathy','Wrist Tendinopathy')]
export const wristSpecialTestGroups={
  carpal_tunnel:{label:'Carpal Tunnel',labelAr:'Carpal Tunnel',tests:[item('phalen','Phalen'),item('reverse_phalen','Reverse Phalen'),item('tinel_carpal','Tinel at carpal tunnel'),item('carpal_compression','Carpal compression')]},
  de_quervain:{label:'De Quervain',labelAr:'De Quervain',tests:[item('finkelstein','Finkelstein'),item('eichhoff','Eichhoff'),item('what_test','WHAT test')]},
  tfcc:{label:'TFCC / Ulnar-sided Wrist',labelAr:'TFCC / Ulnar-sided Wrist',tests:[item('tfcc_load','TFCC load'),item('ulnar_fovea','Ulnar fovea sign'),item('press_test','Press test')]},
  scaphoid_radial:{label:'Scaphoid / Radial-sided Wrist',labelAr:'Scaphoid / Radial-sided Wrist',tests:[item('snuffbox','Anatomical snuffbox tenderness'),item('scaphoid_tubercle','Scaphoid tubercle tenderness'),item('scaphoid_compression','Scaphoid compression')]},
  tendinopathy:{label:'Wrist Tendinopathy',labelAr:'Wrist Tendinopathy',tests:[item('resisted_flexion','Resisted wrist flexion'),item('resisted_extension','Resisted wrist extension'),item('resisted_ulnar_dev','Resisted ulnar deviation'),item('resisted_radial_dev','Resisted radial deviation')]},
}
export const thumbSpecialTests=[item('grind_test','Thumb CMC grind'),item('mcp_ulnar_collateral','Thumb MCP UCL stress'),item('finkelstein_thumb','Thumb tendon provocation')]
export const fingerSpecialTests=[item('elson','Elson test'),item('valgus_varus_collateral','Collateral stress'),item('trigger_finger','Trigger finger provocation'),item('central_slip','Central slip screen')]
export const activities=[item('grasp','Grasping'),item('pinch','Pinching'),item('writing','Writing'),item('typing','Typing / mouse'),item('opening_jar','Opening jar'),item('lifting','Lifting'),item('self_care','Self care / dressing'),item('fine_motor','Fine motor tasks')]
export const handTests=[item('full_fist','Full fist'),item('hook_fist','Hook fist'),item('table_top','Table-top / intrinsic plus'),item('opposition','Thumb opposition'),item('coin_pickup','Coin pickup'),item('buttoning','Buttoning / dexterity')]
