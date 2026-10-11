/* State-by-state exotic pet legality overview — educational, not legal advice */
(function () {
  "use strict";

  // level: green = generally permissive, amber = permits/restrictions, red = strict/bans
  var STATES = {
    "Alabama":   { level: "green", headline: "Few state-level restrictions", notes: "One of the least restrictive states. No state permit needed for most exotic pets, but big cats and bears face some rules. Cities may still have their own bans." },
    "Alaska":    { level: "amber", headline: "Permits for many species", notes: "Requires permits for various exotics. Big cats, bears, and some other large mammals are prohibited. Check the Alaska Dept. of Fish and Game before buying." },
    "Arizona":   { level: "amber", headline: "Restricted-species list", notes: "Arizona maintains a restricted wildlife list — primates, some large cats, and certain other mammals need permits. Reptiles and birds are broadly fine." },
    "Arkansas":  { level: "amber", headline: "Permits for large carnivores", notes: "Large carnivores (big cats, bears, wolves) require permits. Common pets like hedgehogs, reptiles, and small birds are generally fine." },
    "California": { level: "red", headline: "Very strict — many bans", notes: "Among the strictest states. BANNED: ferrets, hedgehogs, sugar gliders, gerbils, monkeys, and many reptiles (including some pythons). Even axolotls are banned. Always verify with CA Dept. of Fish and Wildlife." },
    "Colorado":  { level: "amber", headline: "Permits for some exotics", notes: "Requires permits for various wild/exotic species. Common reptiles and small birds are generally allowed; check Colorado Parks and Wildlife for specifics." },
    "Connecticut": { level: "amber", headline: "Permit required for most wild animals", notes: "Broad definition of 'wild animal' — most exotics beyond common pets need a DEEP permit. Check before buying anything unusual." },
    "Delaware":  { level: "amber", headline: "Permits for some species", notes: "Some exotic mammals and reptiles require state permits. Small common exotics are typically fine; verify with DNREC." },
    "Florida":   { level: "amber", headline: "Class I / II / III permit system", notes: "Florida classifies wildlife: Class III (most common exotics like hedgehogs, small reptiles) needs a no-cost permit; Class I & II (big cats, bears, large primates) need serious permits, experience, and inspections." },
    "Georgia":   { level: "amber", headline: "Wild animals need DNR permits", notes: "Native and many exotic wild animals require Georgia DNR permits. Common reptiles, birds, and small mammals are generally okay, but check the wild animal rules." },
    "Hawaii":    { level: "red", headline: "Strictest state — import controls", notes: "Hawaii's island ecosystem means extremely tight rules. Most exotic mammals are banned or need hard-to-get permits; even hamsters and gerbils are prohibited. Verify with the Hawaii Dept. of Agriculture." },
    "Idaho":     { level: "green", headline: "Few state restrictions", notes: "Very few state-level exotic pet restrictions. Local city rules can still apply, so check your municipality." },
    "Illinois":  { level: "amber", headline: "Permits for dangerous animals", notes: "Dangerous animals (big cats, bears, venomous reptiles, primates) are regulated and largely prohibited for private owners. Common small exotics are fine." },
    "Indiana":   { level: "amber", headline: "Permits for some; USDA rules apply", notes: "Some species need state permits; USDA licensing applies to commercial breeders. Wild animal possession rules tightened in recent years — verify current law." },
    "Iowa":      { level: "green", headline: "Few state restrictions", notes: "Minimal state-level exotic pet law. Counties and cities may have their own rules, so check locally." },
    "Kansas":    { level: "green", headline: "Minimal state laws", notes: "Kansas has very few state exotic pet restrictions. Local ordinances vary — check your city and county." },
    "Kentucky":  { level: "amber", headline: "Permits for inherently dangerous wildlife", notes: "Inherently dangerous animals (big cats, bears, large venomous reptiles) are restricted. Common exotic pets are generally allowed." },
    "Louisiana": { level: "amber", headline: "Permits for some species", notes: "Louisiana requires permits for various exotic species, including some big cats and primates. Verify with the Dept. of Wildlife and Fisheries." },
    "Maine":     { level: "amber", headline: "Permits for many exotics", notes: "Maine requires importation/possession permits for many exotic species. Some, like hedgehogs, have specific rules — check Maine Inland Fisheries and Wildlife." },
    "Maryland":  { level: "amber", headline: "Some species banned", notes: "Maryland bans certain species (including some big cats and bears) and requires permits for others. Common small exotics are typically allowed." },
    "Massachusetts": { level: "amber", headline: "Permits for many species", notes: "Broad exotic pet permit requirements. Some species like ferrets have special rules (ferrets are legal with restrictions). Check MassWildlife." },
    "Michigan":  { level: "amber", headline: "Large carnivores regulated", notes: "Michigan's Large Carnivore Act regulates big cats, bears, and wolf-dog hybrids. Smaller exotics are generally fine." },
    "Minnesota": { level: "amber", headline: "Permits for some species", notes: "Some exotic species require permits; regulated animals include big cats and bears. Verify with the MN DNR." },
    "Mississippi": { level: "amber", headline: "Permits for some species", notes: "Requires permits for inherently dangerous animals. Common exotic pets are generally allowed; check the Dept. of Wildlife, Fisheries, and Parks." },
    "Missouri":  { level: "green", headline: "Few state restrictions", notes: "Missouri is relatively permissive at the state level, though some large carnivores face rules. Local ordinances vary." },
    "Montana":   { level: "amber", headline: "Permits for some species", notes: "Montana requires permits for various exotic wildlife. Check Montana Fish, Wildlife and Parks for your specific species." },
    "Nebraska":  { level: "amber", headline: "Permits for some species", notes: "Some exotic species require permits from Nebraska Game and Parks. Common small exotics are typically fine." },
    "Nevada":    { level: "green", headline: "One of the most permissive states", notes: "Nevada has minimal exotic pet restrictions — even big cats are legal in some counties with permits. Cities like Las Vegas may have stricter local rules, so check locally." },
    "New Hampshire": { level: "amber", headline: "Permits for many species", notes: "Many exotic species require permits from NH Fish and Game. Some animals are outright prohibited — verify before buying." },
    "New Jersey": { level: "amber", headline: "Permits for exotic pets", notes: "New Jersey requires permits for exotic pets and bans some species outright (including axolotls and some others). Check NJ Fish and Wildlife." },
    "New Mexico": { level: "green", headline: "Few state restrictions", notes: "New Mexico has minimal exotic pet laws at the state level. Import rules for some species apply — check locally." },
    "New York":  { level: "red", headline: "Strict — many species banned", notes: "New York bans private ownership of wild animals including primates, big cats, bears, and venomous reptiles. NYC is even stricter (ferrets are banned in the city). Common reptiles and birds are generally fine." },
    "North Carolina": { level: "green", headline: "Minimal state restrictions", notes: "North Carolina has almost no state-level exotic pet law, but some counties and cities ban venomous reptiles and large carnivores. Check locally." },
    "North Dakota": { level: "amber", headline: "Permits for some species", notes: "Requires permits for various non-traditional livestock and exotic species. Verify with ND Game and Fish." },
    "Ohio":      { level: "red", headline: "Dangerous wild animals banned", notes: "After the 2011 Zanesville incident, Ohio bans private ownership of dangerous wild animals (big cats, bears, large primates, venomous snakes). Common small exotics remain legal." },
    "Oklahoma":  { level: "amber", headline: "Permits for some species", notes: "Oklahoma requires permits for some exotic species, particularly native big cats. Most common exotic pets are allowed." },
    "Oregon":    { level: "amber", headline: "Permits for some species", notes: "Oregon requires permits for various exotic animals and prohibits some (including certain big cats without permits). Check Oregon Dept. of Fish and Wildlife." },
    "Pennsylvania": { level: "amber", headline: "Exotic wildlife permits required", notes: "Pennsylvania requires exotic wildlife possession permits for many species. Some animals (like certain primates) face additional rules." },
    "Rhode Island": { level: "amber", headline: "Permits for many species", notes: "Rhode Island requires permits for possession of many exotic animals. Verify with RI Dept. of Environmental Management." },
    "South Carolina": { level: "green", headline: "Minimal state restrictions", notes: "South Carolina has very few state exotic pet laws, though some local rules exist. Venomous reptiles face some local restrictions." },
    "South Dakota": { level: "amber", headline: "Permits for some species", notes: "Some exotic species require permits from SD Game, Fish and Parks. Common small exotics are typically fine." },
    "Tennessee": { level: "amber", headline: "Permits for Class I wildlife", notes: "Tennessee classifies native wildlife; Class I species (bears, big cats, etc.) need permits. Most common exotic pets are allowed." },
    "Texas":     { level: "amber", headline: "Permits for dangerous wild animals", notes: "Texas requires permits/registration for dangerous wild animals (big cats, bears, large primates, some venomous). Rules vary by county — some counties ban more. Common exotics are broadly legal." },
    "Utah":      { level: "amber", headline: "Permits for some species", notes: "Utah requires certificates of registration for various exotic species. Check the Utah Division of Wildlife Resources." },
    "Vermont":   { level: "amber", headline: "Permits for wild animals", notes: "Vermont requires permits for possession of wild/exotic animals. Common small exotics are generally allowed with proper permits." },
    "Virginia":  { level: "amber", headline: "Permits for some species", notes: "Virginia requires permits for various exotic species and bans some outright. Check the Dept. of Wildlife Resources." },
    "Washington": { level: "amber", headline: "Permits; some species banned", notes: "Washington regulates 'potentially dangerous wild animals' — big cats, bears, wolves, and some primates are restricted. Common reptiles and small exotics are generally fine." },
    "West Virginia": { level: "red", headline: "Dangerous Wild Animal Act", notes: "West Virginia's Dangerous Wild Animal Act bans private ownership of big cats, bears, large primates, and other dangerous species. Common small exotics remain legal." },
    "Wisconsin": { level: "green", headline: "Minimal state restrictions", notes: "Wisconsin has few state-level exotic pet restrictions. Some local ordinances apply — check your city and county." },
    "Wyoming":   { level: "amber", headline: "Permits for some species", notes: "Wyoming requires permits for various exotic species through Game and Fish. Common small exotics are typically allowed." }
  };

  var LEVEL_META = {
    green: { cls: "badge-green", label: "Generally permissive" },
    amber: { cls: "badge-amber", label: "Permits / restrictions apply" },
    red:   { cls: "badge-red",   label: "Strict / bans in place" }
  };

  function check() {
    var sel = document.getElementById("state");
    var box = document.getElementById("law-result");
    var name = sel.value;
    if (!name || !STATES[name]) {
      box.innerHTML = "<h3>👆 Choose a state first</h3><p>Pick your state from the dropdown to see its exotic pet rules.</p>";
      box.classList.add("show");
      return;
    }
    var s = STATES[name];
    var meta = LEVEL_META[s.level];
    var html = "<h3>⚖️ " + name + "</h3>" +
      '<span class="state-badge ' + meta.cls + '">' + meta.label + "</span>" +
      "<p><strong>" + s.headline + ".</strong></p>" +
      "<p>" + s.notes + "</p>" +
      "<p>⚠️ This is an overview, not legal advice. County and city rules may be stricter — " +
      'always verify with your state wildlife agency. Then <a href="pet-selector.html">find your pet match</a> ' +
      'and <a href="care-cost.html">estimate its cost</a>.</p>';
    box.innerHTML = html;
    box.classList.add("show");
    box.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var sel = document.getElementById("state");
    if (sel) {
      Object.keys(STATES).sort().forEach(function (name) {
        var opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        sel.appendChild(opt);
      });
    }
    var btn = document.getElementById("check-btn");
    if (btn) btn.addEventListener("click", check);
  });
})();
