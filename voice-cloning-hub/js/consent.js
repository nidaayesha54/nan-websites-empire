// Ethical voice cloning checklist generator (informational only — not legal advice)
var CASES = {
  own:{label:"🎤 My own voice", level:"ok",
    consents:["You are the speaker — consent is yours to give.","Keep a dated record of your own consent statement (a short recorded or written note works).","If a platform hosts the voice, save their terms on voice usage and deletion."],
    legal:["You generally control commercial rights to your own voice, but contracts (employer, agency, platform) can override this — check them.","Some US states recognize voice as a protected personal attribute; your own commercial use is the baseline case."],
    redflags:[]},
  employee:{label:"👔 An employee's / team member's voice", level:"warn",
    consents:["Written, signed consent from the specific person — verbal alone is risky.","Consent must name the allowed uses (e.g., training videos, IVR) and the time period.","Allow the person to revoke consent and define what happens to existing recordings."],
    legal:["Employment contracts rarely include voice-cloning rights automatically — get a separate addendum.","Union or collective-bargaining rules may apply in media/production roles.","Informational only: employment lawyers recommend written releases for commercial voice use."],
    redflags:["Don't pressure employees to consent; coerced consent can be legally challenged."]},
  client:{label:"🤝 A client's voiceover (freelance project)", level:"warn",
    consents:["Written consent in your contract or a standalone release form.","Specify deliverables: where the voice may appear, for how long, and in what media.","Clarify whether you may reuse the voice model for other projects (default: no)."],
    legal:["The client typically owns rights to their voice; you own your production work — put the split in writing.","For broadcast or national campaigns, a formal talent release is standard practice."],
    redflags:["Never clone a client's voice for uses beyond the signed scope."]},
  deceased:{label:"🕊️ A deceased loved one's voice", level:"warn",
    consents:["Consent from the estate / next of kin in writing.","Agreement among close family members to avoid disputes.","Consider the person's own known wishes about their likeness."],
    legal:["Several US states (e.g., California, Tennessee) extend likeness/voice rights after death — the estate may control commercial use.","Non-commercial memorial use is generally lower-risk, but family disagreement can still create problems."],
    redflags:["Don't use a deceased person's voice for commercial products without the estate's clear written approval."]},
  public:{label:"⭐ A celebrity / public figure's voice", level:"danger",
    consents:["Direct, written license from the person or their representatives.","A public figure's fame does NOT imply consent."],
    legal:["Right-of-publicity laws in many US states prohibit commercial use of a recognizable voice without permission.","Parody has some protection, but it is narrow and fact-specific — this is where lawyers earn their fees."],
    redflags:["Creating ads, endorsements, or 'the celebrity said X' content without permission is high-risk — do not do this."]},
  other:{label:"🚫 Someone else's voice (no relationship)", level:"danger",
    consents:["Stop here: you need their explicit, written, informed consent first.","'They'll never know' is not a legal strategy."],
    legal:["Non-consensual voice cloning can violate fraud, impersonation, and right-of-publicity laws in the US.","Scam calls using cloned voices are prosecuted — the FCC banned AI-generated robocalls in 2024."],
    redflags:["If you don't have clear consent, do not create the clone. Use a stock/licensed voice or hire a voice actor instead."]}
};

document.addEventListener('DOMContentLoaded',function(){
  var sel=document.getElementById('usecase');
  var out=document.getElementById('checklistOut');
  function tagFor(level){
    if(level==='ok') return '<span class="tag ok">LOW RISK</span>';
    if(level==='warn') return '<span class="tag warn">NEEDS CARE</span>';
    return '<span class="tag danger">HIGH RISK</span>';
  }
  function render(key){
    var c=CASES[key];
    var html='<h3>Checklist: '+c.label+' '+tagFor(c.level)+'</h3>';
    html+='<div class="disclaimer" style="margin:14px 0">⚠️ Informational guide only — <b>not legal advice</b>. Voice-cloning laws vary by US state and country. Consult a licensed attorney for your situation.</div>';
    html+='<h4 style="margin:14px 0 8px">✅ Required consents</h4>';
    html+='<div id="consentItems">'+c.consents.map(function(item,i){
      return '<label class="checkitem" id="ci'+i+'"><input type="checkbox" onchange="document.getElementById(\'ci'+i+'\').classList.toggle(\'done\',this.checked)"><span class="t"><strong>'+item+'</strong></span></label>';
    }).join('')+'</div>';
    html+='<h4 style="margin:14px 0 8px">📜 Legal notes (USA, general)</h4><ul>'+c.legal.map(function(l){return '<li>'+l+'</li>';}).join('')+'</ul>';
    if(c.redflags.length){
      html+='<div class="verdict" style="background:#2e1414;color:#fca5a5">⛔ '+c.redflags.join(' ')+'</div>';
    } else {
      html+='<div class="verdict" style="background:#0f2b22;color:#9be8c8">✅ This use case is ethically straightforward — keep records and respect platform terms.</div>';
    }
    out.innerHTML=html;
  }
  if(sel){
    sel.addEventListener('change',function(){render(sel.value);});
    render(sel.value);
  }
});
