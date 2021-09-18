import { BasedLevel } from "../../../engine/BasedLevel";
import { TouchKnob } from "../../../engine/controls/TouchKnob";
import { distanceBetween, getRandomInt } from "../../../engine/libs/mathHelpers";
import Baddie from "../entities/Baddie";
import Leader from "../entities/Leader";
import Player from "../entities/Player";
import PushBox from "../entities/Pushbox";
import { MapOne } from "../maps/MapOne";
import BgMusic from '../../../assets/vimjam2/good-new-diddyPERFOMANCE.mp3'
import BgMusic2 from '../../../assets/vimjam2/Deep space.mp3'
import { Pickup } from "../entities/Pickup";
import { BasedButton } from "../../../engine/BasedButton";

import PoopSprite from '../../../assets/vimjam2/poop-sprite.png'
import StickMelee from '../../../assets/vimjam2/Stick_melee.png'
import { createSprite, drawBox, drawImage, rotateDraw } from "../../../engine/libs/drawHelpers";
import Boss from "../entities/Boss";

import MoveText from '../../../assets/vimjam2/MOVE_2x.png'
import WASDText from '../../../assets/vimjam2/WASD_2x.png'
import ArrowText from '../../../assets/vimjam2/ARROWSx.png'
import AimText from '../../../assets/vimjam2/AIMx.png'
import AttackText from '../../../assets/vimjam2/ATTACKx.png'
import ButtonX from '../../../assets/vimjam2/BUTTON_Xx.png'
import SwapText from '../../../assets/vimjam2/SWAPx.png'
import MouseImg from '../../../assets/vimjam2/MOUSE.png'
import HealthGFX from '../../../assets/vimjam2/Health-Bar-2.png'


export class LevelOne extends BasedLevel {

  player: any;
  leader: any;
  box: any;

  baddies: any[] = [];
  pickups: any[] = [];

  moveKnob: any;
  aimKnob: any;
  swapWeaponBtn: any;

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

  // interface sprites
  swingSprite: any;
  flingSprite: any;
  moveSprite: any;
  wasdSprite: any;
  arrowSprite: any;
  aimSprite: any;
  swapSprite: any;
  attackSprite: any;
  buttonXSprite: any;
  mouseSprite: any;
  healthSprite: any;

  async preload() {

    this.gameRef.drawLoading('Interface')

    this.healthSprite = await await createSprite({
      c: this.gameRef.ctx,
      sprite: HealthGFX,
      sx: 0,
      sy: 0,
      sWidth: 160,
      sHeight: 72,
      dx: 0,
      dy: 0,
      dWidth: 160,
      dHeight: 72,
      frame: 0,
    })

    this.swingSprite = await await createSprite({
      c: this.gameRef.ctx,
      sprite: StickMelee,
      sx: 0,
      sy: 0,
      sWidth: 40,
      sHeight: 20,
      dx: 0,
      dy: 0,
      dWidth: 80,
      dHeight: 40,
      frame: 0,
    })

    this.flingSprite = await createSprite({
      c: this.gameRef.ctx,
      sprite: PoopSprite,
      sx: 0,
      sy: 0,
      sWidth: 12,
      sHeight: 12,
      dx: 0,
      dy: 0,
      dWidth: 36,
      dHeight: 36,
      frame: 0,
    })

    const commonSpriteDim = {
      c: this.gameRef.ctx,
      sx: 0,
      sy: 0,
      sWidth: 94,
      sHeight: 24,
      dx: 0,
      dy: 0,
      dWidth: 96,
      dHeight: 24,
      frame: 0,
    }
    this.wasdSprite = await createSprite({
      sprite: WASDText,
      ...commonSpriteDim
    })

    this.arrowSprite = await createSprite({
      sprite: ArrowText,
      ...commonSpriteDim
    })

    this.moveSprite = await createSprite({
      sprite: MoveText,
      ...commonSpriteDim
    })

    this.aimSprite = await createSprite({
      sprite: AimText,
      ...commonSpriteDim
    })

    this.swapSprite = await createSprite({
      sprite: SwapText,
      ...commonSpriteDim
    })

    this.buttonXSprite = await createSprite({
      sprite: ButtonX,
      ...commonSpriteDim
    })

    this.attackSprite = await createSprite({
      c: this.gameRef.ctx,
      sprite: AttackText,
      sx: 0,
      sy: 0,
      sWidth: 140,
      sHeight: 24,
      dx: 0,
      dy: 0,
      dWidth: 140,
      dHeight: 24,
      frame: 0,
    })

    this.mouseSprite = await createSprite({
      c: this.gameRef.ctx,
      sprite: MouseImg,
      sx: 0,
      sy: 0,
      sWidth: 24,
      sHeight: 24,
      dx: 0,
      dy: 0,
      dWidth: 24,
      dHeight: 24,
      frame: 0,
    })

    this.gameRef.drawLoading('Map')
    // setup map
    this.tileMap = new MapOne({ key: 'map-1', gameRef: this.gameRef })
    this.tileMap.tileSize = 64
    await this.tileMap.preload()
    this.levelWidth = this.tileMap.width
    this.levelHeight = this.tileMap.height
    this.bossRoom = false

    this.gameRef.drawLoading('Entities')

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
    await this.leader.preload()
    // this.player.tileMap = this.tileMap

    // setup pickups
    this.pickups = []
    let pickupCount = 1
    for (let i = 1; i < this.tileMap.roomList.length; i++) {
      const newPickup = new Pickup({ key: `pickup-${pickupCount}`, gameRef: this.gameRef })
      newPickup.x = (this.tileMap.roomList[i].x + getRandomInt(this.tileMap.roomList[i].w)) * this.tileMap.tileSize + this.tileMap.tileSize / 2
      newPickup.y = (this.tileMap.roomList[i].y + getRandomInt(this.tileMap.roomList[i].h)) * this.tileMap.tileSize + this.tileMap.tileSize / 2
      newPickup.spawnRoom = this.tileMap.roomList[i].key
      if (getRandomInt(2) > 0) {
        newPickup.setOnPickup(() => {
          this.player.healthBar.tick(25, true)
          newPickup.active = false
          newPickup.playPickupNoise()
        })
        newPickup.spriteChoice = 1
        newPickup.pickupColor = 'yellow'
      } else {
        newPickup.setOnPickup(() => {
          this.player.poopHealthBar.tick(50, true)
          newPickup.active = false
          newPickup.playPickupNoise()
        })
      }
      await newPickup.preload()
      newPickup.active = true
      this.tileMap.addOccupant(newPickup)
      this.pickups.push(newPickup)
      pickupCount++
    }

    //setup enemies
    this.baddies = []
    let baddieCount = 0
    for (let i = 1; i < this.tileMap.roomList.length; i++) {
      for(let j = 0; j <= i/2; j++) {
        const newBaddie = new Baddie({ key: `baddie-${baddieCount}`, gameRef: this.gameRef })
        await newBaddie.preload()
        newBaddie.x = (this.tileMap.roomList[i].x + getRandomInt(this.tileMap.roomList[i].w)) * this.tileMap.tileSize + this.tileMap.tileSize / 2
        newBaddie.y = (this.tileMap.roomList[i].y + getRandomInt(this.tileMap.roomList[i].h)) * this.tileMap.tileSize + this.tileMap.tileSize / 2
        newBaddie.spawnRoom = this.tileMap.roomList[i].key
        this.baddies.push(newBaddie)
        baddieCount++
      }
    }

    // add boss
    const bossBaddie = new Boss({ key: `baddie-${baddieCount}`, gameRef: this.gameRef })
    await bossBaddie.preload()
    const lastRoomIndex = this.tileMap.roomList.length - 1
    bossBaddie.x = (this.tileMap.roomList[lastRoomIndex].x + 5) * this.tileMap.tileSize
    bossBaddie.y = (this.tileMap.roomList[lastRoomIndex].y + 5) * this.tileMap.tileSize
    bossBaddie.spawnRoom = this.tileMap.roomList[lastRoomIndex].key
    this.baddies.push(bossBaddie)

    this.bossRoomTag = this.tileMap.roomList[this.tileMap.roomList.length - 1].key

    // UI
    this.moveKnob = new TouchKnob({ key: 'move-knob', gameRef: this.gameRef })
    this.aimKnob = new TouchKnob({ key: 'aim-knob', gameRef: this.gameRef })
    this.positionKnobs()

    this.gameRef.drawLoading('Music')
    // Music
    this.bgSong = await this.gameRef.soundPlayer.loadSound(BgMusic)
    this.bgSong2 = await this.gameRef.soundPlayer.loadSound(BgMusic2)
    this.activeSound.playing = false
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

    this.swapWeaponBtn = new BasedButton({
      key: `swap-wpn-button`,
      gameRef: this.gameRef,
    })
    this.swapWeaponBtn.fillColor = '#ce192b'
    this.swapWeaponBtn.x = this.gameRef.gameWidth - 100
    this.swapWeaponBtn.y = 40
    this.swapWeaponBtn.buttonText = 'swap'
    this.swapWeaponBtn.width = 80
    this.swapWeaponBtn.clickFunction = () => {
      this.player.switchMode(this.player.mode === 'melee' ? 'shoot' : 'melee')
    }

  }

  update() {

    this.handleSounds()
    // this.tileMap.removeOccupant(this.player)
    this.movePlayer()
    this.swapWeaponBtn.update()
    this.player.update()
    // this.tileMap.addOccupant(this.player)

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
    if (pressedKeys['KeyX']) {
      this.player.switchMode(this.player.mode === 'melee' ? 'shoot' : 'melee')
    }

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
      this.player.attacking = this.gameRef.mouseInfo.mouseDown && !this.swapWeaponBtn.hovered
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
    this.swapWeaponBtn.x = this.gameRef.gameWidth - 100
  }

  drawInterface() {
    if (this.gameRef.touchMode) {
      this.moveKnob.draw()
      this.aimKnob.draw()

      rotateDraw({
        c: this.gameRef.ctx,
        x: this.moveKnob.width/2 - 48,
        y: this.gameRef.gameHeight -40 ,
        a: 0
      }, () => {
        drawImage(this.moveSprite)
      })
      rotateDraw({
        c: this.gameRef.ctx,
        x: this.aimKnob.x + this.moveKnob.width/2 - 48,
        y: this.gameRef.gameHeight -40 ,
        a: 0
      }, () => {
        drawImage(this.aimSprite)
      })

      // END TOUCH MODE
    } else {
      rotateDraw({
        c: this.gameRef.ctx,
        x: 60,
        y: this.gameRef.gameHeight - 120 ,
        a: 0
      }, () => {
        drawImage(this.moveSprite)
      })
      rotateDraw({
        c: this.gameRef.ctx,
        x: 60,
        y: this.gameRef.gameHeight - 80 ,
        a: 0
      }, () => {
        drawImage(this.wasdSprite)
      })

      rotateDraw({
        c: this.gameRef.ctx,
        x: 60,
        y: this.gameRef.gameHeight - 40 ,
        a: 0
      }, () => {
        drawImage(this.arrowSprite)
      })

      rotateDraw({
        c: this.gameRef.ctx,
        x: this.gameRef.gameWidth - 178,
        y: this.gameRef.gameHeight - 120,
        a: 0
      }, () => {
        drawImage(this.aimSprite)
      })

      rotateDraw({
        c: this.gameRef.ctx,
        x: this.gameRef.gameWidth - 200,
        y: this.gameRef.gameHeight - 80,
        a: 0
      }, () => {
        drawImage(this.attackSprite)
      })

      rotateDraw({
        c: this.gameRef.ctx,
        x: this.gameRef.gameWidth - 142,
        y: this.gameRef.gameHeight - 40,
        a: 0
      }, () => {
        drawImage(this.mouseSprite)
      })

      // rotateDraw({
      //   c: this.gameRef.ctx,
      //   x: this.gameRef.gameWidth - 116,
      //   y: 90,
      //   a: 0
      // }, () => {
      //   drawImage(this.buttonXSprite)
      // })
    }

    // this.swapWeaponBtn.draw()

    if (this.player.mode === 'shoot') {
      rotateDraw({
        c: this.gameRef.ctx,
        x: this.gameRef.gameWidth - 100,
        y: 40,
        a: 0
      }, () => {
        drawImage(this.swingSprite)
      })
      rotateDraw({
        c: this.gameRef.ctx,
        x: this.gameRef.gameWidth - 116,
        y: 10,
        a: 0
      }, () => {
        drawImage(this.swapSprite)
      })
    }

    rotateDraw({
      c: this.gameRef.ctx,
      x: 10,
      y: 10,
      a: 0
    }, () => {
      drawImage(this.healthSprite)
    })

    if(this.player.healthBar.current > 0){
      const p = this.player.healthBar.current/this.player.healthBar.max
      drawBox({
        c: this.gameRef.ctx,
        x: 90,
        y: 18,
        width: 72 * p,
        height: 8,
        // fillColor: 'red'
        fillColor: p < .5 ? 'red' : p < .8 ? 'orange' : 'green'
      })
    }

    if(this.player.poopHealthBar.current > 0){
      const p = this.player.poopHealthBar.current/this.player.poopHealthBar.max
      drawBox({
        c: this.gameRef.ctx,
        x: 106,
        y: 42,
        width: 56 * p,
        height: 8,
        fillColor: 'brown'
      })
    }

    if (this.player.mode === 'melee' && this.player.poopHealthBar.current > 0) {
      rotateDraw({
        c: this.gameRef.ctx,
        x: this.gameRef.gameWidth - 86,
        y: 40,
        a: 0
      }, () => {
          this.gameRef.ctx.globalAlpha = this.player.poopHealthBar.current / this.player.poopHealthBar.max
          drawImage(this.flingSprite)
          this.gameRef.ctx.globalAlpha = 1
      })
      rotateDraw({
        c: this.gameRef.ctx,
        x: this.gameRef.gameWidth - 116,
        y: 10,
        a: 0
      }, () => {
        drawImage(this.swapSprite)
      })
    }
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

    this.pickups.map(pickup => {
      if (pickup.active) {
        pickup.draw()
      }
    })

    this.drawInterface()

  }

  tearDown() {
    if (this.activeSound.playing && this.activeSound.soundRef) {
      this.activeSound.soundRef.stop()
    }
  }

}
