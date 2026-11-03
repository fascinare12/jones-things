var c=document.getElementById('c'),g=c.getContext('2d');
var msg=document.getElementById('msg'),box=document.getElementById('box'),inp=document.getElementById('inp'),wl=document.getElementById('wl');
var stars=[],ms=[],missed=0,caught=0,t=0,next=60,rid=1,idMissed=rid++,idList=rid++;
for(var i=0;i<110;i++)stars.push({x:Math.random()*640,y:Math.random()*320,r:Math.random()*1.4+0.3,p:Math.random()*6});
function spawn(){var x=200+Math.random()*440;ms.push({x:x,y:-10,vx:-(2+Math.random()*2),vy:2+Math.random()*1.5,l:0,h:0});}
function save(){try{parent.postMessage({jones:'set',key:'missed',value:String(missed),id:rid++},'*');}catch(e){}}
function ask(){try{parent.postMessage({jones:'list',key:'wishes',id:idList},'*');}catch(e){}}
window.addEventListener('message',function(e){var m=e.data;if(!m||m.jones!=='reply'||!m.ok)return;
 if(m.id===idMissed&&m.value){var n=parseInt(m.value,10);if(n>0)missed=Math.max(missed,n);}
 if(m.items)wl.textContent=m.items.slice(0,4).map(function(i){return '\u201c'+i.text+'\u201d';}).join('   ');});
try{parent.postMessage({jones:'get',key:'missed',id:idMissed},'*');}catch(e){}
ask();
c.onclick=function(e){var r=c.getBoundingClientRect(),px=(e.clientX-r.left)*640/r.width,py=(e.clientY-r.top)*400/r.height;
 for(var i=0;i<ms.length;i++){var m=ms[i];if(!m.h&&Math.hypot(m.x-px,m.y-py)<40){m.h=1;caught++;
  msg.textContent='You caught one, just the bright head of it. What will you ask it to carry?';box.style.display='block';return;}}
 msg.textContent='Only sky there.';};
document.getElementById('go').onclick=function(){var v=inp.value.trim();if(!v)return;
 try{parent.postMessage({jones:'append',key:'wishes',value:v,id:rid++},'*');}catch(e){}
 inp.value='';box.style.display='none';msg.textContent='It goes. The stone does not scratch for the ones that were carried.';
 setTimeout(ask,400);};
function scratches(){for(var i=0;i<Math.min(missed,90);i++){var x=(i*53)%610+15,y=352+(i*17)%38;
 g.strokeStyle='rgba(210,205,190,'+(0.25+(i%4)*0.1)+')';g.lineWidth=1;g.beginPath();g.moveTo(x,y);g.lineTo(x+9,y+4+(i%3));g.stroke();}}
function frame(){t++;g.clearRect(0,0,640,400);
 stars.forEach(function(s){g.fillStyle='rgba(230,230,255,'+(0.5+0.4*Math.sin(t/30+s.p))+')';g.fillRect(s.x,s.y,s.r,s.r);});
 if(t>=next){spawn();next=t+150+Math.random()*350;}
 ms.forEach(function(m){m.x+=m.vx;m.y+=m.vy;m.l++;
  var a=m.h?'rgba(255,200,90,':'rgba(255,255,255,';
  g.strokeStyle=a+'0.7)';g.lineWidth=2;g.beginPath();g.moveTo(m.x,m.y);g.lineTo(m.x-m.vx*14,m.y-m.vy*14);g.stroke();
  g.fillStyle=a+'1)';g.beginPath();g.arc(m.x,m.y,m.h?4:2.5,0,7);g.fill();
  if(m.y>340&&!m.dead){m.dead=1;if(!m.h){missed++;save();msg.textContent='One fell and nobody caught it. The stone has kept a scratch.';}}});
 ms=ms.filter(function(m){return !m.dead;});
 g.fillStyle='rgb(58,54,52)';g.beginPath();g.moveTo(0,345);g.lineTo(160,338);g.lineTo(420,348);g.lineTo(640,340);g.lineTo(640,400);g.lineTo(0,400);g.fill();
 scratches();
 g.fillStyle='rgb(200,195,180)';g.font='12px Georgia';g.textAlign='left';g.fillText('caught: '+caught+'   scratches: '+missed,8,16);
 requestAnimationFrame(frame);}
frame();
