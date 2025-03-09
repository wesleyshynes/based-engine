import BGMusic from '../../../assets/the-squeeze/tunetank.com_5630_ready-to-play_by_alexey-anisimov__1.mp3'
import { BasedLevel } from "../../../engine/BasedLevel";
import { FollowCam } from '../../../engine/cameras/FollowCam';
import { createSprite, drawBox, drawCameraFrame, drawCircle, drawSVG, rotateDraw } from '../../../engine/libs/drawHelpers';
import PhysBox from '../../../engine/physicsObjects/PhysBox';
import { DARK_COLOR, LIGHT_COLOR, PRIMARY_COLOR, SECONDARY_COLOR } from '../constants/gameColors';

export class Level01 extends BasedLevel {

    physics: any

    tileSize: number = 64
    tileMap: any = []

    levelWidth: number = 800
    levelHeight: number = 800

    nextLevel: string = 'credits-screen'

    playerStartPosition: any = {
        x: this.levelWidth / 2,
        y: this.levelHeight / 2,
        // x: 0,
        // y: 0,
    }

    bgMusicTrack: any = BGMusic

    // Camera related stuff
    miniMapActive: boolean = false
    followCam: any;

    simpleCard: any;
    simpleCardZone: any;

    async preload() {}

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
        // this.mainPlayer.update()
        // this.littleBox.update()
        // this.randomPoly.update()
        // console.log(this.followCam.activeTarget)

        if (this.gameRef.mouseInfo.mouseDown) {
            // this.mainPlayer.setTargetPosition({
            //     x: this.gameRef.cameraMouseInfo.x,
            //     y: this.gameRef.cameraMouseInfo.y
            // })
        }
    }


    updateCamera() {
        this.followCam.setTarget({
            x: this.levelWidth / 2,
            y: this.levelHeight / 2,
        })

        const activeTarget: any = this.playerStartPosition
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

            // rotateDraw({
            //     c: this.gameRef.ctx,
            //     x: (this.littleBox.body.position.x - this.cheesePiece.sWidth / 2),
            //     y: (this.littleBox.body.position.y - this.cheesePiece.sHeight / 2),
            //     a: 0,
            //     cameraPos: this.gameRef.cameraPos,
            //     zoom: this.gameRef.cameraZoom
            // }, () => {
            //     drawSVG(this.cheesePiece, { zoom: this.gameRef.cameraZoom })
            // })

            // draw the little box
            // this.littleBox.draw()

            // this.randomPoly.draw()

            // draw the player
            // this.mainPlayer.draw()

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