// Weight converter — base unit: grams (exact international factors)
const TO_G = { mg:0.001, g:1, kg:1000, t:1000000, oz:28.349523125, lb:453.59237 };
const NAMES = { mg:"mg", g:"g", kg:"kg", t:"t", oz:"oz", lb:"lb" };
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
  const grams = v * TO_G[f];
  const res = grams / TO_G[t];
  out.textContent = fmt(v) + " " + NAMES[f] + " = " + fmt(res) + " " + NAMES[t];
}
["val","from","to"].forEach(id=>document.getElementById(id).addEventListener("input",convert));
document.getElementById("swap").addEventListener("click",()=>{
  const f=document.getElementById("from"), t=document.getElementById("to");
  const tmp=f.value; f.value=t.value; t.value=tmp; convert();
});
convert();
