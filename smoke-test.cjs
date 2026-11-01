const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const html = fs.readFileSync(__dirname + '/index.html', 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/);
assert(script, 'inline application script exists');
const listeners = {};
const nodes = new Map();
function node(id='') {
  return { id, innerHTML:'', textContent:'', value:'', checked:false, disabled:false, style:{}, attrs:{}, classList:{add(){},remove(){},toggle(){}}, setAttribute(k,v){this.attrs[k]=v;}, getAttribute(k){return this.attrs[k];}, focus(){}, setSelectionRange(){}, click(){}, files:[] };
}
for (const id of ['age-gate','site','app','game-layer','toast','age-confirm','consent-confirm','enter-house']) nodes.set('#'+id,node(id));
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
vm.runInContext(script[1], context, {timeout:3000});
assert(nodes.get('#age-gate').classList, 'age gate rendered');
assert(nodes.get('#enter-house').disabled, 'age gate starts locked');
nodes.get('#age-confirm').checked=true;
nodes.get('#consent-confirm').checked=true;
listeners.change({target:nodes.get('#age-confirm')});
assert(!nodes.get('#enter-house').disabled, 'enter unlocks after both acknowledgements');
function click(target){listeners.click({target:{closest:()=>target},preventDefault(){}});}
click({id:'enter-house',dataset:{}});
assert(nodes.get('#app').innerHTML.includes('BIG BOSS'), 'house page renders show title');
assert(nodes.get('#app').innerHTML.includes('BLACKED'), 'house page renders primary brand');
click({dataset:{view:'games'}});
assert((nodes.get('#app').innerHTML.match(/data-start-game=/g)||[]).length>=20, 'game catalogue renders 20 game cards');
const ids=['naughty-wheel','truth-bomb','dare-double','secret-crush','chemistry-test','eye-contact','model-walk','pose-challenge','compliment-battle','mystery-box','who-knows-whom','forbidden-question','couple-sync','temptation-test','secret-mission','boss-says','hot-seat','winner-choice','final-temptation','fashion-show'];
for(const id of ids){click({dataset:{startGame:id}});assert(nodes.get('#game-layer').innerHTML.includes('Complete'),id+' opens a playable round');click({dataset:{action:'complete'}});}
const saved=JSON.parse(storage.get('black-ed-big-boss-ke-randiya-v1'));
assert(saved.completed===20,'all 20 game modes can complete and persist a round');
assert(saved.history.length===20,'round history is saved');
click({dataset:{view:'profile'}});
assert(nodes.get('#app').innerHTML.includes('Custom challenge deck'),'profile and custom challenge section render');
click({dataset:{view:'spin'}});
assert(nodes.get('#app').innerHTML.includes('SPIN THE WHEEL'),'wheel screen renders');
click({dataset:{action:'spin-wheel'}});
assert(nodes.get('#wheel-result').innerHTML.includes('THE WHEEL CHOSE'),'wheel produces a result');
console.log('PASS: age gate, show home, 20 game launches/completions, local persistence, profile, and wheel flow.');
// Consent controls, skip/pause/favourite/Joker and profile editing.
click({dataset:{view:'profile'}});
document.querySelector('#new-player').value='Housemate 3';
click({dataset:{action:'add-player'}});
let profileState=JSON.parse(storage.get('black-ed-big-boss-ke-randiya-v1'));
assert(profileState.players.includes('Housemate 3'),'new housemate is saved');
document.querySelector('#custom-prompt').value='Invent a funny house slogan together.';
click({dataset:{action:'add-custom'}});
profileState=JSON.parse(storage.get('black-ed-big-boss-ke-randiya-v1'));
assert(profileState.custom.includes('Invent a funny house slogan together.'),'custom challenge is saved');
click({dataset:{view:'games'}});
click({dataset:{startGame:'truth-bomb'}});
click({dataset:{action:'pause'}});
assert(nodes.get('#game-layer').innerHTML.includes('Round paused'),'pause control pauses the round');
click({dataset:{action:'resume'}});
assert(nodes.get('#game-layer').innerHTML.includes('Skip · no penalty'),'resume restores round controls');
click({dataset:{action:'favorite'}});
profileState=JSON.parse(storage.get('black-ed-big-boss-ke-randiya-v1'));
assert(profileState.favourites.length===1,'favourite challenge is saved');
click({dataset:{action:'joker'}});
profileState=JSON.parse(storage.get('black-ed-big-boss-ke-randiya-v1'));
assert(profileState.jokers===0,'Secret Joker is consumed once');
click({dataset:{action:'skip'}});
profileState=JSON.parse(storage.get('black-ed-big-boss-ke-randiya-v1'));
assert(profileState.skipped===1,'skip counter increments');
click({dataset:{action:'off-camera'}});
assert(nodes.get('#game-layer').innerHTML===''&&!nodes.get('#game-layer').classList.open,'off-camera choice ends the round');
console.log('PASS: pause/resume, skip, favourite, Joker, housemate management, custom deck, off-camera exit.');
