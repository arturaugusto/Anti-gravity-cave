import * as custom from '../custom/main.js'
import * as factories from './factories.js'
import INPUT from '../engine/input.js'

var WORLD = factories.worldFactory()

var CANVAS = document.createElement('canvas');
CANVAS.id = 'game-canvas';
document.body.appendChild(CANVAS);

var VW
var VH
var setCanvasSize = (function() {
  VW = window.innerWidth
  VH = window.innerHeight
  //CANVAS.style.width = 200+'vmin'
  //CANVAS.style.height = (200*0.5625)+'vmin'
  CANVAS.width = custom.CANVAS_W
  CANVAS.height = custom.CANVAS_H

})()

window.onresize = setCanvasSize


var CAMERA = {xoffset: 0, yoffset: 0}

var ctx = CANVAS.getContext('2d', { alpha: false })

/* handle recorded input */
/*var stopRecordFn = function() {
  custom.RECORD_INPUT = false
  var inputSequence = document.createElement('textarea')
  inputSequence.value = JSON.stringify(custom.RECORDED_INPUT)
  inputSequence.style = 'position: absolute;'
  document.body.append(inputSequence)
}*/

/*if (custom.RECORD_INPUT) {
  document.body.append(document.createElement('br'))

  var stopRecordButton = document.createElement('input')
  stopRecordButton.type = 'button'
  stopRecordButton.value = 'stop record'
  stopRecordButton.style = 'position: absolute;'
  stopRecordButton.accesskey='n'
  document.body.append(stopRecordButton)
  stopRecordButton.onclick = stopRecordFn
}

var cloneInput = function() {
  var obj = {}
  Object.keys(INPUT).map(function(item) {
    obj[item] = INPUT[item]
  })
  return obj
}*/

var TYPES = custom.THINGS_PAINT_ORDER.reverse()

var TIME_FACTOR

function update (dt) {
  if (custom.iniMsg) {
    return
  }

  TIME_FACTOR = dt
  //console.log(TIME_FACTOR)
  //TIME_FACTOR = 1/60
  //TIME_FACTOR += (Math.random()/10)
  var thingsOfType
    , things
    , thing
    , collisions
    , detail;

  Object.keys(WORLD.things).map((k) => { // {!warn}
    //if (TYPES.indexOf(k) === -1) console.warn('Things of type `'+k+'` must be set on `custom.THINGS_PAINT_ORDER` to apear on game.') // {!warn}
  }) // {!warn}

  if (custom.PAUSE) return

  if (!WORLD.lost) {
    ctx.clearRect(0, 0, CANVAS.width, CANVAS.height)
    ctx.rect(0, 0, CANVAS.width, CANVAS.height)
    ctx.fillStyle = '#000000'
    ctx.fill()
    ctx.closePath()
  }
  
  // reproduz gavação
  if (custom.RECORDED_INPUT.length && !custom.RECORD_INPUT) {
    if (!!custom.RECORDED_INPUT[WORLD.count]) {
      var recInput = custom.RECORDED_INPUT[WORLD.count]
      Object.keys(recInput).map(function(item) {
        INPUT[item] = recInput[item]
      })

    } else {
      //if (WORLD.test) WORLD.test()
      //PAUSE = true
    }
  } else if (custom.RECORD_INPUT) {
    custom.RECORDED_INPUT.push(cloneInput())
  }

  if(!!custom.beforeIterateThings) custom.beforeIterateThings(WORLD)

  // Iterate object types
  for (var _t = TYPES.length - 1; _t >= 0; _t--) {
    thingsOfType = WORLD.things[TYPES[_t]]
    if (!thingsOfType) {
      //console.warn('No thing of type `'+TYPES[_t]+'` was registred at `world.things` array.') // {!warn}
      continue
    }

    // Iterate things of certain type    
    for (var j = thingsOfType.length - 1; j >= 0; j--) {
      thing = thingsOfType[j]
      if (thing._toRecycle) continue

      // check if thing is in camera
      if (((thing.x+thing.w) > CAMERA.xoffset) &&
          ((thing.x) < CAMERA.xoffset+VW) &&
          
          ((thing.y+thing.h) > CAMERA.yoffset) &&
          ((thing.y) < CAMERA.yoffset+VH)
      ) {
        if (thing.sprites) { // thing has sprites
          var sprtSetName
          // Check if is moving and set correct sprite set
          //if (thing.movex || thing.movey) {
          if (thing.movex && !thing.falling) {
            if (thing.upsidedown) {
              sprtSetName = thing.toSide === -1 ? 'moveLeftUpsDown' : 'moveRightUpsDown'
            } else {
              sprtSetName = thing.toSide === -1 ? 'moveLeft' : 'moveRight'
            }

            thing.sprites['idleLeft'].ctl.i = 0
            thing.sprites['idleLeft'].ctl.timeline = 0
            thing.sprites['idleRight'].ctl.i = 0
            thing.sprites['idleRight'].ctl.timeline = 0
          } else {
            if (thing.upsidedown) {
              sprtSetName = thing.toSide === -1 ? 'idleLeftUpsDown' : 'idleRightUpsDown'
            } else {
              sprtSetName = thing.toSide === -1 ? 'idleLeft' : 'idleRight'
            }
            thing.sprites['moveLeft'].ctl.i = 0
            thing.sprites['moveLeft'].ctl.timeline = 0
            thing.sprites['moveRight'].ctl.i = 0
            thing.sprites['moveRight'].ctl.timeline = 0
          }

          var sprtSet = thing.sprites[sprtSetName]
          var sprtSeqI = sprtSet.ctl.i
          var toPaint = sprtSet[sprtSeqI].s

          // if duration elapsed, reset timeline for sprite sequence control
          if (sprtSet.ctl.timeline >= sprtSet[sprtSeqI].d) {
            sprtSet.ctl.timeline = 0
            // is sprite loop complete, reset index
            if (sprtSet.ctl.i === sprtSet.length-1) {
              sprtSet.ctl.i = 0
            } else {
              sprtSet.ctl.i++
            }            
          }
          sprtSet.ctl.timeline += TIME_FACTOR

          ctx.drawImage(toPaint, ~~(thing.x-CAMERA.xoffset), ~~(thing.y-CAMERA.yoffset))
        }
      } else { // thing dont have sprites
        ctx.beginPath()
        ctx.rect(~~(thing.x-CAMERA.xoffset), ~~(thing.y-CAMERA.yoffset), ~~thing.w, ~~thing.h)
        ctx.fillStyle = thing.color || '#00ff00'
        ctx.fill()
        ctx.closePath()
      }

      if (WORLD.lost) continue
      // store prev position, useful for
      // collision handling and other stuff
      thing._prevx = thing.x
      thing._prevy = thing.y

      // objects with property `movex` or `movey` have
      // position increased by speed
      if (thing.movex) {thing.x += thing.movex * TIME_FACTOR * thing.speed}
      if (thing.movey) {thing.y += thing.movey * TIME_FACTOR * thing.speed}

      if (!!custom.thingsHandler) custom.thingsHandler(WORLD, thing, TYPES[_t])
      
      if (thing.ai) {thing.ai()}
      
      if (thing.followers) {
        for (var fi = thing.followers.length - 1; fi >= 0; fi--) {
          thing.followers[fi].x += thing.x-thing._prevx
          thing.followers[fi].y += thing.y-thing._prevy
        }
      }
    }
  }
  if (WORLD.lost) return
  WORLD.count += 1
}

export {
  WORLD,
  CANVAS,
  CAMERA,
  TYPES,
  TIME_FACTOR,
  update,
  //stopRecordFn
}