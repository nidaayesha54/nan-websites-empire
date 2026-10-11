// Currency converter — STATIC approximate 2026 rates, base: USD. ESTIMATES ONLY.
const PER_USD = { USD:1, EUR:0.92, GBP:0.79, PKR:278, INR:83.5, AED:3.6725 };
const SYM = { USD:"$", EUR:"€", GBP:"£", PKR:"₨", INR:"₹", AED:"د.إ " };
const NO_DEC = { PKR:true, INR:true }; // whole-unit display
function fmt(n,cur){
  if(!isFinite(n)) return "—";
  if(NO_DEC[cur]) return Math.round(n).toLocaleString("en-US");
  return n.toLocaleString("en-US",{maximumFractionDigits:2,minimumFractionDigits:2});
}
function convert(){
  const v=parseFloat(document.getElementById("val").value);
  const f=document.getElementById("from").value;
  const t=document.getElementById("to").value;
  const out=document.getElementById("out");
  if(isNaN(v)){ out.textContent="Enter an amount"; return; }
  if(v<0){ out.textContent="Amount cannot be negative"; return; }
  const usd = v / PER_USD[f];
  const res = usd * PER_USD[t];
  out.textContent = SYM[f]+fmt(v,f)+" = "+SYM[t]+fmt(res,t);
}
["val","from","to"].forEach(id=>document.getElementById(id).addEventListener("input",convert));
document.getElementById("swap").addEventListener("click",()=>{
  const f=document.getElementById("from"), t=document.getElementById("to");
  const tmp=f.value; f.value=t.value; t.value=tmp; convert();
});
convert();
