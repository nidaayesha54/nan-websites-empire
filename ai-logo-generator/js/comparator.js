/* AI Logo Generator Comparator — data + filters */
(function(){
  const DATA = [
    {name:"Looka", free:"Free previews, paid downloads", price:"From $20 one-time / $96 yr", vector:"Yes", text:"Excellent", watermark:"Yes (free)", pro:"Brand kit, 300+ logo concepts, great typography", con:"High-res download is paid; free version watermarked"},
    {name:"LogoAI", free:"Free preview, paid download", price:"From $29 one-time", vector:"Yes", text:"Excellent", watermark:"Yes (free)", pro:"AI learns your style, strong monogram options", con:"No truly free download; limited free edits"},
    {name:"Brandmark", free:"Free concepts, paid files", price:"From $25 one-time", vector:"Yes", text:"Good", watermark:"Yes (free)", pro:"Great color/font pairing engine, cheap one-time", con:"Fewer customization controls than rivals"},
    {name:"Ideogram", free:"Yes — free tier", price:"Free (paid from $7/mo)", vector:"No (raster)", text:"Best in class", watermark:"No", pro:"Best free text-in-logo accuracy, no watermark on free tier", con:"Raster only; needs upscaling/vectorizing for print"},
    {name:"Leonardo AI", free:"Yes — daily free credits", price:"Free / from $10/mo", vector:"No (raster)", text:"Good", watermark:"No", pro:"Huge style variety, daily free generations", con:"General image tool, not logo-focused; no brand kit"},
    {name:"Canva Logo Maker", free:"Yes", price:"Free / Pro $15/mo", vector:"Yes (SVG export)", text:"Good", watermark:"No", pro:"True free SVG downloads, huge template library", con:"Templates can look generic; AI features limited on free"},
    {name:"Hatchful by Shopify", free:"Yes", price:"Free", vector:"Yes", text:"Good", watermark:"No", pro:"Completely free downloads, simple wizard", con:"Limited styles, basic customization, retiring features"},
    {name:"Wix Logo Maker", free:"Free design, paid download", price:"From $20 one-time", vector:"Yes", text:"Good", watermark:"Yes (free)", pro:"Deep questionnaire personalizes results", con:"Download paywalled; vector only on higher tiers"},
    {name:"Designs.ai Logo Maker", free:"Free preview, paid download", price:"From $29/mo", vector:"Yes", text:"Good", watermark:"Yes (free)", pro:"Full design suite (video, voice, mockups)", con:"Subscription pricing is steep for one logo"},
    {name:"Fiverr Logo Maker", free:"Free design, paid download", price:"From $30 one-time", vector:"Yes", text:"Excellent", watermark:"Yes (free)", pro:"Hand-made by pros mixed with AI speed", con:"Costs more; revisions cost extra"}
  ];

  const tbody = document.getElementById('compare-body');
  const countEl = document.getElementById('compare-count');

  function row(d){
    const tr = document.createElement('tr');
    tr.innerHTML =
      "<td><strong>" + d.name + "</strong></td>" +
      "<td>" + d.free + "</td>" +
      "<td>" + d.price + "</td>" +
      "<td>" + d.vector + "</td>" +
      "<td>" + d.text + "</td>" +
      "<td>" + d.watermark + "</td>" +
      "<td>" + d.pro + "</td>" +
      "<td>" + d.con + "</td>";
    return tr;
  }

  function render(){
    const fFree = document.getElementById('f-free').checked;
    const fVector = document.getElementById('f-vector').checked;
    const fText = document.getElementById('f-text').checked;
    const list = DATA.filter(function(d){
      if(fFree && !/^yes/i.test(d.free)) return false;
      if(fVector && d.vector !== "Yes") return false;
      if(fText && d.text !== "Best in class" && d.text !== "Excellent") return false;
      return true;
    });
    tbody.innerHTML = "";
    list.forEach(function(d){ tbody.appendChild(row(d)); });
    countEl.textContent = "Showing " + list.length + " of " + DATA.length + " generators";
  }

  ["f-free","f-vector","f-text"].forEach(function(id){
    document.getElementById(id).addEventListener('change', render);
  });
  document.getElementById('f-reset').addEventListener('click', function(){
    ["f-free","f-vector","f-text"].forEach(function(id){ document.getElementById(id).checked = false; });
    render();
  });
  render();
})();
