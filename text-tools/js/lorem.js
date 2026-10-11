/* Lorem ipsum generator */
var LOREM_WORDS = ('lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum').split(' ');
function randomWord() { return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]; }
function makeSentence() {
  var n = 6 + Math.floor(Math.random() * 10);
  var words = [];
  for (var i = 0; i < n; i++) words.push(randomWord());
  var s = words.join(' ');
  return s.charAt(0).toUpperCase() + s.slice(1) + '.';
}
function makeParagraph() {
  var n = 3 + Math.floor(Math.random() * 3);
  var s = [];
  for (var i = 0; i < n; i++) s.push(makeSentence());
  return s.join(' ');
}
function generateLorem() {
  var type = document.getElementById('lorem-type').value;
  var count = Math.max(1, Math.min(100, parseInt(document.getElementById('lorem-count').value, 10) || 1));
  var out = [];
  if (type === 'paragraphs') for (var i = 0; i < count; i++) out.push(makeParagraph());
  else if (type === 'sentences') for (var j = 0; j < count; j++) out.push(makeSentence());
  else { for (var k = 0; k < count; k++) out.push(randomWord()); }
  var sep = type === 'words' ? ' ' : '\n\n';
  document.getElementById('lorem-output').value = out.join(sep);
}
document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById('lorem-output')) generateLorem();
});
