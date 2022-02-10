import { BasedLevel } from "./BasedLevel";
import { BasedSounds } from "./BasedSounds";
import { drawText } from "./libs/drawHelpers";
import { getClickPosition, getTouchArray, getTouchPosition, XYCoordinateType } from "./libs/mathHelpers";

export interface gameSettings {
  width?: number
  height?: number
  canvasElementId?: string
  levels?: { key: string, level: any }[]
}

export interface BasedGameType {
  ctx: CanvasRenderingContext2D;
  gameActive: boolean;
  soundPlayer: BasedSounds;

  gameWidth: number;
  gameHeight: number;

  lastUpdate: number;
  updateDiff: number;
  updateTick: number;
  diffMulti: number;

  pressedKeys: { [key: string]: boolean }

  createCanvas: () => void;
  createContextFromElement: (e: any) => void;
  enableKeyboard: () => void;
  tick: () => void;
  start: () => void;
  update: () => void;
  draw: () => void;
  gameLoop: () => void;
  loadLevel: (level: string) => void;
  levels: { [key: string]: BasedLevel }
  activeLevel: string;
  enableMouse: () => void;
}

export class BasedGame implements BasedGameType {
  canvasElement: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  gameActive: boolean = false;

  soundPlayer: BasedSounds;

  animFrame: any;

  gameWidth: number;
  gameHeight: number;

  cameraPos: XYCoordinateType = {x: 0, y: 0}
  cameraZoom: number = 1

  lastUpdate: number = Date.now()
  updateDiff: number = Date.now()
  updateTick: number = 1000 / 60
  fps: number = 0
  diffMulti: number = this.updateDiff / this.updateTick

  keyBoardEnabled: boolean = false
  pressedKeys: { [key: string]: boolean } = {}

  mouseEnabled: boolean = false
  mouseInfo: {
    x: number, y: number,
    mouseDown: boolean
  } = { x: -100, y: -100, mouseDown: false }

  touchInfo: {x: number, y: number, id: string}[] = []
  touchMode: boolean = false

  levels: { [key: string]: BasedLevel } = {}
  activeLevel: string = '';
  targetLevel: string = '';
  pendingLevelLoad: boolean = false;

  basedObjectRefs: any = {}

  loadingMessage: string = 'Loading Assets'
  currentlyLoading: string = ''

  constructor(settings: gameSettings) {
    this.canvasElement = this.createCanvas()
    this.canvasElement.width = settings.width ? settings.width : 200
    this.gameWidth = this.canvasElement.width
    this.canvasElement.height = settings.height ? settings.height : 400
    this.gameHeight = this.canvasElement.height
    const baseElement: HTMLElement | null | Document = settings.canvasElementId ? document.getElementById(settings.canvasElementId) : document
    if (baseElement) {
      baseElement.appendChild(this.canvasElement)
    }
    this.ctx = this.createContextFromElement(this.canvasElement)

    this.soundPlayer = new BasedSounds()

    window.addEventListener('resize', e => {
      this.resizeCanvas()
    });


    if (settings.levels) {
      settings.levels.forEach((level) => {
        this.levels[level.key] = new level.level({ key: level.key, gameRef: this })
        if (this.activeLevel == '') {
          this.activeLevel = level.key
        }
      })
    }

    this.gameLoop = this.gameLoop.bind(this)
    this.update = this.update.bind(this)
    this.tick = this.tick.bind(this)
    this.draw = this.draw.bind(this)
  }

  createCanvas(): any {
    return document.createElement('canvas')
  }

  resizeCanvas() {
    this.canvasElement.width = window.innerWidth
    this.canvasElement.height = window.innerHeight
    this.gameWidth = this.canvasElement.width
    this.gameHeight = this.canvasElement.height
    this.ctx = this.createContextFromElement(this.canvasElement)
    if(this.levels[this.activeLevel].onResize) {
      this.levels[this.activeLevel].onResize()
    }
  }

  createContextFromElement(e: any): any {
    return e.getContext('2d')
  }

  enableMouse() {
    this.canvasElement.addEventListener('mousedown', e => {
      this.mouseInfo.mouseDown = true;
    });

    this.canvasElement.addEventListener('mousemove', e => {
      [this.mouseInfo.x, this.mouseInfo.y] = getClickPosition(e)
      // this.touchMode = false
    });
    window.addEventListener('mouseup', e => {
      this.mouseInfo.mouseDown = false;
    });

    this.canvasElement.addEventListener('touchstart', e => {
      // [this.mouseInfo.x,this.mouseInfo.y] = getClickPosition(e)
      // e.preventDefault()
      [this.mouseInfo.x, this.mouseInfo.y] = getTouchPosition(e)
      this.mouseInfo.mouseDown = true;
      this.touchMode = true
      this.touchInfo = getTouchArray(e)
    });

    this.canvasElement.addEventListener('touchmove', e => {
      [this.mouseInfo.x, this.mouseInfo.y] = getTouchPosition(e)
      this.touchInfo = getTouchArray(e)
    });
    window.addEventListener('touchend', e => {
      // e.preventDefault()
      this.mouseInfo.mouseDown = false;
      this.touchInfo = getTouchArray(e)
    });
  }

  enableKeyboard() {
    if (this.keyBoardEnabled) {
      return
    }
    document.addEventListener('keydown', (e) => {
      // console.log(e.code)
      this.pressedKeys[e.code] = true
      // this.pressedKeys[e.keyCode] = true
    })
    document.addEventListener('keyup', (e) => {
      this.pressedKeys[e.code] = false
      // this.pressedKeys[e.keyCode] = false
    })
  }

  tick() {
    this.updateDiff = Date.now() - this.lastUpdate
    this.fps = 1/(this.updateDiff/1000)
    this.diffMulti = this.updateDiff / this.updateTick
    // this.diffMulti = this.updateDiff / this.fps
    this.lastUpdate = Date.now()
  }

  async start() {
    // console.log('game start')
    this.drawLoading()
    this.soundPlayer.initialize()
    this.gameActive = true

    this.targetLevel = this.activeLevel

    await this.levels[this.activeLevel].preload()
    this.levels[this.activeLevel].initialize()
    this.animFrame = window.requestAnimationFrame(this.gameLoop)
  }

  update() {
    // console.log('game update')
    this.tick()
    this.levels[this.activeLevel].update()
  }

  draw() {
    // console.log('game draw')
    this.levels[this.activeLevel].draw()
  }

  drawLoading(loadingThing?: string) {
    this.ctx.beginPath()
    this.ctx.rect(0, 0, this.gameWidth, this.gameHeight)
    this.ctx.fillStyle = '#eee'
    this.ctx.fill()

    drawText({
      c: this.ctx,
      x: (this.gameWidth)/2,
      y: 100,
      align:'center',
      fillColor: '#000',
      strokeColor: '#fff',
      strokeWidth: 3,
      style: '',
      weight: '500',
      fontFamily: 'sans-serif',
      fontSize: 20,
      text: this.loadingMessage
    })

    drawText({
      c: this.ctx,
      x: (this.gameWidth)/2,
      y: 150,
      align:'center',
      fillColor: '#000',
      strokeColor: '#fff',
      strokeWidth: 3,
      style: '',
      weight: '500',
      fontFamily: 'sans-serif',
      fontSize: 20,
      text: loadingThing ? loadingThing : this.currentlyLoading
    })
  }

  loadLevel(level: string) {
    this.targetLevel = level;
    this.pendingLevelLoad = true
  }

  async handleLevelLoad() {
    this.loadingMessage = 'Loading Assets'
    this.currentlyLoading = ''
    this.drawLoading()
    this.levels[this.activeLevel].tearDown()
    this.activeLevel = this.targetLevel
    await this.levels[this.activeLevel].preload()
    this.levels[this.activeLevel].initialize()
    this.pendingLevelLoad = false
    this.animFrame = window.requestAnimationFrame(this.gameLoop)
  }

  gameLoop() {
    // console.log('game loop')
    if (this.gameActive) {
      if(this.activeLevel === this.targetLevel && !this.pendingLevelLoad) {
        this.update()
        this.draw()
        this.animFrame = window.requestAnimationFrame(this.gameLoop)
      } else {
        this.handleLevelLoad()
      }
    }
  }

}
