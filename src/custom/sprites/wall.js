import * as factories from '../../engine/factories.js'
import * as utils from '../../engine/utils.js'


var wallFactory = (size, type, pEarth, pGrass) => {
  type = type || ''

  var p = {...pEarth, ...pGrass}


  var arrBuff = Array(size).fill()
  var tile = arrBuff.map((_, i) => 
    arrBuff.reduce((a) => a+utils.randomPick(Object.keys(pEarth)),'')
  )

  var randomTexture = (p) => {
    return arrBuff.reduce((a) => a+utils.randomPick(Object.keys(p)),'')
  }
  // top grass
  if (type.indexOf('t') !== -1) {
    tile[0] = randomTexture(pGrass)// arrBuff.reduce((a) => a+utils.randomPick(Object.keys(pGrass)),'')
    tile[1] = randomTexture(pGrass)// arrBuff.reduce((a) => a+utils.randomPick(Object.keys(pGrass)),'')
    tile[2] = randomTexture(p)// arrBuff.reduce((a) => a+utils.randomPick(Object.keys(p)),'')
  }

  // bottom grass
  if (type.indexOf('b') !== -1) {
    tile[size-1] = randomTexture(pGrass)// arrBuff.reduce((a) => a+utils.randomPick(Object.keys(pGrass)),'')
    tile[size-2] = randomTexture(pGrass)// arrBuff.reduce((a) => a+utils.randomPick(Object.keys(pGrass)),'')    
    tile[size-3] = randomTexture(p)// arrBuff.reduce((a) => a+utils.randomPick(Object.keys(p)),'')
  }

  // left grass
  if (type.indexOf('l') !== -1) {
    for (var i = 0; i < size; i++) {
      tile[i] = tile[i].split('')
      for (var j = 0; j < 3; j++) {
        tile[i][j] = utils.randomPick(Object.keys(j <= 1 ? pGrass : p))
      }
      tile[i] = tile[i].join('')
    }
  }

  if (type.indexOf('r') !== -1) {
    for (var i = 0; i < size; i++) {
      tile[i] = tile[i].split('')
      for (var j = 0; j < 3; j++) {
        tile[i][size-j-1] = utils.randomPick(Object.keys(j <= 1 ? pGrass : p))
      }
      tile[i] = tile[i].join('')
    }
  }


  var wall = {
    idle: [{
      s: factories.spriteFactory(tile, p)
    }]
  }
  return wall
}

export default wallFactory