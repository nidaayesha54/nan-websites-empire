// Time converter — base unit: seconds
const TO_S = { s:1, min:60, h:3600, d:86400, w:604800 };
const NAMES = { s:"seconds", min:"minutes", h:"hours", d:"days", w:"weeks" };
function fmt(n){
  if(!isFinite(n)) return "—";
  const a = Math.abs(n);
  if(a!==0 && (a>=1e12 || a<1e-9)) return n.toExponential(6);
  return parseFloat(n.toPrecision(10)).toString();
}
function convert(){
  const v = parseFloat(document.getElementById("val").value);
  const f = document.getElementById("from").value;
  const t = document.getElementById("to").value;
  const out = document.getElementById("out");
  if(isNaN(v)){ out.textContent = "Enter a number"; return; }
  const secs = v * TO_S[f];
  const res = secs / TO_S[t];
  out.textContent = fmt(v) + " " + NAMES[f] + " = " + fmt(res) + " " + NAMES[t];
}
["val","from","to"].forEach(id=>document.getElementById(id).addEventListener("input",convert));
document.getElementById("swap").addEventListener("click",()=>{
  const f=document.getElementById("from"), t=document.getElementById("to");
  const tmp=f.value; f.value=t.value; t.value=tmp; convert();
});
convert();
