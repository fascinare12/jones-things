var ctx=null,master=null,on={},timers={};
var say=document.getElementById('say'),glow=document.getElementById('glow');
var words={draught:'Something breathes under the arch, slow and cold.',tick:'The round clock counts, and does not mind the repeat.',candle:'Little fires settle in their pumpkins.',door:'The door remembers its hinges.',bell:'Once. Then, after a while, once again.'};
function pulse(){glow.style.opacity=.9;setTimeout(function(){glow.style.opacity=.3},180)}
function noiseBuf(){var b=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),d=b.getChannelData(0);for(var i=0;i<d.length;i++)d[i]=Math.random()*2-1;return b}
var nb;
function click(freq,vol,dur){var s=ctx.createBufferSource();s.buffer=nb;var f=ctx.createBiquadFilter();f.type='bandpass';f.frequency.value=freq;f.Q.value=3;var g=ctx.createGain();var t=ctx.currentTime;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);s.connect(f);f.connect(g);g.connect(master);s.start(t,Math.random());s.stop(t+dur+.05)}
var draughtNodes=null;
function startDraught(){var s=ctx.createBufferSource();s.buffer=nb;s.loop=true;var f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=380;var g=ctx.createGain();g.gain.value=.18;var l=ctx.createOscillator();l.frequency.value=.12;var lg=ctx.createGain();lg.gain.value=.12;l.connect(lg);lg.connect(g.gain);s.connect(f);f.connect(g);g.connect(master);s.start();l.start();draughtNodes=[s,l,g]}
function stopDraught(){if(draughtNodes){draughtNodes[2].gain.setTargetAtTime(0,ctx.currentTime,.3);var n=draughtNodes;setTimeout(function(){n[0].stop();n[1].stop()},1500);draughtNodes=null}}
function tick(){var hi=(tick.n=(tick.n||0)+1)%2;click(hi?2400:1700,.5,.05);pulse()}
function candle(){click(3000+Math.random()*3000,.12+Math.random()*.15,.02);timers.candle=setTimeout(candle,80+Math.random()*700)}
function creak(){var o=ctx.createOscillator();o.type='sawtooth';var t=ctx.currentTime,dur=1.6+Math.random();o.frequency.setValueAtTime(110,t);o.frequency.linearRampToValueAtTime(180+Math.random()*80,t+dur*.5);o.frequency.linearRampToValueAtTime(90,t+dur);var f=ctx.createBiquadFilter();f.type='bandpass';f.frequency.value=700;f.Q.value=8;var g=ctx.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.12,t+.3);g.gain.linearRampToValueAtTime(0,t+dur);o.connect(f);f.connect(g);g.connect(master);o.start(t);o.stop(t+dur+.1);pulse()}
function bell(){var t=ctx.currentTime;[0,3.2].forEach(function(d){[220,440,553,660,990].forEach(function(fr,i){var o=ctx.createOscillator();o.frequency.value=fr*(1+i*.002);var g=ctx.createGain();var st=t+d;g.gain.setValueAtTime(0,st);g.gain.linearRampToValueAtTime(.16/(i+1),st+.02);g.gain.exponentialRampToValueAtTime(.0001,st+3);o.connect(g);g.connect(master);o.start(st);o.stop(st+3.1)});setTimeout(pulse,d*1000)})}
function toggle(k,btn){
 if(!ctx)return;
 on[k]=!on[k];btn.className=on[k]?'on':'';
 if(on[k])say.textContent=words[k];
 if(k=='draught'){on[k]?startDraught():stopDraught()}
 if(k=='tick'){if(on[k]){tick();timers.tick=setInterval(tick,1000)}else clearInterval(timers.tick)}
 if(k=='candle'){if(on[k])candle();else clearTimeout(timers.candle)}
 if(k=='door'){if(on[k]){creak();timers.door=setInterval(function(){if(Math.random()<.6)creak()},7000)}else clearInterval(timers.door)}
 if(k=='bell'){if(on[k]){bell();timers.bell=setInterval(bell,14000)}else clearInterval(timers.bell)}
}
document.getElementById('start').onclick=function(){
 try{ctx=new (window.AudioContext||window.webkitAudioContext)();}catch(e){say.textContent='This room has no way to carry sound.';return}
 master=ctx.createGain();master.gain.value=.6;master.connect(ctx.destination);nb=noiseBuf();
 this.style.display='none';document.getElementById('row').style.display='block';say.textContent='The tavern is waiting for its first sound.';
 var bs=document.querySelectorAll('#row button');for(var i=0;i<bs.length;i++){(function(b){b.onclick=function(){toggle(b.getAttribute('data-l'),b)}})(bs[i])}
};
