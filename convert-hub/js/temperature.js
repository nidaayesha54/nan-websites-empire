// Temperature converter — via Celsius as base
function toC(v,u){
  if(u==="C") return v;
  if(u==="F") return (v-32)*5/9;
  return v-273.15; // K
}
function fromC(c,u){
  if(u==="C") return c;
  if(u==="F") return c*9/5+32;
  return c+273.15; // K
}
const SYM={C:"°C",F:"°F",K:"K"};
const FORMULAS={"C>F":"(°C × 9/5) + 32","F>C":"(°F − 32) × 5/9","C>K":"°C + 273.15","K>C":"K − 273.15","F>K":"((°F − 32) × 5/9) + 273.15","K>F":"((K − 273.15) × 9/5) + 32"};
function fmt(n){
  if(!isFinite(n)) return "—";
  return parseFloat(n.toPrecision(10)).toString();
}
function convert(){
  const v=parseFloat(document.getElementById("val").value);
  const f=document.getElementById("from").value;
  const t=document.getElementById("to").value;
  const out=document.getElementById("out");
  const fh=document.getElementById("formula");
  if(isNaN(v)){ out.textContent="Enter a number"; fh.textContent=""; return; }
  if(f==="K"&&v<0){ out.textContent="Kelvin cannot be negative"; fh.textContent=""; return; }
  const res=fromC(toC(v,f),t);
  if(t==="K"&&res<0){ out.textContent="Result below absolute zero — check input"; fh.textContent=""; return; }
  out.textContent=fmt(v)+" "+SYM[f]+" = "+fmt(res)+" "+SYM[t];
  fh.textContent = f===t ? "Same unit selected." : "Formula: "+(FORMULAS[f+">"+t]||"via Celsius");
}
["val","from","to"].forEach(id=>document.getElementById(id).addEventListener("input",convert));
document.getElementById("swap").addEventListener("click",()=>{
  const f=document.getElementById("from"), t=document.getElementById("to");
  const tmp=f.value; f.value=t.value; t.value=tmp; convert();
});
convert();
