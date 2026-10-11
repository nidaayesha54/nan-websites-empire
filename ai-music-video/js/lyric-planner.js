/* Lyric Video Planner */
const SECTIONS = {
  "intro":      { name:"Intro",        weight:0.5,  lyric:"No lyrics — typographic title reveal",            motion:"Letters assemble from particles; logo resolve on beat 1", style:"Big condensed title, tracking animation" },
  "verse":      { name:"Verse",        weight:1.0,  lyric:"Full lyrics, line by line",                       motion:"Smooth left-to-right kinetic type, subtle parallax bg", style:"Clean sans-serif, 1–2 lines on screen" },
  "prechorus":  { name:"Pre-Chorus",   weight:0.5,  lyric:"Build tension — words stack tighter",              motion:"Type scales up slightly each bar; bg brightens", style:"Tighter leading, rising baseline" },
  "chorus":     { name:"Chorus",       weight:1.25, lyric:"Hook lyrics BIG — repeat-safe design",             motion:"Punch-in on key words, beat-reactive glow", style:"Bold display font, max contrast" },
  "postchorus": { name:"Post-Chorus",  weight:0.75, lyric:"Ad-libs / vocal chops as fragments",               motion:"Fragmented words orbit the frame", style:"Scattered, playful placement" },
  "bridge":     { name:"Bridge",       weight:0.75, lyric:"Emotional peak — few words, huge presence",        motion:"Slow morph transitions, single word per screen", style:"Serif italic, generous whitespace" },
  "solo":       { name:"Instrumental / Solo", weight:1.0, lyric:"No lyrics — visual interlude",              motion:"Abstract AI visual, camera flies through scene", style:"Instrument name watermark, low opacity" },
  "outro":      { name:"Outro",        weight:0.5,  lyric:"Last line lingers, then credits",                  motion:"Type dissolves into particles; CTA appears", style:"Fade to artist name + follow CTA" }
};
const PRESETS = {
  "pop":       ["intro","verse","prechorus","chorus","verse","prechorus","chorus","bridge","chorus","outro"],
  "ballad":    ["intro","verse","chorus","verse","chorus","bridge","chorus","outro"],
  "edm":       ["intro","verse","chorus","solo","chorus","bridge","chorus","outro"],
  "hiphop":    ["intro","verse","chorus","verse","chorus","verse","chorus","outro"],
  "short":     ["intro","verse","chorus","chorus","outro"]
};
function fmt(s){ s=Math.max(0,Math.round(s)); var m=Math.floor(s/60); var r=s%60; return m+":"+String(r).padStart(2,"0"); }
function planLyrics(){
  var dur = parseFloat(document.getElementById('duration').value) || 210;
  var bpm = parseFloat(document.getElementById('bpm').value) || 100;
  var preset = document.getElementById('structure').value;
  var seq = PRESETS[preset];
  var totalW = seq.reduce(function(a,k){ return a + SECTIONS[k].weight; }, 0);
  var t = 0, rows = "";
  seq.forEach(function(k, i){
    var sec = SECTIONS[k];
    var d = dur * sec.weight / totalW;
    var beats = Math.round(d * bpm / 60);
    var estLines = k==="chorus" ? Math.max(2, Math.round(d/6)) : Math.max(1, Math.round(d/5));
    rows += "<tr><td><strong>" + sec.name + "</strong>" + (i>0 && seq[i-1]===k ? " (2)" : "") + "</td>"
      + "<td>" + fmt(t) + " → " + fmt(t+d) + "</td>"
      + "<td>" + Math.round(d) + "s · ~" + beats + " beats</td>"
      + "<td>" + sec.lyric + " (~" + estLines + " lines)</td>"
      + "<td>" + sec.motion + "</td>"
      + "<td>" + sec.style + "</td></tr>";
    t += d;
  });
  var html = "<h3>🗺️ Timing Plan — " + fmt(dur) + " total @ " + bpm + " BPM</h3>";
  html += "<table class='plan'><tr><th>Section</th><th>Timecode</th><th>Length</th><th>Lyric Sync Segment</th><th>Motion Beat</th><th>Type Style</th></tr>" + rows + "</table>";
  html += "<h3>✅ Lyric-Sync Checklist</h3><ul>"
    + "<li>Place each line's <strong>first word on beat 1</strong> of its bar — viewers forgive drift everywhere else.</li>"
    + "<li>Chorus hook: one design reused every repeat — recognition beats novelty.</li>"
    + "<li>Never more than <strong>2 lines on screen</strong> at once on mobile (85% of views).</li>"
    + "<li>Add a 0.15s scale-punch on stressed syllables in the chorus for rhythm feel.</li>"
    + "<li>Export a <strong>vertical 9:16 master</strong> first, then crop to 16:9 — not the reverse.</li></ul>";
  document.getElementById('planResult').innerHTML = html;
}
document.addEventListener('DOMContentLoaded', function(){
  var btn = document.getElementById('planBtn');
  if (btn) btn.addEventListener('click', planLyrics);
});
