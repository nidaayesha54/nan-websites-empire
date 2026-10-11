/* Grocery list page logic. Requires js/meals.js loaded first. */
const LS_PLAN = "lunchplan_week_v1";
const LS_CHECKED = "lunchplan_checked_v1";
let plan = JSON.parse(localStorage.getItem(LS_PLAN) || "{}");
let checked = JSON.parse(localStorage.getItem(LS_CHECKED) || "[]");

function catOf(item){
  const s = item.toLowerCase();
  if(/bread|tortilla|bagel|pasta|noodle|rice|cracker|granola|wonton|pita|crouton/.test(s)) return "Bakery & Grains";
  if(/cheese|yogurt|milk|butter|egg|cream/.test(s)) return "Dairy & Eggs";
  if(/turkey|ham|chicken|tuna|pepperoni|bacon|meatball/.test(s)) return "Meat & Deli";
  if(/apple|banana|grape|berr|orange|lemon|avocado|tomato/.test(s)) return "Produce";
  if(/lettuce|spinach|carrot|cucumber|celery|broccoli|veggie|pea|corn|onion|pepper/.test(s)) return "Produce";
  if(/peanut|almond|walnut|cashew|pistachio|trail/.test(s)) return "Nuts & Snacks";
  return "Pantry & Condiments";
}
function esc(s){ return String(s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }

function renderList(){
  const wrap = document.getElementById("groceryWrap");
  const counts = {};
  const daysUsed = [];
  Object.keys(plan).forEach(day=>{
    const m = mealById(plan[day]);
    if(m){ daysUsed.push(day+": "+m.name); m.ingredients.forEach(i=>{ counts[i]=(counts[i]||0)+1; }); }
  });
  if(!Object.keys(counts).length){
    wrap.innerHTML = "<div class='card' style='text-align:center'><div class='emoji'>🍱</div><h3>No lunches planned yet</h3><p>Head to the <a href='weekly-planner.html' style='color:var(--orange);font-weight:700'>weekly planner</a> and pick meals for the week — your grocery list builds itself automatically.</p></div>";
    document.getElementById("listToolbar").style.display = "none";
    return;
  }
  const groups = {};
  Object.keys(counts).sort().forEach(item=>{
    const c = catOf(item);
    (groups[c] = groups[c] || []).push(item);
  });
  let html = "<p class='meta-line'>From: "+esc(daysUsed.join(" • "))+"</p>";
  Object.keys(groups).sort().forEach(cat=>{
    html += "<div class='grocery-cat'>"+esc(cat)+"</div>";
    groups[cat].forEach(item=>{
      const isChecked = checked.includes(item);
      html += "<label class='grocery-item"+(isChecked?" done":"")+"'><input type='checkbox' data-item='"+esc(item)+"'"+(isChecked?" checked":"")+"><span>"+esc(item)+(counts[item]>1?" <small style='color:var(--muted)'>(×"+counts[item]+")</small>":"")+"</span></label>";
    });
  });
  wrap.innerHTML = html;
  wrap.querySelectorAll("input[type=checkbox]").forEach(cb=>{
    cb.addEventListener("change", ()=>{
      const it = cb.getAttribute("data-item");
      if(cb.checked && !checked.includes(it)) checked.push(it);
      if(!cb.checked) checked = checked.filter(x=>x!==it);
      localStorage.setItem(LS_CHECKED, JSON.stringify(checked));
      cb.closest(".grocery-item").classList.toggle("done", cb.checked);
    });
  });
  document.getElementById("itemCount").textContent = Object.keys(counts).length + " items";
}

document.addEventListener("DOMContentLoaded", ()=>{
  renderList();
  document.getElementById("printList").addEventListener("click", ()=>window.print());
  document.getElementById("resetChecked").addEventListener("click", ()=>{ checked=[]; localStorage.setItem(LS_CHECKED,"[]"); renderList(); });
  document.querySelectorAll(".faq-q").forEach(b=>b.addEventListener("click",()=>b.parentElement.classList.toggle("open")));
});
