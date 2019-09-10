import * as main from '../engine/main.js'
import * as custom from '../custom/main.js'  
import * as loop from '../engine/loop.js'
import entityFactory from './entityFactory.js'
import spriteFactory from './spriteFactory.js'
import * as sprites from '../custom/sprites.js'

var worldFactory = function() {
  var world = {}
  world.count = 0
  world.lost = false
  world.things = {}
  
  var poolsNames = Object.keys(custom.POOLS)

  for (var j = 0; j < poolsNames.length; j++) {
    world.things[poolsNames[j]] = []
    for (var _i = (custom.POOLS[poolsNames[j]] || 100) ; _i >= 1; _i--) {
      var thing =  entityFactory()
      thing._toRecycle = true
      world.things[poolsNames[j]].push(thing)
    }
  }

  if(custom.afterWorldCreate) {
    custom.afterWorldCreate(world, sprites)
    loop.start(main.update)
  }

  return world
}

/*var buildIdleTileVersions = function(templates, palette, modFun) {
  var tileSet = []
  for (var i = 0; i < templates.length; i++) {
    if (modFun) {
      var templatesMod = templates[i].map(modFun)
    } else {
      var templatesMod = templates[i]
    }
    var tileSprite = {idle: [spriteFactory(templatesMod, palette)]}
    tileSet.push(tileSprite)
  }
  return tileSet
}*/


export {worldFactory, entityFactory, spriteFactory}