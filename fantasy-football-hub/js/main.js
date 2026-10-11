// FantasyFootballHub shared JS
(function(){
  // Sample player data — DEMO data, not real current-season stats
  window.SAMPLE_PLAYERS = [
    {id:'gk1', name:'Emre Kaya', pos:'GK', price:4.5, goals:0, assists:0, cs:9, pts:112, team:'Brightfield United'},
    {id:'gk2', name:'Marco Silvestri', pos:'GK', price:5.5, goals:0, assists:1, cs:12, pts:141, team:'Kingsport City'},
    {id:'d1', name:'Victor Lindqvist', pos:'DEF', price:6.0, goals:3, assists:6, cs:13, pts:158, team:'Kingsport City'},
    {id:'d2', name:'Diego Ferreira', pos:'DEF', price:5.5, goals:2, assists:5, cs:11, pts:139, team:'Real Marbella'},
    {id:'d3', name:'Tom Becker', pos:'DEF', price:5.0, goals:4, assists:2, cs:10, pts:131, team:'Northfield Rovers'},
    {id:'d4', name:'Kwame Owusu', pos:'DEF', price:4.5, goals:1, assists:7, cs:8, pts:118, team:'Brightfield United'},
    {id:'d5', name:'Luca Marchetti', pos:'DEF', price:4.0, goals:2, assists:3, cs:7, pts:101, team:'Harbour FC'},
    {id:'m1', name:'Arjun Mehta', pos:'MID', price:11.5, goals:18, assists:11, cs:10, pts:246, team:'Kingsport City'},
    {id:'m2', name:'Sofia Andersson', pos:'MID', price:9.5, goals:12, assists:9, cs:8, pts:198, team:'Real Marbella'},
    {id:'m3', name:'James Okafor', pos:'MID', price:8.0, goals:9, assists:12, cs:9, pts:187, team:'Brightfield United'},
    {id:'m4', name:'Pedro Alvarez', pos:'MID', price:7.5, goals:8, assists:8, cs:11, pts:172, team:'Northfield Rovers'},
    {id:'m5', name:'Noah Schmidt', pos:'MID', price:6.0, goals:6, assists:5, cs:9, pts:140, team:'Harbour FC'},
    {id:'m6', name:'Callum Reid', pos:'MID', price:5.0, goals:4, assists:6, cs:8, pts:119, team:'Eastport Town'},
    {id:'f1', name:'Dario Costa', pos:'FWD', price:12.5, goals:24, assists:6, cs:0, pts:252, team:'Real Marbella'},
    {id:'f2', name:'Ibrahim Diallo', pos:'FWD', price:10.5, goals:19, assists:8, cs:0, pts:218, team:'Kingsport City'},
    {id:'f3', name:'Harry Linden', pos:'FWD', price:8.5, goals:14, assists:7, cs:0, pts:179, team:'Northfield Rovers'},
    {id:'f4', name:'Rafael Duarte', pos:'FWD', price:7.0, goals:11, assists:5, cs:0, pts:152, team:'Brightfield United'},
    {id:'f5', name:'Owen Gallagher', pos:'FWD', price:5.5, goals:8, assists:4, cs:0, pts:124, team:'Eastport Town'},
    {id:'f6', name:'Yusuf Karim', pos:'FWD', price:4.5, goals:5, assists:3, cs:0, pts:98, team:'Harbour FC'}
  ];
  window.FORMATIONS = {
    '4-4-2': {DEF:4, MID:4, FWD:2},
    '4-3-3': {DEF:4, MID:3, FWD:3},
    '3-5-2': {DEF:3, MID:5, FWD:2},
    '5-3-2': {DEF:5, MID:3, FWD:2},
    '3-4-3': {DEF:3, MID:4, FWD:3}
  };
})();
