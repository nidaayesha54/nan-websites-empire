/* Prompt quality checklist: scores 6 elements of an AI video prompt */
(function(){
  const RULES = [
    {key:'subject', label:'Subject', hint:'Name the main subject clearly (who/what is in the scene).',
     re:/(dragon|car|cat|dog|woman|man|girl|boy|astronaut|robot|bird|tree|city|ocean|mountain|house|flower|bird|lion|tiger|bear|baby|chef|dancer|warrior|ship|temple|castle|bridge|balloon|camera|person|character|creature|animal|kid|couple|elder|kid)/i},
    {key:'action', label:'Action / motion', hint:'Describe movement — AI video needs motion verbs (flying, walking, pouring, spinning).',
     re:/(fly|flying|walk|walking|run|running|pour|pouring|spin|spinning|dance|dancing|glid|soar|drift|flow|flowing|fall|falling|rise|rising|swirl|explode|melt|drip|chase|leap|leaping|swim|swimming|drive|driving|bloom|burn|burning|sail|crash|wave|waving)/i},
    {key:'camera', label:'Camera move', hint:'Direct the camera: dolly-in, aerial orbit, tracking shot, slow push-in, crane, handheld…',
     re:/(dolly|camera|shot|aerial|orbit|tracking|push-in|pull-back|crane|pan|tilt|zoom|handheld|close-up|wide shot|overhead|top-down|POV|steadicam|gimbal|drone|macro)/i},
    {key:'lighting', label:'Lighting', hint:'Set the light: golden hour, neon glow, moonlight, soft morning, dramatic storm, volumetric…',
     re:/(light|lighting|sunset|sunrise|golden hour|neon|moonlight|moonlit|dawn|dusk|twilight|backlit|rim light|volumetric|glow|glowing|shadow|spotlight|lantern|candle)/i},
    {key:'style', label:'Style', hint:'Name the visual style: cinematic, photorealistic, anime, cyberpunk, vintage, watercolor…',
     re:/(cinematic|photorealistic|anime|cyberpunk|vintage|watercolor|noir|fantasy|minimalist|documentary|commercial|painterly|claymation|8k|35mm|film)/i},
    {key:'mood', label:'Mood / atmosphere', hint:'Give the feeling: epic, serene, mysterious, joyful, dramatic, nostalgic, eerie…',
     re:/(epic|serene|mysterious|joyful|dramatic|nostalgic|eerie|peaceful|intense|magical|dreamy|moody|romantic|tense|calm|powerful|ethereal|melancholic|vibrant)/i}
  ];
  const ring = document.getElementById('ring'), verdict = document.getElementById('verdict'),
        tip = document.getElementById('tip'), items = document.getElementById('items');

  document.getElementById('check').onclick = () => {
    const text = document.getElementById('prompt').value.trim();
    if (text.length < 10){ verdict.textContent = 'Paste a prompt first (at least a few words).'; return; }
    let score = 0;
    items.innerHTML = '';
    RULES.forEach(r => {
      const pass = r.re.test(text);
      const lenBonus = r.key === 'subject' && text.split(/\s+/).length >= 25;
      if (pass) score += 15;
      if (lenBonus) score += 5;
      const d = document.createElement('div');
      d.className = 'check-item' + (pass ? ' pass' : '');
      const icon = document.createElement('div'); icon.className = 'icon'; icon.textContent = pass ? '✅' : '❌';
      const body = document.createElement('div');
      const h = document.createElement('strong'); h.textContent = r.label;
      const p = document.createElement('p'); p.className = 'section-sub'; p.style.margin = '4px 0 0';
      p.textContent = pass ? 'Detected — nice.' : 'Missing. ' + r.hint;
      body.append(h, p); d.append(icon, body); items.appendChild(d);
    });
    score = Math.min(100, score);
    const words = text.split(/\s+/).length;
    if (words < 15){ score = Math.max(10, score - 20); }
    ring.textContent = score;
    ring.style.borderColor = score >= 80 ? '#0f7b3d' : score >= 50 ? '#b8860b' : '#a33';
    ring.style.color = score >= 80 ? '#4ade80' : score >= 50 ? '#ffcf4d' : '#ff7b7b';
    if (score >= 80){ verdict.textContent = 'Excellent prompt — ready to generate! 🎬'; tip.textContent = 'Strong prompts still benefit from one specific camera move and a mood word.'; }
    else if (score >= 50){ verdict.textContent = 'Decent start — add the missing elements.'; tip.textContent = 'Fix the ❌ items above, then re-check. Aim for 80+.'; }
    else { verdict.textContent = 'Too vague — the AI will guess.'; tip.textContent = 'Add subject + action + camera move at minimum. Try our prompt combiner.'; }
  };
})();
