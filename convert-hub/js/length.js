// Length converter — base unit: meters (exact international factors)
const TO_M = { mm:0.001, cm:0.01, m:1, km:1000, in:0.0254, ft:0.3048, yd:0.9144, mi:1609.344 };
const NAMES = { mm:"mm", cm:"cm", m:"m", km:"km", in:"in", ft:"ft", yd:"yd", mi:"mi" };
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
  const meters = v * TO_M[f];
  const res = meters / TO_M[t];
  out.textContent = fmt(v) + " " + NAMES[f] + " = " + fmt(res) + " " + NAMES[t];
}
["val","from","to"].forEach(id=>document.getElementById(id).addEventListener("input",convert));
document.getElementById("swap").addEventListener("click",()=>{
  const f=document.getElementById("from"), t=document.getElementById("to");
  const tmp=f.value; f.value=t.value; t.value=tmp; convert();
});
convert();
