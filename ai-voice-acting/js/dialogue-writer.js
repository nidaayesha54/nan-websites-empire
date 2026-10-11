function buildScript(){
  const scene = document.getElementById("scene").value.trim();
  const raw = document.getElementById("dlg").value.trim();
  const out = document.getElementById("out");
  if(!raw){ out.style.display="block"; out.textContent="Add at least one dialogue line first."; return ""; }
  let s = "=== DIALOGUE SCRIPT ===\n";
  if(scene) s += "SCENE: " + scene + "\n";
  s += "------------------------------\n\n";
  const counts = {};
  raw.split("\n").forEach(function(line, idx){
    line = line.trim();
    if(!line) return;
    const m = line.match(/^([^:]+):\s*(.+)$/);
    let speaker, text;
    if(m){ speaker = m[1].trim(); text = m[2].trim(); }
    else { speaker = "SPEAKER " + (idx+1); text = line; }
    let emo = "neutral";
    const em = text.match(/\[([^\]]+)\]\s*$/);
    if(em){ emo = em[1].trim(); text = text.replace(/\s*\[[^\]]+\]\s*$/, "").trim(); }
    counts[speaker] = (counts[speaker] || 0) + 1;
    s += speaker.toUpperCase() + "  (emotion: " + emo + ")\n";
    s += '    "' + text + '"\n\n';
  });
  s += "------------------------------\nLINE COUNTS:\n";
  Object.keys(counts).forEach(function(k){ s += k + ": " + counts[k] + "\n"; });
  out.style.display = "block";
  out.textContent = s;
  return s;
}
document.getElementById("go").addEventListener("click", buildScript);
document.getElementById("copy").addEventListener("click", function(){
  const s = buildScript();
  if(!s) return;
  navigator.clipboard.writeText(s).then(function(){ alert("Script copied!"); });
});
