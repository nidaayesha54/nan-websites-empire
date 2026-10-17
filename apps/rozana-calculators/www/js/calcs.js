/* Verified formulas reused from NAN's live sites:
   EOBI: (avgWage × years) ÷ 50, min Rs 11,500; <14.5 yrs → one-time old-age grant = wage × years
   OT: hourly = salary×12 ÷ (52 × weeklyHours); OT pay = hourly × 2 × otHours  (double rate)
   Gratuity: perDay = wage ÷ 26; gratuity = perDay × 30 × years
   Age: standard y/m/d diff + Urdu numerals + weekday + next-birthday countdown
   All calculations run 100% offline. No network calls. */
'use strict';

let LANG = 'ur'; // 'ur' | 'en'
const UR_D = '۰۱۲۳۴۵۶۷۸۹';
const DAYS_UR = ['اتوار','پیر','منگل','بدھ','جمعرات','جمعہ','ہفتہ'];
const DAYS_EN = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function num(n){ let t=String(n); if(LANG==='ur'){ t=t.replace(/[0-9]/g,d=>UR_D[d]); } return t; }
function fmtRs(n){ return 'Rs ' + num(Math.round(n).toLocaleString('en-US')); }
function fmtN(n){ return num(Number(n).toLocaleString('en-US')); }

const T = {
  en: {
    needWageYears:'Please enter your wage and years of service.',
    grantTitle:'estimated one-time OLD-AGE GRANT (not monthly pension)',
    yourService:'Your service', years:'years', pensionElig:'Monthly pension eligibility',
    notYet:'Not yet — needs 14.5+ years', grantHint:'Workers with 2 to under 15 years of contributions get a one-time grant of one month\u2019s average wage per year of service.',
    monthlyPension:'estimated MONTHLY pension', minApplies:' (minimum pension applies)',
    formulaResult:'Formula result', minPension:'Minimum pension (2026)', eachYear:'Each year of service adds', twoPct:'2% of your wage',
    eobiHint:'Formula: (average monthly wage × years of service) ÷ 50. If the result is below Rs 11,500, you receive the minimum.',
    needSalary:'Please enter salary and weekly hours.', otDue:'overtime pay due',
    ordHourly:'Ordinary hourly rate', otRate:'Overtime rate (double)', otHours:'Overtime hours',
    otHint:'Legal formula: (monthly salary × 12) ÷ (52 × weekly hours) = hourly rate; overtime = hourly × 2.',
    needWage:'Please enter wage and years of service.', gratDue:'estimated gratuity payable',
    perDay:'Per-day wage (÷ 26)', rate:'Rate', gratHint:'Payable on resignation, termination (except misconduct), retirement or death — after 1+ year of service.',
    needDob:'Please select your date of birth.', dobFuture:'Date of birth must be before today.',
    yourAge:'your age', yr:'years', mo:'months', dy:'days', birthDay:'Birth weekday', totalDays:'Total days lived', nextBday:'Days until next birthday'
  },
  ur: {
    needWageYears:'براہ کرم اپنی اجرت اور ملازمت کے سال درج کریں۔',
    grantTitle:'متوقع یک وقتی اولڈ ایج گرانٹ (ماہانہ پنشن نہیں)',
    yourService:'آپ کی ملازمت', years:'سال', pensionElig:'ماہانہ پنشن کی اہلیت',
    notYet:'ابھی نہیں — 14.5+ سال درکار ہیں', grantHint:'2 سے 15 سال سے کم کنٹریبیوشن والے ورکرز کو فی سال ایک ماہ کی اوسط اجرت کے برابر یک وقتی گرانٹ ملتی ہے۔',
    monthlyPension:'متوقع ماہانہ پنشن', minApplies:' (کم از کم پنشن لاگو)',
    formulaResult:'فارمولے کا نتیجہ', minPension:'کم از کم پنشن (2026)', eachYear:'ہر سال ملازمت پر اضافہ', twoPct:'اجرت کا 2٪',
    eobiHint:'فارمولا: (اوسط ماہانہ اجرت × ملازمت کے سال) ÷ 50۔ اگر نتیجہ 11,500 روپے سے کم ہو تو کم از کم پنشن ملتی ہے۔',
    needSalary:'براہ کرم تنخواہ اور ہفتہ وار گھنٹے درج کریں۔', otDue:'اوور ٹائم کی رقم',
    ordHourly:'عام فی گھنٹہ اجرت', otRate:'اوور ٹائم ریٹ (دوگنا)', otHours:'اوور ٹائم گھنٹے',
    otHint:'قانونی فارمولا: (ماہانہ تنخواہ × 12) ÷ (52 × ہفتہ وار گھنٹے) = فی گھنٹہ اجرت؛ اوور ٹائم = فی گھنٹہ × 2۔',
    needWage:'براہ کرم اجرت اور ملازمت کے سال درج کریں۔', gratDue:'متوقع گریجویٹی',
    perDay:'یومیہ اجرت (÷ 26)', rate:'شرح', gratHint:'استعفیٰ، برطرفی (بدعنوانی کے سوا)، ریٹائرمنٹ یا وفات پر — 1+ سال ملازمت کے بعد قابل ادائیگی۔',
    needDob:'براہ کرم تاریخ پیدائش منتخب کریں۔', dobFuture:'تاریخ پیدائش آج سے پہلے کی ہونی چاہیے۔',
    yourAge:'آپ کی عمر', yr:'سال', mo:'ماہ', dy:'دن', birthDay:'پیدائش کا دن', totalDays:'کل گزرے دن', nextBday:'اگلی سالگرہ میں باقی دن'
  }
};
function t(k){ return T[LANG][k]; }

function calcEOBI(){
  const wage=parseFloat(document.getElementById('wage').value)||0;
  const yrs=parseFloat(document.getElementById('years').value)||0;
  const r=document.getElementById('eobiResult'); r.classList.add('show');
  const MIN=11500;
  if(wage<=0||yrs<=0){ r.innerHTML='<p>'+t('needWageYears')+'</p>'; return; }
  if(yrs<14.5){
    const grant=wage*yrs;
    r.innerHTML='<div class="big">'+fmtRs(grant)+'<small>'+t('grantTitle')+'</small></div>'
      +'<table><tr><td>'+t('yourService')+'</td><td>'+num(yrs)+' '+t('years')+'</td></tr>'
      +'<tr><td>'+t('pensionElig')+'</td><td>'+t('notYet')+'</td></tr></table>'
      +'<p class="hint">'+t('grantHint')+'</p>';
    return;
  }
  let p=wage*yrs/50; const atMin=p<MIN; if(atMin)p=MIN;
  r.innerHTML='<div class="big">'+fmtRs(p)+'<small>'+t('monthlyPension')+(atMin?t('minApplies'):'')+'</small></div>'
    +'<table><tr><td>'+t('formulaResult')+'</td><td>'+fmtRs(wage*yrs/50)+'</td></tr>'
    +'<tr><td>'+t('minPension')+'</td><td>'+fmtRs(MIN)+'</td></tr>'
    +'<tr><td>'+t('eachYear')+'</td><td>'+t('twoPct')+'</td></tr></table>'
    +'<p class="hint">'+t('eobiHint')+'</p>';
}

function calcOT(){
  const s=parseFloat(document.getElementById('salary').value)||0;
  const w=parseFloat(document.getElementById('whrs').value)||48;
  const h=parseFloat(document.getElementById('oth').value)||0;
  const r=document.getElementById('otResult'); r.classList.add('show');
  if(s<=0||w<=0){ r.innerHTML='<p>'+t('needSalary')+'</p>'; return; }
  const hourly=s*12/(52*w), pay=hourly*2*h;
  r.innerHTML='<div class="big">'+fmtRs(pay)+'<small>'+t('otDue')+'</small></div>'
    +'<table><tr><td>'+t('ordHourly')+'</td><td>'+fmtRs(hourly)+'</td></tr>'
    +'<tr><td>'+t('otRate')+'</td><td>'+fmtRs(hourly*2)+'</td></tr>'
    +'<tr><td>'+t('otHours')+'</td><td>'+num(h)+'</td></tr></table>'
    +'<p class="hint">'+t('otHint')+'</p>';
}

function calcGrat(){
  const w=parseFloat(document.getElementById('gwage').value)||0;
  const y=parseFloat(document.getElementById('gyrs').value)||0;
  const r=document.getElementById('grResult'); r.classList.add('show');
  if(w<=0||y<=0){ r.innerHTML='<p>'+t('needWage')+'</p>'; return; }
  const perDay=w/26, g=perDay*30*y;
  r.innerHTML='<div class="big">'+fmtRs(g)+'<small>'+t('gratDue')+'</small></div>'
    +'<table><tr><td>'+t('perDay')+'</td><td>'+fmtRs(perDay)+'</td></tr>'
    +'<tr><td>'+t('rate')+'</td><td>30 '+t('dy')+' × '+num(y)+' '+t('years')+'</td></tr></table>'
    +'<p class="hint">'+t('gratHint')+'</p>';
}

function calcAge(){
  const v=document.getElementById('dob').value, r=document.getElementById('ageResult');
  r.classList.add('show');
  if(!v){ r.innerHTML='<p>'+t('needDob')+'</p>'; return; }
  const b=new Date(v+'T00:00:00'), now=new Date();
  if(b>now){ r.innerHTML='<p>'+t('dobFuture')+'</p>'; return; }
  let y=now.getFullYear()-b.getFullYear(), m=now.getMonth()-b.getMonth(), d=now.getDate()-b.getDate();
  if(d<0){ m--; const pm=new Date(now.getFullYear(),now.getMonth(),0).getDate(); d+=pm; }
  if(m<0){ y--; m+=12; }
  const totalDays=Math.floor((now-b)/86400000);
  const nb=new Date(now.getFullYear(),b.getMonth(),b.getDate());
  if(nb<now) nb.setFullYear(nb.getFullYear()+1);
  const toBday=Math.ceil((nb-now)/86400000);
  const daysArr = LANG==='ur' ? DAYS_UR : DAYS_EN;
  r.innerHTML='<div class="big">'+num(y)+' '+t('yr')+' '+num(m)+' '+t('mo')+' '+num(d)+' '+t('dy')+'<small>'+t('yourAge')+'</small></div>'
    +'<table><tr><td>'+t('birthDay')+'</td><td>'+daysArr[b.getDay()]+'</td></tr>'
    +'<tr><td>'+t('totalDays')+'</td><td>'+fmtN(totalDays)+'</td></tr>'
    +'<tr><td>'+t('nextBday')+'</td><td>'+num(toBday)+'</td></tr></table>';
}
