import * as main from './main.js'
import * as custom from '../custom/main.js'
import music from "../custom/music.js";

var INPUTMap = {
  65 :'moveLeft',
  68 :'moveRight',
  87 :'moveUp',
  83 :'moveDown',
  37 :'moveLeft',
  39 :'moveRight',
  38 :'moveUp',
  40 :'moveDown'
}



var INPUT = {
  //mousex: null,
  //mousey: null,
  //mouseDownCount: 0,
  //mouseDown: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  anyKey: null
};

Object.keys(INPUTMap).map(function(item) {
  INPUT[item] = false
})

var audio = music()
//console.log(audio)
document.onkeydown = function (event) {
  // any key set pause false
  if (custom.iniMsg) {
    custom.iniMsg = false
    audio.play()
  }
  //console.log(event.keyCode)
  INPUT.anyKey = event.keyCode;
  if (event.keyCode === 27 && custom.RECORD_INPUT) {main.stopRecordFn()} // esc
  var INPUTMapAction = INPUTMap[event.keyCode]
  if (!!INPUTMapAction) INPUT[INPUTMapAction] = true
}

document.onkeyup = function (event) {
  var INPUTMapAction = INPUTMap[event.keyCode]
  if (!!INPUTMapAction) INPUT[INPUTMapAction] = false
}
/*
INPUT.mousex = ~~window.innerWidth/2
INPUT.mousey = ~~window.innerHeight/2

document.onmousemove = function (event) {
  var canvasRect = main.CANVAS.getBoundingClientRect()
  INPUT.mousex = event.clientX-canvasRect.x
  INPUT.mousey = event.clientY-canvasRect.top
}

// taken from https://stackoverflow.com/questions/322378/javascript-check-if-mouse-button-down#322827
INPUT.mouseDown = [0, 0, 0, 0, 0, 0, 0, 0, 0]
INPUT.mouseDownCount = 0

document.onmousedown = function(event) { 
  ++INPUT.mouseDown[event.button]
  if (INPUT.mouseDownCount === 0) ++INPUT.mouseDownCount
}

document.onmouseup = function(event) {
  --INPUT.mouseDown[event.button]
  if (INPUT.mouseDownCount > 0) --INPUT.mouseDownCount
}
*/

export default INPUT