const TOOLS=[
{n:"Runway",d:"Text/image से high-quality video — Gen-3 model, professional editing suite ke saath।",p:"~$12/mo se",f:"Limited free credits",u:["marketing","youtube","social"],r:"4.6/5"},
{n:"Pika",d:"Short creative clips ke liye fun tool — effects aur stylized video mein strong।",p:"~$8/mo se",f:"Free tier (watermark)",u:["social","youtube"],r:"4.3/5"},
{n:"Luma Dream Machine",d:"Realistic motion aur cinematic shots — free trial generous hai।",p:"~$10/mo se",f:"Free trial credits",u:["youtube","social","marketing"],r:"4.5/5"},
{n:"Kling AI",d:"Longer clips aur smooth character motion — Chinese model, quality impressive।",p:"Free + paid plans",f:"Daily free credits",u:["youtube","social"],r:"4.4/5"},
{n:"HeyGen",d:"AI avatar spokesperson videos — 40+ languages, Hindi avatar bhi available।",p:"~$24/mo se",f:"1 free video/mo",u:["avatar","marketing"],r:"4.5/5"},
{n:"Synthesia",d:"Corporate/training avatar videos — 140+ languages, professional templates।",p:"~$22/mo se",f:"Free demo only",u:["avatar","marketing"],r:"4.4/5"},
{n:"CapCut",d:"Free video editor + AI features — auto-captions, TTS Hindi voice, templates।",p:"Free",f:"Full free plan",u:["social","youtube","marketing"],r:"4.7/5"},
{n:"InVideo",d:"Text-to-video for marketing — 5000+ templates, stock library included।",p:"~$28/mo se",f:"Free (watermark)",u:["marketing","youtube"],r:"4.2/5"},
{n:"Pictory",d:"Blog/script se auto video — faceless YouTube ke liye popular।",p:"~$19/mo se",f:"Free trial",u:["youtube","marketing"],r:"4.1/5"},
{n:"ElevenLabs",d:"Best AI voice — Hindi समेत 29 languages mein realistic voiceover।",p:"Free + ~$5/mo se",f:"10k chars/mo free",u:["youtube","avatar","social"],r:"4.8/5"}
];
const USE={marketing:"मार्केटिंग",youtube:"YouTube",social:"Reels/Shorts",avatar:"Avatar"};
function render(f){
  const tb=document.getElementById('rows');tb.innerHTML='';
  TOOLS.filter(t=>f==='all'||t.u.includes(f)).forEach(t=>{
    const tr=document.createElement('tr');
    tr.innerHTML='<td><strong>'+t.n+'</strong></td><td>'+t.d+'</td><td>'+t.p+'</td><td>'+t.f+'</td><td>'+t.u.map(u=>USE[u]).join(', ')+'</td><td>'+t.r+'</td>';
    tb.appendChild(tr);
  });
}
document.querySelectorAll('#filters button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('#filters button').forEach(x=>x.classList.remove('active'));
  b.classList.add('active');render(b.dataset.f);
}));
render('all');
