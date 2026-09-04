import { DualLabel } from '../../components/AssessmentControls.jsx'
import { buildNeckConclusion } from '../neckConclusion.js'

function SummaryValue({value}){
  return <DualLabel label={value.en} labelAr={value.ar}/>
}

function SummaryBlock({block}){
  return <section className="neck-conclusion__block">
    <SummaryValue value={block.label}/>
    <div className="neck-conclusion__table-wrap">
      <table>
        <thead><tr>{block.columns.map((column,index)=><th key={index}><SummaryValue value={column}/></th>)}</tr></thead>
        <tbody>{block.rows.map((row,rowIndex)=><tr key={rowIndex}>{row.map((cell,cellIndex)=><td key={cellIndex}><SummaryValue value={cell}/></td>)}</tr>)}</tbody>
      </table>
    </div>
  </section>
}

export default function AssessmentConclusion({assessmentData}){
  const sections=buildNeckConclusion(assessmentData)
  return <details className="neck-conclusion" open>
    <summary><DualLabel label="Assessment Conclusion" labelAr="خلاصة التقييم"/></summary>
    <p className="neck-conclusion__intro">Review the recorded findings from steps 1–11 before completing the clinical reasoning. / راجع النتائج المسجلة من الخطوات 1–11 قبل إكمال الاستدلال السريري.</p>
    <div className="neck-conclusion__sections">{sections.map((item)=><article className="neck-conclusion__section" key={item.number}>
      <header><span>{String(item.number).padStart(2,'0')}</span><SummaryValue value={item.label}/></header>
      {item.blocks.length?<div className="neck-conclusion__blocks">{item.blocks.map((block,index)=><SummaryBlock block={block} key={`${item.number}-${index}`}/>)}</div>:<div className="clinical-empty-inline"><DualLabel label="No findings recorded" labelAr="لم يتم تسجيل نتائج"/></div>}
    </article>)}</div>
  </details>
}
