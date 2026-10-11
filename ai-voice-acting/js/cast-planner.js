const KEY = "aivoiceacting_cast";
let cast = [];
try { cast = JSON.parse(localStorage.getItem(KEY)) || []; } catch(e){ cast = []; }

const sel = document.getElementById("ctype");
archetypeList().forEach(function(k){
  const o = document.createElement("option");
  o.value = k; o.textContent = ARCHETYPES[k].name;
  sel.appendChild(o);
});

function save(){ try{ localStorage.setItem(KEY, JSON.stringify(cast)); }catch(e){} }
function render(){
  const rows = document.getElementById("rows");
  const tbl = document.getElementById("tbl");
  const empty = document.getElementById("empty");
  rows.innerHTML = "";
  let total = 0;
  cast.forEach(function(c, i){
    total += c.lines;
    const tr = document.createElement("tr");
    const tdName = document.createElement("td"); tdName.textContent = c.name;
    const tdType = document.createElement("td"); tdType.textContent = c.type;
    const tdLines = document.createElement("td"); tdLines.textContent = c.lines;
    const tdDel = document.createElement("td");
    const btn = document.createElement("button");
    btn.textContent = "✕"; btn.style.marginTop = "0"; btn.style.padding = "4px 10px";
    btn.addEventListener("click", function(){ cast.splice(i,1); save(); render(); });
    tdDel.appendChild(btn);
    [tdName,tdType,tdLines,tdDel].forEach(function(td){ tr.appendChild(td); });
    rows.appendChild(tr);
  });
  document.getElementById("tChars").textContent = cast.length;
  document.getElementById("tLines").textContent = total;
  const has = cast.length > 0;
  tbl.style.display = has ? "" : "none";
  empty.style.display = has ? "none" : "block";
}
document.getElementById("add").addEventListener("click", function(){
  const name = document.getElementById("cname").value.trim();
  if(!name){ alert("Enter a character name."); return; }
  const lines = parseInt(document.getElementById("clines").value, 10) || 0;
  cast.push({name: name, type: ARCHETYPES[sel.value].name, lines: lines});
  document.getElementById("cname").value = "";
  document.getElementById("clines").value = "0";
  save(); render();
});
document.getElementById("clear").addEventListener("click", function(){
  if(confirm("Clear the whole cast?")){ cast = []; save(); render(); }
});
render();
