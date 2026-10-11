/* Statute of limitations data (general personal injury).
   Years shown are typical base periods; discovery rules, tolling for minors,
   and claims against government entities often shorten or change them.
   This is a research aid, NOT legal advice — verify with a licensed attorney. */
var STATUTES={
"Alabama":{pi:2,mm:2,wd:2,prod:2,note:"Strict 2-year limit; few exceptions."},
"Alaska":{pi:2,mm:2,wd:2,prod:2,note:"Discovery rule may apply to latent injuries."},
"Arizona":{pi:2,mm:2,wd:2,prod:2,note:"Claims vs. public entities: 180-day notice required."},
"Arkansas":{pi:3,mm:2,wd:3,prod:3,note:"Medical malpractice has its own 2-year rule."},
"California":{pi:2,mm:3,wd:2,prod:2,note:"Med-mal: 3 yrs from injury OR 1 yr from discovery, whichever first."},
"Colorado":{pi:2,mm:2,wd:2,prod:2,note:"Motor-vehicle injury claims: 3 years."},
"Connecticut":{pi:2,mm:2,wd:2,prod:3,note:"Product liability has a longer 3-year window."},
"Delaware":{pi:2,mm:2,wd:2,prod:2,note:"Discovery rule can extend start date."},
"District of Columbia":{pi:3,mm:3,wd:2,prod:3,note:"Wrongful death is a shorter 2-year window."},
"Florida":{pi:2,mm:2,wd:2,prod:2,note:"PI limit cut from 4 to 2 years in 2023."},
"Georgia":{pi:2,mm:2,wd:2,prod:2,note:"Government claims require ante litem notice."},
"Hawaii":{pi:2,mm:2,wd:2,prod:2,note:"Standard 2-year limit for injury claims."},
"Idaho":{pi:2,mm:2,wd:2,prod:2,note:"Notice of tort claim vs. government: 180 days."},
"Illinois":{pi:2,mm:2,wd:2,prod:2,note:"Claims vs. local government: 1 year."},
"Indiana":{pi:2,mm:2,wd:2,prod:2,note:"Med-mal claims go through a review panel first."},
"Iowa":{pi:2,mm:2,wd:2,prod:2,note:"Discovery rule applies to latent injuries."},
"Kansas":{pi:2,mm:2,wd:2,prod:2,note:"Wrongful-death heirs have specific filing rules."},
"Kentucky":{pi:1,mm:1,wd:1,prod:1,note:"One of the shortest limits in the US — act fast."},
"Louisiana":{pi:2,mm:1,wd:1,prod:2,note:"Med-mal and wrongful death: only 1 year."},
"Maine":{pi:6,mm:3,wd:2,prod:6,note:"Among the longest PI windows in the country."},
"Maryland":{pi:3,mm:5,wd:3,prod:3,note:"Med-mal: 5 yrs from injury or 3 from discovery."},
"Massachusetts":{pi:3,mm:3,wd:3,prod:3,note:"Claims vs. public entities need presentment first."},
"Michigan":{pi:3,mm:2,wd:3,prod:3,note:"Med-mal requires 182-day notice before suing."},
"Minnesota":{pi:2,mm:4,wd:3,prod:4,note:"Med-mal has a longer 4-year window."},
"Mississippi":{pi:3,mm:2,wd:3,prod:3,note:"Latent-injury discovery rule applies."},
"Missouri":{pi:5,mm:2,wd:3,prod:5,note:"Generous 5-year PI window."},
"Montana":{pi:3,mm:3,wd:3,prod:3,note:"Standard 3-year limit."},
"Nebraska":{pi:4,mm:2,wd:2,prod:4,note:"Med-mal: 2 years from the act."},
"Nevada":{pi:2,mm:3,wd:2,prod:2,note:"Med-mal: 3 yrs from injury or 1 from discovery."},
"New Hampshire":{pi:3,mm:3,wd:3,prod:3,note:"Discovery rule for hidden injuries."},
"New Jersey":{pi:2,mm:2,wd:2,prod:2,note:"Tort claims vs. public entities: 90-day notice."},
"New Mexico":{pi:3,mm:3,wd:3,prod:3,note:"Med-mal capped with 3-year limit."},
"New York":{pi:3,mm:2.5,wd:2,prod:3,note:"Med-mal: 2.5 years; wrongful death: 2 years."},
"North Carolina":{pi:3,mm:3,wd:2,prod:3,note:"Contributory negligence state — any fault can bar recovery."},
"North Dakota":{pi:6,mm:2,wd:2,prod:6,note:"Long 6-year general PI window."},
"Ohio":{pi:2,mm:1,wd:2,prod:2,note:"Med-mal: only 1 year — one of the shortest."},
"Oklahoma":{pi:2,mm:2,wd:2,prod:2,note:"Government tort claims: 1 year."},
"Oregon":{pi:2,mm:2,wd:3,prod:2,note:"Discovery rule may extend filing time."},
"Pennsylvania":{pi:2,mm:2,wd:2,prod:2,note:"Claims vs. Commonwealth: 6-month notice."},
"Rhode Island":{pi:3,mm:3,wd:3,prod:3,note:"Product claims subject to 10-year repose period."},
"South Carolina":{pi:3,mm:3,wd:3,prod:3,note:"Tort claims vs. government: 2 years."},
"South Dakota":{pi:3,mm:2,wd:3,prod:3,note:"Med-mal: 2 years from the act."},
"Tennessee":{pi:1,mm:1,wd:1,prod:1,note:"1-year limit — act immediately."},
"Texas":{pi:2,mm:2,wd:2,prod:2,note:"Claims vs. government: 6-month notice."},
"Utah":{pi:4,mm:2,wd:2,prod:2,note:"Generous 4-year PI window."},
"Vermont":{pi:3,mm:3,wd:2,prod:3,note:"Standard 3-year limit."},
"Virginia":{pi:2,mm:2,wd:2,prod:2,note:"Contributory negligence state."},
"Washington":{pi:3,mm:3,wd:3,prod:3,note:"Claims vs. government: special filing rules."},
"West Virginia":{pi:2,mm:2,wd:2,prod:2,note:"Med-mal pre-suit notice required."},
"Wisconsin":{pi:3,mm:3,wd:3,prod:3,note:"Standard 3-year limit."},
"Wyoming":{pi:4,mm:2,wd:2,prod:4,note:"4-year general PI window."}
};
var TYPE_LABELS={pi:"Personal injury (general)",mm:"Medical malpractice",wd:"Wrongful death",prod:"Defective product"};
document.addEventListener('DOMContentLoaded',function(){
  var stateSel=document.getElementById('state'),typeSel=document.getElementById('injury-type'),res=document.getElementById('result');
  if(!stateSel){return;}
  Object.keys(STATUTES).sort().forEach(function(s){
    var o=document.createElement('option');o.value=s;o.textContent=s;stateSel.appendChild(o);
  });
  function render(){
    var s=stateSel.value,t=typeSel.value;
    if(!s||!t){res.classList.remove('show');return;}
    var d=STATUTES[s],yrs=d[t];
    var yrsText=yrs===1?"1 year":yrs+" years";
    document.getElementById('r-state').textContent=s;
    document.getElementById('r-type').textContent=TYPE_LABELS[t];
    document.getElementById('r-years').textContent=yrsText;
    document.getElementById('r-note').textContent=d.note+" This is a general reference only — exceptions (minors, discovery rule, government defendants) can change the deadline. Confirm with a licensed attorney in "+s+".";
    res.classList.add('show');
  }
  stateSel.addEventListener('change',render);
  typeSel.addEventListener('change',render);
});
