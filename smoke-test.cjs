const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const html = fs.readFileSync(__dirname + '/index.html', 'utf8');
const script = fs.readFileSync(__dirname + '/app.js', 'utf8');
assert(html.includes('<script src="app.js" defer></script>'), 'separate application script is linked');
assert(html.includes('href="styles.css"'), 'separate stylesheet is linked');
assert(fs.existsSync(__dirname + '/assets/black-ed-campaign.webp'), 'campaign artwork exists');

const listeners = {};
const nodes = new Map();
function node(id='') {
  return { id, innerHTML:'', textContent:'', value:'', checked:false, disabled:false, style:{}, attrs:{}, classList:{open:false,add(v){this.open=true;},remove(){this.open=false;},toggle(){}}, setAttribute(k,v){this.attrs[k]=v;}, getAttribute(k){return this.attrs[k];}, focus(){}, setSelectionRange(){}, click(){}, files:[] };
}
for (const id of ['age-gate','site','app','game-layer','toast','age-confirm','consent-confirm','enter-house','new-player','custom-prompt','game-search','wheel','wheel-result','profile-name','comfort-level','import-backup']) nodes.set('#'+id,node(id));
nodes.get('#enter-house').disabled=true;
const document = {
  body:{style:{}},
  addEventListener(name,fn){listeners[name]=fn;},
  querySelector(sel){if(!nodes.has(sel))nodes.set(sel,node(sel));return nodes.get(sel);},
  querySelectorAll(){return [];},
  createElement(){return node('created');}
};
const storage = new Map();
const context = {
  document, window:{scrollTo(){}}, navigator:{}, location:{protocol:'file:',href:'file:///index.html'},
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},
  setTimeout:(fn)=>{fn();return 1;},clearTimeout(){},setInterval:()=>1,clearInterval(){},
  URL:{createObjectURL:()=>'',revokeObjectURL(){}}, Blob:function(){}, FileReader:function(){},
  confirm:()=>true, Math, Date, JSON, Array, Object, String, Number, RegExp, console
};
vm.createContext(context);
vm.runInContext(script, context, {timeout:5000});
assert(nodes.get('#enter-house').disabled, 'age gate starts locked');
nodes.get('#age-confirm').checked=true;
nodes.get('#consent-confirm').checked=true;
listeners.change({target:nodes.get('#age-confirm')});
assert(!nodes.get('#enter-house').disabled, 'enter unlocks after both acknowledgements');
function click(dataset={}, id='') {
  const target={id,dataset};
  listeners.click({target:{closest:()=>target},preventDefault(){}});
  return target;
}
click({}, 'enter-house');
assert(nodes.get('#app').innerHTML.includes('BIG BOSS'), 'house page renders show title');
assert(nodes.get('#app').innerHTML.includes('BLACKED'), 'house page renders primary innerwear brand');
assert(nodes.get('#app').innerHTML.includes('Daily mission'), 'house page has a daily task');
assert((nodes.get('#app').innerHTML.match(/data-start-game=/g)||[]).length>=10, 'house quick-launch grid renders');

const ids=['naughty-wheel','truth-bomb','dare-double','secret-crush','chemistry-test','eye-contact','model-walk','pose-challenge','compliment-battle','mystery-box','who-knows-whom','forbidden-question','couple-sync','temptation-test','secret-mission','boss-says','hot-seat','winner-choice','final-temptation','fashion-show','task-arena','confession-room','date-night-generator'];
click({view:'games'});
assert((nodes.get('#app').innerHTML.match(/data-start-game=/g)||[]).length===23, 'game catalogue renders 23 playable modes');
for(const id of ids){
  click({startGame:id});
  assert(nodes.get('#game-layer').innerHTML.includes('COMPLETE'), id+' opens a playable prompt and completion action');
  click({action:'complete'});
}
let saved=JSON.parse(storage.get('black-ed-big-boss-ke-randiya-v1'));
assert(saved.completed===23, 'all 23 game modes can complete and persist a round');
assert(saved.history.length===23, 'round history is saved');
assert(Object.values(saved.scores).reduce((a,b)=>a+b,0)===230, 'round completion updates the house score');

click({view:'tasks'});
assert(nodes.get('#app').innerHTML.includes('START RANDOM TASK'), 'Task Arena view renders');
click({view:'ranks'});
assert(nodes.get('#app').innerHTML.includes('leaderboard'), 'ranks view renders');
click({view:'wardrobe'});
assert(nodes.get('#app').innerHTML.includes('BLACKED <em>Fashion Zone.'), 'fashion zone renders');
assert(nodes.get('#app').innerHTML.includes('assets/black-ed-campaign.webp'), 'campaign art is referenced by fashion view');
click({view:'profile'});
assert(nodes.get('#app').innerHTML.includes('SAVE CUSTOM CHALLENGE'), 'profile and custom challenge section render');
nodes.get('#new-player').value='Housemate 3';
click({action:'add-player'});
saved=JSON.parse(storage.get('black-ed-big-boss-ke-randiya-v1'));
assert(saved.players.includes('Housemate 3'), 'new housemate is saved');
nodes.get('#custom-prompt').value='Invent a funny house slogan together.';
click({action:'add-custom'});
saved=JSON.parse(storage.get('black-ed-big-boss-ke-randiya-v1'));
assert(saved.custom.includes('Invent a funny house slogan together.'), 'custom challenge is saved');

click({view:'games'});
click({startGame:'truth-bomb'});
click({action:'pause'});
assert(nodes.get('#game-layer').innerHTML.includes('Round paused'), 'pause control pauses the round');
click({action:'resume'});
assert(nodes.get('#game-layer').innerHTML.includes('SKIP · NO PENALTY'), 'resume restores round controls');
click({action:'favorite'});
saved=JSON.parse(storage.get('black-ed-big-boss-ke-randiya-v1'));
assert(saved.favourites.length===1, 'favourite challenge is saved');
click({action:'joker'});
saved=JSON.parse(storage.get('black-ed-big-boss-ke-randiya-v1'));
assert(saved.jokers===0, 'Secret Joker is consumed once');
click({action:'skip'});
saved=JSON.parse(storage.get('black-ed-big-boss-ke-randiya-v1'));
assert(saved.skipped===1, 'skip counter increments');
click({action:'off-camera'});
assert(nodes.get('#game-layer').innerHTML===''&&!nodes.get('#game-layer').classList.open, 'off-camera choice ends the round');

click({view:'spin'});
assert(nodes.get('#app').innerHTML.includes('SPIN THE WHEEL'), 'spin page renders');
click({action:'spin-wheel'});
assert(nodes.get('#wheel-result').innerHTML.includes('THE WHEEL CHOSE'), 'spin wheel produces a result');
click({comfort:'naughty'});
saved=JSON.parse(storage.get('black-ed-big-boss-ke-randiya-v1'));
assert(saved.comfort==='naughty', 'comfort-level preference persists');

// Verify all linked local assets exist and the page references no missing legacy JS/CSS.
for (const asset of ['styles.css','app.js','manifest.json','icon.svg','sw.js','assets/black-ed-campaign.webp']) assert(fs.existsSync(__dirname+'/'+asset), asset+' exists');
const classic=fs.readFileSync(__dirname+'/classic.html','utf8');
assert(fs.existsSync(__dirname+'/styles.css') && !classic.includes('src="app.js"'), 'legacy route no longer points to the missing legacy script');
console.log('PASS: age gate, 23 game launches/completions, scores/history, new views, profile/housemate/custom deck, pause/resume, skip, favourite, Joker, off-camera exit, wheel spin and local asset paths.');
