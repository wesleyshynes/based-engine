import { degToRad } from "./mathHelpers"

export function drawImage(settings: {
  c: CanvasRenderingContext2D,
  img: CanvasImageSource,
  sx: number,
  sy: number,
  sWidth: number,
  sHeight: number,
  dx: number,
  dy: number,
  dWidth: number,
  dHeight: number,
  sprite: string
}) {
    const {
        c,
        sprite,
        sx,
        sy,
        sWidth,
        sHeight,
        dx,
        dy,
        dWidth,
        dHeight,
        img
    } = settings
    c.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
}

export async function createSprite(spriteOptions: any) {
    const spriteImg = await new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => {resolve(img)}
        img.onerror = (err) => {reject(err)}
        img.src = spriteOptions.sprite
    })
    spriteOptions.img = spriteImg
    return spriteOptions
}

export function drawLine(settings: {
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  toX: number,
  toY: number,
  strokeWidth: number,
  strokeColor: string
}) {
  const {
    c,
    x,
    y,
    toX,
    toY,
    strokeWidth,
    strokeColor
  } = settings
  c.beginPath()
  c.moveTo(x, y);
  c.lineTo(toX, toY);
  c.strokeStyle = strokeColor
  c.lineWidth = strokeWidth
  c.stroke()
}

export function drawCircle(settings: {
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  startAngle?: number,
  endAngle?: number,
  fillColor?: string,
  strokeWidth?: number,
  strokeColor?: string
}) {
  const {
    c, x, y, radius, startAngle, endAngle, fillColor, strokeWidth, strokeColor
  } = settings
  c.beginPath()
  c.arc(x, y, radius, startAngle ? degToRad(startAngle) : 0, endAngle ? degToRad(endAngle) : 2 * Math.PI)
  if (fillColor) {
    c.fillStyle = fillColor
    c.fill()
  }
  if (strokeWidth && strokeColor) {
    c.strokeStyle = strokeColor
    c.lineWidth = strokeWidth
    c.stroke()
  }
}

export function drawBox(settings: {
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  fillColor?: string,
  strokeWidth?: number,
  strokeColor?: string
}) {
  const {
    c, x, y, width, height, fillColor, strokeWidth, strokeColor
  } = settings
  c.beginPath()
  c.rect(x, y, width, height)
  if (fillColor) {
    c.fillStyle = fillColor
    c.fill()
  }

  if (strokeWidth && strokeColor) {
    c.strokeStyle = strokeColor
    c.lineWidth = strokeWidth
    c.stroke()
  }
}

export function drawText(settings: {
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  fillColor: string,
  align: 'center' |  'left' | 'right',
  text: string,
  strokeWidth?: number,
  strokeColor?: string,
  fontFamily: string,
  fontSize: number,
  style?: string,
  weight?: string
}) {
  const {
       c,
       x,
       y,
       fillColor,
       strokeWidth,
       strokeColor,
       text,
       fontFamily,
       fontSize,
       align,
       style,
       weight
   } = settings
   c.textAlign = align ? align : 'center'
   c.font = `${style ? style + ' ' : ''}${weight ? weight + ' ' : ''}${fontSize}px ${fontFamily}`

   if(fillColor) {
       c.fillStyle = fillColor
       c.fillText(text, x, y)
   }
   if(strokeWidth && strokeColor) {
       c.strokeStyle = strokeColor
       c.lineWidth = strokeWidth
       c.strokeText(text, x, y)
   }
}
