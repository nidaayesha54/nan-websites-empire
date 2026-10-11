// AI Voiceover Script Optimizer — TTS-friendly conversion (client-side)
(function(){
"use strict";
var ONES=["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
var TENS=["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
function numToWords(n){
  if(n<0)return "minus "+numToWords(-n);
  if(n<20)return ONES[n];
  if(n<100){var t=Math.floor(n/10),r=n%10;return TENS[t]+(r?"-"+ONES[r]:"");}
  if(n<1000){var h=Math.floor(n/100),r2=n%100;return ONES[h]+" hundred"+(r2?" "+numToWords(r2):"");}
  if(n<1000000){var th=Math.floor(n/1000),r3=n%1000;return numToWords(th)+" thousand"+(r3?" "+numToWords(r3):"");}
  if(n<1000000000){var m=Math.floor(n/1000000),r4=n%1000000;return numToWords(m)+" million"+(r4?" "+numToWords(r4):"");}
  return n.toString();
}
var ABBR={
 "mr\\.":"mister","mrs\\.":"missus","ms\\.":"miss","dr\\.":"doctor","st\\.":"street","ave\\.":"avenue",
 "blvd\\.":"boulevard","rd\\.":"road","jr\\.":"junior","sr\\.":"senior",
 "e\\.g\\.":"for example","i\\.e\\.":"that is","etc\\.":"etcetera","vs\\.":"versus",
 "approx\\.":"approximately","dept\\.":"department","govt\\.":"government"
};
function ordinal(n){var s=["th","st","nd","rd"],v=n%100;return n+(s[(v-20)%10]||s[v]||s[0]);}
function ordinalWords(n){
  var o=ordinal(n),base=o.replace(/(\d+)(st|nd|rd|th)/,"$1");
  var irr={"1":"first","2":"second","3":"third","5":"fifth","8":"eighth","9":"ninth","12":"twelfth"};
  if(irr[base])return irr[base];
  var w=numToWords(n);
  if(w.endsWith("y"))return w.slice(0,-1)+"ieth";
  return w+"th";
}
function expandNumberToken(tok){
  // $5.99 -> five dollars and ninety-nine cents ; $5 -> five dollars
  var m=tok.match(/^\$([\d,]+(?:\.\d{1,2})?)$/);
  if(m){var parts=m[1].replace(/,/g,"").split("."),d=numToWords(parseInt(parts[0],10))+" dollar"+(parseInt(parts[0],10)===1?"":"s");
    if(parts[1]&&parseInt(parts[1],10)>0)d+=" and "+numToWords(parseInt(parts[1],10))+" cents";
    return d;}
  m=tok.match(/^([\d,]+(?:\.\d+)?)%$/);
  if(m){return expandDecimal(m[1])+" percent";}
  m=tok.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?$/);
  if(m){var h=parseInt(m[1],10),mm=parseInt(m[2],10),out=numToWords(h);
    if(mm===0)out+=" o'clock";else if(mm<10)out+=" oh "+numToWords(mm);else out+=" "+numToWords(mm);
    if(m[3])out+=" "+m[3].toUpperCase().split("").join(" ");
    return out;}
  m=tok.match(/^(\d+)(st|nd|rd|th)$/i);
  if(m)return ordinalWords(parseInt(m[1],10));
  m=tok.match(/^(\d{4})s$/);
  if(m)return decadeWords(parseInt(m[1],10));
  m=tok.match(/^(\d[\d,]*(?:\.\d+)?)$/);
  if(m)return expandDecimal(m[1]);
  return tok;
}
function decadeWords(y){
  var a=Math.floor(y/100),b=y%100,aw=numToWords(a),bw;
  if(b===0)bw="hundreds";
  else{var w=numToWords(b);bw=w.charAt(w.length-1)==="y"?w.slice(0,-1)+"ies":w+"s";}
  return "the "+aw+" "+bw;
}
function expandDecimal(s){
  s=s.replace(/,/g,"");
  var p=s.split(".");
  var out=numToWords(parseInt(p[0],10)||0);
  if(p[1])out+=" point "+p[1].split("").map(function(d){return ONES[parseInt(d,10)];}).join(" ");
  return out;
}
function optimize(text,opts){
  var t=" "+text+" ";
  // abbreviations first
  Object.keys(ABBR).forEach(function(k){
    t=t.replace(new RegExp("(^|\\s)"+k+"(?=\\s|$)","gi"),function(m,p){return p+ABBR[k];});
  });
  // & -> and
  t=t.replace(/\s&\s/g," and ");
  // @ -> at
  t=t.replace(/\s@\s/g," at ");
  // + -> plus
  t=t.replace(/(\d)\s*\+\s*(\d)/g,"$1 plus $2");
  // x between digits -> by
  t=t.replace(/(\d)\s*[xX]\s*(\d)/g,"$1 by $2");
  // expand number tokens (keep word boundaries)
  t=t.replace(/\$[\d,]+(?:\.\d{1,2})?|[\d,]+(?:\.\d+)?%|\b\d{1,2}:\d{2}\s*(?:[APap]\.?M\.?)?|\b\d+(?:st|nd|rd|th)\b|\b\d{4}s\b|\d[\d,]*(?:\.\d+)?/g,function(m){
    return expandNumberToken(m);
  });
  // am/pm standalone (after times like 3:30 PM are already expanded)
  t=t.replace(/\b([AP])\.?M\.?/g,function(m,l){return " "+l+" M";});
  // remove URLs / emails
  t=t.replace(/https?:\/\/\S+/g," link in description ");
  t=t.replace(/\S+@\S+\.\S+/g," email in description ");
  // remove emojis and weird symbols
  t=t.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu,"");
  t=t.replace(/[*_#~`>|^]/g,"");
  // smart quotes
  t=t.replace(/[\u201C\u201D]/g,'"').replace(/[\u2018\u2019]/g,"'");
  t=t.replace(/\u2026/g," ... ");
  // pacing
  if(opts.pacing){
    // break long paragraphs into sentence lines
    t=t.replace(/([.!?])\s+(?=[A-Z])/g,"$1\n");
    // add pause marks after headings/ALLCAPS lines
    t=t.split("\n").map(function(line){
      var l=line.trim();
      if(l && l===l.toUpperCase() && /[A-Z]/.test(l) && l.length<80){
        return l.toLowerCase().replace(/\b\w/g,function(c){return c.toUpperCase();})+" ...";
      }
      return l;
    }).join("\n");
  }
  // strip double spaces
  t=t.replace(/[ \t]+/g," ").replace(/\n{3,}/g,"\n\n").trim();
  // final: remove lines that are empty
  if(opts.clean)t=t.split("\n").map(function(l){return l.trim();}).filter(Boolean).join("\n");
  return t;
}
function stats(text){
  var words=text.trim().split(/\s+/).filter(Boolean);
  var sents=(text.match(/[.!?…]+/g)||[]).length;
  var w=words.length;
  var mins=w/150; // 150 wpm avg
  var total=Math.round(mins*60);
  return {words:w,sentences:sents,dur:total};
}
function fmtDur(sec){
  var m=Math.floor(sec/60),s=sec%60;
  return m+":"+("0"+s).slice(-2);
}
document.addEventListener("DOMContentLoaded",function(){
  var inp=document.getElementById("in"),out=document.getElementById("out");
  var btn=document.getElementById("go"),cp=document.getElementById("copy");
  var st=document.getElementById("stats");
  if(!inp)return;
  btn.addEventListener("click",function(){
    var opts={pacing:document.getElementById("opPace").checked,clean:document.getElementById("opClean").checked};
    var res=optimize(inp.value,opts);
    out.textContent=res;
    out.style.display="block";
    var s=stats(res);
    st.innerHTML="<div><b>"+s.words+"</b>words</div><div><b>"+s.sentences+"</b>sentences</div><div><b>~"+fmtDur(s.dur)+"</b>est. duration @150 wpm</div>";
  });
  cp.addEventListener("click",function(){
    navigator.clipboard.writeText(out.textContent).then(function(){
      cp.textContent="Copied!";setTimeout(function(){cp.textContent="Copy result";},1500);
    });
  });
});
})();
