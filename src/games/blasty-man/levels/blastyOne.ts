import { BasedLevel } from "../../../engine/BasedLevel";
import { BlastMan } from "../entities/BlastMan";
import { BlastSpider } from "../entities/BlastSpider";
import { BlastyMap } from "../maps/BlastyMap";
import { angleBetween, distanceBetween, pointOnCircle, relativeMultiplier, XYCoordinateType } from "../../../engine/libs/mathHelpers";
import { BasedButton } from "../../../engine/BasedButton";
import BgMusic from '../../../assets/blasty-man/boneDaddy5.mp3'
import { TouchKnob } from "../../../engine/controls/TouchKnob";

export class BlastyLevelOne extends BasedLevel {

  bMan: any;
  spiderGroup: any[];

  moveKnob: any;
  aimKnob: any;
  swapWeaponBtn: any;

  tileMap: any;

  cameraPos: XYCoordinateType = {x: 0, y: 0}
  levelWidth: number = 2000
  levelHeight: number = 2000

  swordHitBox: any = {
    sword: true,
    swordMid: true,
    swordHand: true
  }

  activeSound: any = {
    playing: false,
    soundRef: null,
  }
  bgSong: any;

  async preload() {
    this.tileMap = new BlastyMap({key: 'blast-map-1', gameRef: this.gameRef})
    this.tileMap.width = this.levelWidth
    this.tileMap.height = this.levelHeight
    this.tileMap.tileSize = 64
    await this.tileMap.preload()

    this.bMan = new BlastMan({key: 'blastMan', gameRef: this.gameRef})
    this.bMan.x = 115 - 20
    this.bMan.y = 100 - 32
    await this.bMan.preload()

    this.spiderGroup = []
    // console.log(this.tileMap.roomList)
    for(let i = 0; i < this.tileMap.roomList.length; i++) {
      const roomInfo = this.tileMap.roomList[i]
      // console.log(roomInfo)
      const newSpider = new BlastSpider({key: `blastspider-${i}`, gameRef: this.gameRef})
      newSpider.x = Math.floor((roomInfo.x*2 + roomInfo.w)/2) * this.tileMap.tileSize
      newSpider.y = Math.floor((roomInfo.y*2 + roomInfo.h)/2) * this.tileMap.tileSize
      // console.log(newSpider)
      await newSpider.preload()
      if(this.tileMap.getRoomFromCoord(this.tileMap.getMapCoord({x: newSpider.x, y: newSpider.y})).walkable) {
        // console.log('added')
        this.spiderGroup.push(newSpider)
      }
    }

    this.moveKnob = new TouchKnob({key: 'move-knob', gameRef: this.gameRef})
    this.aimKnob = new TouchKnob({key: 'aim-knob', gameRef: this.gameRef})
    this.positionKnobs()

    this.bgSong =  await this.gameRef.soundPlayer.loadSound(BgMusic)
  }

  initialize() {
    this.bMan.initialize()
    this.bMan.tileMap = this.tileMap

    this.spiderGroup.map(spider => {
      spider.initialize()
      spider.tileMap = this.tileMap
      spider.target = this.bMan.centerCoordinates()
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
    this.swapWeaponBtn.buttonText = this.bMan.mode
    this.swapWeaponBtn.width = 80
    this.swapWeaponBtn.clickFunction = () => {
      this.bMan.switchMode(this.bMan.mode === 'melee' ? 'ranged' : 'melee')
      this.swapWeaponBtn.buttonText = this.bMan.mode
    }

    console.log(this.gameRef.basedObjectRefs)
  }

  handleSounds() {
    if(this.activeSound.playing == false) {
      this.activeSound.soundRef = this.gameRef.soundPlayer.playSound(this.bgSong, () => {
        this.activeSound.playing = false
      })
      this.activeSound.playing = true
    }
  }

  update() {
    this.updateBg()
    this.handleSounds()

    this.swapWeaponBtn.update()
    this.tileMap.removeOccupant({...this.bMan.centerCoordinates(), objectKey: this.bMan.objectKey})
    this.tileMap.removeOccupant(this.bMan.gun1Bullet)
    this.tileMap.removeOccupant(this.bMan.gun2Bullet)
    this.tileMap.removeOccupant({
      x: this.bMan.sword.x + this.bMan.sword.swordTip.x,
      y: this.bMan.sword.y + this.bMan.sword.swordTip.y,
      objectKey: this.bMan.sword.objectKey
    })
    this.tileMap.removeOccupant({
      x: this.bMan.sword.x + this.bMan.sword.handPos.x,
      y: this.bMan.sword.y + this.bMan.sword.handPos.y,
      objectKey: 'swordHand'
    })
    this.tileMap.removeOccupant({
      x: this.bMan.sword.x + this.bMan.sword.swordMid.x,
      y: this.bMan.sword.y + this.bMan.sword.swordMid.y,
      objectKey: 'swordMid'
    })
    this.moveCharacter()
    this.bMan.update(this.cameraPos)
    this.tileMap.addOccupant({...this.bMan.centerCoordinates(), objectKey: this.bMan.objectKey},  {nonBlocker: true})
    this.tileMap.addOccupant(this.bMan.gun1Bullet)
    this.tileMap.addOccupant(this.bMan.gun2Bullet)
    this.tileMap.addOccupant({
      x: this.bMan.sword.x + this.bMan.sword.swordTip.x,
      y: this.bMan.sword.y + this.bMan.sword.swordTip.y,
      objectKey: this.bMan.sword.objectKey
    })
    this.tileMap.addOccupant({
      x: this.bMan.sword.x + this.bMan.sword.handPos.x,
      y: this.bMan.sword.y + this.bMan.sword.handPos.y,
      objectKey: 'swordHand'
    })
    this.tileMap.addOccupant({
      x: this.bMan.sword.x + this.bMan.sword.swordMid.x,
      y: this.bMan.sword.y + this.bMan.sword.swordMid.y,
      objectKey: 'swordMid'
    })



    let liveSpiders = 0
    this.spiderGroup.map(spider => {
      this.tileMap.removeOccupant(spider)
    })
    this.spiderGroup.map(spider => {
      // this.tileMap.removeOccupant(spider)
      if(spider.healthBar.current > 0) {
        spider.update()

        const occupants = this.tileMap.getRoomFromCoord(this.tileMap.getMapCoord(spider)).occupants
        Object.keys(occupants).map(oc => {
          if(occupants[oc].objectKey == spider.objectKey) {
            return
          }
          if(this.gameRef.basedObjectRefs[occupants[oc].objectKey]) {
            const otherObject = this.gameRef.basedObjectRefs[occupants[oc].objectKey]
            if(this.bMan.mode !== 'melee' && otherObject.entityTag === 'bullet' && otherObject.active && distanceBetween(otherObject, spider) <= 16) {
              otherObject.active = false
              spider.damage(-5, occupants[oc], 5)
            }
            if(this.bMan.mode === 'melee' && (this.swordHitBox[oc]) && /*otherObject.active &&*/ distanceBetween(occupants[oc], spider) <= 16) {
              // otherObject.active = false
              spider.damage(this.bMan.sword.currentSpeed > 5 ? -30 : -5, occupants[oc], 16)
            }
            if(otherObject.entityTag === 'blastMan' && distanceBetween(otherObject.centerCoordinates(), spider) <= 16) {
              // otherObject.healthBar.tick(-5)
              this.bMan.damage(-5, spider, 16)
            }
          }
        })

        spider.target = this.bMan.centerCoordinates()
        this.tileMap.addOccupant(spider)
        liveSpiders++
      }
    })


    // // collision checks
    // this.spiderGroup.map(spider => {
    //   if (spider.healthBar.current < 1) {return}
    //
    // })

    this.updateCamera()
    if(this.bMan.healthBar.current < 1 || liveSpiders === 0){
      // this.gameRef.loadLevel('start-screen')
      this.gameRef.loadLevel('blasty-1')
    }
  }

  onResize() {
    this.positionKnobs()
  }

  positionKnobs() {
    this.moveKnob.width = this.moveKnob.width > this.gameRef.gameWidth/2 ? this.gameRef.gameWidth/2 - 5 : this.moveKnob.width
    this.moveKnob.x = 0
    this.moveKnob.y = this.gameRef.gameHeight - this.moveKnob.height

    this.aimKnob.width = this.aimKnob.width > this.gameRef.gameWidth/2 ? this.gameRef.gameWidth/2 - 5 : this.aimKnob.width
    this.aimKnob.x = this.gameRef.gameWidth - this.aimKnob.width
    this.aimKnob.y = this.gameRef.gameHeight - this.moveKnob.height
  }

  moveCharacter() {
    const pressedKeys = this.gameRef.pressedKeys
    const speedFactor = this.bMan.speed * this.gameRef.diffMulti

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
      this.bMan.switchMode(this.bMan.mode === 'melee' ? 'ranged' : 'melee')
    }

    this.moveKnob.update()
    if(this.moveKnob.knobActive) {
      const speedFactor = this.bMan.speed * this.gameRef.diffMulti
      moveX += (this.moveKnob.knobCoord.x/this.moveKnob.maxOffset)*speedFactor
      moveY += (this.moveKnob.knobCoord.y/this.moveKnob.maxOffset)*speedFactor
    }

    this.bMan.x += moveX
    let bManCoords = this.bMan.centerCoordinates()
    if(
      !this.tileMap.onMap({x: bManCoords.x + (20 * relativeMultiplier(moveX)), y: bManCoords.y}) ||
      !this.tileMap.getRoomFromCoord(this.tileMap.getMapCoord({x: bManCoords.x + (20 * relativeMultiplier(moveX)), y: bManCoords.y})).walkable
    ) {
      this.bMan.x -= moveX
    }
    this.bMan.y += moveY
    bManCoords = this.bMan.centerCoordinates()
    const yyDis = (relativeMultiplier(moveY) > 0 ? 32 : -20)
    if(
      !this.tileMap.onMap({x: bManCoords.x, y: bManCoords.y + yyDis}) ||
      !this.tileMap.getRoomFromCoord(this.tileMap.getMapCoord({x: bManCoords.x, y: bManCoords.y + yyDis})).walkable
    ) {
      this.bMan.y -= moveY
    }

    this.aimKnob.update()
    if(this.aimKnob.knobActive) {
      const{x: bx, y: by} = this.bMan.centerCoordinates()
      this.bMan.setTarget({
        x: (this.aimKnob.knobCoord.x/this.aimKnob.maxOffset) * 1000 + bx,
        y: (this.aimKnob.knobCoord.y/this.aimKnob.maxOffset) * 1000 + by,
      })
      this.bMan.attacking = true
    } else if(!this.gameRef.touchMode) {
      this.bMan.attacking = this.gameRef.mouseInfo.mouseDown
      this.bMan.setTarget({
        x: this.gameRef.mouseInfo.x - this.cameraPos.x,
        y: this.gameRef.mouseInfo.y - this.cameraPos.y,
      })
    } else {
      this.bMan.attacking = false
    }

  }

  updateCamera() {
    const bManCenter = this.bMan.centerCoordinates()
    this.cameraPos = {
      x: -(bManCenter.x - this.gameRef.gameWidth / 2),
      y: -(bManCenter.y - this.gameRef.gameHeight / 2)
    }
    if (this.gameRef.gameWidth < this.levelWidth) {
      if (this.cameraPos.x > 0) this.cameraPos.x = 0
      if (this.cameraPos.x - this.gameRef.gameWidth < this.levelWidth * -1) this.cameraPos.x = -(this.levelWidth - this.gameRef.gameWidth)
    } else {
      this.cameraPos.x = (this.gameRef.gameWidth - this.levelWidth) / 2
    }

    if (this.gameRef.gameHeight < this.levelHeight) {
      if (this.cameraPos.y > 0) this.cameraPos.y = 0
      if (this.cameraPos.y - this.gameRef.gameHeight < this.levelHeight * -1) this.cameraPos.y = -(this.levelHeight - this.gameRef.gameHeight)
    } else {
      this.cameraPos.y = (this.gameRef.gameHeight - this.levelHeight) / 2
    }
  }

  updateBg() { }

  drawBg() { }

  draw() {
    this.gameRef.ctx.beginPath()
    this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight)
    this.gameRef.ctx.fillStyle = '#777'
    this.gameRef.ctx.fill()

    this.tileMap.draw(this.cameraPos)

    this.drawBg()

    this.bMan.draw(this.cameraPos)

    this.spiderGroup.map(spider => {
      if (spider.healthBar.current < 1) {return}
      spider.draw(this.cameraPos)
    })

    // drawText({
    //   c: this.gameRef.ctx,
    //   x: 20,
    //   y: 300,
    //   fillColor: 'white',
    //   text: 'debug text',
    //   fontFamily: 'sans-serif',
    //   align: 'left',
    //   fontSize: 16
    // })

    if(this.gameRef.touchMode) {
      this.moveKnob.draw()
      this.aimKnob.draw()
    }
    this.swapWeaponBtn.draw()
  }

  tearDown() {
    if(this.activeSound.playing){
      this.activeSound.soundRef.stop()
    }
  }
}
