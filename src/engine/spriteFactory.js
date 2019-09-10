var custom = {
  PSIZE: 1
}

var spriteFactory = function(template, palette) {
  //template = template || ['BBBBBB','BBBBBB','BBBBBB','BBBBBB','BBBBBB','BBBBBB']
  /*palette = palette ||  {
    ' ': 'rgba(255,255,255,0)'
    ,x: 'black'
    ,b: 'blue'
    ,r: 'red'
    ,w: 'white'
    ,g: 'green'
  }*/
  var canvas = document.createElement('canvas')

  canvas.width = template[0].length*custom.PSIZE
  canvas.height = template.length*custom.PSIZE

  var ctx = canvas.getContext('2d', { alpha: true })
  for (var i = 0; i < template.length; i++) {
    var cells = template[i].split('')
    for (var j = 0; j < cells.length; j++) {
      ctx.beginPath();
      ctx.rect(j*custom.PSIZE, i*custom.PSIZE, custom.PSIZE, custom.PSIZE)
      ctx.fillStyle = palette[cells[j]]
      ctx.fill()
      ctx.closePath()
    }
  }
  return canvas
}
 export default spriteFactory