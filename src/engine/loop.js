var lastTime = timestamp();
//import Stats from '../vendor/stats.js'
//var stats = new Stats()
//stats.showPanel(0)
//document.body.appendChild(stats.dom)

function timestamp () {
  return window.performance && window.performance.now ?
    window.performance.now() :
    Date.now();
}

function raf (fn) {
  return window.requestAnimationFrame(function () {
    //stats && stats.begin();

    var now = timestamp();
    var dt = now - lastTime;

    if (dt > 999) {
      dt = 1 / 60;
    } else {
      dt /= 1000;
    }
    
    lastTime = now;

    fn(dt);

    //stats && stats.end();
  });
}

var start = function (fn) {
  return raf(function tick (dt) {
    fn(dt);
    raf(tick);
  });
};

export {
  timestamp,
  raf,
  start
};