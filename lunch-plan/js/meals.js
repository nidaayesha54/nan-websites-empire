/* LunchPlan meal ideas database.
   nuts:false = safe for nut-free schools. nuts:true = contains nuts / may contain. */
const MEALS = [
  {id:"turkey-rollups", name:"Turkey & Cheese Roll-Ups", cat:"Sandwiches & Wraps", nuts:false, mins:5, ingredients:["deli turkey slices","cheddar cheese slices","flour tortillas","baby carrots"]},
  {id:"diy-lunchables", name:"DIY Lunchables", cat:"Sandwiches & Wraps", nuts:false, mins:5, ingredients:["whole-grain crackers","colby jack cheese cubes","deli ham","apple slices"]},
  {id:"ham-cheese-sand", name:"Ham & Cheese Sandwich", cat:"Sandwiches & Wraps", nuts:false, mins:5, ingredients:["whole-wheat bread","deli ham","swiss cheese","lettuce"]},
  {id:"tuna-sand", name:"Tuna Salad Sandwich", cat:"Sandwiches & Wraps", nuts:false, mins:10, ingredients:["canned tuna","mayo","celery","whole-wheat bread"]},
  {id:"egg-salad-sand", name:"Egg Salad Sandwich", cat:"Sandwiches & Wraps", nuts:false, mins:10, ingredients:["eggs","mayo","mustard","whole-wheat bread"]},
  {id:"grilled-cheese", name:"Grilled Cheese (thermos-warm)", cat:"Sandwiches & Wraps", nuts:false, mins:10, ingredients:["bread","cheddar cheese","butter"]},
  {id:"chicken-caesar-wrap", name:"Chicken Caesar Wrap", cat:"Sandwiches & Wraps", nuts:false, mins:10, ingredients:["grilled chicken strips","romaine lettuce","caesar dressing","large tortillas","parmesan"]},
  {id:"hummus-veggie-wrap", name:"Hummus & Veggie Wrap", cat:"Sandwiches & Wraps", nuts:false, mins:5, ingredients:["hummus","tortillas","cucumber","shredded carrots","spinach"]},
  {id:"sunbutter-jelly", name:"Sunflower Butter & Jelly", cat:"Sandwiches & Wraps", nuts:false, mins:5, ingredients:["sunflower seed butter","grape jelly","whole-wheat bread"]},
  {id:"pbj", name:"Classic PB&J", cat:"Sandwiches & Wraps", nuts:true, mins:5, ingredients:["peanut butter","grape jelly","whole-wheat bread"]},
  {id:"pasta-salad", name:"Rainbow Pasta Salad", cat:"Pasta & Rice", nuts:false, mins:15, ingredients:["rotini pasta","cherry tomatoes","cucumber","italian dressing","shredded mozzarella"]},
  {id:"mac-cheese", name:"Mac & Cheese Cups", cat:"Pasta & Rice", nuts:false, mins:15, ingredients:["elbow macaroni","cheddar cheese","milk","butter"]},
  {id:"chicken-fried-rice", name:"Chicken Fried Rice", cat:"Pasta & Rice", nuts:false, mins:20, ingredients:["cooked rice","diced chicken","frozen peas & carrots","soy sauce","eggs"]},
  {id:"egg-fried-rice", name:"Egg Fried Rice", cat:"Pasta & Rice", nuts:false, mins:15, ingredients:["cooked rice","eggs","frozen peas","soy sauce","sesame oil"]},
  {id:"spaghetti-meatballs", name:"Spaghetti & Meatballs", cat:"Pasta & Rice", nuts:false, mins:20, ingredients:["spaghetti","frozen meatballs","marinara sauce","parmesan"]},
  {id:"pesto-pasta", name:"Pesto Pasta", cat:"Pasta & Rice", nuts:true, mins:15, ingredients:["penne pasta","basil pesto (pine nuts)","parmesan"]},
  {id:"chicken-quesadilla", name:"Chicken Quesadilla", cat:"Mexican-Inspired", nuts:false, mins:10, ingredients:["flour tortillas","shredded chicken","mexican cheese blend","salsa cup"]},
  {id:"bean-burrito", name:"Bean & Cheese Burrito", cat:"Mexican-Inspired", nuts:false, mins:10, ingredients:["refried beans","flour tortillas","cheddar cheese","sour cream cup"]},
  {id:"taco-cups", name:"Taco Cups", cat:"Mexican-Inspired", nuts:false, mins:15, ingredients:["wonton wrappers","ground turkey","taco seasoning","shredded lettuce","cheddar"]},
  {id:"chicken-nuggets", name:"Homemade Chicken Nuggets", cat:"Warm Favorites", nuts:false, mins:20, ingredients:["chicken breast","breadcrumbs","eggs","flour","ketchup cup"]},
  {id:"pizza-bagel", name:"Pizza Bagel", cat:"Warm Favorites", nuts:false, mins:10, ingredients:["mini bagels","pizza sauce","shredded mozzarella","turkey pepperoni"]},
  {id:"chicken-noodle-soup", name:"Chicken Noodle Soup (thermos)", cat:"Warm Favorites", nuts:false, mins:20, ingredients:["chicken broth","egg noodles","diced chicken","carrots","celery"]},
  {id:"mini-pancakes", name:"Mini Pancakes & Fruit", cat:"Warm Favorites", nuts:false, mins:15, ingredients:["pancake mix","maple syrup cup","strawberries","blueberries"]},
  {id:"pita-hummus", name:"Pita & Hummus Bento", cat:"Bento Boxes", nuts:false, mins:5, ingredients:["pita triangles","hummus cups","cucumber sticks","cherry tomatoes","cheese cubes"]},
  {id:"cheese-crackers", name:"Cheese & Crackers Bento", cat:"Bento Boxes", nuts:false, mins:5, ingredients:["cheddar cubes","whole-grain crackers","grapes","turkey slices"]},
  {id:"bagel-cream-cheese", name:"Bagel & Cream Cheese", cat:"Bento Boxes", nuts:false, mins:5, ingredients:["mini bagels","cream cheese cups","banana","yogurt tube"]},
  {id:"yogurt-parfait", name:"Yogurt Parfait", cat:"Bento Boxes", nuts:false, mins:5, ingredients:["greek yogurt","mixed berries","honey","nut-free granola"]},
  {id:"trail-mix-box", name:"Trail Mix Snack Box", cat:"Bento Boxes", nuts:true, mins:5, ingredients:["mixed nuts","raisins","m&ms","pretzels","cheese stick"]},
  {id:"chicken-salad-cups", name:"Chicken Salad Lettuce Cups", cat:"Light & Fresh", nuts:false, mins:10, ingredients:["canned chicken","mayo","grapes","butter lettuce","crackers"]},
  {id:"veggie-noodles", name:"Veggie Lo Mein Noodles", cat:"Light & Fresh", nuts:false, mins:15, ingredients:["lo mein noodles","stir-fry veggie mix","soy sauce","sesame oil"]}
];
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
function mealById(id){ return MEALS.find(m=>m.id===id); }
