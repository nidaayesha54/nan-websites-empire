/* Prompt combiner: style + subject + camera move + lighting -> custom prompt */
(function(){
  const STYLES = {
    "Cinematic film": "cinematic film look, 35mm grain, dramatic color grade",
    "Photorealistic": "ultra-photorealistic, 8k detail, natural colors",
    "Anime": "vibrant anime style, cel shading, dynamic lines",
    "Cyberpunk": "cyberpunk neon aesthetic, rain-slicked reflections, electric glow",
    "Vintage 70s": "vintage 1970s film look, warm faded colors, soft grain",
    "Watercolor dream": "dreamy watercolor painting style, soft washes of color",
    "Claymation": "charming claymation stop-motion style, handcrafted texture",
    "Noir B&W": "film-noir black and white, deep shadows, stark contrast",
    "Fantasy epic": "epic fantasy art style, painterly detail, magical atmosphere",
    "Minimalist": "clean minimalist aesthetic, soft light, simple composition"
  };
  const SUBJECTS = {
    "Dragon in a city": "a majestic dragon gliding between skyscrapers",
    "Ocean wave": "a towering ocean wave curling in perfect form",
    "Busy market": "a bustling street market full of life and color",
    "Astronaut": "a lone astronaut drifting above Earth",
    "Ancient temple": "an ancient stone temple in morning mist",
    "Sports car": "a sleek sports car on a coastal highway",
    "Cat explorer": "a curious cat exploring a sunlit garden",
    "Desert caravan": "a camel caravan crossing golden dunes",
    "Neon street": "a rain-soaked neon street at night",
    "Hot air balloons": "colorful hot air balloons over a valley at dawn"
  };
  const CAMERAS = {
    "Slow dolly-in": "slow dolly-in toward the subject",
    "Aerial orbit": "smooth aerial orbit circling the scene",
    "Handheld follow": "dynamic handheld follow shot",
    "Crane pull-back": "slow crane pull-back revealing the wider scene",
    "360 spin": "dramatic 360-degree camera spin",
    "Low tracking": "low tracking shot gliding alongside",
    "Top-down": "top-down bird's-eye view descending",
    "POV glide": "first-person POV gliding through the scene"
  };
  const LIGHTS = {
    "Golden hour": "warm golden hour sunlight, long soft shadows",
    "Neon night": "vibrant neon glow against deep night blues",
    "Soft morning": "soft diffused morning light, gentle and fresh",
    "Dramatic storm": "dramatic storm lighting, dark clouds with light breaks",
    "Moonlit": "cool moonlight with deep blue shadows",
    "Candlelit warm": "warm flickering candlelight, intimate glow"
  };
  const style = document.getElementById('style'), subject = document.getElementById('subject'),
        camera = document.getElementById('camera'), lighting = document.getElementById('lighting'),
        output = document.getElementById('output'), copy = document.getElementById('copy');

  function fill(sel, obj){
    Object.keys(obj).forEach(k => {
      const o = document.createElement('option'); o.value = k; o.textContent = k; sel.appendChild(o);
    });
  }
  fill(style, STYLES); fill(subject, SUBJECTS); fill(camera, CAMERAS); fill(lighting, LIGHTS);

  function pick(sel){ sel.selectedIndex = Math.floor(Math.random() * sel.options.length); }

  function generate(){
    const text = SUBJECTS[subject.value] + ', ' + CAMERAS[camera.value] + ', ' +
                 LIGHTS[lighting.value] + ', ' + STYLES[style.value] +
                 '. Rich detail, smooth motion, high quality, no text, no watermark.';
    output.innerHTML = '';
    const p = document.createElement('p'); p.textContent = text;
    output.appendChild(p);
    copy.style.display = 'inline-block';
    copy.dataset.text = text;
  }
  document.getElementById('gen').onclick = generate;
  document.getElementById('random').onclick = () => { pick(style); pick(subject); pick(camera); pick(lighting); generate(); };
  copy.onclick = () => {
    navigator.clipboard.writeText(copy.dataset.text).then(() => {
      copy.textContent = 'Copied ✓'; copy.classList.add('ok');
      setTimeout(() => { copy.textContent = 'Copy prompt'; copy.classList.remove('ok'); }, 1600);
    });
  };
})();
