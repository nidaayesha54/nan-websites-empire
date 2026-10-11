/* AI Logo Style Quiz — picks the best generator + suggested prompt */
(function(){
  const answers = {};
  const Q = ["industry","vibe","colors","style","budget"];

  document.querySelectorAll('.opts').forEach(function(group){
    const key = group.dataset.q;
    group.addEventListener('click', function(e){
      const btn = e.target.closest('.opt');
      if(!btn) return;
      group.querySelectorAll('.opt').forEach(function(o){ o.classList.remove('sel'); });
      btn.classList.add('sel');
      answers[key] = btn.dataset.v;
      document.getElementById('quiz-result').style.display = 'none';
    });
  });

  const RECOMMEND = {
    minimal:      { tool:"Looka", why:"minimal icon-first logos with clean wordmarks are Looka's specialty — it renders refined flat vector-style marks better than most free generators." },
    mascot:       { tool:"Ideogram", why:"mascot logos need a generator that handles characters + text together; Ideogram is the strongest free option for readable text in mascot marks." },
    retro:        { tool:"LogoAI (free preview) or Ideogram", why:"retro badge and emblem styles work well with Ideogram's typography control; use the prompt below for a vintage badge look." },
    abstract:     { tool:"Midjourney or Leonardo AI (free tiers)", why:"abstract geometric marks need strong shape design; Midjourney's free-via-web and Leonardo's free daily credits both nail abstract concepts." },
    luxury:       { tool:"Brandmark or Looka", why:"luxury monograms need restraint and symmetry — Brandmark's monogram engine is built exactly for that." },
    playful:      { tool:"Ideogram", why:"playful illustrated logos pair best with Ideogram's character rendering and clean text." },
    tech:         { tool:"Leonardo AI (free tier)", why:"tech startups want crisp geometric marks; Leonardo's free daily credits generate clean vector-style concepts." },
    handdrawn:    { tool:"Ideogram", why:"hand-drawn line logos need a model that respects sketch aesthetics without garbling — Ideogram handles this best for free." }
  };

  function buildPrompt(){
    const ind = answers.industry || "startup";
    const vibe = answers.vibe || "modern";
    const colors = answers.colors || "purple and gold";
    const style = answers.style || "minimal";

    const styleMap = {
      minimal: "flat minimalist vector logo, simple geometric icon, clean sans-serif wordmark",
      mascot: "cute mascot logo, friendly illustrated character",
      retro: "vintage retro badge logo, emblem style, classic typography",
      abstract: "abstract geometric logo mark, modern shapes",
      luxury: "luxury monogram logo, elegant serif lettermark, gold accents",
      playful: "playful cartoon-style logo, rounded shapes, cheerful",
      tech: "futuristic tech logo, sleek lines, gradient",
      handdrawn: "hand-drawn line art logo, organic sketch style"
    };
    return "Logo design for a " + ind + " brand, " + (styleMap[style] || styleMap.minimal) +
      ", " + vibe + " vibe, color palette: " + colors +
      ", centered on white background, professional branding, no photo, no watermark -- style logo";
  }

  function recommend(){
    const style = answers.style || "minimal";
    const budget = answers.budget || "best";
    const base = RECOMMEND[style] || RECOMMEND.minimal;
    if(budget === "free"){
      return { tool: style === "luxury" || style === "minimal" ? "Canva Logo Maker" : "Ideogram",
               why: "You chose free-only: " + (style === "luxury" || style === "minimal"
                 ? "Canva gives free SVG vector downloads with no watermark — ideal for " + style + " logos."
                 : "Ideogram's free tier has no watermark and the best text rendering for " + style + " logos.") +
                 " Style match: " + base.tool + " would be the paid upgrade." };
    }
    if(budget === "paid"){
      return { tool: style === "luxury" ? "Brandmark ($25 one-time)" : "Looka (from $20 one-time)",
               why: "With a one-time budget, a logo-focused tool beats free image generators: you get vector files, a brand kit and no watermark. Style match for '" + style + "': " + base.why };
    }
    return base;
  }

  document.getElementById('quiz-btn').addEventListener('click', function(){
    const missing = Q.filter(function(k){ return !answers[k]; });
    const box = document.getElementById('quiz-result');
    const msg = document.getElementById('quiz-msg');
    if(missing.length){
      msg.textContent = "Please answer all 5 questions (" + missing.join(", ") + " missing).";
      msg.style.color = "#f87171";
      box.style.display = "block";
      return;
    }
    const rec = recommend();
    const prompt = buildPrompt();
    msg.style.color = "";
    msg.innerHTML =
      "<h3>Recommended generator: " + rec.tool + "</h3>" +
      "<p>" + rec.why + "</p>" +
      "<h3 style='margin-top:16px'>Your starter prompt</h3>" +
      "<div class='prompt-box' id='quiz-prompt'>" + prompt + "</div>" +
      "<button class='btn' id='quiz-copy'>Copy Prompt</button>";
    box.style.display = "block";
    document.getElementById('quiz-copy').addEventListener('click', function(){
      navigator.clipboard.writeText(prompt).then(function(){
        document.getElementById('quiz-copy').textContent = "Copied!";
      });
    });
    box.scrollIntoView({behavior:"smooth"});
  });
})();
