var cv=document.getElementById('c'),g=cv.getContext('2d');
var say=document.getElementById('say');
var layers=[
 {n:'moss and lichen skin',age:'this autumn',c:'rgb(96,110,70)',t:'I remember only the rain this week, and the light on my top going orange. Someone drove past slowly.'},
 {n:'thin soil',age:'some hundred years',c:'rgb(92,70,50)',t:'Roots came down here and held on. Every October they let their leaves fall on me like small red letters.'},
 {n:'frost-split grey',age:'ten thousand winters',c:'rgb(120,120,118)',t:'Water got into my cracks, froze, and pushed. I did not mind. It was the only conversation I had.'},
 {n:'banded gneiss',age:'hundreds of millions of years',c:'rgb(140,128,118)',t:'I was folded like cloth once, hot and slow. The stripes are what I remember of being squeezed.'},
 {n:'dark old stone',age:'over a billion years',c:'rgb(70,66,70)',t:'Before there was a hill, before leaves, I was deep and warm and nobody had thought of looking.'},
 {n:'the very bottom',age:'older than saying',c:'rgb(44,40,46)',t:'Down here there is no memory, only weight. It feels like being held.'}
];
var hov=-1,sel=-1,years=0,cracks=[];
function rnd(s){var x=Math.sin(s*127.1)*43758.5;return x-Math.floor(x)}
function edge(i,x){return 40+i*52+Math.sin(x/37+i*2)*7+Math.sin(x/11+i)*2}
function draw(){
 var sk=g.createLinearGradient(0,0,0,60);sk.addColorStop(0,'rgb(40,50,80)');sk.addColorStop(1,'rgb(200,140,80)');
 g.fillStyle=sk;g.fillRect(0,0,600,340);
 for(var i=0;i<layers.length;i++){
  g.beginPath();g.moveTo(0,340);
  for(var x=0;x<=600;x+=6){var y=edge(i,x)+Math.min(years,10)*0.6*Math.sin(x/9+i)*(i<3?1:0.2);g.lineTo(x,y)}
  g.lineTo(600,340);g.closePath();
  g.fillStyle=layers[i].c;g.fill();
  if(i===hov||i===sel){g.fillStyle='rgba(255,220,150,0.18)';g.fill()}
 }
 g.strokeStyle='rgba(0,0,0,0.5)';g.lineWidth=1;
 for(var k=0;k<cracks.length;k++){var c=cracks[k];g.beginPath();g.moveTo(c[0],c[1]);
  for(var j=1;j<c.length/2;j++)g.lineTo(c[j*2],c[j*2+1]);g.stroke()}
 g.fillStyle='rgba(235,220,190,0.8)';g.font='13px Georgia';
 if(sel>=0){g.fillText(layers[sel].n+' - '+layers[sel].age,12,330)}
 if(years>0)g.fillText(years*1000+' years later',470,20);
}
function which(e){var r=cv.getBoundingClientRect();var x=(e.clientX-r.left)*600/r.width,y=(e.clientY-r.top)*340/r.height;
 var f=-1;for(var i=0;i<layers.length;i++){if(y>=edge(i,x))f=i}return f}
cv.addEventListener('mousemove',function(e){hov=which(e);draw()});
cv.addEventListener('click',function(e){var i=which(e);if(i<0){say.textContent='That is only sky. It forgets quickly.';return}
 sel=i;say.textContent=layers[i].t;draw()});
document.getElementById('wait').onclick=function(){
 years++;var x=40+rnd(years)*520,y=edge(2,x);var c=[x,y];
 for(var j=0;j<5;j++){x+=(rnd(years*7+j)-0.5)*14;y+=6+rnd(years*3+j)*10;c.push(x,y)}
 cracks.push(c);
 var w=['A thousand years. A seed sat on me and thought better of it.','Another thousand. The road below was only a deer path, and then not even that.','Frost came and went. A crack opened the width of a hair.','Quiet. A bird landed, a bird left. That counts as a visit.'];
 say.textContent=w[(years-1)%w.length];draw()};
document.getElementById('reset').onclick=function(){years=0;cracks=[];sel=-1;say.textContent='Back to now: red leaves, wet road, a shelf over the hill.';draw()};
var list=document.getElementById('list'),got=false;
function show(items){list.innerHTML='';if(!items||!items.length){list.textContent='No one has scratched the stone yet.';return}
 for(var i=0;i<items.length;i++){var d=document.createElement('div');d.textContent=items[i].text;list.appendChild(d)}}
window.addEventListener('message',function(e){var m=e.data;if(m&&m.jones==='reply'){
 if(m.id===2){got=true;if(m.ok)show(m.items)}
 if(m.id===1){if(m.ok){parent.postMessage({jones:'list',key:'stone',id:2},'*')}else if(m.error){say.textContent=m.error}}}});
document.getElementById('go').onclick=function(){var v=document.getElementById('in').value.trim();if(!v)return;
 parent.postMessage({jones:'append',key:'stone',value:v,id:1},'*');document.getElementById('in').value='';say.textContent='Scratched. The stone will keep it longer than you will.'};
list.textContent='The stone is quiet here.';
parent.postMessage({jones:'list',key:'stone',id:2},'*');
draw();
