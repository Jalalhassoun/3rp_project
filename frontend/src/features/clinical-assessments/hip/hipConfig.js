const item=(key,label,labelAr=label)=>({key,label,labelAr})

export const hipSteps=[
  item('inspection','Inspection'),item('gait','Gait Analysis'),item('palpation','Palpation'),item('articular','Articular Assessment — Hip'),
  item('mensuration','Leg Length / Mensuration'),item('muscular','Muscular Assessment / MMT'),item('neurological','Neurological Screen'),
  item('specialTests','Special Tests — Hip & Pelvis'),item('functional','Functional Assessment'),item('outcomeMeasure','Outcome Measures'),
  item('redFlags','Red Flags'),item('clinicalReasoning','Quick Clinical Reasoning'),
]

export const inspectionFindings=[item('posture','Posture / pelvic alignment'),item('swelling','Swelling'),item('bruising','Bruising'),item('atrophy','Muscle atrophy'),item('deformity','Deformity'),item('scar','Scar'),item('protective_posture','Protective posture')]
export const gaitFindings=[item('antalgic','Antalgic gait'),item('trendelenburg','Trendelenburg gait'),item('reduced_stance','Reduced stance time'),item('shortened_stride','Shortened stride'),item('toe_out','Toe-out gait'),item('pelvic_drop','Pelvic drop'),item('assistive_device','Assistive device')]
export const palpationGroups=[
  {label:'Bony / Joint',items:[item('as_is','ASIS'),item('ps_is','PSIS'),item('greater_trochanter','Greater trochanter'),item('hip_joint_line','Hip joint line'),item('si_joint','SI joint'),item('pubic_symphysis','Pubic symphysis')]},
  {label:'Muscle / Tendon',items:[item('gluteus_medius','Gluteus medius'),item('gluteus_minimus','Gluteus minimus'),item('iliopsoas','Iliopsoas'),item('adductors','Adductors'),item('piriformis','Piriformis / deep gluteals'),item('tfl_itb','TFL / IT band'),item('hamstrings','Hamstrings')]},
]
export const hipMovements=[item('flexion','Flexion'),item('extension','Extension'),item('abduction','Abduction'),item('adduction','Adduction'),item('internal_rotation','Internal rotation'),item('external_rotation','External rotation')]
export const accessoryMobility=[item('posterior_glide','Posterior glide'),item('anterior_glide','Anterior glide'),item('inferior_glide','Inferior glide'),item('long_axis_distraction','Long-axis distraction'),item('si_joint_mobility','SI joint mobility')]
export const muscles=[item('hip_flexors','Hip flexors'),item('hip_extensors','Hip extensors'),item('hip_abductors','Hip abductors'),item('hip_adductors','Hip adductors'),item('hip_internal_rotators','Hip internal rotators'),item('hip_external_rotators','Hip external rotators'),item('knee_flexors','Knee flexors'),item('knee_extensors','Knee extensors')]
export const muscleLength=[item('thomas','Hip flexor / Thomas'),item('ely','Rectus femoris / Ely'),item('ninety_ninety','Hamstrings / 90–90'),item('ober','TFL / IT band / Ober'),item('adductors','Adductors'),item('piriformis','Piriformis')]
export const pelvicControl=[item('single_leg_stance','Single leg stance'),item('trendelenburg','Trendelenburg'),item('bridge','Bridge control'),item('step_down','Step-down control'),item('squat','Squat pelvic control')]
export const sensoryZones=[item('l1','L1'),item('l2','L2'),item('l3','L3'),item('l4','L4'),item('l5','L5'),item('s1','S1'),item('s2','S2')]
export const myotomes=[item('l1_2','L1–L2 hip flexion'),item('l3','L3 knee extension'),item('l4','L4 ankle dorsiflexion'),item('l5','L5 great toe extension'),item('s1','S1 plantarflexion')]
export const reflexes=[item('patellar','Patellar (L3–L4)'),item('achilles','Achilles (S1–S2)')]
export const neurodynamicTests=[item('slr','SLR'),item('slump','Slump'),item('femoral_nerve','Femoral nerve stretch')]
export const specialTestGroups={
  hip_general:{label:'Hip Special Tests',tests:[item('faber','FABER / Patrick'),item('fadir','FADIR'),item('scour','Scour / Quadrant'),item('log_roll','Log Roll'),item('stinchfield','Stinchfield')]},
  oa:{label:'Hip Osteoarthritis',tests:[item('hip_oa_cluster','Hip OA clinical cluster'),item('painful_ir','Painful / limited internal rotation')]},
  fai:{label:'Femoroacetabular Impingement — FAI',tests:[item('fadir_fai','FADIR'),item('impingement_quadrant','Impingement quadrant')]},
  labral:{label:'Hip Labral Pathology',tests:[item('scour_labral','Scour'),item('clicking_catching','Clicking / catching'),item('labral_quadrant','Labral quadrant')]},
  gluteal:{label:'Greater Trochanteric Pain / Gluteal Tendinopathy',tests:[item('single_leg_stance','Single Leg Stance'),item('resisted_abduction','Resisted abduction'),item('trochanteric_palpation','Trochanteric palpation')]},
  piriformis:{label:'Piriformis / Deep Gluteal Syndrome',tests:[item('fair','FAIR Test'),item('piriformis_resistance','Resisted piriformis')]},
  si_joint:{label:'SI Joint / Pelvic Pain — Laslett Cluster',tests:[item('distraction','Distraction'),item('thigh_thrust','Thigh Thrust'),item('compression','Compression'),item('sacral_thrust','Sacral Thrust'),item('gaenslen','Gaenslen')]},
  hip_flexor:{label:'Hip Flexor / Iliopsoas',tests:[item('thomas','Thomas Test'),item('resisted_hip_flexion','Resisted hip flexion')]},
  adductor:{label:'Adductor / Groin',tests:[item('adductor_squeeze','Adductor Squeeze'),item('resisted_adduction','Resisted adduction')]},
}
export const specialTestPathways=Object.entries(specialTestGroups).map(([key,group])=>item(key,group.label))
export const functionalActivities=[item('sitting','Sitting'),item('walking','Walking'),item('stairs','Stairs'),item('squat','Squat'),item('running','Running'),item('dressing','Dressing / footwear'),item('transfers','Transfers')]
export const functionalMovements=[item('single_leg_squat','Single leg squat'),item('step_down','Step-down'),item('lunge','Lunge'),item('bridge','Bridge'),item('sit_to_stand','Sit-to-stand')]
