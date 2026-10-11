function genLetter(){
  var g=function(id){return document.getElementById(id).value.trim();};
  var name=g('fullName')||'[Your Name]';
  var addr=g('address')||'[Your Address]';
  var pol=g('policyNum')||'[Policy Number]';
  var ins=g('insurer')||'[Insurance Company]';
  var clm=g('claimNum')||'[Claim Number]';
  var dos=g('dos')||'[Date(s) of Service]';
  var prov=g('provider')||'[Provider Name]';
  var amt=g('amount')?fmtUSD(g('amount')):'[Amount]';
  var dd=g('denialDate')||'[Denial Date]';
  var rsn=g('denialReason');
  var why=g('extra')||'[Explain here why the denial was incorrect.]';
  var today=new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});

  var letter=name+'\n'+addr+'\n\n'+today+'\n\n'+ins+'\nAppeals Department\n\n'+
  'Re: Formal Appeal of Denied Claim\n'+
  'Policy/Member ID: '+pol+'\n'+
  'Claim Number: '+clm+'\n'+
  'Date(s) of Service: '+dos+'\n'+
  'Provider: '+prov+'\n'+
  'Amount Billed: '+amt+'\n\n'+
  'Dear Appeals Department:\n\n'+
  'I am writing to formally appeal the denial of the above-referenced claim. Your denial letter dated '+dd+' states the denial reason as: "'+rsn+'."\n\n'+
  'I respectfully request that you reconsider this decision for the following reasons:\n\n'+why+'\n\n'+
  'Enclosed with this letter, please find the following supporting documents:\n'+
  '  1. Copy of the denial letter\n'+
  '  2. Relevant medical records and physician notes\n'+
  '  3. Itemized bill from '+prov+'\n'+
  '  4. Copy of the applicable policy/coverage provisions\n\n'+
  'Please process this appeal promptly and notify me in writing of your determination. Under my plan, I understand I have the right to an internal appeal and, if necessary, an external review by an independent third party.\n\n'+
  'Thank you for your time and attention to this matter.\n\nSincerely,\n\n'+name+'\n'+addr;

  var out=document.getElementById('letterOut');
  out.textContent=letter;
  out.style.display='block';
  document.getElementById('copyBtn').style.display='inline-block';
  document.getElementById('dlBtn').style.display='inline-block';
  out.scrollIntoView({behavior:'smooth'});
}
