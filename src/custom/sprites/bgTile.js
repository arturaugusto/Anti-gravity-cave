import * as factories from '../../engine/factories.js'
import * as utils from '../../engine/utils.js'

var bgTile = (size, pattern) => {

  var p = {
    a: '#1C1C1C',
    x: '#1E1E1E'
    //x: '#1F1F1F'
  }

  var patterns = {}

  patterns['t1'] = Array(20).fill()
    .map((_, i) => 
              Array(3+~~(i/4)).fill('a')
      .concat(Array(5).fill('x'))
      .concat(Array(13+~~(i/4)).fill('a'))
      .join('')
      .slice(0,20)
    )
 /*['aaaxxxxxxaaaxxxxxxxx',
  'aaaxxxxxxxaaaxxxxxxx',
  'aaaaxxxxxxaaaxxxxxxx',
  'xaaaxxxxxxxaaaxxxxxx',
  'xaaaaxxxxxxaaaxxxxxx',
  'xxaaaxxxxxxxaaaxxxxx',
  'xxaaaaxxxxxxaaaxxxxx',
  'xxxaaaxxxxxxxaaaxxxx',
  'xxxaaaaxxxxxxaaaxxxx',
  'xxxxaaaxxxxxxxaaaxxx',
  'xxxxaaaaxxxxxxaaaxxx',
  'xxxxxaaaxxxxxxxaaaxx',
  'xxxxxaaaaxxxxxxaaaxx',
  'xxxxxxaaaxxxxxxxaaax',
  'xxxxxxaaaaxxxxxxaaax',
  'xxxxxxxaaaxxxxxxxaaa',
  'xxxxxxxaaaaxxxxxxxxx',
  'xxxxxxxxaaaxxxxxxxxx',
  'xxxxxxxxaaaxxxxxxxxx',
  'xxxxxxxxxaaaxxxxxxxx']*/


 patterns['t2'] = 
 ['aaaaaaaaaaaaaaaaaaaa',
  'aaaaxaaaaaaaaaaaaaaa',
  'aaaaxaaaaaaaaaaaaaaa',
  'aaxxxxxaaaaaaaaaaaaa',
  'aaaaxaaaaaaaaaaaaaaa',
  'aaaaxaaaaaaaaaaaaaaa',
  'aaaaaaaxaaaaaaaaaaax',
  'xxaaaaaxaaaaaaaaaxxx',
  'aaaaaxxxxxaaaaaaaaax',
  'aaaaaaaxaaaaaaaaaaax',
  'aaaaaaaxaaaaaaaaaaaa',
  'aaaaaaaaaaaxaaaaaaaa',
  'aaaaaaaaaaaxaaaaaaaa',
  'aaaaaaaaaxxxxxaaaaaa',
  'aaaxaaaaaaaxaaaaaaaa',
  'aaaxaaaaaaaxaaaaaaaa',
  'axxxxxaaaaaaaaaaaaaa',
  'aaaxaaaaaaaaaaaaaaaa',
  'aaaxaaaaaaaaaaaaaaaa',
  'aaaaaaaaaaaaaaaaaaaa']


  var arrBuff = Array(size).fill()
  var t = arrBuff.map((_, i) => 
    arrBuff.reduce((a) => a+utils.randomPick(Object.keys(p)),'')
  )

  var tile = {
    idle: [{
      s: factories.spriteFactory(patterns[pattern], p)
    }]
  }
  return tile
}

export default bgTile