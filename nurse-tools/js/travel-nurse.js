document.addEventListener("DOMContentLoaded",()=>{
  document.getElementById("calc").addEventListener("submit",e=>{
    e.preventDefault();
    const hourly=parseFloat(document.getElementById("hourly").value)||0;
    const housing=parseFloat(document.getElementById("housing").value)||0;
    const meals=parseFloat(document.getElementById("meals").value)||0;
    const hours=parseFloat(document.getElementById("hours").value)||36;
    const weeks=parseFloat(document.getElementById("weeks").value)||13;
    const bonus=parseFloat(document.getElementById("bonus").value)||0;
    const travel=parseFloat(document.getElementById("travel").value)||0;

    const taxable=hourly*hours*weeks;
    const taxfree=(housing+meals)*weeks;
    const total=taxable+taxfree+bonus+travel;
    const effectiveHourly=total/(hours*weeks);
    const staffCompare=effectiveHourly/48; // vs ~$48/hr avg staff RN wage
    const weeklyTake=Math.round(total/weeks);

    let verdict;
    if(effectiveHourly>=65)verdict="Excellent package — well above typical staff pay.";
    else if(effectiveHourly>=55)verdict="Strong package — competitive for most specialties.";
    else if(effectiveHourly>=45)verdict="Average travel package — fine for desirable locations.";
    else verdict="Below average — negotiate stipends or look for another contract.";

    document.getElementById("out").innerHTML=
      "<h3>Your travel nurse package</h3>"+
      '<div class="big">'+fmtUSD(total)+"</div><p>total over "+weeks+" weeks</p>"+
      "<table><tr><th>Component</th><th>Amount</th></tr>"+
      "<tr><td>Taxable wages ("+fmtUSD(hourly)+"/hr × "+hours+"h × "+weeks+"w)</td><td>"+fmtUSD(taxable)+"</td></tr>"+
      "<tr><td>Tax-free stipends (housing + meals)</td><td>"+fmtUSD(taxfree)+"</td></tr>"+
      "<tr><td>Completion bonus</td><td>"+fmtUSD(bonus)+"</td></tr>"+
      "<tr><td>Travel reimbursement</td><td>"+fmtUSD(travel)+"</td></tr>"+
      "<tr><td><strong>Effective hourly rate</strong></td><td><strong>"+fmtUSD(effectiveHourly)+"/hr</strong></td></tr>"+
      "<tr><td>Approx. weekly total</td><td>"+fmtUSD(weeklyTake)+"/week</td></tr>"+
      "<tr><td>vs staff RN (~$48/hr)</td><td>×"+staffCompare.toFixed(2)+"</td></tr></table>"+
      "<p style='margin-top:12px'><strong>Verdict:</strong> "+verdict+"</p>";
    document.getElementById("out").classList.add("show");
  });
});
