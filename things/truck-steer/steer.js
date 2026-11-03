var cv=document.getElementById('c'),ctx=cv.getContext('2d');
var msg=document.getElementById('msg'),info=document.getElementById('info');
var W=640,H=460;
var truck={x:90,y:360,a:-0.5,v:0};
var ball={x:520,y:110,vx:0,vy:0,r:26};
var rose={x:550,y:370,r:46};
var leaves=[],cargo=0,banked=0,total=14,t0=0,done=false,best=null;
var keys={},target=null,hold={l:0,r:0,g:0};
var lines=["hazy, ask again near the Alps","the rose is listening","yes, if the road is wet","dark moon, small push","outlook: leaves","not now, I am rolling","cannot say, I am round"];
var books=[{x:60,y:150,w:110,h:34,c:'rgb(120,140,110)'},{x:70,y:120,w:100,h:30,c:'rgb(60,80,120)'},{x:62,y:92,w:105,h:28,c:'rgb(110,45,60)'}];
var goggles={x:230,y:90,r:44};
var shown=0;
function say(s){msg.textContent=s}
function seed(){leaves=[];var n=0;while(n<total){var x=40+Math.random()*560,y=40+Math.random()*380;
 if(Math.hypot(x-rose.x,y-rose.y)<70||Math.hypot(x-truck.x,y-truck.y)<50||(x<190&&y<200))continue;
 leaves.push({x:x,y:y,s:Math.random()*6,c:['rgb(200,90,30)','rgb(220,160,40)','rgb(160,50,40)'][n%3]});n++}}
seed();
function saveBest(sec){if(best===null||sec<best){best=sec;try{parent.postMessage({jones:'set',key:'steer-best',value:String(sec),id:3},'*')}catch(e){}}}
window.addEventListener('message',function(e){var m=e.data;if(m&&m.jones==='reply'&&m.id===4&&m.ok&&m.value){best=parseFloat(m.value)}});
try{parent.postMessage({jones:'get',key:'steer-best',id:4},'*')}catch(e){}
document.addEventListener('keydown',function(e){keys[e.key]=1;if(e.key.indexOf('Arrow')==0)e.preventDefault()});
document.addEventListener('keyup',function(e){keys[e.key]=0});
function bind(id,k){var b=document.getElementById(id);
 b.addEventListener('pointerdown',function(e){hold[k]=1;e.preventDefault()});
 ['pointerup','pointerleave'].forEach(function(n){b.addEventListener(n,function(){hold[k]=0})})}
bind('l','l');bind('r','r');bind('g','g');
document.getElementById('h').addEventListener('click',honk);
function honk(){say(Math.hypot(truck.x-ball.x,truck.y-ball.y)<120?"The ball: "+lines[shown++%lines.length]:"beep. nothing answers but the cloth.")}
function pos(e){var r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)*W/r.width,y:(e.clientY-r.top)*H/r.height}}
cv.addEventListener('pointerdown',function(e){target=pos(e);cv.setPointerCapture(e.pointerId)});
cv.addEventListener('pointermove',function(e){if(e.buttons)target=pos(e)});
cv.addEventListener('pointerup',function(){target=null});
function step(){
 var steer=0,gas=0;
 if(keys.ArrowLeft||keys.a||hold.l)steer-=1;
 if(keys.ArrowRight||keys.d||hold.r)steer+=1;
 if(keys.ArrowUp||keys.w||hold.g)gas=1;
 if(keys.ArrowDown||keys.s)gas=-0.6;
 if(target){var da=Math.atan2(target.y-truck.y,target.x-truck.x)-truck.a;
  while(da>Math.PI)da-=2*Math.PI;while(da<-Math.PI)da+=2*Math.PI;
  steer=Math.max(-1,Math.min(1,da*2));
  gas=Math.hypot(target.x-truck.x,target.y-truck.y)>25?1:0}
 if(gas||steer){if(!t0&&!done)t0=Date.now()}
 truck.v+=gas*0.18;truck.v*=0.94;
 truck.a+=steer*0.05*Math.min(1,Math.abs(truck.v)/1.5+0.3);
 truck.x+=Math.cos(truck.a)*truck.v;truck.y+=Math.sin(truck.a)*truck.v;
 truck.x=Math.max(14,Math.min(W-14,truck.x));truck.y=Math.max(14,Math.min(H-14,truck.y));
 var dx=ball.x-truck.x,dy=ball.y-truck.y,d=Math.hypot(dx,dy);
 if(d<ball.r+20){var n=(ball.r+20-d);ball.vx+=dx/d*(1+Math.abs(truck.v)*0.6);ball.vy+=dy/d*(1+Math.abs(truck.v)*0.6);ball.x+=dx/d*n*0.5;ball.y+=dy/d*n*0.5;
  if(!ball.hit||Date.now()-ball.hit>2500){say("The ball: "+lines[shown++%lines.length]);}ball.hit=Date.now()}
 ball.x+=ball.vx;ball.y+=ball.vy;ball.vx*=0.97;ball.vy*=0.97;
 if(ball.x<ball.r||ball.x>W-ball.r){ball.vx*=-0.7;ball.x=Math.max(ball.r,Math.min(W-ball.r,ball.x))}
 if(ball.y<ball.r||ball.y>H-ball.r){ball.vy*=-0.7;ball.y=Math.max(ball.r,Math.min(H-ball.r,ball.y))}
 for(var i=leaves.length-1;i>=0;i--){var L=leaves[i];
  if(Math.hypot(L.x-truck.x,L.y-truck.y)<24){leaves.splice(i,1);cargo++;say("A leaf in the back. Cargo: "+cargo)}}
 if(cargo>0&&Math.hypot(rose.x-truck.x,rose.y-truck.y)<rose.r){banked+=cargo;say("Tipped "+cargo+" leaves on the rose. "+banked+" of "+total+".");cargo=0;
  if(banked>=total&&!done){done=true;var sec=Math.round((Date.now()-t0)/100)/10;saveBest(sec);say("All "+total+" leaves are home. "+sec+" seconds. Double-tap the map to scatter more.");}}
}
cv.addEventListener('dblclick',function(){if(done){done=false;banked=0;cargo=0;t0=0;seed();say("The leaves have blown back out.")}});
function draw(){
 ctx.clearRect(0,0,W,H);
 ctx.fillStyle='rgb(238,224,190)';ctx.fillRect(30,25,580,410);
 ctx.strokeStyle='rgb(190,170,130)';ctx.lineWidth=1;
 for(var i=1;i<10;i++){ctx.beginPath();ctx.moveTo(30+i*58,25);ctx.lineTo(30+i*58,435);ctx.stroke()}
 for(var j=1;j<7;j++){ctx.beginPath();ctx.moveTo(30,25+j*58);ctx.lineTo(610,25+j*58);ctx.stroke()}
 ctx.strokeStyle='rgb(150,110,50)';ctx.lineWidth=7;
 [goggles.x-30,goggles.x+34].forEach(function(x){ctx.fillStyle='rgba(200,225,235,0.55)';ctx.beginPath();ctx.arc(x,goggles.y,30,0,7);ctx.fill();ctx.stroke()});
 books.forEach(function(b){ctx.fillStyle=b.c;ctx.fillRect(b.x-b.w/2,b.y-b.h/2,b.w,b.h)});
 ctx.strokeStyle='rgb(120,95,70)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(rose.x,rose.y,rose.r,0,7);ctx.stroke();
 for(var k=0;k<8;k++){var an=k*Math.PI/4;ctx.beginPath();ctx.moveTo(rose.x,rose.y);ctx.lineTo(rose.x+Math.cos(an)*rose.r,rose.y+Math.sin(an)*rose.r);ctx.stroke()}
 ctx.fillStyle='rgb(200,90,30)';ctx.fillText('tip here',rose.x-18,rose.y+rose.r+14);
 leaves.forEach(function(L){ctx.save();ctx.translate(L.x,L.y);ctx.rotate(L.s);ctx.fillStyle=L.c;ctx.beginPath();ctx.ellipse(0,0,10,5,0,0,7);ctx.fill();ctx.restore()});
 ctx.fillStyle='rgb(25,25,30)';ctx.beginPath();ctx.arc(ball.x,ball.y,ball.r,0,7);ctx.fill();
 ctx.fillStyle='rgb(240,240,225)';ctx.beginPath();ctx.arc(ball.x-5,ball.y-6,9,0,7);ctx.fill();
 ctx.fillStyle='rgb(25,25,30)';ctx.font='bold 13px Georgia';ctx.fillText('8',ball.x-9,ball.y-1);
 ctx.save();ctx.translate(truck.x,truck.y);ctx.rotate(truck.a);
 ctx.fillStyle='rgb(40,40,40)';ctx.fillRect(-14,-14,8,5);ctx.fillRect(-14,9,8,5);ctx.fillRect(8,-14,8,5);ctx.fillRect(8,9,8,5);
 ctx.fillStyle='rgb(240,225,180)';ctx.fillRect(-18,-10,36,20);
 ctx.fillStyle='rgb(110,175,220)';ctx.fillRect(-18,-10,26,20);
 ctx.fillStyle='rgb(190,225,245)';ctx.fillRect(4,-8,6,16);
 if(cargo){ctx.fillStyle='rgb(200,90,30)';ctx.beginPath();ctx.arc(-8,0,Math.min(8,3+cargo),0,7);ctx.fill()}
 ctx.restore();
 info.textContent='cargo '+cargo+'   banked '+banked+'/'+total+(best!==null?'   best '+best+'s':'')+(done?'   (double-tap to scatter again)':'');
}
function loop(){step();draw();requestAnimationFrame(loop)}
loop();
