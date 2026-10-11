// Shared voice archetype definitions used across tools.
const ARCHETYPES = {
  hero:    {name:"Hero", pitch:1.0, rate:1.0, desc:"Confident, warm mid-range voice with strong projection.", sample:"I will not let this city fall — not while I still stand."},
  villain: {name:"Villain", pitch:0.7, rate:0.85, desc:"Low, slow, menacing tone with controlled menace.", sample:"You really thought you could defy me? How... amusing."},
  comic:   {name:"Comic Sidekick", pitch:1.5, rate:1.15, desc:"Bright, bouncy, fast-talking energy that lifts every scene.", sample:"Wait wait wait — did that dragon just wink at me? Tell me you saw that!"},
  mentor:  {name:"Wise Mentor", pitch:0.8, rate:0.8, desc:"Calm, deep, measured voice that carries authority and warmth.", sample:"The path you fear is the path you must walk, child."},
  child:   {name:"Child", pitch:1.7, rate:1.05, desc:"High, innocent, wide-eyed wonder.", sample:"Wow! Are we really going to the moon? Can I bring my teddy?"},
  narrator:{name:"Narrator", pitch:0.95, rate:0.95, desc:"Neutral, clear, cinematic storytelling voice.", sample:"Long ago, in a kingdom forgotten by time, a legend began."},
  robot:   {name:"Robot / AI", pitch:0.6, rate:1.0, desc:"Flat, mechanical cadence — slightly clipped and precise.", sample:"Threat. Level. Assessed. Initiating. Protocol. Seven."},
  monster: {name:"Monster", pitch:0.4, rate:0.7, desc:"Guttural, heavy, growling low register.", sample:"You should not have come to my cave, little one."}
};

function archetypeList(){ return Object.keys(ARCHETYPES); }

function pickArchetype(trait, age, energy){
  // Simple deterministic recommendation engine.
  if(trait === "villain") return "villain";
  if(trait === "comic") return "comic";
  if(trait === "mentor") return "mentor";
  if(age === "child") return "child";
  if(age === "robot") return "robot";
  if(age === "monster") return "monster";
  if(trait === "hero"){
    if(energy === "calm") return "mentor";
    return "hero";
  }
  if(energy === "wild") return "comic";
  if(energy === "calm") return "narrator";
  return "hero";
}

function sampleLines(key, characterName){
  const base = ARCHETYPES[key].sample;
  return [
    base,
    "Line 2 — [emotional beat]: \"" + base + "\"",
    "Call-out — \"" + (characterName || "Hero") + " answers the call.\""
  ];
}
