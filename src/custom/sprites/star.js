import * as factories from '../../engine/factories.js'

var p = {
  ' ': 'rgba(255,255,255,0)'
  ,x: '#DDDDDDFF'
}

var star = 
  { idle: [
    { s: factories.spriteFactory(
        [ '  xx  ' // 0
        , ' xxxx ' // 1
        , 'xxxxxx' // 2
        , ' xxxx ' //18
        , '  xx  ' //19
        ], p),
      d: 0.2
    }] // idle
  } // states end
;

star.move = []

export default star