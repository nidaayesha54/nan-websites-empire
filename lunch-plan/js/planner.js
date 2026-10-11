/* LunchPlan weekly planner logic. Requires js/meals.js loaded first. */
const LS_PLAN = "lunchplan_week_v1";
const LS_NUTFREE = "lunchplan_nutfree_v1";
let plan = JSON.parse(localStorage.getItem(LS_PLAN) || "{}");
let nutFree = localStorage.getItem(LS_NUTFREE) === "1";
let activeDay = null;

function save(){ localStorage.setItem(LS_PLAN, JSON.stringify(plan)); }

function visibleMeals(){
  return nutFree ? MEALS.filter(m=>!m.nuts) : MEALS;
}

function renderWeek(){
  const grid = document.getElementById("weekGrid");
  grid.innerHTML = "";
  DAYS.forEach(day=>{
    const mealId = plan[day];
    const meal = mealId ? mealById(mealId) : null;
    const card = document.createElement("div");
    card.className = "day-card" + (meal ? " filled" : "");
    card.innerHTML = "<h4>"+day+"</h4>" +
      (meal
        ? "<div class='meal'>"+esc(meal.name)+"</div><div class='meta'>"+meal.mins+" min prep &bull; "+esc(meal.cat)+"</div><div style='margin-top:8px'><button class='btn ghost' style='padding:6px 14px;font-size:.8rem' data-change='"+day+"'>Change</button> <button class='btn ghost' style='padding:6px 14px;font-size:.8rem' data-clear='"+day+"'>Clear</button></div>"
        : "<div class='meta'>Tap to pick a lunch</div><div style='font-size:2rem;margin-top:8px'>+</div>");
    card.addEventListener("click", e=>{
      const ch = e.target.getAttribute("data-change");
      const cl = e.target.getAttribute("data-clear");
      if(cl){ delete plan[cl]; save(); renderWeek(); return; }
      openPicker(ch || day);
    });
    grid.appendChild(card);
  });
  const count = Object.keys(plan).length;
  document.getElementById("planCount").textContent = count + " of 5 days planned";
  document.getElementById("goGrocery").style.display = count ? "" : "none";
}

function openPicker(day){
  activeDay = day;
  document.getElementById("pickerTitle").textContent = "Pick lunch for " + day;
  renderMealOptions("");
  document.getElementById("pickerModal").classList.add("open");
}
function closePicker(){ document.getElementById("pickerModal").classList.remove("open"); }

function renderMealOptions(q){
  const list = document.getElementById("mealList");
  const meals = visibleMeals().filter(m =>
    !q || m.name.toLowerCase().includes(q) || m.cat.toLowerCase().includes(q));
  list.innerHTML = meals.length ? "" : "<p style='color:var(--muted)'>No meals match. Try another search.</p>";
  meals.forEach(m=>{
    const d = document.createElement("div");
    d.className = "meal-opt";
    d.innerHTML = "<div><strong>"+esc(m.name)+"</strong><div class='meta' style='font-size:.8rem;color:var(--muted)'>"+m.mins+" min &bull; "+esc(m.cat)+"</div></div>" +
      "<span class='badge "+(m.nuts?"nuts":"nf")+"'>"+(m.nuts?"Contains nuts":"Nut-free")+"</span>";
    d.addEventListener("click", ()=>{
      plan[activeDay] = m.id; save(); closePicker(); renderWeek();
    });
    list.appendChild(d);
  });
}

function esc(s){ return String(s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }

function buildGroceryList(){
  const counts = {};
  Object.values(plan).forEach(id=>{
    const m = mealById(id);
    if(m) m.ingredients.forEach(i=>{ counts[i]=(counts[i]||0)+1; });
  });
  return counts;
}

document.addEventListener("DOMContentLoaded", ()=>{
  const t = document.getElementById("nutFreeToggle");
  t.classList.toggle("on", nutFree);
  t.addEventListener("click", ()=>{
    nutFree = !nutFree;
    t.classList.toggle("on", nutFree);
    localStorage.setItem(LS_NUTFREE, nutFree ? "1" : "0");
    // drop nut-containing meals if toggle turned on
    if(nutFree){
      Object.keys(plan).forEach(d=>{
        const m = mealById(plan[d]);
        if(m && m.nuts) delete plan[d];
      });
      save();
    }
    renderWeek();
  });
  document.getElementById("mealSearch").addEventListener("input", e=>renderMealOptions(e.target.value.toLowerCase()));
  document.getElementById("pickerClose").addEventListener("click", closePicker);
  document.getElementById("pickerModal").addEventListener("click", e=>{ if(e.target.id==="pickerModal") closePicker(); });
  document.getElementById("clearWeek").addEventListener("click", ()=>{ if(confirm("Clear the whole week?")){ plan={}; save(); renderWeek(); }});
  document.getElementById("surpriseMe").addEventListener("click", ()=>{
    const pool = visibleMeals();
    const days = DAYS.slice();
    const picked = [];
    while(picked.length < 5 && pool.length){
      const m = pool[Math.floor(Math.random()*pool.length)];
      if(!picked.includes(m.id)) picked.push(m.id);
    }
    days.forEach((d,i)=>{ if(picked[i]) plan[d]=picked[i]; });
    save(); renderWeek();
  });
  document.querySelectorAll(".faq-q").forEach(b=>b.addEventListener("click",()=>b.parentElement.classList.toggle("open")));
  renderWeek();
});
