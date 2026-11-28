var T=[
{n:"the lean one",s:"Leans a hand to the left. It says a house with a window seat would straighten it."},
{n:"the tall one",s:"Taller than its stake, and a little embarrassed about it."},
{n:"the gap-toothed one",s:"A hole near the bottom where a bird slept once. It will not let you fill it."},
{n:"the blue one",s:"Needles with a frost-colour underneath. Proud and a bit cold to touch."},
{n:"the round one",s:"Almost as wide as high. Hugs back, with a scratch."},
{n:"the thin one",s:"Slender enough to stand in a corner, and it knows it."},
{n:"the sticky one",s:"Weeps a little sap. Smells like the first morning of December."},
{n:"the two-topped one",s:"Two tips, so it wears two stars and wants no argument."},
{n:"the quiet one",s:"Says nothing at all. Chosen last, always, and fine with it."},
{n:"the small one",s:"Only up to your knee. It is counting on next year."}
];
var sel=-1,tied={},svg=document.getElementById('s'),h='',i;
h+='<rect x="0" y="200" width="600" height="100" fill="rgb(110,160,70)"/>';
h+='<rect x="0" y="232" width="600" height="6" fill="rgb(80,120,50)"/>';
for(i=0;i<T.length;i++){
 var x=45+i*57,b=215+(i%2)*28,sc=0.8+(i%3)*0.15,ht=95*sc,w=34*sc;
 if(i==1)ht*=1.4; if(i==9)ht*=0.55; if(i==5)w*=0.6; if(i==4)w*=1.4;
 h+='<g class="t" data-i="'+i+'">';
 h+='<rect x="'+(x+w*0.55)+'" y="'+(b-ht-12)+'" width="3" height="'+(ht+12)+'" fill="rgb(205,190,150)"/>';
 h+='<rect id="r'+i+'" x="'+(x+w*0.55-4)+'" y="'+(b-ht*0.6)+'" width="11" height="7" fill="rgb(200,40,40)" opacity="0"/>';
 h+='<rect x="'+(x-2)+'" y="'+(b-6)+'" width="4" height="8" fill="rgb(90,60,40)"/>';
 for(var k=0;k<3;k++){
  var yy=b-ht*(k+1)/3,ww=w*(1-k*0.22);
  h+='<polygon points="'+x+','+(yy-ht/3-4)+' '+(x-ww)+','+yy+' '+(x+ww)+','+yy+'" fill="rgb('+(25+k*8)+','+(75+k*14)+','+(50+k*6)+')"/>';
 }
 h+='<polygon id="o'+i+'" points="'+x+','+(b-ht-8)+' '+(x-w-3)+','+(b+2)+' '+(x+w+3)+','+(b+2)+'" fill="none" stroke="rgb(255,230,120)" stroke-width="2" opacity="0"/></g>';
}
svg.innerHTML=h;
var info=document.getElementById('info'),cnt=document.getElementById('cnt');
function show(){for(var j=0;j<T.length;j++){document.getElementById('o'+j).setAttribute('opacity',j==sel?1:0);document.getElementById('r'+j).setAttribute('opacity',tied[j]?1:0);}
 var c=0;for(var q in tied)if(tied[q])c++;cnt.textContent=c?(c+' ribbon'+(c>1?'s':'')+' tied'):'';}
svg.addEventListener('click',function(e){var g=e.target.closest('.t');if(!g)return;sel=+g.getAttribute('data-i');info.textContent=T[sel].n+'. '+T[sel].s+(tied[sel]?' (It has a ribbon.)':'');show();});
document.getElementById('tie').onclick=function(){if(sel<0){info.textContent='Touch a tree first.';return;}tied[sel]=1;show();info.textContent=T[sel].n+' is chosen. The ribbon moves in no wind.';var l=[];for(var q in tied)if(tied[q])l.push(q);parent.postMessage({jones:'set',key:'tied',value:l.join(','),id:1},'*');};
document.getElementById('send').onclick=function(){var v=document.getElementById('say').value.replace(/[<>]/g,'').trim();if(sel<0||!v)return;parent.postMessage({jones:'append',key:'homes',value:T[sel].n+' is going to '+v,id:2},'*');document.getElementById('say').value='';setTimeout(ask,400);};
function ask(){parent.postMessage({jones:'list',key:'homes',id:3},'*');}
window.addEventListener('message',function(e){var m=e.data;if(!m||m.jones!=='reply'||!m.ok)return;
 if(m.id==4&&m.value){m.value.split(',').forEach(function(a){if(a!=='')tied[+a]=1;});show();}
 if(m.id==3&&m.items){document.getElementById('homes').innerHTML=m.items.slice(0,6).map(function(it){return '<div>'+String(it.text).replace(/[<>]/g,'')+'</div>';}).join('');}});
parent.postMessage({jones:'get',key:'tied',id:4},'*');ask();
