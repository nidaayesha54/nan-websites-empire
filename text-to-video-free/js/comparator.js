// Free text-to-video tool comparison data (rendered into the table)
(function () {
  var TOOLS = [
    {name:"Pika", free:"~150 credits/month (free tier)", wm:"Yes", len:"~3–5 sec (up to 10s)", res:"720p", comm:"No — personal use only", best:"Stylized, artistic clips"},
    {name:"Runway (Gen-3/4)", free:"Limited one-time credits", wm:"Yes", len:"~5–10 sec", res:"720p–1080p", comm:"No on free tier", best:"Cinematic realism"},
    {name:"Luma Dream Machine", free:"~30 generations/month", wm:"Yes", len:"~5 sec", res:"720p", comm:"No — personal use only", best:"Smooth, natural motion"},
    {name:"Hailuo / MiniMax", free:"Daily free credits", wm:"Yes (removable on paid)", len:"~6 sec", res:"720p", comm:"No on free tier", best:"Character & dialogue scenes"},
    {name:"Kling", free:"Daily free credits", wm:"Yes", len:"~5–10 sec", res:"720p", comm:"No on free tier", best:"Realistic human motion"},
    {name:"PixVerse", free:"Daily free credits", wm:"Yes", len:"~5–8 sec", res:"720p", comm:"No on free tier", best:"Anime & effects templates"},
    {name:"Vidu", free:"Limited monthly credits", wm:"Yes", len:"~4–8 sec", res:"720p", comm:"No on free tier", best:"Reference-to-video"},
    {name:"Sora (via ChatGPT)", free:"Not free — requires paid plan", wm:"No (paid)", len:"Up to 60 sec", res:"1080p", comm:"Yes on paid plans", best:"Top realism, long clips"},
    {name:"Veo (via Gemini/Flow)", free:"Very limited trial credits", wm:"No (paid/trial)", len:"~8 sec", res:"1080p", comm:"Per Google terms", best:"Photoreal quality"},
    {name:"CapCut AI Video", free:"Generous free tier", wm:"No (export clean on free)", len:"~5–10 sec", res:"720p–1080p", comm:"Yes — check current terms", best:"Social clips, TikTok/Reels"},
    {name:"InVideo AI", free:"Limited weekly exports", wm:"Yes", len:"Varies by template", res:"720p", comm:"No on free tier", best:"Faceless YouTube videos"},
    {name:"Canva Magic Media", free:"Limited lifetime credits", wm:"No", len:"~4 sec", res:"720p", comm:"Yes — Canva license", best:"Quick social graphics video"}
  ];

  var tbody = document.querySelector('#cmp tbody');
  TOOLS.forEach(function (t) {
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td><strong>' + t.name + '</strong></td>' +
      '<td>' + t.free + '</td>' +
      '<td>' + (t.wm.indexOf('Yes') === 0 ? '<span class="n">Yes</span>' : '<span class="y">' + t.wm + '</span>') + '</td>' +
      '<td>' + t.len + '</td>' +
      '<td>' + t.res + '</td>' +
      '<td>' + t.comm + '</td>' +
      '<td>' + t.best + '</td>';
    tbody.appendChild(tr);
  });
})();
