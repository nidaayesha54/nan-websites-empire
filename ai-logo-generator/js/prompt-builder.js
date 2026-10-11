/* AI Logo Prompt Builder — assembles a copy-paste prompt */
(function(){
  function val(id){ return (document.getElementById(id).value || "").trim(); }

  const STYLE_TXT = {
    minimal:"flat minimalist vector logo, simple geometric icon, generous negative space",
    mascot:"friendly mascot logo, illustrated character",
    retro:"vintage retro badge emblem logo, classic typography, distressed texture optional",
    abstract:"abstract geometric logo mark, bold modern shapes",
    luxury:"luxury monogram lettermark, elegant serif, thin gold lines",
    playful:"playful cartoon logo, rounded chunky shapes, cheerful",
    tech:"futuristic tech logo, sleek gradients, sharp lines",
    handdrawn:"hand-drawn line-art logo, organic sketch feel"
  };

  function build(){
    const industry = val('pb-industry') || "tech startup";
    const name = val('pb-name');
    const style = val('pb-style');
    const colors = val('pb-colors') || "deep purple and gold";
    const elements = val('pb-elements');
    const mood = val('pb-mood') || "modern and trustworthy";
    const avoid = val('pb-avoid');

    let p = "Professional logo design for " + (name ? "'" + name + "', a " : "a ") + industry + " brand. " +
      (STYLE_TXT[style] || STYLE_TXT.minimal) + ", " + mood + " mood. " +
      "Color palette: " + colors + ".";
    if(elements) p += " Include: " + elements + ".";
    if(name) p += " Brand name text '" + name + "' integrated cleanly, perfectly spelled, legible typography.";
    p += " Centered composition on a plain white background, crisp edges, balanced, scalable branding mark.";
    if(avoid) p += " Avoid: " + avoid + ".";
    p += " No photograph, no watermark, no stock elements.";
    return p;
  }

  const out = document.getElementById('pb-output');
  const msg = document.getElementById('pb-msg');

  document.getElementById('pb-build').addEventListener('click', function(){
    const p = build();
    out.textContent = p;
    out.style.display = "block";
    msg.textContent = "";
    out.scrollIntoView({behavior:"smooth", block:"nearest"});
  });

  document.getElementById('pb-copy').addEventListener('click', function(){
    if(!out.textContent.trim()){ msg.textContent = "Build a prompt first!"; return; }
    navigator.clipboard.writeText(out.textContent).then(function(){
      msg.textContent = "Copied to clipboard — paste it into Ideogram, Leonardo, or Midjourney.";
    });
  });

  document.getElementById('pb-random').addEventListener('click', function(){
    const ideas = [
      ["coffee shop","Brew & Bean","retro","espresso brown and cream","a steaming coffee cup","cozy and nostalgic","neon colors"],
      ["fitness app","PulseFit","tech","electric blue and black","a heartbeat pulse line","energetic and bold","gradients overload"],
      ["pet grooming","Pawsome","playful","teal and coral","a smiling paw print","fun and friendly","realistic photos"],
      ["law firm","Sterling & Cole","luxury","navy and gold","balanced scales","prestigious and calm","cartoon styles"],
      ["bakery","Crumb Culture","handdrawn","warm orange and brown","a wheat stalk","artisanal and warm","sharp geometric shapes"]
    ];
    const pick = ideas[Math.floor(Math.random()*ideas.length)];
    document.getElementById('pb-industry').value = pick[0];
    document.getElementById('pb-name').value = pick[1];
    document.getElementById('pb-style').value = pick[2];
    document.getElementById('pb-colors').value = pick[3];
    document.getElementById('pb-elements').value = pick[4];
    document.getElementById('pb-mood').value = pick[5];
    document.getElementById('pb-avoid').value = pick[6];
  });
})();
