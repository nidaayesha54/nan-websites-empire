document.getElementById("go").addEventListener("click", function(){
  const name = document.getElementById("cname").value.trim();
  const trait = document.getElementById("trait").value;
  const age = document.getElementById("age").value;
  const energy = document.getElementById("energy").value;
  const key = pickArchetype(trait, age, energy);
  const a = ARCHETYPES[key];
  const lines = sampleLines(key, name || "your character");
  const out = document.getElementById("out");
  out.style.display = "block";
  out.textContent =
    "Recommended voice: " + a.name + "\n" +
    "Profile: " + a.desc + "\n" +
    "TTS preset: pitch " + a.pitch + " · rate " + a.rate + "\n\n" +
    "Sample lines:\n" + lines.map(function(l,i){return (i+1)+". "+l;}).join("\n") + "\n\n" +
    "Try these in the TTS Character Preview tool with pitch " + a.pitch + " and rate " + a.rate + ".";
});
