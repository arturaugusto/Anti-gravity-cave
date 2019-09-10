import * as factories from '../../engine/factories.js'

var p = {
  ' ': 'rgba(255,255,255,0)'
  ,'a': '#000'
  ,x: '#980000'
  ,y: '#FF0000'
}

var enemy = 
  { idle: [
    { s: factories.spriteFactory(
        [ 'a aa a' // 0
        , ' aaaa ' // 1
        , 'aaaaaa' // 2
        , ' ayya ' //18
        , 'a aa a' //19
        ], p),
      d: 0.2
    }] // idle
  } // states end
;
/*
enemy.move = [
    { s: factories.spriteFactory(
        [ 'a aa  ' // 0
        , ' aaaaa' // 1
        , 'aaaaaa' // 2
        , ' ayyaa' //18
        , 'a aa  ' //19
        ], p),
      d: 0.5
    },
    { s: factories.spriteFactory(
        [ '  aa a' // 0
        , 'aaaaa ' // 1
        , 'aaaaaa' // 2
        , 'aayya ' //18
        , '  aa a' //19
        ], p),
      d: 0.5
    }
  ]
*/
export default enemy