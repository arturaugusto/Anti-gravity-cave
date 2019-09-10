import * as factories from '../../engine/factories.js'

var p = {
  ' ': 'rgba(255,255,255,0)'
  ,x: '#EA9CAE'
  ,G: '#C36278'
  ,H: '#9C344C'
  ,g: '#75142A'
  ,b: '#34000B'
  ,w: '#D4C175FF'
  //,B: 'blue'
  //,r: 'red'
  ,y: '#EA9CAE'
  ,m: '#F07E98'
  ,p: '#DDDDDDFF'
}

var v1 = '    ppypypp     '
var v2 = '   pympppypy    '
var v3 = '  pympyppmpyy   '
var v4 = 'HhxxxxxxxxxHHHH '
var v5 = 'HGGGGGbbbGGGbbbb'
var v6 = 'HGGGGbwwwbGbwwwb'
var v7 = 'HGGGGbwbwbGbwwbb'
var v8 = 'HgGGGbwwwbGbwwwb'
var v9 = 'HgxGGGbbbGGGbbb '
var v10 = 'HgxGGGGGwwwwGH  '
var v11 = 'HHgxGGGwGGGGGH  '
var v12 = 'HGGGGGGGGGGGHH  '
var v13 = 'bHGHHHHHHHdggb  '
var v14 = ' bHHHHHHHgggb   '
var v15 = ' bHHbbbbbgggb   '
var v16 = ' bHb     bgb    '
var v18 = ' bHb     bgb    '
var player = 
  { idle: [
    { s: factories.spriteFactory(
        [ v1 // 0
        , v2 // 1
        , v3 // 2
        , v4 // 3
        , v5 // 4
        , v6 // 5
        , v7 // 6
        , v8 // 7
        , v9 //10
        , v10 //11
        , v11 //12
        , v12 //14
        , v13 //15
        , v14 //16
        , v15 //17
        , v16 //18
        , v18 //19
        ], p),
      d: 2
    }, 
    { s: factories.spriteFactory(
        [ v1 // 0
        , v2 // 1
        , v3 // 2
        , v4 // 3
        , v5 // 4
        , v6 // 5
        , 'HGGGGbwbwbGbwwwb' // 6
        , 'HgGGGbwwwbGbwbwb' // 7
        , v9 //10
        , v10 //11
        , v11 //12
        , v12 //14
        , v13 //15
        , v14 //16
        , v15 //17
        , v16 //18
        , v18 //19
        ], p),
      d: 0.1
    }, 
    { s: factories.spriteFactory(
        [ v1 // 0
        , v2 // 1
        , v3 // 2
        , v4 // 3
        , v5 // 4
        , v6 // 5
        , 'HGGGGbwbwbGbbwwb' // 6
        , v8 // 7
        , v9 //10
        , v10 //11
        , v11 //12
        , v12 //14
        , v13 //15
        , v14 //16
        , v15 //17
        , v16 //18
        , v18 //19
        ], p),
      d: 0.1
    }, 
    { s: factories.spriteFactory(
        [ v1 // 0
        , v2 // 1
        , v3 // 2
        , v4 // 3
        , 'HGGGGGGGGGGGGGGb' // 4
        , 'HGGGGbbbbbGbbbbb' // 5
        , 'HGGGGbbbbbGbbbbb' // 6
        , 'HgGGGGGGGGGGGGb ' // 7
        , 'HgxGGGGGGGGGGHb ' //10
        , v10 //11
        , v11 //12
        , v12 //14
        , v13 //15
        , v14 //16
        , v15 //17
        , v16 //18
        , v18 //19
        //, 'bHGGGGGGGGGGGGHb ' //13
        ] , p),
      d: 0.2
    }] // idle
  , move: [
    { s: factories.spriteFactory(
        [ v1 // 0
        , v2 // 1
        , v3 // 2
        , v4 // 3
        , v5 // 4
        , v6 // 5
        , v7 // 6
        , v8 // 7
        , v9 //10
        , v10 //11
        , v11 //12
        , v12 //14
        , v13 //15
        , 'bHHHHHHHHgggb   ' //16
        , 'bgggbbbbbgggb   ' //17
        , 'bgbb     bbb    ' //18
        , 'bb              ' //19
        ], p),
      d: 0.2 }, 
    { s: factories.spriteFactory(
        [ v1 // 0
        , v2 // 1
        , v3 // 2
        , v4 // 3
        , v5 // 4
        , v6 // 5
        , v7 // 6
        , v8 // 7
        , v9 //10
        , v10 //11
        , v11 //12
        , v12 //14
        , v13 //15
        , 'bHHHbbbbbgggb   ' //16
        , 'bbbb     bbbb   ' //17
        , '                ' //18
        , '                ' //19
        ] , p),
      d: 0.2},
    { s: factories.spriteFactory(
        [ v1 // 0
        , v2 // 1
        , v3 // 2
        , v4 // 3
        , v5 // 4
        , v6 // 5
        , v7 // 6
        , v8 // 7
        , v9 //10
        , v10 //11
        , v11 //12
        , v12 //14
        , v13 //15
        , 'bHHHHHHHHgggb   ' //16
        , 'bbbbbbbbbggb    ' //17
        , '        bgb     ' //18
        , '        bb      ' //19
        ] , p),
      d: 0.2},
    { s: factories.spriteFactory(
        [ v1 // 0
        , v2 // 1
        , v3 // 2
        , v4 // 3
        , v5 // 4
        , v6 // 5
        , v7 // 6
        , v8 // 7
        , v9 //10
        , v10 //11
        , v11 //12
        , v12 //14
        , v13 //15
        , 'bbHHHHHHHgggb   ' //16
        , '  bbbbbbbggb    ' //17
        , '        bgb     ' //18
        , '        bb      ' //19
        ] , p),
      d: 0.2},
    { s: factories.spriteFactory(
        [ v1 // 0
        , v2 // 1
        , v3 // 2
        , v4 // 3
        , v5 // 4
        , v6 // 5
        , v7 // 6
        , v8 // 7
        , v9 //10
        , v10 //11
        , v11 //12
        , v12 //14
        , v13 //15
        , 'bHHHbbbbbgggb   ' //16
        , 'bbbb     bbbb   ' //17
        , '                ' //18
        , '                ' //19
        ] , p),
      d: 0.2}
    ] // move
  } // states end
;

export default player