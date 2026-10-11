/* FootballTacticsHub — searchable tactics glossary */
(function () {
  "use strict";

  var TERMS = [
    { t: "Gegenpressing", c: "Pressing", d: "German for 'counter-pressing': pressing immediately after losing the ball to win it back within 5–8 seconds. Popularised by Jürgen Klopp." },
    { t: "Tiki-taka", c: "Possession", d: "A possession style built on short, rapid passes and constant movement, keeping the ball to control the game. Associated with Pep Guardiola's Barcelona and Spain." },
    { t: "Low block", c: "Defending", d: "Defending deep near your own goal with compact lines, giving up space in midfield but denying space behind. The classic underdog tactic." },
    { t: "High block / high press", c: "Pressing", d: "Pushing the whole team up the pitch to press the opposition near their own goal. Aggressive but risky — leaves space behind." },
    { t: "False nine", c: "Attacking", d: "A striker who drops deep into midfield instead of staying on the shoulder of the last defender, dragging centre-backs out of position. Lionel Messi under Guardiola is the famous example." },
    { t: "Inverted winger", c: "Attacking", d: "A winger who plays on the opposite side to their strong foot (right-footer on the left) so they can cut inside and shoot." },
    { t: "Inverted full-back", c: "Possession", d: "A full-back who moves into central midfield in possession rather than overlapping wide. A Guardiola signature that adds a body in the middle." },
    { t: "Overlapping full-back", c: "Attacking", d: "A full-back who runs beyond the winger on the outside to deliver crosses. The traditional source of width." },
    { t: "Wing-back", c: "Formations", d: "A hybrid of winger and full-back used in 3-5-2 and 5-3-2: provides all the team's width, attacking and defending the whole flank." },
    { t: "Double pivot", c: "Formations", d: "Two holding midfielders screening the defence, as in 4-2-3-1. Provides defensive balance and a platform to build play." },
    { t: "Regista", c: "Roles", d: "Italian for 'director': a deep-lying playmaker who dictates tempo from in front of the defence (e.g. Andrea Pirlo)." },
    { t: "Number 10", c: "Roles", d: "The classic playmaker operating between midfield and attack, linking play and creating chances in the 'hole'." },
    { t: "Box-to-box midfielder", c: "Roles", d: "A midfielder who covers the whole pitch — defending in their own box and arriving late in the opposition's." },
    { t: "Ball-playing centre-back", c: "Roles", d: "A defender comfortable carrying the ball out and breaking lines with passes, essential for teams that build from the back." },
    { t: "Sweeper-keeper", c: "Roles", d: "A goalkeeper who plays high and acts as an extra outfield player, sweeping behind a high defensive line (e.g. Manuel Neuer, Ederson)." },
    { t: "Target man", c: "Roles", d: "A physical striker used as the focal point: holds the ball up, wins headers and brings others into play." },
    { t: "Poacher", c: "Roles", d: "A striker who lives in the six-yard box, scoring from rebounds, tap-ins and clever movement rather than build-up play." },
    { t: "Pressing trigger", c: "Pressing", d: "A specific cue — like a bad touch or a pass to a full-back — that tells the team to start pressing as a unit." },
    { t: "Counter-press", c: "Pressing", d: "Another name for gegenpressing: the immediate collective press the moment possession is lost." },
    { t: "Transition", c: "Attacking", d: "The moments right after possession changes hands — attacking transition (win the ball → attack) and defensive transition (lose the ball → reorganise). Modern tactics obsess over these seconds." },
    { t: "Counter-attack", c: "Attacking", d: "Attacking at speed into the space left by an opponent committed forward, before they can reorganise." },
    { t: "Rest defence", c: "Defending", d: "How a team positions its players behind the ball while attacking, so it's protected against counter-attacks." },
    { t: "High line", c: "Defending", d: "Defenders positioned near the halfway line to compress the pitch and support the press. Vulnerable to balls in behind without pace or a sweeper-keeper." },
    { t: "Offside trap", c: "Defending", d: "Defenders stepping up in unison to catch attackers offside — high-risk, high-reward, needs perfect timing." },
    { t: "Zonal marking", c: "Defending", d: "Defending spaces rather than individual opponents. Each player is responsible for a zone." },
    { t: "Man marking", c: "Defending", d: "Each defender follows a specific opponent everywhere. Rare as a team system now, still used for key threats." },
    { t: "Half-space", c: "Attacking", d: "The channel between the wing and the centre — the zone Guardiola calls the most dangerous area to receive the ball." },
    { t: "Overload", c: "Attacking", d: "Creating a numerical advantage (e.g. 3v2) in one area of the pitch to break through." },
    { t: "Underlap", c: "Attacking", d: "Running inside a team-mate (rather than outside/overlapping) to receive the ball in the half-space." },
    { t: "Third-man run", c: "Attacking", d: "A player making a run beyond the ball carrier, released by a combination between two team-mates — devastating against pressing teams." },
    { t: "Build-up / playing out from the back", c: "Possession", d: "Starting attacks with short passes from the goalkeeper through the defence, drawing the press before playing through it." },
    { t: "Long ball", c: "Attacking", d: "Bypassing midfield with direct passes to forwards — the opposite of build-up play, effective with a target man." },
    { t: "Parking the bus", c: "Defending", d: "Slang for ultra-defensive play: everyone behind the ball, protecting the goal at all costs." },
    { t: "Total football", c: "Possession", d: "The Dutch 1970s philosophy where any outfield player can take over any team-mate's role — the ancestor of modern positional play." },
    { t: "Positional play (juego de posición)", c: "Possession", d: "Guardiola's system: players occupy specific zones to create passing lanes, numerical superiorities and positional advantages." },
    { t: "Verticality", c: "Attacking", d: "Playing forward quickly with progressive passes and runs, prioritising penetration over possession." },
    { t: "Progressive pass", c: "Attacking", d: "A pass that moves the ball significantly closer to the opponent's goal — a key stat for measuring attacking intent." },
    { t: "xG (expected goals)", c: "Analytics", d: "A stat measuring the quality of a chance: the probability it becomes a goal, from 0 to 1. High xG = great chance." },
    { t: "PPDA (passes per defensive action)", c: "Analytics", d: "A pressing-intensity metric: how many passes a team allows before making a tackle, interception or foul. Lower = more intense press." },
    { t: "Set-piece routine", c: "Attacking", d: "A rehearsed plan for corners and free-kicks — blocking, decoy runs and near-post flicks. A huge source of goals for well-drilled teams." },
    { t: "Mid-block", c: "Defending", d: "Defending in the middle third: compact but not camped on the goal line. The balanced default for many teams." },
    { t: "Shadow striker", c: "Roles", d: "An attacking midfielder who plays just behind the striker, making late runs into the box unseen by defenders." },
    { t: "Mezzala", c: "Roles", d: "Italian for 'half-winger': a central midfielder who drifts wide into the half-space to attack, common in a midfield three." },
    { t: "Carrilero", c: "Roles", d: "Spanish for 'lane-runner': a shuttling midfielder who covers the wide channels, linking defence and attack." },
    { t: "Libero", c: "Roles", d: "The classic free sweeper behind the defence, stepping into midfield with the ball. Rare today but echoed by ball-playing centre-backs." },
    { t: "Catenaccio", c: "Defending", d: "The famous Italian system of the 1960s: extreme defensive organisation with a sweeper, built on 1-0 wins." },
    { t: "Route one", c: "Attacking", d: "Slang for the most direct long-ball football: goalkeeper to striker, bypassing everyone in between." }
  ];

  var listEl = document.getElementById("gloss-list");
  var searchEl = document.getElementById("gloss-search");
  var filterEl = document.getElementById("gloss-filters");
  var countEl = document.getElementById("term-count");
  if (!listEl) return;

  var CATS = ["All"];
  TERMS.forEach(function (x) { if (CATS.indexOf(x.c) === -1) CATS.push(x.c); });
  var activeCat = "All";

  // term count
  if (countEl) countEl.textContent = TERMS.length;

  // category filter buttons
  CATS.forEach(function (c) {
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = c;
    b.className = c === "All" ? "" : "secondary";
    b.style.fontSize = ".9rem";
    b.addEventListener("click", function () {
      activeCat = c;
      var btns = filterEl.querySelectorAll("button");
      for (var i = 0; i < btns.length; i++) {
        btns[i].className = btns[i].textContent === c ? "" : "secondary";
        btns[i].style.fontSize = ".9rem";
      }
      render();
    });
    filterEl.appendChild(b);
  });

  function render() {
    var q = (searchEl.value || "").trim().toLowerCase();
    var shown = 0;
    listEl.innerHTML = "";
    TERMS.forEach(function (x) {
      var matchCat = activeCat === "All" || x.c === activeCat;
      var matchQ = !q || x.t.toLowerCase().indexOf(q) !== -1 || x.d.toLowerCase().indexOf(q) !== -1;
      if (!matchCat || !matchQ) return;
      shown++;
      var div = document.createElement("div");
      div.className = "term";
      var tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = x.c;
      var h = document.createElement("h3");
      h.textContent = x.t;
      var p = document.createElement("p");
      p.textContent = x.d;
      div.appendChild(tag); div.appendChild(h); div.appendChild(p);
      listEl.appendChild(div);
    });
    if (shown === 0) {
      listEl.innerHTML = '<p class="hint">No terms found — try "press", "block" or "midfield".</p>';
    }
  }

  searchEl.addEventListener("input", render);
  render();
})();
