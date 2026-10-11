document.addEventListener("DOMContentLoaded",()=>{
  const stateSel=document.getElementById("state");
  const specSel=document.getElementById("specialty");
  const expSel=document.getElementById("experience");
  const eduSel=document.getElementById("education");

  Object.keys(NURSE_DATA.states).sort().forEach(s=>{
    const o=document.createElement("option");o.value=s;o.textContent=s;stateSel.appendChild(o);
  });
  Object.keys(NURSE_DATA.specialties).forEach(s=>{
    const o=document.createElement("option");o.value=s;o.textContent=s;specSel.appendChild(o);
  });
  Object.keys(NURSE_DATA.experience).forEach(s=>{
    const o=document.createElement("option");o.value=s;o.textContent=s;expSel.appendChild(o);
  });
  Object.keys(NURSE_DATA.education).forEach(s=>{
    const o=document.createElement("option");o.value=s;o.textContent=s;eduSel.appendChild(o);
  });
  stateSel.value="California";eduSel.value="BSN";

  document.getElementById("calc").addEventListener("submit",e=>{
    e.preventDefault();
    const stateWage=NURSE_DATA.states[stateSel.value];
    const spec=NURSE_DATA.specialties[specSel.value];
    const exp=NURSE_DATA.experience[expSel.value];
    const edu=NURSE_DATA.education[eduSel.value];
    const annual=stateWage*spec*exp*edu;
    const hourly=annual/2080;
    const monthly=annual/12;
    const vsNational=annual/NURSE_DATA.baseRN;
    document.getElementById("out").innerHTML=
      "<h3>Your estimated RN salary</h3>"+
      '<div class="big">'+fmtUSD(annual)+"/yr</div>"+
      "<p><strong>"+fmtUSD(hourly)+"</strong>/hour · <strong>"+fmtUSD(monthly)+"</strong>/month</p>"+
      "<p>"+(vsNational>=1?"▲ ":"▼ ")+Math.abs(Math.round((vsNational-1)*100))+"% vs the national RN average ("+fmtUSD(NURSE_DATA.baseRN)+")</p>"+
      "<table><tr><th>Factor</th><th>Your selection</th></tr>"+
      "<tr><td>State ("+stateSel.value+")</td><td>"+fmtUSD(stateWage)+"</td></tr>"+
      "<tr><td>Specialty ("+specSel.value+")</td><td>×"+spec.toFixed(2)+"</td></tr>"+
      "<tr><td>Experience ("+expSel.value+")</td><td>×"+exp.toFixed(2)+"</td></tr>"+
      "<tr><td>Education ("+eduSel.value+")</td><td>×"+edu.toFixed(2)+"</td></tr></table>";
    document.getElementById("out").classList.add("show");
  });
});
