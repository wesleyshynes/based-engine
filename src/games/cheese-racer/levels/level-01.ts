import BGMusic from '../../../assets/the-squeeze/tunetank.com_5630_ready-to-play_by_alexey-anisimov__1.mp3'
import { BasedLevel } from "../../../engine/BasedLevel";
import { FollowCam } from '../../../engine/cameras/FollowCam';
import { createSprite, drawBox, drawCameraFrame, drawCircle, drawSVG, rotateDraw } from '../../../engine/libs/drawHelpers';
import PhysBox from '../../../engine/physicsObjects/PhysBox';
import { DARK_COLOR, LIGHT_COLOR, PRIMARY_COLOR, SECONDARY_COLOR } from '../constants/gameColors';
import { MainPlayer } from '../entities/mainPlayer';
import CheesePiece from '../../../assets/cheese-racer/cheese-piece.svg'
import PhysPoly from '../../../engine/physicsObjects/PhysPoly';

export class Level01 extends BasedLevel {

    physics: any

    levelWidth: number = 1792
    levelHeight: number = 1600

    nextLevel: string = 'credits-screen'

    playerStartPosition: any = { 
        x: this.levelWidth / 2,
        y: this.levelHeight / 2
    }

    bgMusicTrack: any = BGMusic

    // Camera related stuff
    miniMapActive: boolean = false
    followCam: any;

    mainPlayer: any

    littleBox: any
    cheeseX: number = 400
    cheeseY: number = 400

    cheesePiece: any
    randomPoly: any

    tileSize: number = 64
    tileMap: any = []

    async preload() {
        this.cheesePiece = await createSprite({
            c: this.gameRef.ctx,
            sprite: CheesePiece,
            // img: CheesePiece,
            sx: 0,
            sy: 0,
            sWidth: 100,
            sHeight: 100,
            // dx: 0,
            // dy: 0,
            // dWidth: 100,
            // dHeight: 78,
            // frame: 0,
            // lastUpdate: 0,
            // updateDiff: 1000 / 60 * 10
        })

        // setup level and players
        this.mainPlayer = new MainPlayer({
            key: 'mainPlayer',
            gameRef: this.gameRef,
        })
        await this.mainPlayer.preload()
        
    }

    initialize() {
        this.gameRef.initializePhysics()
        this.gameRef.physics.world.gravity.y = 0

        this.followCam = new FollowCam({ key: 'followCam', gameRef: this.gameRef })
        this.followCam.levelWidth = this.levelWidth
        this.followCam.levelHeight = this.levelHeight
        this.followCam.zoomSetting = this.gameRef.touchMode ? 0.7 : 1.0
        this.followCam.cameraZoomSpeed = .03
        this.followCam.cameraSpeed = 50

        this.followCam.defaultBound = false
        this.followCam.fullScreenBound = false

        // this.followCam.cameraRotationTarget = 45

        this.followCam.initialize()


        this.mainPlayer.x = this.playerStartPosition.x
        this.mainPlayer.y = this.playerStartPosition.y
        this.mainPlayer.targetPosition.x = this.playerStartPosition.x
        this.mainPlayer.targetPosition.y = this.playerStartPosition.y
        this.mainPlayer.color = PRIMARY_COLOR
        this.mainPlayer.strokeColor = SECONDARY_COLOR
        this.mainPlayer.radius = 25
        this.mainPlayer.initialize()
        this.gameRef.addToWorld(this.mainPlayer.body)
        

        this.littleBox = new PhysBox({
            key: 'littleBox',
            gameRef: this.gameRef,
        })
        this.littleBox.x = 300
        this.littleBox.y = 300
        this.littleBox.width = 50
        this.littleBox.height = 50
        this.littleBox.color = SECONDARY_COLOR
        this.littleBox.strokeColor = PRIMARY_COLOR
        this.littleBox.bodyOptions = {
            label: `pushBox`,
            inertia: Infinity,
            density: 5,
            friction: 0.9
        }
        this.littleBox.initialize()
        this.gameRef.addToWorld(this.littleBox.body)

        this.randomPoly = new PhysPoly({
            key: 'randomPoly',
            gameRef: this.gameRef,
        })
        this.randomPoly.bodyOptions = {
            label: `randomPoly`,
            inertia: Infinity,
            density: 5,
            friction: 0.9
        }
        this.randomPoly.x = 600
        this.randomPoly.y = 400
        this.randomPoly.color = SECONDARY_COLOR
        this.randomPoly.strokeColor = PRIMARY_COLOR
        this.randomPoly.initialize()
        this.gameRef.addToWorld(this.randomPoly.body)

        this.generateTileMap()

    }

    generateTileMap() {
        this.tileMap = []
        for (let i = 0; i < this.levelWidth / this.tileSize; i++) {
            this.tileMap[i] = []
            for (let j = 0; j < this.levelHeight / this.tileSize; j++) {
                this.tileMap[i][j] = -1
            }
        }


        const minBlockWidth = 5
        const minBlockHeight = 5

        const maxBlockWidth = 10
        const maxBlockHeight = 10

        const minBlockGap = 1
        const maxBlockGap = 2


        for (let i = 0; i < this.tileMap.length; i++) {
            for (let j = 0; j < this.tileMap[0].length; j++) {
                // draw the borders
                if(j === 0) {
                    this.tileMap[i][j] = 1
                }
                if (j === 1) {
                    this.tileMap[i][j] = 1
                }
                if (j === this.tileMap[0].length - 1) {
                    this.tileMap[i][j] = 1
                }
                if (j === this.tileMap[0].length - 2) {
                    this.tileMap[i][j] = 1
                }
                if (i === 0) {
                    this.tileMap[i][j] = 1
                }
                if (i === 1) {
                    this.tileMap[i][j] = 1
                }
                if (i === this.tileMap.length - 1) {
                    this.tileMap[i][j] = 1
                }
                if (i === this.tileMap.length - 2) {
                    this.tileMap[i][j] = 1
                }

                if(this.tileMap[i][j] === -1) {

                    // if tile above or to left is a 0 then this should be a 1
                    if (this.tileMap[i - 1][j] === 0 || this.tileMap[i][j - 1] === 0) {
                        this.tileMap[i][j] = 1
                        continue
                    }


                    const generateValue = Math.random() > 0.5 ? 1 : 0
                    if (generateValue === 1) {
                        this.tileMap[i][j] = 1
                        continue
                    }
                    this.tileMap[i][j] = 0
                    const availableWidth = this.tileMap.length - i - 2
                    const availableHeight = this.tileMap[0].length - j - 2
                    if(availableWidth < 1 || availableHeight < 1) {
                        continue
                    }
                    let blockWidth = Math.floor(Math.random() * (maxBlockWidth - minBlockWidth) + minBlockWidth)
                    let blockHeight = Math.floor(Math.random() * (maxBlockHeight - minBlockHeight) + minBlockHeight)
                    
                    if (availableWidth < blockWidth) {
                        blockWidth = availableWidth
                    }
                    if (availableHeight < blockHeight) {
                        blockHeight = availableHeight
                    }

                    const blockGap = Math.floor(Math.random() * (maxBlockGap - minBlockGap) + minBlockGap)

                    for (let k = 0; k < blockWidth; k++) {
                        for (let l = 0; l < blockHeight; l++) {
                            this.tileMap[i + k][j + l] = 0
                        }
                    }

                    for (let k = 0; k < blockGap; k++) {
                        for (let l = 0; l < blockWidth; l++) {
                            this.tileMap[i + l][j - k] = 2
                        }
                        for (let l = 0; l < blockHeight; l++) {
                            this.tileMap[i - k][j + l] = 2
                        }
                    }
                    
                }


            }
        }


    }

    drawTileMap() {
        this.tileMap.forEach((row: any, i: number) => {
            row.forEach((tile: any, j: number) => {
                if (tile === 0) {
                    drawBox({
                        c: this.gameRef.ctx,
                        x: i * this.tileSize,
                        y: j * this.tileSize,
                        width: this.tileSize + 1,
                        height: this.tileSize + 1,
                        fillColor: PRIMARY_COLOR,
                        cameraPos: this.gameRef.cameraPos,
                        zoom: this.gameRef.cameraZoom
                    })
                }
                if (tile === 2) {
                    drawBox({
                        c: this.gameRef.ctx,
                        x: i * this.tileSize,
                        y: j * this.tileSize,
                        width: this.tileSize + 1,
                        height: this.tileSize + 1,
                        fillColor: SECONDARY_COLOR,
                        cameraPos: this.gameRef.cameraPos,
                        zoom: this.gameRef.cameraZoom
                    })
                }
            })
        })
    }



    update() {
        this.handlePhysics()
    }

    handlePhysics() {
        if (this.gameRef.updatePhysics()) {
            this.onPhysicsUpdate()
        }
    }
    onPhysicsUpdate() {
        // this.followCam.cameraRotationTarget += 1

        // do something on physics tick
        this.updateCamera()
        // this.movingPlatforms.forEach((plat: any) => {
        //     plat.update()
        // })
        this.mainPlayer.update()
        this.littleBox.update()
        this.randomPoly.update()
        // console.log(this.followCam.activeTarget)

        if(this.gameRef.mouseInfo.mouseDown) {
            this.mainPlayer.setTargetPosition({
                x: this.gameRef.cameraMouseInfo.x,
                y: this.gameRef.cameraMouseInfo.y
            })
        }
    }


    updateCamera() {
        this.followCam.setTarget({
            x: this.levelWidth / 2,
            y: this.levelHeight / 2,
        })

        const activeTarget: any = this.mainPlayer.body.position
        if (activeTarget) {
            this.followCam.setTarget(activeTarget)
        }

        this.followCam.setFullScreen(this.miniMapActive)
        this.followCam.update()
        this.gameRef.handleCameraShake()
    }


    draw(): void {
        this.gameRef.ctx.beginPath();
        this.gameRef.ctx.rect(0, 0, this.gameRef.gameWidth, this.gameRef.gameHeight);
        this.gameRef.ctx.fillStyle = DARK_COLOR;
        this.gameRef.ctx.fill();


        drawCameraFrame(this.gameRef, () => {

            // draw the level
            // level bg
            drawBox({
                c: this.gameRef.ctx,
                x: 0,
                y: 0,
                width: this.levelWidth,
                height: this.levelHeight,
                fillColor: LIGHT_COLOR,
                cameraPos: this.gameRef.cameraPos,
                zoom: this.gameRef.cameraZoom
            })


            
            // draw the tile map
            this.drawTileMap()
             


            rotateDraw({
                c: this.gameRef.ctx,
                x: (this.littleBox.body.position.x - this.cheesePiece.sWidth / 2),
                // x: (this.cheeseX - this.cheesePiece.sWidth / 2),
                y: (this.littleBox.body.position.y - this.cheesePiece.sHeight / 2),
                // y: (this.cheeseY - this.cheesePiece.sHeight / 2),
                a: 0,
                cameraPos: this.gameRef.cameraPos,
                zoom: this.gameRef.cameraZoom
            }, () => {
                // this.sprite.flipX = this.velocity.x < 0
                drawSVG(this.cheesePiece, { zoom: this.gameRef.cameraZoom })
            })

            // draw the little box
            // this.littleBox.draw()

            this.randomPoly.draw()

            // draw the player
            this.mainPlayer.draw()

            // draw the mouse position
            drawCircle({
                c: this.gameRef.ctx,
                x: this.gameRef.cameraMouseInfo.x,
                y: this.gameRef.cameraMouseInfo.y,
                radius: 10,
                fillColor: 'red',
                cameraPos: this.gameRef.cameraPos,
                zoom: this.gameRef.cameraZoom,
            })

        })



        // Add any additional drawing logic here
    }
    onResize() { }
    tearDown() { }
}