function decodeEob(){
  var v=function(id){var n=Number(document.getElementById(id).value);return isNaN(n)?0:n;};
  var billed=v('billed'),allowed=v('allowed'),paid=v('paid'),deduct=v('deduct'),copay=v('copay'),denied=v('denied');
  if(billed<=0){alert('Please enter at least the billed amount.');return;}
  var adjusted=Math.max(0,billed-allowed-denied); // negotiated write-off
  var youOwe=Math.max(0,deduct+copay);
  var lines=[];
  lines.push('PLAIN-ENGLISH BREAKDOWN OF YOUR EOB\n');
  lines.push('1. Billed amount ('+fmtUSD(billed)+'): what your provider charged. You almost never pay this full number.');
  if(allowed>0&&allowed<billed){
    lines.push('2. Provider adjustment ('+fmtUSD(adjusted)+'): the discount your insurer negotiated. You do NOT pay this — the provider writes it off.');
  }
  if(allowed>0){
    lines.push('3. Allowed amount ('+fmtUSD(allowed)+'): the negotiated rate. Everything below is calculated from this number.');
  }
  lines.push('4. Paid by insurance ('+fmtUSD(paid)+'): what your insurer covered.');
  if(deduct>0)lines.push('5. Applied to deductible ('+fmtUSD(deduct)+'): counts toward your yearly deductible.');
  if(copay>0)lines.push('6. Copay / coinsurance ('+fmtUSD(copay)+'): your share of the cost.');
  if(denied>0)lines.push('7. Denied ('+fmtUSD(denied)+'): the insurer refused this part. You can APPEAL this — try our appeal letter generator.');
  lines.push('');
  lines.push('YOUR LIKELY RESPONSIBILITY: '+fmtUSD(youOwe));
  if(youOwe>0)lines.push('(deductible share + copay/coinsurance — but wait for the real bill from your provider before paying.)');
  else lines.push('Good news — based on these numbers you may owe $0 for this claim.');
  if(denied>0)lines.push('\nNOTE: '+fmtUSD(denied)+' was denied. Denials are often wrong — many people win on appeal. Do not pay a denied amount without appealing first.');
  var out=document.getElementById('eobOut');
  out.textContent=lines.join('\n');
  out.style.display='block';
  out.scrollIntoView({behavior:'smooth'});
}
