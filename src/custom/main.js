import * as factories from '../engine/factories.js'
import INPUT from '../engine/input.js'
import * as collisions from '../engine/collisions.js'
import entityFactory from '../engine/entityFactory.js'
import spriteFactory from '../engine/spriteFactory.js'
import * as utils from '../engine/utils.js'
import canvasTxt from "canvas-txt";
import sounds from "./sounds.js";

var CANVAS_W = 240
var CANVAS_H = 140//CANVAS_W*0.5625
var PAUSE = false
var LIFE = 30
var SCORE = 0


var RECORD_INPUT = false
var RECORDED_INPUT = []

var POOLS = {
  //'enemyBullets': 1000,
}

var THINGS_PAINT_ORDER = [
  'walls',
  'bgTiles',
  'players',
  'star',
  'enemy',
  'lifeBar'
]

var MAP_SIZE = 20
var PSIZE = 1
var TILESCALE = 30

var PALETTE = {
//  ' ': 'rgba(255,255,255,0)'
//  ,b: 'black'
//  ,B: 'blue'
//  ,R: 'red'
//  ,w: 'white'
//  ,x: 'green'
//  ,a: '#438043'
//  ,G: '#8BAD8B'
//  ,H: '#047504'
}


var createMap = function(tileSize, sprites, iniTrail) {
  PAUSE = true
  var walls = []
  var bgTiles = []
  // create map buffer
  var ways = {
    up: undefined,
    down: undefined,
    right: undefined,
    left: undefined
  }

  var sceneMap = []
  for (var i = 0; i < CANVAS_H/tileSize; i++) {
    sceneMap.push([])
    for (var j = 0; j < CANVAS_W/tileSize; j++) {
      var trailObj = Object.create(ways)
      trailObj.y = i*tileSize
      trailObj.x = j*tileSize
      sceneMap[i].push(trailObj)
    }
  }

  // create map walk pointers
  sceneMap.map((row, r_i) => {
    row.map((cell, c_i) => {
      cell.up = sceneMap[r_i-1] ? sceneMap[r_i-1][c_i] : undefined
      cell.right = row[c_i+1] ? row[c_i+1] : undefined
      cell.left = row[c_i-1] ? row[c_i-1] : undefined
      cell.down = sceneMap[r_i+1] ? sceneMap[r_i+1][c_i] : undefined
    })
  })
  
  // random walk
  // the loop is to try until the mas is valid
  for (var __i = 10; __i >= 0; __i--) {
    var sceneMapFlat = sceneMap.reduce((a, c) => c.concat(a),[])
    if (iniTrail) {
      iniTrail.map((item) => {
        sceneMapFlat.filter((wall) => wall.x === item.x && wall.y === item.y)
        .map((wall) => {
          wall.trail = true
        })
      })

      var randomIniTrail = utils.randomPick(iniTrail)
      if (!randomIniTrail) continue
      // TODO: some times bug here
      var yini = randomIniTrail.y/tileSize
      var xini = randomIniTrail.x/tileSize

    } else {
      var yini = utils.randomMinMax(0, sceneMap.length-1)
      var xini = utils.randomMinMax(0, sceneMap[0].length-1)

    }

    var place = sceneMap[yini][xini]
    for (var _i = 100; _i >= 0; _i--) {
      place.trail = true
      place = place[utils.randomPick(
        Object.keys(ways).filter((k) => !!place[k])
      )]
    }

    //console.log(JSON.stringify(sceneMap.map((r) => r.reduce((a, c) => a+(c.trail ? 'x' : ' '), '')),0,2))
    
    var palleteOptions = [
      [{a: '#FFAAAA'}, {f: '#D46A6A'}],
      [{a: '#FFD1AA'}, {f: '#D49A6A'}],
      [{a: '#669999'}, {f: '#407F7F'}],
      [{a: '#88CC88'}, {f: '#55AA55'}],
      [{a: '#801515'}, {f: '#550000'}],
      [{a: '#804515'}, {f: '#552600'}],
      [{a: '#0D4D4D'}, {f: '#003333'}],
      [{a: '#116611'}, {f: '#004400'}],
      [{a: '#CD88AF'}, {f: '#AA5585'}],
      [{a: '#661141'}, {f: '#440027'}]
    ]

    var pChoosen = utils.randomPick(palleteOptions)

    sceneMapFlat.filter((item) => !item.trail).map((item) => {
      //var pChoosen = utils.randomPick(palleteOptions)
      // add wall decoration
      var wallFlags = ''
      wallFlags += item.right && item.right.trail ? 'r' : ''
      wallFlags += item.left && item.left.trail ? 'l' : ''
      wallFlags += item.up && item.up.trail ? 't' : ''
      wallFlags += item.down && item.down.trail ? 'b' : ''

      

      var wall = entityFactory(sprites.wallFactory(tileSize, wallFlags, pChoosen[0], pChoosen[1]))
      wall.y = item.y
      wall.x = item.x
      walls.push(wall)
    })

    // random walk background
    //world.things.bgTiles = []
    var trails = sceneMapFlat.filter((item) => item.trail)
    // TODO: as vezes trailsPlace é undefined e causa errors
    var trailsPlace = utils.randomPick(trails)

    // check for invalid map and try again
    if (!trailsPlace) {
      //console.log('error generating map')
    }

    for (var _i = 100; _i >= 0; _i--) {
      var bgTile = entityFactory(sprites.bgTileFactory(tileSize, 't2'))
      if (!trailsPlace) return
      trailsPlace = trailsPlace[utils.randomPick(
        Object.keys(ways).filter((k) => !!trailsPlace && !!trailsPlace[k] && trailsPlace[k].trail)
      )]
      if (trailsPlace) {
        trailsPlace.bg = true
        bgTile.x = trailsPlace.x
        bgTile.y = trailsPlace.y
        bgTiles.push(bgTile)
      }
    }
    // check for invalid map and try again
    if (!trailsPlace) continue

    break
  }


  trails.filter((item) => !item.bg).map((item) => {
    var bgTile = entityFactory(sprites.bgTileFactory(tileSize, 't1'))
    bgTile.x = item.x
    bgTile.y = item.y
    bgTiles.push(bgTile)
  })


  var stars = []
  for (var _k = 3; _k >= 0; _k--) {
    // create star
    var starPlace = utils.randomPick(trails)
    var star = entityFactory(sprites.star)
    var correction = ((star.h - tileSize)/2)
    star.x = starPlace.x - correction
    star.y = starPlace.y - correction
    star.type = 'star'
    stars.push(star)
  }



  // create enemy
  var enemies = []

  for (var _e = Math.min(3, Math.floor(0.2*roomCount)); _e >= 0; _e--) {
    var enemyPlace = utils.randomPick(trails)
    var enemy = entityFactory(sprites.enemy)
    var correction = ((enemy.h - tileSize)/2)
    enemy.x = enemyPlace.x - correction
    enemy.y = enemyPlace.y - correction
    enemy.speed = 10+roomCount*0.7
    enemy.type = 'enemy'
    enemies.push(enemy)
  }



  return {
    walls: walls,
    bgTiles: bgTiles,
    sceneMapFlat: sceneMapFlat,
    trails: trails,
    stars: stars,
    enemies: enemies,
    pointers: {
      l: undefined,
      r: undefined,
      t: undefined,
      d: undefined
    }
  }
}


var roomCount = 0
var setMap = function(world, scene) {
  Object.keys(world.things).filter((x) => ['player', 'star', 'enemy'].indexOf(x) !== -1).map((k) => {
    world.things[k].map((item) => item._toRecycle = true)
  })


  world.things.walls = scene.walls
  world.things.bgTiles = scene.bgTiles
  roomCount += 1


  window.setTimeout(() => {
    world.things.star = scene.stars
    world.things.enemy = scene.enemies
    PAUSE = false


    let txt = `Explore a strange anti-gravity cave where rooms you never go back.\n
Avoid spiders and collect energy pills to *beat* your high score.\n
Controls: "wasd" or "←→↑↓" to walk and invert.\n
Press any key to start.`
    var gCanvas = document.getElementById('game-canvas');
    var ctx = gCanvas.getContext("2d");
    canvasTxt.font = "Arial";
    canvasTxt.textSize = 10;
    canvasTxt.align = "center";
    //canvasTxt.lineHeight = 12;
    ctx.fillStyle = "#FF0000FF";
    canvasTxt.drawText(ctx,txt,45,65,150,0)
    ctx.fillStyle = "#FFFFFFFF";
    canvasTxt.drawText(ctx,txt,45-1,65-1,150,0)

  }, 300)
}


var SPRITES
var setLifeBar = function(world) {
  var lifeBarSprite = SPRITES.lifeBar(LIFE)
  if (lifeBarSprite) {
    var lifeBar = entityFactory(SPRITES.lifeBar(LIFE))
    lifeBar.x = CANVAS_W - 35
    lifeBar.y = 5
    lifeBar.type = 'lifeBar'
    world.things.lifeBar = [lifeBar]
  }
}

var prevSCORE = null
var setScorePanel = function() {
  // score
  if (prevSCORE == SCORE) {
    //return
  }
  prevSCORE = SCORE
  let txt = 'score: '+SCORE
  var gCanvas = document.getElementById('game-canvas');
  var ctx = gCanvas.getContext("2d");
  canvasTxt.font = "Arial";
  canvasTxt.textSize = 9;
  canvasTxt.align = "left";
  canvasTxt.lineHeight = 12;
  //canvasTxt.debug = true; //shows debug info
  ctx.fillStyle = "#FF0000FF";
  canvasTxt.drawText(ctx,txt,CANVAS_W-90,6,100,0)

  ctx.fillStyle = "#FFFFFFFF";
  canvasTxt.drawText(ctx,txt,CANVAS_W-90-1,6-1,100,0)

}

var tileSize = 20

var placePlayer = function(player, scene) {
  var playerPlace = utils.randomPick(scene.sceneMapFlat.filter((item) => item.trail))
  var correction = ((player.h - tileSize)/2)
  player.x = playerPlace.x - correction
  player.y = playerPlace.y - correction
  player.type = 'player'
  player.speed = 100
  player.scene = scene
  sounds['again'].play()
}

var afterWorldCreate = function(world, sprites) {
  SPRITES = sprites

  setLifeBar(world)

  var scene = createMap(tileSize, sprites)
  setMap(world, scene)


  var player = entityFactory(sprites.player)
  placePlayer(player, scene)
  
  world.things.players = [player]
  window.setTimeout(() => {
    player.movey = 1
  }, 1000)
}


var beforeIterateThings = function(world) {
  /** Look at mouse camera
  var player = world.things.players[0]
  CAMERA = {
    xoffset: ~~((CAMERA.xoffset*0.8) + (player.w/2+player.x-VW+INPUT.mousex)*0.2)
    ,yoffset: ~~((CAMERA.yoffset*0.8) + (player.h/2+player.y-VH+INPUT.mousey)*0.2)
  }
  */
}

var gravity = {
  v: 0,
  h: 0
}

var handlePlayerInput = function(thing) {
  thing.movex = 0
  if (!INPUT.moveLeft || !INPUT.moveRight) {
    if (INPUT.moveLeft) {
      thing.movex = -1
      gravity.v = -1
    }
    if (INPUT.moveRight) {
      thing.movex = 1
    }
  }

  thing.toSide = thing.movex !== 0 ? thing.movex : thing.toSide
  
  if ((!INPUT.moveUp || !INPUT.moveDown) && !thing.falling) {
    //thing.movey = 0
    if (INPUT.moveUp) {
      thing.movey = -1
      thing.upsidedown = true
      sounds['jump'].play()
    }
    if (INPUT.moveDown) {
      thing.movey = 1
      thing.upsidedown = false
      sounds['jump'].play()
    }

  }
}

var iniMsg = true
var thingsHandler = function(world, thing, type) {

  var player = world.things.players[0]
  if (type === 'enemy') {
    var dx = (player.x+player.h/2 - thing.x)
    var dy = (player.y+player.w/2 - thing.y)
    var deltaP = Math.atan2(dy, dx)

    thing.movex = Math.cos(deltaP)
    thing.movey = Math.sin(deltaP)


  }

  if (type === 'star') {
    var collisionEvents = collisions.checkCollision(thing, world.things.players)
    if (!!collisionEvents.length) {
      thing._toRecycle = true
      if (LIFE < 30) {
        LIFE += 2
      }
      setLifeBar(world)
      SCORE += 10
      // TODO: enable play multiple
      //console.log(sounds['pick'])
      sounds['pick'].play()
    }
  }

  if (type === 'players') {
    setScorePanel()
    handlePlayerInput(thing)

    var collisionEvents = collisions.checkCollision(thing, world.things.enemy)
    if (!!collisionEvents.length) {
      LIFE = LIFE-0.5
      sounds['hurt'].play()
      if (LIFE <= 0) {
        var hiscore = parseInt(localStorage.getItem('hiscore'))
        if (isNaN(hiscore)) {
          hiscore = 0
        }
        var scoreTxt
        if (SCORE > hiscore) {
          localStorage.setItem('hiscore', SCORE)
          scoreTxt = 'New High score! but you lose, again...'
        } else {
          scoreTxt = 'You lose! try again...'
        }

        var c = document.getElementById('game-canvas');
        var ctx = c.getContext("2d");
        roomCount = 0
        SCORE = 0
        canvasTxt.font = "Arial";
        canvasTxt.textSize = 14;
        canvasTxt.align = "left";
        canvasTxt.lineHeight = 12;
        //canvasTxt.debug = true; //shows debug info
        ctx.fillStyle = "#FF0000FF";
        canvasTxt.drawText(ctx,scoreTxt,CANVAS_W/3,20,100,100)

        ctx.fillStyle = "#FFFFFFFF";
        canvasTxt.drawText(ctx,scoreTxt,CANVAS_W/3-1,20-1,100,100)

        PAUSE = true
        window.setTimeout(() => {
          LIFE = 30
          var scene = createMap(tileSize, SPRITES)
          setMap(world, scene)
          placePlayer(player, scene)
          PAUSE = false
        }, 3000)

        
      } else {
        setLifeBar(world)
      }

    }




    thing.falling = true 
    // checking for collision ultil all is solved. 
    // necessary because of fps oscliation
    for (var i = 10; i >= 0; i--) {
      var collisionEvents = collisions.checkCollision(thing, world.things.walls)
      if (!!collisionEvents.length) {
        collisions.handlePlayerColl(collisionEvents)
      } else {
        break
      }
    }
    // check if is falling. Used to invert gravity
    if (thing.y === thing._prevy) {
      thing.falling = false
    }

    /*
    borderPaths: {
      l: trails.filter((item) => item.x === 0),
      r: trails.filter((item) => item.y === 0),
      t: trails.filter((item) => item.x === CANVAS_W-tileSize),
      d: trails.filter((item) => item.y === CANVAS_H-tileSize)
    }*/

    if (thing.x < -4*(thing.w/5)) {
      setLifeBar(world)
      //console.log('to left')
      var borders = thing.scene.trails.filter((item) => item.x === 0).map((item) => {
        var o = {}
        o.x = CANVAS_W-tileSize
        o.y = item.y
        return o
      })
      var scene = createMap(tileSize, SPRITES, borders)
      setMap(world, scene)
      thing.scene = scene
      thing.x = CANVAS_W-thing.w/4
      thing._prevx = thing.x
      return 
    }

    if (thing.x+thing.w/5 > CANVAS_W) {
      setLifeBar(world)
      //console.log('to right')
      var borders = thing.scene.trails.filter((item) => item.x === CANVAS_W-tileSize).map((item) => {
        var o = {}
        o.x = 0
        o.y = item.y
        return o
      })
      var scene = createMap(tileSize, SPRITES, borders)
      thing.scene.pointers.r = scene
      setMap(world, scene)
      thing.scene = scene
      thing.x = -thing.w/4
      thing._prevx = thing.x
      return 
    }

    if (thing.y < -4*(thing.h/5)) {
      setLifeBar(world)
      //console.log('to up')
      var borders = thing.scene.trails.filter((item) => item.y === 0).map((item) => {
        var o = {}
        o.x = item.x
        o.y = CANVAS_H-tileSize
        return o
      })
      var scene = createMap(tileSize, SPRITES, borders)
      setMap(world, scene)
      thing.scene = scene
      thing.y = CANVAS_H-thing.h/4
      thing._prevy = thing.y
      return 
    }

    if (thing.y+thing.h/5 > CANVAS_H) {
      setLifeBar(world)
      //console.log('to down')
      var borders = thing.scene.trails.filter((item) => item.y === CANVAS_H-tileSize).map((item) => {
        var o = {}
        o.x = item.x
        o.y = 0
        return o
      })
      var scene = createMap(tileSize, SPRITES, borders)
      setMap(world, scene)
      thing.scene = scene
      thing.y = -thing.h/4
      thing._prevy = thing.y
      return
    }
  }
}

export {
  RECORD_INPUT,
  RECORDED_INPUT,
  POOLS,
  THINGS_PAINT_ORDER,
  MAP_SIZE,
  PSIZE,
  TILESCALE,
  PALETTE,
  afterWorldCreate,
  beforeIterateThings,
  thingsHandler,
  CANVAS_W,
  CANVAS_H,
  PAUSE,
  iniMsg
};