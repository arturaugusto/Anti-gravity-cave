import * as factories from '../../engine/factories.js'

function scorePanel(val) {
  
  var p = {
    ' ': 'rgba(255,255,255,0)'
    ,x: '#fff'
  }
  
  if (val < 1) {
    val = 1
    p['x'] = p[' ']
  }

  var arr = Array(4).fill('x'.repeat(val))

  var lb = 
    { idle: [
      { s: factories.spriteFactory(arr, p),
        d: 0.2
      }] // idle
    } // states end
  ;

  lb.move = []
  return lb
}


export default scorePanel