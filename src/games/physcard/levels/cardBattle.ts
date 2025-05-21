import BGMusic from '../../../assets/the-squeeze/tunetank.com_5630_ready-to-play_by_alexey-anisimov__1.mp3'
import { BasedLevel } from "../../../engine/BasedLevel";
import { FollowCam } from '../../../engine/cameras/FollowCam';
import { drawBox, drawCameraFrame, drawCircle } from '../../../engine/libs/drawHelpers';
import { DARK_COLOR, LIGHT_COLOR, PRIMARY_COLOR, SECONDARY_COLOR } from '../constants/gameColors';


export class CardBattle extends BasedLevel {

    levelWidth: number = 800
    levelHeight: number = 800

    nextLevel: string = 'credits-screen'

    bgMusicTrack: any = BGMusic

    // Camera related stuff
    viewFullMap: boolean = true
    followCam: FollowCam

    lastClick: number = 0
    lastClickPosition: any = { x: 0, y: 0 }

    async preload() { }

    initialize() {
        this.followCam = new FollowCam({ key: 'followCam', gameRef: this.gameRef })
        this.followCam.levelWidth = this.levelWidth
        this.followCam.levelHeight = this.levelHeight
        this.followCam.zoomSetting = this.gameRef.touchMode ? 0.7 : 1.0
        this.followCam.cameraZoomSpeed = .03
        this.followCam.cameraSpeed = 50

        this.followCam.defaultBound = false
        this.followCam.fullScreenBound = false

        this.lastClick = 0
    }

    update() {
        this.updateCamera()
        if(this.gameRef.mouseInfo.mouseDown) {
            this.lastClick = this.gameRef.lastUpdate
            this.lastClickPosition = { x: this.gameRef.cameraMouseInfo.x, y: this.gameRef.cameraMouseInfo.y }
        }
    }

    updateCamera() {
        this.followCam.setTarget({
            x: this.levelWidth / 2,
            y: this.levelHeight / 2,
        })

        // const activeTarget: any = this.mainPlayer.body.position
        // if (activeTarget) {
        //     this.followCam.setTarget(activeTarget)
        // }

        this.followCam.setFullScreen(this.viewFullMap)
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

            const clickSpotRadius = this.gameRef.lastUpdate - this.lastClick
            if(clickSpotRadius < 400) {
                drawCircle({
                    c: this.gameRef.ctx,
                    x: this.lastClickPosition.x,
                    y: this.lastClickPosition.y,
                    radius: clickSpotRadius/20,
                    fillColor: `rgba(0, 0, 0, ${1 - (clickSpotRadius/400)})`,
                    cameraPos: this.gameRef.cameraPos,
                    zoom: this.gameRef.cameraZoom
                })
            }

        })
    }

    onResize() { }
    tearDown() { }
}
