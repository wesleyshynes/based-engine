import { BasedLevel } from "../../../engine/BasedLevel";
import { TouchKnob } from "../../../engine/controls/TouchKnob";
import { distanceBetween } from "../../../engine/libs/mathHelpers";
import Baddie from "../entities/Baddie";
import Leader from "../entities/Leader";
import Player from "../entities/Player";
import PushBox from "../entities/Pushbox";
import { MapOne } from "../maps/MapOne";
import BgMusic from '../../../assets/vimjam2/good-new-diddyPERFOMANCE.mp3'
import BgMusic2 from '../../../assets/vimjam2/Deep space.mp3'

export class LevelOne extends BasedLevel {

  player: any;
  leader: any;
  box: any;

  baddies: any[] = [];

  moveKnob: any;
  aimKnob: any;

  levelWidth: number = 3200
  levelHeight: number = 3200

  tileMap: any;

  activeSound: any = {
    playing: false,
    soundRef: null,
  }

  bgSong: any;
  bgSong2: any;

  bossRoom: boolean = false
  bossRoomTag: string;

  async preload() {
    // setup map
    this.tileMap = new MapOne({ key: 'map-1', gameRef: this.gameRef })
    this.tileMap.tileSize = 64
    await this.tileMap.preload()
    this.levelWidth = this.tileMap.width
    this.levelHeight = this.tileMap.height
    this.bossRoom = false

    // setup player
    this.player = new Player({ key: 'player', gameRef: this.gameRef })
    this.player.x = (this.tileMap.roomList[0].x + 2) * this.tileMap.tileSize
    this.player.y = (this.tileMap.roomList[0].y + 2) * this.tileMap.tileSize
    this.player.tileMap = this.tileMap
    await this.player.preload()

    // setup box
    this.box = new PushBox({ key: 'box', gameRef: this.gameRef })
    this.box.x = (this.tileMap.roomList[this.tileMap.roomList.length - 1].x + 2) * this.tileMap.tileSize
    this.box.y = (this.tileMap.roomList[this.tileMap.roomList.length - 1].y + 2) * this.tileMap.tileSize
    this.box.tileMap = this.tileMap
    await this.box.preload()

    // setup goal
    this.leader = new Leader({ key: 'leader', gameRef: this.gameRef })
    this.leader.x = (this.tileMap.roomList[0].x + 5) * this.tileMap.tileSize
    this.leader.y = (this.tileMap.roomList[0].y + 5) * this.tileMap.tileSize
    // this.player.tileMap = this.tileMap

    //setup enemies
    this.baddies = []
    for (let i = 1; i < this.tileMap.roomList.length; i++) {
      const newBaddie = new Baddie({ key: `baddie-${i}`, gameRef: this.gameRef })
      await newBaddie.preload()
      newBaddie.x = (this.tileMap.roomList[i].x + 2) * this.tileMap.tileSize
      newBaddie.y = (this.tileMap.roomList[i].y + 2) * this.tileMap.tileSize
      newBaddie.spawnRoom = this.tileMap.roomList[i].key
      this.baddies.push(newBaddie)
    }

    this.bossRoomTag = this.tileMap.roomList[this.tileMap.roomList.length - 1].key

    // UI
    this.moveKnob = new TouchKnob({ key: 'move-knob', gameRef: this.gameRef })
    this.aimKnob = new TouchKnob({ key: 'aim-knob', gameRef: this.gameRef })
    this.positionKnobs()


    // Music
    this.bgSong = await this.gameRef.soundPlayer.loadSound(BgMusic)
    this.bgSong2 = await this.gameRef.soundPlayer.loadSound(BgMusic2)

  }

  initialize() {
    this.player.initialize()
    this.baddies.map(baddie => {
      baddie.tileMap = this.tileMap
      baddie.target = this.player
      baddie.initialize()
    })
    this.moveKnob.initialize()
    this.aimKnob.initialize()
  }

  update() {

    this.handleSounds()

    this.tileMap.removeOccupant(this.player)
    this.movePlayer()
    this.player.update()
    this.tileMap.addOccupant(this.player)

    this.tileMap.removeOccupant(this.box)
    this.box.update()
    this.tileMap.addOccupant(this.box)

    this.baddies.map(baddie => {
      this.tileMap.removeOccupant(baddie)
    })
    this.baddies.map(baddie => {
      if (baddie.healthBar.current > 0) {
        baddie.update()
        this.tileMap.addOccupant(baddie)
      }
    })

    this.updateCamera()

    // win condition
    if (distanceBetween(this.leader, this.box) < this.leader.radius + this.box.radius) {
      // alert('You win')
      this.gameRef.loadLevel('start-screen')
    }
    if (this.player.healthBar.current < 1) {
      // alert('You died')
      this.gameRef.loadLevel('start-screen')
    }

  }

  movePlayer() {
    const pressedKeys = this.gameRef.pressedKeys
    const speedFactor = this.player.baseSpeed //this.player.speed * this.gameRef.diffMulti

    let moveX = 0
    let moveY = 0

    if (pressedKeys['KeyA'] || pressedKeys['ArrowLeft']) {
      moveX -= speedFactor
    }
    if (pressedKeys['KeyD'] || pressedKeys['ArrowRight']) {
      moveX += speedFactor
    }
    if (pressedKeys['KeyW'] || pressedKeys['ArrowUp']) {
      moveY -= speedFactor
    }
    if (pressedKeys['KeyS'] || pressedKeys['ArrowDown']) {
      moveY += speedFactor
    }
    if (pressedKeys['KeyX']) { }

    this.moveKnob.update()
    if (this.moveKnob.knobActive) {
      const speedFactor = this.player.speed * this.gameRef.diffMulti
      moveX += (this.moveKnob.knobCoord.x / this.moveKnob.maxOffset) * speedFactor
      moveY += (this.moveKnob.knobCoord.y / this.moveKnob.maxOffset) * speedFactor
    }

    this.player.moveTo({
      x: this.player.x + moveX,
      y: this.player.y + moveY
    })

    this.aimKnob.update()
    if (this.aimKnob.knobActive) {
      const { x: bx, y: by } = this.player
      this.player.setTarget({
        x: (this.aimKnob.knobCoord.x / this.aimKnob.maxOffset) * 1000 + bx,
        y: (this.aimKnob.knobCoord.y / this.aimKnob.maxOffset) * 1000 + by,
      })
      this.player.attacking = true
    } else if (!this.gameRef.touchMode) {
      this.player.attacking = this.gameRef.mouseInfo.mouseDown
      this.player.setTarget({
        x: this.gameRef.mouseInfo.x - this.gameRef.cameraPos.x,
        y: this.gameRef.mouseInfo.y - this.gameRef.cameraPos.y,
      })
    } else {
      this.player.attacking = false
    }
  }

  handleSounds() {
    if (!this.bossRoom && this.tileMap.visitedRooms[this.bossRoomTag]) {
      this.bossRoom = true
      this.activeSound.soundRef.stop()
    }
    if (this.activeSound.playing == false) {
      this.activeSound.soundRef = this.gameRef.soundPlayer.playSound(this.bossRoom ? this.bgSong2 : this.bgSong, () => {
        this.activeSound.playing = false
      })
      this.activeSound.playing = true
    }
  }

  updateCamera() {
    const cameraTarget = this.player
    this.gameRef.cameraPos = {
      x: -(cameraTarget.x - this.gameRef.gameWidth / 2),
      y: -(cameraTarget.y - this.gameRef.gameHeight / 2)
    }
    if (this.gameRef.gameWidth < this.levelWidth) {
      if (this.gameRef.cameraPos.x > 0) this.gameRef.cameraPos.x = 0
      if (this.gameRef.cameraPos.x - this.gameRef.gameWidth < this.levelWidth * -1) this.gameRef.cameraPos.x = -(this.levelWidth - this.gameRef.gameWidth)
    } else {
      this.gameRef.cameraPos.x = (this.gameRef.gameWidth - this.levelWidth) / 2
    }

    if (this.gameRef.gameHeight < this.levelHeight) {
      if (this.gameRef.cameraPos.y > 0) this.gameRef.cameraPos.y = 0
      if (this.gameRef.cameraPos.y - this.gameRef.gameHeight < this.levelHeight * -1) this.gameRef.cameraPos.y = -(this.levelHeight - this.gameRef.gameHeight)
    } else {
      this.gameRef.cameraPos.y = (this.gameRef.gameHeight - this.levelHeight) / 2
    }
  }

  positionKnobs() {
    this.moveKnob.width = this.moveKnob.width > this.gameRef.gameWidth / 2 ? this.gameRef.gameWidth / 2 - 5 : this.moveKnob.width
    this.moveKnob.x = 0
    this.moveKnob.y = this.gameRef.gameHeight - this.moveKnob.height

    this.aimKnob.width = this.aimKnob.width > this.gameRef.gameWidth / 2 ? this.gameRef.gameWidth / 2 - 5 : this.aimKnob.width
    this.aimKnob.x = this.gameRef.gameWidth - this.aimKnob.width
    this.aimKnob.y = this.gameRef.gameHeight - this.moveKnob.height
  }

  onResize() {
    this.positionKnobs()
  }

  draw() {
    this.gameRef.ctx.beginPath()
    this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight)
    this.gameRef.ctx.fillStyle = '#777'
    this.gameRef.ctx.fill()

    this.tileMap.draw()

    this.player.draw()
    this.box.draw()

    this.leader.draw()

    this.baddies.map(baddie => {
      if (baddie.healthBar.current > 0) {
        baddie.draw()
      }
    })

    if (this.gameRef.touchMode) {
      this.moveKnob.draw()
      this.aimKnob.draw()
    }
  }

  tearDown() {
    if(this.activeSound.playing){
      this.activeSound.soundRef.stop()
    }
  }

}
