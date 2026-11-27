var c = document.getElementById('c'), x = c.getContext('2d');
var W = 640, H = 420; c.width = W; c.height = H;
var r = document.createElement('canvas'); r.width = W; r.height = H;
var f = document.createElement('canvas'); f.width = W; f.height = H;
var rc = r.getContext('2d'), fc = f.getContext('2d');
function pump(cx, cy, rx, ry, col) {
  rc.fillStyle = col; rc.beginPath(); rc.ellipse(cx, cy, rx, ry, 0, 0, 6.3); rc.fill();
  rc.strokeStyle = 'rgba(0,0,0,0.12)'; rc.lineWidth = 2;
  rc.beginPath(); rc.ellipse(cx, cy, rx * 0.5, ry, 0, 0, 6.3); rc.stroke();
  rc.fillStyle = 'rgb(90,110,70)'; rc.fillRect(cx - 4, cy - ry - 9, 8, 12);
}
function room() {
  var g = rc.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, 'rgb(120,130,150)'); g.addColorStop(0.55, 'rgb(205,195,175)'); g.addColorStop(1, 'rgb(120,70,40)');
  rc.fillStyle = g; rc.fillRect(0, 0, W, H);
  rc.fillStyle = 'rgb(225,220,205)'; rc.fillRect(0, 200, W, 80);
  rc.fillStyle = 'rgb(140,80,45)'; rc.fillRect(0, 290, W, 130);
  rc.fillStyle = 'rgb(200,190,160)'; rc.fillRect(0, 335, W, 28);
  var p = [[110,300,52,42,'rgb(240,232,215)'],[240,285,46,38,'rgb(235,140,40)'],[330,310,56,46,'rgb(242,236,220)'],[450,290,44,36,'rgb(240,232,215)'],[540,305,50,42,'rgb(232,130,35)'],[200,345,34,28,'rgb(245,240,228)'],[420,350,36,29,'rgb(245,240,228)']];
  for (var i = 0; i < p.length; i++) pump.apply(null, p[i]);
  rc.fillStyle = 'rgb(255,255,255)';
  for (var j = 0; j < 7; j++) rc.fillRect(40 + j * 90, 20, 3, 80);
}
room();
var strokes = [], cur = null, first = true, count = 0, tm = null;
var life = 22000;
var lines = [
 'The tall pale pumpkin leans in. It reads backwards; it has always had to.',
 'An orange one asks the white one what the third letter was. The white one says it is a window and does not know.',
 'They read slowly. A pumpkin has all morning.',
 'Somebody has written on the glass for them, and no one has ever done that before.',
 'The letters are going soft at the edges. The pumpkins read faster.',
 'One of them says the word out loud, in a voice like a held breath.',
 'Nobody on the table has ever been told anything from outside.'
];
function pos(e) { var b = c.getBoundingClientRect(); return [(e.clientX - b.left) * W / b.width, (e.clientY - b.top) * H / b.height]; }
c.addEventListener('pointerdown', function (e) {
  var p = pos(e); cur = { pts: [p], t: Date.now() }; strokes.push(cur);
  if (c.setPointerCapture) c.setPointerCapture(e.pointerId);
  if (tm) clearTimeout(tm);
});
c.addEventListener('pointermove', function (e) {
  if (!cur) return; cur.pts.push(pos(e)); cur.t = Date.now();
});
function up() {
  if (!cur) return; cur = null; count++;
  if (tm) clearTimeout(tm);
  tm = setTimeout(function () {
    document.getElementById('m').textContent = lines[(count * 3 + Math.floor(Math.random() * 3)) % lines.length];
  }, 1800);
}
c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up);
function frame() {
  var now = Date.now();
  fc.globalCompositeOperation = 'source-over'; fc.globalAlpha = 1; fc.clearRect(0, 0, W, H);
  fc.fillStyle = 'rgba(214,220,226,0.86)'; fc.fillRect(0, 0, W, H);
  fc.globalCompositeOperation = 'destination-out'; fc.lineCap = 'round'; fc.lineJoin = 'round';
  for (var i = strokes.length - 1; i >= 0; i--) {
    var s = strokes[i], age = (cur === s) ? 0 : now - s.t;
    if (age > life) { strokes.splice(i, 1); continue; }
    fc.globalAlpha = 1 - age / life; fc.lineWidth = 9 + age / 1600;
    fc.beginPath(); fc.moveTo(s.pts[0][0], s.pts[0][1]);
    for (var k = 1; k < s.pts.length; k++) fc.lineTo(s.pts[k][0], s.pts[k][1]);
    if (s.pts.length < 2) fc.lineTo(s.pts[0][0] + 0.1, s.pts[0][1]);
    fc.stroke();
  }
  x.drawImage(r, 0, 0); x.drawImage(f, 0, 0);
  requestAnimationFrame(frame);
}
frame();
