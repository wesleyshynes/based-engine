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

    levelWidth: number = 1800
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


    async preload() {
        this.cheesePiece = await createSprite({
            c: this.gameRef.ctx,
            sprite: CheesePiece,
            // img: CheesePiece,
            sx: 0,
            sy: 0,
            sWidth: 100,
            sHeight: 100,
            dx: 0,
            dy: 0,
            dWidth: 100,
            dHeight: 100,
            frame: 0,
            lastUpdate: 0,
            updateDiff: 1000 / 60 * 10
        })
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

        this.followCam.cameraRotationTarget = 45

        this.followCam.initialize()


        // setup level and players
        this.mainPlayer = new MainPlayer({
            key: 'mainPlayer',
            gameRef: this.gameRef,
        })
        this.mainPlayer.x = this.playerStartPosition.x
        this.mainPlayer.y = this.playerStartPosition.y
        this.mainPlayer.color = PRIMARY_COLOR
        this.mainPlayer.strokeColor = SECONDARY_COLOR
        this.mainPlayer.radius = 25
        this.mainPlayer.initialize()
        this.gameRef.addToWorld(this.mainPlayer.body)

        // 
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

            const tileSize = 100
            const tileColor = DARK_COLOR
            const tileColor2 = LIGHT_COLOR
            const tileColorHighlight = PRIMARY_COLOR
            const tileColorHovered = SECONDARY_COLOR
            const tileStroke = 2
            const tileColorStroke2 = SECONDARY_COLOR
            const tileColorStroke = PRIMARY_COLOR

            const highlightedTile = {
                x: Math.floor(this.mainPlayer.body.position.x / tileSize),
                y: Math.floor(this.mainPlayer.body.position.y / tileSize)
            }
            const hoveredTile = {
                x: Math.floor(this.gameRef.cameraMouseInfo.x / tileSize),
                y: Math.floor(this.gameRef.cameraMouseInfo.y / tileSize)
            }
            const targetTile = {
                x: Math.floor(this.mainPlayer.targetPosition.x / tileSize),
                y: Math.floor(this.mainPlayer.targetPosition.y / tileSize)
            }
            for (let i = 0; i < this.levelWidth / tileSize; i++) {
                for (let j = 0; j < this.levelHeight / tileSize; j++) {
                    drawBox({
                        c: this.gameRef.ctx,
                        x: i * tileSize,
                        y: j * tileSize,
                        width: tileSize,
                        height: tileSize,
                        fillColor: (i + j) % 2 === 0 ? tileColor : tileColor2,
                        strokeColor: (i + j) % 2 === 0 ? tileColorStroke : tileColorStroke2,
                        strokeWidth: tileStroke,
                        cameraPos: this.gameRef.cameraPos,
                        zoom: this.gameRef.cameraZoom
                    })
                }
            }

            drawBox({
                c: this.gameRef.ctx,
                x: highlightedTile.x * tileSize,
                y: highlightedTile.y * tileSize,
                width: tileSize,
                height: tileSize,
                fillColor: tileColorHighlight,
                strokeColor: tileColorStroke,
                strokeWidth: tileStroke,
                cameraPos: this.gameRef.cameraPos,
                zoom: this.gameRef.cameraZoom
            })

            drawBox({
                c: this.gameRef.ctx,
                x: hoveredTile.x * tileSize,
                y: hoveredTile.y * tileSize,
                width: tileSize,
                height: tileSize,
                fillColor: tileColorHovered,
                strokeColor: tileColorStroke,
                strokeWidth: tileStroke,
                cameraPos: this.gameRef.cameraPos,
                zoom: this.gameRef.cameraZoom
            })

            drawBox({
                c: this.gameRef.ctx,
                x: targetTile.x * tileSize + 5,
                y: targetTile.y * tileSize + 5,
                width: tileSize - 10,
                height: tileSize - 10,
                fillColor: SECONDARY_COLOR,
                strokeColor: PRIMARY_COLOR,
                strokeWidth: 5,
                cameraPos: this.gameRef.cameraPos,
                zoom: this.gameRef.cameraZoom
            })


            // draw the player
            this.mainPlayer.draw()

            // draw the little box
            this.littleBox.draw()


            rotateDraw({
                c: this.gameRef.ctx,
                x: (this.cheeseX - this.cheesePiece.sWidth / 2),
                y: (this.cheeseY - this.cheesePiece.sHeight / 2),
                a: 0,
                cameraPos: this.gameRef.cameraPos,
                zoom: this.gameRef.cameraZoom
            }, () => {
                // this.sprite.flipX = this.velocity.x < 0
                drawSVG(this.cheesePiece, { zoom: this.gameRef.cameraZoom })
            })

            drawCircle({
                c: this.gameRef.ctx,
                x: this.gameRef.cameraMouseInfo.x,
                y: this.gameRef.cameraMouseInfo.y,
                radius: 10,
                fillColor: 'red',
                cameraPos: this.gameRef.cameraPos,
                zoom: this.gameRef.cameraZoom,
            })

            this.randomPoly.draw()
        })



        // Add any additional drawing logic here
    }
    onResize() { }
    tearDown() { }
}