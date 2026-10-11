/* Career path ROI — 2026 salary estimates modeled on BLS May 2024 medians,
   adjusted upward. Program costs are national averages. */
const PATHS=[
  {name:"CNA",cost:1500,years:0.12,salary:38200,label:"Certified Nursing Assistant"},
  {name:"LPN / LVN",cost:15000,years:1,salary:59730,label:"Licensed Practical Nurse"},
  {name:"ADN → RN",cost:20000,years:2,salary:101000,label:"Associate Degree RN"},
  {name:"BSN → RN",cost:45000,years:4,salary:104000,label:"Bachelor's Degree RN"},
  {name:"MSN → NP",cost:105000,years:6.5,salary:132000,label:"Nurse Practitioner (MSN)"},
  {name:"DNP → CRNA",cost:150000,years:9,salary:248000,label:"Certified Nurse Anesthetist"}
];

document.addEventListener("DOMContentLoaded",()=>{
  const sel=document.getElementById("path");
  PATHS.forEach((p,i)=>{const o=document.createElement("option");o.value=i;o.textContent=p.label;sel.appendChild(o);});
  sel.value=3;

  document.getElementById("calc").addEventListener("submit",e=>{
    e.preventDefault();
    const p=PATHS[parseInt(sel.value,10)];
    const horizon=parseFloat(document.getElementById("horizon").value)||10;
    const workYears=Math.max(0,horizon-p.years);
    const gross=p.salary*workYears;
    const net=gross-p.cost;
    const vsCNA=net-(PATHS[0].salary*horizon-PATHS[0].cost);
    const payback=p.cost/p.salary; // years of salary to cover cost (simple)

    let rows=PATHS.map(q=>{
      const wy=Math.max(0,horizon-q.years);
      const n=q.salary*wy-q.cost;
      const hl=q.name===p.name?" style='background:#e6f5f4'":"";
      return "<tr"+hl+"><td>"+q.name+"</td><td>"+q.years+" yr</td><td>"+fmtUSD(q.cost)+
             "</td><td>"+fmtUSD(q.salary)+"</td><td><strong>"+fmtUSD(n)+"</strong></td></tr>";
    }).join("");

    document.getElementById("out").innerHTML=
      "<h3>"+p.label+" — "+horizon+"-year outlook</h3>"+
      '<div class="big">'+fmtUSD(net)+"</div><p>net earnings after education cost</p>"+
      "<table><tr><th>Path</th><th>School</th><th>Cost</th><th>Salary</th><th>"+horizon+"-yr net</th></tr>"+rows+"</table>"+
      "<p style='margin-top:12px'>Tuition pays for itself in about <strong>"+payback.toFixed(1)+
      " working years</strong> of salary. Compared with staying a CNA, this path nets <strong>"+
      fmtUSD(vsCNA)+"</strong> more over "+horizon+" years.</p>";
    document.getElementById("out").classList.add("show");
  });
});
