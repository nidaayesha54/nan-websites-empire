(function(){
  const synth = window.speechSynthesis;
  const warn = document.getElementById("warn");
  if(!("speechSynthesis" in window)){
    warn.style.display = "block";
    warn.textContent = "Your browser does not support the Web Speech API. Try Chrome or Edge on desktop.";
    return;
  }
  const archSel = document.getElementById("arch");
  archetypeList().forEach(function(k){
    const o = document.createElement("option");
    o.value = k; o.textContent = ARCHETYPES[k].name;
    archSel.appendChild(o);
  });
  const voiceSel = document.getElementById("voice");
  function loadVoices(){
    voiceSel.innerHTML = "";
    const vs = synth.getVoices().filter(function(v){ return v.lang.indexOf("en") === 0; });
    (vs.length ? vs : synth.getVoices()).forEach(function(v){
      const o = document.createElement("option");
      o.value = v.name; o.textContent = v.name + " (" + v.lang + ")";
      voiceSel.appendChild(o);
    });
  }
  loadVoices();
  if(synth.onvoiceschanged !== undefined) synth.onvoiceschanged = loadVoices;

  const pitch = document.getElementById("pitch");
  const rate = document.getElementById("rate");
  function applyPreset(){
    const a = ARCHETYPES[archSel.value];
    pitch.value = a.pitch; rate.value = a.rate;
    document.getElementById("pitchVal").textContent = a.pitch;
    document.getElementById("rateVal").textContent = a.rate;
  }
  archSel.addEventListener("change", applyPreset);
  applyPreset();
  pitch.addEventListener("input", function(){ document.getElementById("pitchVal").textContent = pitch.value; });
  rate.addEventListener("input", function(){ document.getElementById("rateVal").textContent = rate.value; });

  document.getElementById("speak").addEventListener("click", function(){
    const text = document.getElementById("line").value.trim();
    if(!text){ warn.style.display="block"; warn.textContent="Type a dialogue line first."; return; }
    warn.style.display = "none";
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const name = voiceSel.value;
    const v = synth.getVoices().filter(function(x){ return x.name === name; })[0];
    if(v) u.voice = v;
    u.pitch = parseFloat(pitch.value);
    u.rate = parseFloat(rate.value);
    synth.speak(u);
  });
  document.getElementById("stop").addEventListener("click", function(){ synth.cancel(); });
})();
