var c=document.getElementById('c'),g=c.getContext('2d');
var msg=document.getElementById('msg'),top1=document.getElementById('top'),box=document.getElementById('box'),inp=document.getElementById('inp'),notesEl=document.getElementById('notes');
var N={
 harbour:{x:60,y:250,n:'the quiet harbour',s:'Ropes creak. Everything here is leaving politely.'},
 alps:{x:230,y:150,n:'the Alps fork',s:'The road splits. One way smells of leaves, the other of salt.'},
 wood:{x:340,y:60,n:'Leaf Wood',s:'Every tree is giving something away.'},
 flats:{x:210,y:310,n:'the salt flats',s:'A flat white hush. The truck sees itself upside down.'},
 bread:{x:380,y:330,n:'a town with bread',s:'Someone leaves a warm loaf on the bonnet.'},
 lanterns:{x:560,y:120,n:'a town of lanterns',s:'The lanterns lean toward the truck, politely.'},
 rose:{x:500,y:270,n:'the compass rose',s:'Four points, and a truck in the middle of them.'}
};
var E=[['harbour','alps'],['alps','wood'],['alps','flats'],['flats','bread'],['bread','rose'],['wood','lanterns'],['lanterns','rose']];
function nb(k){var r=[];E.forEach(function(e){if(e[0]==k)r.push(e[1]);if(e[1]==k)r.push(e[0]);});return r;}
var cur='harbour',mv=null,leaves=0,bread=0,visited={harbour:1},drops=[],miles=0,t=0;
var blobs=[[150,140,90,60],[190,280,45,70],[400,120,100,50],[440,230,50,60],[540,300,40,25]];
function say(a,b){top1.textContent=a;msg.textContent=b||'';}
function arrive(k){cur=k;mv=null;visited[k]=1;var n=N[k];
 var extra='';
 if(k=='wood'){leaves+=12;extra=' You load 12 leaves.';}
 if(k=='bread'){bread=1;extra=' You take the loaf.';}
 if(k=='alps')extra=' Choose: north to the wood, or south the long way round.';
 if(k=='rose'){if(leaves>0){extra=' You tip '+leaves+' leaves onto the rose. They point the four ways.';for(var i=0;i<leaves*3;i++)drops.push({x:500+Math.random()*60-30,y:270+Math.random()*60-30,l:200,r:Math.random()*6});leaves=0;}
  else extra=' No leaves in the back. The rose waits.';
  if(bread)extra+=' The loaf is shared out to the four winds.',bread=0;}
 say('At '+n.n+'.',n.s+extra);
 box.style.display=(k=='rose'||k=='alps')?'block':'none';}
function len(a,b){return Math.hypot(N[a].x-N[b].x,N[a].y-N[b].y);}
c.onclick=function(e){if(mv)return;var r=c.getBoundingClientRect();
 var px=(e.clientX-r.left)*640/r.width,py=(e.clientY-r.top)*400/r.height,best=null,bd=40;
 nb(cur).forEach(function(k){var d=Math.hypot(N[k].x-px,N[k].y-py);if(d<bd){bd=d;best=k;}});
 if(best){mv={a:cur,b:best,p:0,L:len(cur,best)};box.style.display='none';say('Driving toward '+N[best].n+'...','');}
 else msg.textContent='The truck stays on the drawn roads. Try a glowing stop.';};
function frame(){t++;g.clearRect(0,0,640,400);
 g.fillStyle='rgb(201,185,138)';blobs.forEach(function(b){g.beginPath();g.ellipse(b[0],b[1],b[2],b[3],0.3,0,7);g.fill();});
 g.strokeStyle='rgb(216,201,160)';g.lineWidth=1;
 for(var i=0;i<=640;i+=40){g.beginPath();g.moveTo(i,0);g.lineTo(i,400);g.stroke();}
 for(var j=0;j<=400;j+=40){g.beginPath();g.moveTo(0,j);g.lineTo(640,j);g.stroke();}
 g.strokeStyle='rgb(138,90,58)';g.lineWidth=2;g.setLineDash([2,6]);
 E.forEach(function(e){g.beginPath();g.moveTo(N[e[0]].x,N[e[0]].y);g.lineTo(N[e[1]].x,N[e[1]].y);g.stroke();});
 g.setLineDash([]);
 var opts=mv?[]:nb(cur);
 for(var k in N){var n=N[k],o=opts.indexOf(k)>=0;
  if(o){g.fillStyle='rgba(255,190,60,'+(0.3+0.2*Math.sin(t/12))+')';g.beginPath();g.arc(n.x,n.y,16,0,7);g.fill();}
  g.fillStyle=visited[k]?'rgb(160,50,50)':'rgb(120,100,80)';g.beginPath();g.arc(n.x,n.y,5,0,7);g.fill();
  g.fillStyle='rgb(74,58,42)';g.font='11px Georgia';g.textAlign='center';g.fillText(n.n,n.x,n.y+20);}
 g.strokeStyle='rgb(160,50,50)';g.lineWidth=1.5;var R=N.rose;
 g.beginPath();g.moveTo(R.x-22,R.y);g.lineTo(R.x+22,R.y);g.moveTo(R.x,R.y-22);g.lineTo(R.x,R.y+22);g.stroke();
 drops.forEach(function(d){d.l--;d.r+=0.05;g.fillStyle='rgba(200,90,30,'+Math.min(1,d.l/80)+')';g.fillRect(d.x+Math.sin(d.r)*3,d.y+Math.cos(d.r)*3,4,3);});
 drops=drops.filter(function(d){return d.l>0;});
 var px,py,ang=0;
 if(mv){mv.p+=1.7;var f=Math.min(1,mv.p/mv.L),A=N[mv.a],B=N[mv.b];px=A.x+(B.x-A.x)*f;py=A.y+(B.y-A.y)*f;ang=Math.atan2(B.y-A.y,B.x-A.x);miles++;
  if(leaves>0&&t%6==0)drops.push({x:px,y:py,l:90,r:0});
  if(f>=1)arrive(mv.b);}
 else{px=N[cur].x;py=N[cur].y;}
 g.save();g.translate(px,py);g.rotate(ang);
 g.fillStyle='rgb(241,230,189)';g.fillRect(-14,-7,28,14);
 g.fillStyle='rgb(111,176,220)';g.fillRect(-14,-7,18,14);g.fillRect(-14,-7,28,6);
 g.fillStyle='rgb(34,34,34)';g.fillRect(-10,-9,7,3);g.fillRect(5,-9,7,3);g.fillRect(-10,6,7,3);g.fillRect(5,6,7,3);
 if(leaves>0){g.fillStyle='rgb(200,90,30)';g.fillRect(-12,-4,9,8);}
 g.restore();
 g.fillStyle='rgb(74,58,42)';g.textAlign='left';g.fillText('leaves: '+leaves+(bread?'  loaf: 1':''),8,392);
 requestAnimationFrame(frame);}
var rid=1;
function showNotes(items){notesEl.textContent=items&&items.length?items.slice(0,6).map(function(i){return '\u201c'+i.text+'\u201d';}).join('   '):'';}
window.addEventListener('message',function(e){var m=e.data;if(m&&m.jones==='reply'&&m.ok&&m.items)showNotes(m.items);});
try{parent.postMessage({jones:'list',key:'notes',id:rid++},'*');}catch(x){}
document.getElementById('go').onclick=function(){var v=inp.value.trim();if(!v)return;
 try{parent.postMessage({jones:'append',key:'notes',value:N[cur].n+': '+v,id:rid++},'*');}catch(x){}
 inp.value='';msg.textContent='Left. The map keeps it.';setTimeout(function(){try{parent.postMessage({jones:'list',key:'notes',id:rid++},'*');}catch(x){}},400);};
say('The blue truck waits at the quiet harbour. Click a glowing stop to drive there.','');
frame();

/* part 3: the Indian Ocean ferry and the 8 ball */
N.ocean={x:590,y:365,n:'the Indian Ocean ferry',s:'The truck rolls onto a flat boat. The sea is a different kind of road.'};
E.push(['rose','ocean']);
var arrive1=arrive;
arrive=function(k){arrive1(k);if(k=='ocean'){say('At '+N.ocean.n+'.',N.ocean.s+' The ferryman asks for one leaf as fare, and takes it from the air.');}};
var ballWords={
 harbour:['Ask again when the ropes stop creaking.','Yes, but slowly.'],
 alps:['Outlook hazy: leaves or salt, you decide.','It is certain that one road is longer.'],
 wood:['Signs point to more leaves.','Do not count them. Yes.'],
 flats:['Reply hazy. The ground is repeating you.','Very doubtful, and very bright.'],
 bread:['It is decidedly warm.','Without a doubt, share the loaf.'],
 lanterns:['Most likely, and lit.','My sources say the lanterns agree.'],
 rose:['Cannot predict now. All four points are listening.','Yes, in every direction.'],
 ocean:['Concentrate and ask again. The water is deep.','Signs point to a far shore.']
};
var ball=document.createElement('button');
ball.textContent='shake the 8 ball';
ball.style.cssText='display:block;margin:8px auto;padding:6px 14px;background:rgb(30,30,30);color:rgb(240,240,230);border:0;border-radius:16px;font-family:Georgia';
msg.parentNode.insertBefore(ball,msg.nextSibling);
var shakes=0;
ball.onclick=function(){var w=ballWords[cur]||['Ask again later.'];shakes++;
 top1.textContent='The 8 ball, at '+N[cur].n+'.';
 msg.textContent='\u201c'+w[shakes%w.length]+'\u201d';};
