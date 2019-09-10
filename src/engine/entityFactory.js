var mirrorCanvas = function(x, a, b) {
  // vorh shoud be 1 or -1, to control if canvas will be fliped 
  // horizonal or vertical
  // 1 for vertical
  // -1 for horizontal  
  a = a || 1
  b = b || -1
  var newCanvas = document.createElement('canvas')
  var ctx = newCanvas.getContext('2d')
  ctx.height = x.height
  ctx.width = x.width
  ctx.drawImage(x, 0, 0);
  ctx.clearRect(0, 0, x.width, x.height)
  ctx.scale(b, a)
  ctx.drawImage(x,0,0,x.width*b,x.height*a);
  return newCanvas
}

// create a entity with all properties 
// handled on main loop
var entityFactory = function(sprites, toRecycle) {

  sprites = sprites || {idle: [{height: 10, width: 10}]}

  /**
  Conventions for sprites
  
  The `idle` sprite is assumed to be a "character turned to the right".
  We can also define `idleRight` and `idleLeft` sprites, and if they 
  are not defined, the `idle` sprite will be mirrored to the left and used as `idleLeft`
  
  The same idea is used for `move`, `moveRight` and `moveLeft`.
  If no `move` or `moveRight` is defined, the `idleRight` or 
  `idle` sprites will be used instead.

  To each sprite set for those actions, a sprite control object is created.
  They have a `timeline` and `i` parameters to control the repetition
  loop of sprites. The `timeline` is reseted to 0 when it reaches the
  sprite duration and `i` is set to 0 when the sprite loop is complete.
  The `timeline` is also ensured to be 0 when it not corresponds to the 
  current sprite action.
  */

  sprites.idleRight = sprites.idleRight || sprites.idle
  
  sprites.idleLeft = sprites.idleLeft || 
    sprites.idle.map((item) => Object({s: mirrorCanvas(item.s), d: item.d}))
  ;

  sprites.moveRight = sprites.moveRight || sprites.move || sprites.idleRight
  
  sprites.moveLeft = sprites.moveLeft || 
    sprites.moveRight.map((item) => Object({s: mirrorCanvas(item.s), d: item.d}))
  ;

  // upsidedown sprites 
  sprites.idleRightUpsDown = sprites.idleRightUpsDown || 
    sprites.idleRight.map((item) => Object({s: mirrorCanvas(item.s, -1, 1), d: item.d}))
  ;

  sprites.moveRightUpsDown = sprites.moveRightUpsDown || 
    sprites.moveRight.map((item) => Object({s: mirrorCanvas(item.s, -1, 1), d: item.d}))
  ;

  sprites.idleLeftUpsDown = sprites.idleLeftUpsDown || 
    sprites.idleRight.map((item) => Object({s: mirrorCanvas(item.s, -1), d: item.d}))
  ;

  sprites.moveLeftUpsDown = sprites.moveLeftUpsDown || 
    sprites.moveRight.map((item) => Object({s: mirrorCanvas(item.s, -1), d: item.d}))
  ;


  // Create sprite cicle control
  //var _spritesNamesCache = []
  Object.keys(sprites).map(function(k) {
    var spriteCicle = {
      timeline: 0,
      duration: 0.5,
      i: 0
    }
    sprites[k].ctl = Object.create(spriteCicle)
  })

  var obj
  if (toRecycle) {
    obj = toRecycle
  } else {
    obj = 
      {h: sprites.idleRight[0].s.height
      ,w: sprites.idleRight[0].s.width
      ,speed: 100
      ,sprites: sprites
      ,toSide: null
      ,_toRecycle: false
      ,xhit: 0
      ,yhit: 0
      ,type: ''
      ,followers: []
      ,life: 0
      ,x: 0
      ,y: 0
      ,_prevx: 0
      ,_prevy: 0
      ,spriteSet: ''
      ,movex: null
      ,color: null
      ,falling: true
      ,upsidedown: false
    }
  }


  obj.whit = obj.w
  obj.hhit = obj.h
  return obj
}

export default entityFactory