import { BasedGame } from "../BasedEngine";
import { degToRad, XYCoordinateType } from "./mathHelpers"


export function rotateDraw(settings: {
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  a: number,
  cameraPos?: any,
  zoom?: number
}, drawFn: () => void) {
  const {
    c, x, y, a, cameraPos, zoom = 1
  } = settings

  c.save();

  // move to the center of the canvas
  c.translate(
    x * zoom + (cameraPos ? cameraPos.x : 0),
    y * zoom + (cameraPos ? cameraPos.y : 0)
  );

  // rotate the canvas to the specified degrees
  c.rotate(a * Math.PI / 180);

  // draw the image
  // since the context is rotated, the image will be rotated also
  drawFn()

  // we’re done with the rotating so restore the unrotated context
  c.restore();
}

export function drawSVG(settings: {
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
  sprite: string,
  flipX?: boolean,
  flipY?: boolean,
}, camera?: {
  cameraPos?: any,
  zoom?: number
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
    img,
    flipX,
    flipY,
  } = settings
  const {
    cameraPos,
    zoom = 1
  } = camera || {}
  c.scale(flipX ? -1 : 1, flipY ? -1 : 1)
  c.drawImage(
    img,
    sx * (zoom ? zoom : 1) + (cameraPos ? cameraPos.x : 0),
    sy * (zoom ? zoom : 1) + (cameraPos ? cameraPos.y : 0),
    sWidth * (zoom ? zoom : 1),
    sHeight * (zoom ? zoom : 1),
  )
  c.scale(1, 1)
}

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
  sprite: string,
  flipX?: boolean,
  flipY?: boolean,
  cameraPos?: any,
  zoom?: number
},
  camera?: {
    cameraPos?: any,
    zoom?: number
  }
) {
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
    img,
    flipX,
    flipY,
  } = settings
  const {
    cameraPos,
    zoom = 1
  } = camera || {}
  c.scale(flipX ? -1 : 1, flipY ? -1 : 1)
  c.drawImage(
    img,
    sx * (zoom ? zoom : 1) + (cameraPos ? cameraPos.x : 0),
    sy * (zoom ? zoom : 1) + (cameraPos ? cameraPos.y : 0),
    sWidth * (zoom ? zoom : 1),
    sHeight * (zoom ? zoom : 1),
    dx * zoom,
    dy * zoom,
    dWidth * zoom,
    dHeight * zoom,
  )
  c.scale(1, 1)
}

const spriteCache: any = {}

export async function createSprite(spriteOptions: any) {
  const spriteKey = 'cache-' + spriteOptions.sprite
  if (spriteCache[spriteKey]) {
    spriteOptions.img = spriteCache[spriteKey]
  } else {
    const spriteImg = await new Promise((resolve, reject) => {
      let img = new Image();
      img.onload = () => { resolve(img) }
      img.onerror = (err) => { reject(err) }
      img.src = spriteOptions.sprite
    })
    spriteOptions.img = spriteImg
    spriteCache[spriteKey] = spriteImg
  }
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
  strokeDashPattern?: number[],
  cameraPos?: any,
  zoom?: number
}) {
  const {
    c, x, y, radius, startAngle, endAngle, fillColor, strokeWidth, strokeColor, strokeDashPattern, cameraPos, zoom = 1
  } = settings
  c.beginPath()
  c.arc(
    x * zoom + (cameraPos ? cameraPos.x : 0),
    y * zoom + (cameraPos ? cameraPos.y : 0),
    radius * zoom, startAngle ? degToRad(startAngle) : 0, endAngle ? degToRad(endAngle) : 2 * Math.PI)
  if (fillColor) {
    c.fillStyle = fillColor
    c.fill()
  }
  if (strokeWidth && strokeColor) {
    c.strokeStyle = strokeColor
    c.lineWidth = strokeWidth * zoom
    if (settings.strokeDashPattern) {
      c.setLineDash(strokeDashPattern)
    }
    c.stroke()
    c.setLineDash([])
  }
}

export function drawEllipse(settings: {
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  radiusX: number,
  radiusY: number,
  startAngle?: number,
  endAngle?: number,
  fillColor?: string,
  strokeWidth?: number,
  strokeColor?: string,
  cameraPos?: any,
  zoom?: number
}) {
  const {
    c, x, y, radiusX, radiusY, startAngle, endAngle, fillColor, strokeWidth, strokeColor, cameraPos, zoom = 1
  } = settings
  c.beginPath()
  c.ellipse(
    x * zoom + (cameraPos ? cameraPos.x : 0),
    y * zoom + (cameraPos ? cameraPos.y : 0),
    radiusX * zoom,
    radiusY * zoom,
    0, startAngle ? degToRad(startAngle) : 0, endAngle ? degToRad(endAngle) : 2 * Math.PI)
  if (fillColor) {
    c.fillStyle = fillColor
    c.fill()
  }
  if (strokeWidth && strokeColor) {
    c.strokeStyle = strokeColor
    c.lineWidth = strokeWidth * zoom
    c.stroke()
  }
}


export function drawBox(settings: {
  c: any,
  // c: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  fillColor?: string,
  strokeWidth?: number,
  strokeColor?: string,
  borderRadius?: number | number[],
  cameraPos?: any,
  zoom?: number
}) {
  const {
    c, x, y, width, height, fillColor, strokeWidth, strokeColor, borderRadius, cameraPos, zoom = 1
  } = settings
  c.beginPath()
  if (borderRadius) {
    c.roundRect(
      x * zoom + (cameraPos ? cameraPos.x : 0),
      y * zoom + (cameraPos ? cameraPos.y : 0),
      width * zoom,
      height * zoom,
      typeof borderRadius === 'number' ? borderRadius * zoom : borderRadius.map((r: number) => r * zoom)
    )
  } else {
    c.rect(
      x * zoom + (cameraPos ? cameraPos.x : 0),
      y * zoom + (cameraPos ? cameraPos.y : 0),
      width * zoom,
      height * zoom
    )
  }
  if (fillColor) {
    c.fillStyle = fillColor
    c.fill()
  }

  if (strokeWidth && strokeColor) {
    c.strokeStyle = strokeColor
    c.lineWidth = strokeWidth * zoom
    c.stroke()
  }
}

export function drawText(settings: {
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  fillColor: string,
  align: 'center' | 'left' | 'right',
  text: string,
  strokeWidth?: number,
  strokeColor?: string,
  fontFamily: string,
  fontSize: number,
  style?: string,
  weight?: string | number,
  cameraPos?: any,
  zoom?: number
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
    weight,
    cameraPos,
    zoom = 1
  } = settings
  c.textAlign = align ? align : 'center'
  c.font = `${style ? style + ' ' : ''}${weight ? weight + ' ' : ''}${fontSize * zoom}px ${fontFamily}`

  if (strokeWidth && strokeColor) {
    c.strokeStyle = strokeColor
    c.lineWidth = strokeWidth
    c.strokeText(
      text,
      x * zoom + (cameraPos ? cameraPos.x : 0),
      y * zoom + (cameraPos ? cameraPos.y : 0)
    )
  }

  if (fillColor) {
    c.fillStyle = fillColor
    c.fillText(
      text,
      x * zoom + (cameraPos ? cameraPos.x : 0),
      y * zoom + (cameraPos ? cameraPos.y : 0)
    )
  }
}

export function drawPolygon(settings: {
  c: CanvasRenderingContext2D,
  vertices: XYCoordinateType[],
  fillColor: string,
  strokeWidth?: number,
  strokeColor?: string,
  cameraPos?: any,
  zoom?: number
}
) {

  const {
    c,
    vertices,
    fillColor,
    strokeWidth,
    strokeColor,
    cameraPos = { x: 0, y: 0 },
    zoom = 1
  } = settings

  c.fillStyle = fillColor;
  c.beginPath();
  // start line
  c.moveTo(
    vertices[0].x * zoom + cameraPos.x,
    vertices[0].y * zoom + cameraPos.y
  );

  for (let i = 1; i < vertices.length; i++) {
    c.lineTo(
      vertices[i].x * zoom + cameraPos.x,
      vertices[i].y * zoom + cameraPos.y
    );
  }

  // go to start
  c.lineTo(
    vertices[0].x * zoom + cameraPos.x, 
    vertices[0].y * zoom + cameraPos.y
  );

  c.closePath();
  c.fill();

  if (strokeWidth && strokeColor) {
    c.strokeStyle = strokeColor
    c.lineWidth = strokeWidth * zoom
    c.stroke()
  }
}

export function drawCameraFrame(gameRef: BasedGame, drawFn: () => void) {
  const rcX = gameRef.gameWidth / 2
  const rcY = gameRef.gameHeight / 2
  rotateDraw({
    c: gameRef.ctx,
    x: rcX,
    y: rcY,
    a: 0,
  }, () => {
    rotateDraw({
      c: gameRef.ctx,
      x: 0,
      y: 0,
      // a: 0,
      a: gameRef.cameraRotation,
    }, () => {
      rotateDraw({
        c: gameRef.ctx,
        x: -rcX,
        y: -rcY,
        a: 0,
      }, () => {
        drawFn()
      })
    })
  })
}
